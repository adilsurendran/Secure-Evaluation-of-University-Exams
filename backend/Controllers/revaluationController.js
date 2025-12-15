import RevaluationRequest from "../Models/RevaluationRequest.js";
import AnswerSheet from "../Models/AnswerSheet.js";
import Staff from "../Models/Staff.js";
import Student from "../Models/Student.js";
import { decrypt } from "../config/encryption.js";
import cloudinary from "../config/cloudinary.js"; // if staff needs to view pdf
import RevaluationResult from "../Models/RevaluationResult.js";

// ---------------------------
// STUDENT: create request
// POST /revaluation/student/create
// body: { answerSheetId, feeAmount, note }
// ---------------------------
export const createRevaluationRequest = async (req, res) => {
  try {
    const { answerSheetId, feeAmount = 0 } = req.body;
    const studentId = req.body.studentId; // adapt to your auth
    console.log(studentId);
    

    // Validate answer sheet
    const sheet = await AnswerSheet.findById(answerSheetId)
      .populate("subjectId")
      .populate("sessionId");

    if (!sheet) return res.status(404).json({ msg: "Answer sheet not found" });

    // Only allow revaluation for evaluated sheets
    if (sheet.status !== "evaluated") {
      return res.status(400).json({ msg: "Only evaluated sheets are eligible for revaluation" });
    }

    // Prevent duplicate open revaluation for same sheet
    const existing = await RevaluationRequest.findOne({
      answerSheetId,
      studentId,
      status: { $in: ["pending", "approved", "assigned"] },
    });

    if (existing) {
      return res.status(400).json({ msg: "A revaluation request for this paper is already in progress" });
    }

    const request = await RevaluationRequest.create({
      answerSheetId,
      studentId,
      subjectId: sheet.subjectId._id,
      sessionId: sheet.sessionId._id,
      feeAmount,
      paymentStatus: feeAmount > 0 ? "pending" : "paid", // adjust per your payment flow
      status: "pending",
    });

    return res.status(201).json({ msg: "Revaluation request created", request });
  } catch (err) {
    console.log("CREATE REQUEST ERROR:", err);
    return res.status(500).json({ msg: err.message });
  }
};

// ---------------------------
// STUDENT: list his requests
// GET /revaluation/student/requests/:studentId
// ---------------------------
export const getStudentRequests = async (req, res) => {
  try {
    const studentId = req.params.studentId;
    const requests = await RevaluationRequest.find({ studentId })
      .populate("answerSheetId", "examId subjectId marks")
      .populate("subjectId", "subjectName subjectCode")
      .populate("sessionId", "name academicYear semester")
      .populate("assignedStaff", "name phone");

    return res.json(requests);
  } catch (err) {
    console.log("GET STUDENT REQ ERROR:", err);
    return res.status(500).json({ msg: err.message });
  }
};

// ---------------------------
// ADMIN: list (filterable)
// GET /revaluation/admin/all?status=pending
// ---------------------------
export const adminListRequests = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;

    const requests = await RevaluationRequest.find(filter)
      .populate("studentId", "name admissionNo collegeId")
      .populate("answerSheetId", "marks examId")
      .populate("subjectId", "subjectName subjectCode")
      .populate("assignedStaff", "name phone")
      .populate("sessionId", "name");

    return res.json(requests);
  } catch (err) {
    console.log("ADMIN LIST REQ ERROR:", err);
    return res.status(500).json({ msg: err.message });
  }
};

// ---------------------------
// ADMIN: approve a request
// PUT /revaluation/admin/approve/:id
// body (optional): { assignToStaffId }  -- if provided will set to assigned immediately.
// ---------------------------
// export const adminApproveRequest = async (req, res) => {
//   try {
//     const id = req.params.id;
//     // const { assignToStaffId } = req.body;

//     const reqDoc = await RevaluationRequest.findById(id).populate("answerSheetId studentId subjectId");
//     if (!reqDoc) return res.status(404).json({ msg: "Request not found" });

//     if (reqDoc.status !== "pending") {
//       return res.status(400).json({ msg: "Only pending requests can be approved" });
//     }

//     // reqDoc.status = assignToStaffId ? "assigned" : "approved";
//     // if (assignToStaffId) {
//     //   reqDoc.assignedStaff = assignToStaffId;
//     // }

//     // optionally set paymentStatus if admin collected payment manually
//     // if (req.body.paymentCollected) {
//     //   reqDoc.paymentStatus = "paid";
//     // }

//     await reqDoc.save();

//     return res.json({ msg: "Request approved", request: reqDoc });
//   } catch (err) {
//     console.log("ADMIN APPROVE ERROR:", err);
//     return res.status(500).json({ msg: err.message });
//   }
// };

