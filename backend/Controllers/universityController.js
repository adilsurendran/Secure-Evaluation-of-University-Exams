import ExamSession from "../Models/ExamSession.js";
import AnswerSheet from "../Models/AnswerSheet.js";
import Staff from "../Models/Staff.js";


export const getSessionAllocationStats = async (req, res) => {
  try {
    const sessions = await ExamSession.find();

    const finalData = [];

    for (const session of sessions) {
      const totalSheets = await AnswerSheet.countDocuments({
        sessionId: session._id
      });

      const allocatedSheets = await AnswerSheet.countDocuments({
        sessionId: session._id,
        assignedStaff: { $ne: null }
      });

      const pendingSheets = totalSheets - allocatedSheets;

      finalData.push({
        session,
        totalSheets,
        allocatedSheets,
        pendingSheets
      });
    }

    return res.json(finalData);

  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};


export const allocateAnswerSheets = async (req, res) => {
  try {
    const sessionId = req.params.sessionId;

    // 1. Fetch all unassigned sheets for the session
    const sheets = await AnswerSheet.find({
      sessionId,
      assignedStaff: null
    })
      .populate("subjectId")
      .populate("studentId");

    if (sheets.length === 0) {
      return res.json({ msg: "No unassigned sheets found" });
    }

    // 2. Preload all staff
    const allStaff = await Staff.find().populate("subjects");

    // Track allocation load
    const staffLoad = {}; // { staffId: count }

    let assignedCount = 0;

    // Start allocation
    for (const sheet of sheets) {
      const subjectId = sheet.subjectId._id.toString();
      const studentCollege = sheet.studentId.collegeId.toString();

      // 3. Filter eligible staff
      const eligibleStaff = allStaff.filter(st => {
        const teachesSubject = st.subjects.some(
          (sub) => sub._id.toString() === subjectId
        );

        const notFromSameCollege =
          st.collegeId.toString() !== studentCollege;

        return teachesSubject && notFromSameCollege;
      });

      if (eligibleStaff.length === 0) {
        console.log("NO staff found for subject:", sheet.subjectId.subjectName);
        continue;
      }

      // 4. Apply round-robin — select staff with minimum load
      eligibleStaff.sort((a, b) => {
        const loadA = staffLoad[a._id] || 0;
        const loadB = staffLoad[b._id] || 0;
        return loadA - loadB;
      });

      const assignedStaff = eligibleStaff[0];

      // 5. Assign
      sheet.assignedStaff = assignedStaff._id;
      sheet.status = "assigned";
      await sheet.save();

      // Increment load
      staffLoad[assignedStaff._id] =
        (staffLoad[assignedStaff._id] || 0) + 1;

      assignedCount++;
    }

    return res.json({
      msg: `Allocation completed`,
      allocated: assignedCount,
    });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};



import Result from "../Models/Result.js";
import Subject from "../Models/Subject.js";


// ======================================================================
// GET STATS FOR RESULT PUBLISHING
// ======================================================================
export const getResultStats = async (req, res) => {
  try {
    const sessionId = req.params.sessionId;

    const session = await ExamSession.findById(sessionId);
    if (!session) return res.status(404).json({ msg: "Session not found" });

    const totalSheets = await AnswerSheet.countDocuments({ sessionId });
    const evaluatedSheets = await AnswerSheet.countDocuments({
      sessionId,
      status: "evaluated"
    });

    const pendingSheets = totalSheets - evaluatedSheets;

    return res.json({
      session,
      totalSheets,
      evaluatedSheets,
      pendingSheets,
      canPublish: pendingSheets === 0 && totalSheets > 0
    });

  } catch (err) {
    console.log("RESULT STATS ERROR:", err);
    return res.status(500).json({ msg: err.message });
  }
};


// ======================================================================
// PUBLISH RESULTS
// ======================================================================
export const publishResults = async (req, res) => {
  try {
    const sessionId = req.params.sessionId;

    // 1️⃣ Load all evaluated answer sheets
    const evaluatedSheets = await AnswerSheet.find({
      sessionId,
      status: "evaluated"
    })
      .populate("studentId")
      .populate("subjectId");

    if (evaluatedSheets.length === 0) {
      return res.status(400).json({ msg: "No evaluated sheets to publish" });
    }

    // 2️⃣ Convert into Result model entries
    const results = evaluatedSheets.map((sheet) => ({
      sessionId,
      studentId: sheet.studentId._id,
      subjectId: sheet.subjectId._id,
      marks: sheet.marks,
      totalMark: sheet.subjectId.total_mark,
      published: true
    }));

    // 3️⃣ Remove old published results for this session (if republishing)
    await Result.deleteMany({ sessionId });

    // 4️⃣ Save all results
    await Result.insertMany(results);

    return res.json({
      msg: "Results published successfully",
      publishedCount: results.length
    });

  } catch (err) {
    console.log("PUBLISH RESULT ERROR:", err);
    return res.status(500).json({ msg: err.message });
  }
};