// ---------------------------
// ADMIN: reject a request
// PUT /revaluation/admin/reject/:id
// body: { reason }
// ---------------------------
export const adminRejectRequest = async (req, res) => {
  try {
    const id = req.params.id;
    const { reason } = req.body;

    const reqDoc = await RevaluationRequest.findById(id);
    if (!reqDoc) return res.status(404).json({ msg: "Request not found" });

    if (reqDoc.status === "completed") {
      return res.status(400).json({ msg: "Cannot reject completed request" });
    }

    reqDoc.status = "rejected";
    reqDoc.adminNote = reason || "Rejected by admin";
    await reqDoc.save();

    return res.json({ msg: "Request rejected", request: reqDoc });
  } catch (err) {
    console.log("ADMIN REJECT ERROR:", err);
    return res.status(500).json({ msg: err.message });
  }
};

// ---------------------------
// ADMIN: assign to staff (separate endpoint if needed)
// PUT /revaluation/admin/assign/:id
// body: { staffId }
// ---------------------------
// export const adminAssignToStaff = async (req, res) => {
//   try {
//     const id = req.params.id;
//     const { staffId } = req.body;

//     const reqDoc = await RevaluationRequest.findById(id);
//     if (!reqDoc) return res.status(404).json({ msg: "Request not found" });

//     reqDoc.assignedStaff = staffId;
//     reqDoc.status = "assigned";
//     await reqDoc.save();

//     return res.json({ msg: "Assigned to staff", request: reqDoc });
//   } catch (err) {
//     console.log("ADMIN ASSIGN ERROR:", err);
//     return res.status(500).json({ msg: err.message });
//   }
// };

  // ================================
// ADMIN: AUTO ASSIGN REVALUATIONS BY SESSION
// POST /revaluation/admin/auto-assign/:sessionId
// ================================
export const autoAssignRevaluations = async (req, res) => {
  try {
    const { sessionId } = req.params;

    // 1️⃣ Load all pending requests of this session
    const requests = await RevaluationRequest.find({
      sessionId,
      status: "pending"
    }).populate("answerSheetId");

    if (requests.length === 0) {
      return res.json({ msg: "No pending requests found" });
    }

    // Load all staff once
    const staffList = await Staff.find()
      .populate("subjects")
      .populate("collegeId");

    let assigned = 0;
    let rejected = 0;

    for (const reqDoc of requests) {

      // ❌ Reject unpaid
      if (reqDoc.paymentStatus !== "paid") {
        reqDoc.status = "rejected";
        reqDoc.adminNote = "Payment not completed";
        await reqDoc.save();
        rejected++;
        continue;
      }

      const sheet = reqDoc.answerSheetId;
      const subjectId = sheet.subjectId.toString();
      const studentCollegeId = sheet.collegeId.toString();
      const previousStaffId = sheet.assignedStaff?.toString();

      // 2️⃣ Find eligible staff
      const eligibleStaff = staffList.filter(st => {
        const teaches = st.subjects.some(
          sub => sub._id.toString() === subjectId
        );

        const differentCollege =
          st.collegeId._id.toString() !== studentCollegeId;

        const notPrevious =
          previousStaffId ? st._id.toString() !== previousStaffId : true;

        return teaches && differentCollege && notPrevious;
      });

      if (eligibleStaff.length === 0) {
        reqDoc.status = "rejected";
        reqDoc.adminNote = "No eligible staff available";
        await reqDoc.save();
        rejected++;
        continue;
      }

      // 3️⃣ Assign randomly (fair distribution)
      const assignedStaff =
        eligibleStaff[Math.floor(Math.random() * eligibleStaff.length)];

      reqDoc.assignedStaff = assignedStaff._id;
      reqDoc.status = "assigned";
      await reqDoc.save();

      assigned++;
    }

    return res.json({
      msg: "Auto assignment completed",
      assigned,
      rejected
    });

  } catch (err) {
    console.error("AUTO ASSIGN ERROR:", err);
    res.status(500).json({ msg: err.message });
  }
};



// ---------------------------
// STAFF: list assigned re-eval requests
// GET /revaluation/staff/assigned/:staffId
// ---------------------------
export const staffAssignedRequests = async (req, res) => {
  try {
    const staffId = req.params.staffId;

    const requests = await RevaluationRequest.find({
      assignedStaff: staffId,
      status: "assigned",
    })
      .populate("answerSheetId")
      .populate("studentId", "name admissionNo collegeId")
      .populate("subjectId", "subjectName subjectCode")
      .populate("sessionId", "name");

    return res.json(requests);
  } catch (err) {
    console.log("STAFF ASSIGNED ERROR:", err);
    return res.status(500).json({ msg: err.message });
  }
};

// ---------------------------
// STAFF: evaluate revaluation
// PUT /revaluation/staff/evaluate/:id
// body: { newMarks, staffRemarks }
// ---------------------------
export const staffEvaluateRevaluation = async (req, res) => {
  try {
    const id = req.params.id;
    const { newMarks, staffRemarks } = req.body;
    const staffId = req.body.staffId || req.userId; // adapt auth

    if (newMarks === undefined || newMarks === null || isNaN(newMarks)) {
      return res.status(400).json({ msg: "newMarks is required and must be a number" });
    }

    const reqDoc = await RevaluationRequest.findById(id).populate("answerSheetId");
    if (!reqDoc) return res.status(404).json({ msg: "Request not found" });

    if (reqDoc.status !== "assigned") {
      return res.status(400).json({ msg: "Request is not assigned for evaluation" });
    }

    // Update revaluation request
    reqDoc.oldMarks = reqDoc.answerSheetId.marks;
    reqDoc.newMarks = newMarks;
    reqDoc.staffRemarks = staffRemarks || "";
    reqDoc.status = "completed";
    reqDoc.assignedStaff = staffId;
    await reqDoc.save();

    // Update the AnswerSheet marks and keep status evaluated
    const sheet = await AnswerSheet.findById(reqDoc.answerSheetId._id);
    sheet.marks = newMarks;
    sheet.status = "evaluated";
    await sheet.save();

    // Optionally: record history, notify student, recalc results if published etc.

    return res.json({ msg: "Revaluation completed", request: reqDoc, updatedSheet: sheet });
  } catch (err) {
    console.log("STAFF EVAL ERROR:", err);
    return res.status(500).json({ msg: err.message });
  }
};


// ================================
// GET ELIGIBLE STAFF FOR REVALUATION
// ================================

export const getEligibleStaffForRevaluation = async (req, res) => {
  try {
    const { requestId } = req.params;

    const request = await RevaluationRequest.findById(requestId)
      .populate("answerSheetId")
      .populate("studentId")
      .populate("subjectId");

    if (!request) {
      return res.status(404).json({ msg: "Revaluation request not found" });
    }

    const sheet = request.answerSheetId;

    const subjectId = sheet.subjectId.toString();
    const studentCollegeId = sheet.collegeId.toString();
    const previousStaffId = sheet.assignedStaff?.toString(); // initial evaluator

    // Load all staff with their subjects
    const allStaff = await Staff.find().populate("subjects").populate("collegeId");

    const eligible = allStaff.filter(st => {
      const teachesSubject = st.subjects.some(
        (sub) => sub._id.toString() === subjectId
      );

      const notSameCollege = st.collegeId._id.toString() !== studentCollegeId;

      const notPreviousEvaluator =
        previousStaffId ? st._id.toString() !== previousStaffId : true;

      return teachesSubject && notSameCollege && notPreviousEvaluator;
    });

    return res.json(eligible);

  } catch (err) {
    console.log("ELIGIBLE STAFF ERROR:", err);
    return res.status(500).json({ msg: err.message });
  }
};


export const studentMarkPaid = async (req, res) => {
  try {
    const { requestId } = req.params;

    const updated = await RevaluationRequest.findByIdAndUpdate(
      requestId,
      { paymentStatus: "paid" },
      { new: true }
    );

    if (!updated) return res.status(404).json({ msg: "Request not found" });

    res.json({ msg: "Payment updated", updated });

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Server error" });
  }
};


export const getEvaluatedRevaluation = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const list = await RevaluationRequest.find({
      sessionId,
      status: "evaluated",         // Only evaluated and ready for publish
      paymentStatus: "paid"
    })
      .populate("studentId", "name admissionNo collegeId")
      .populate({
        path: "studentId",
        populate: { path: "collegeId", select: "name" }
      })
      .populate("subjectId", "subjectName subjectCode total_mark")
      .populate("answerSheetId")
      .populate("assignedStaff", "name phone collegeId")
      .populate({
        path: "assignedStaff",
        populate: { path: "collegeId", select: "name" }
      });

    res.json(list);

  } catch (err) {
    console.log("EVALUATED LIST ERROR:", err);
    res.status(500).json({ msg: err.message });
  }
};


export const publishRevaluationResults = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const evaluated = await RevaluationRequest.find({
      sessionId,
      status: "evaluated",
      paymentStatus: "paid"
    })
      .populate("studentId")
      .populate("subjectId")
      .populate("answerSheetId");
      console.log(evaluated);
      

    if (evaluated.length === 0)
      return res.status(400).json({ msg: "No evaluated revaluation cases to publish" });

    const results = evaluated.map(r => ({
      sessionId,
      studentId: r.studentId._id,
      collegeId: r.studentId.collegeId,
      subjectId: r.subjectId._id,
      // oldMarks:                // updated mark
      totalMark: r.subjectId.total_mark,
      published: true
    }));

    await RevaluationResult.deleteMany({ sessionId });
    await RevaluationResult.insertMany(results);

    return res.json({
      msg: "Revaluation results published successfully",
      publishedCount: results.length
    });

  } catch (err) {
    console.log("PUBLISH REV ERROR:", err);
    res.status(500).json({ msg: err.message });
  }
};
