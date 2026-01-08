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


// export const allocateAnswerSheets = async (req, res) => {
//   try {
//     const sessionId = req.params.sessionId;

//     // 1. Fetch all unassigned sheets for the session
//     const sheets = await AnswerSheet.find({
//       sessionId,
//       assignedStaff: null
//     })
//       .populate("subjectId")
//       .populate("studentId");

//     if (sheets.length === 0) {
//       return res.json({ msg: "No unassigned sheets found" });
//     }

//     // 2. Preload all staff
//     const allStaff = await Staff.find().populate("subjects");

//     // Track allocation load
//     const staffLoad = {}; // { staffId: count }

//     let assignedCount = 0;

//     // Start allocation
//     for (const sheet of sheets) {
//       const subjectId = sheet.subjectId._id.toString();
//       const studentCollege = sheet.studentId.collegeId.toString();

//       // 3. Filter eligible staff
//       const eligibleStaff = allStaff.filter(st => {
//         const teachesSubject = st.subjects.some(
//           (sub) => sub._id.toString() === subjectId
//         );

//         const notFromSameCollege =
//           st.collegeId.toString() !== studentCollege;

//         return teachesSubject && notFromSameCollege;
//       });

//       if (eligibleStaff.length === 0) {
//         console.log("NO staff found for subject:", sheet.subjectId.subjectName);
//         continue;
//       }

//       // 4. Apply round-robin — select staff with minimum load
//       eligibleStaff.sort((a, b) => {
//         const loadA = staffLoad[a._id] || 0;
//         const loadB = staffLoad[b._id] || 0;
//         return loadA - loadB;
//       });

//       const assignedStaff = eligibleStaff[0];

//       // 5. Assign
//       sheet.assignedStaff = assignedStaff._id;
//       sheet.status = "assigned";
//       await sheet.save();

//       // Increment load
//       staffLoad[assignedStaff._id] =
//         (staffLoad[assignedStaff._id] || 0) + 1;

//       assignedCount++;
//     }

//     return res.json({
//       msg: `Allocation completed`,
//       allocated: assignedCount,
//     });
//   } catch (err) {
//     return res.status(500).json({ msg: err.message });
//   }
// };

// export const allocateAnswerSheets = async (req, res) => {
//   try {
//     const sessionId = req.params.sessionId;

//     const sheets = await AnswerSheet.find({
//       sessionId,
//       assignedStaff: null
//     })
//       .populate("subjectId")
//       .populate("studentId");

//     if (sheets.length === 0) {
//       return res.json({ msg: "No unassigned sheets found" });
//     }

//     const allStaff = await Staff.find().populate("subjects");

//     const staffLoad = {};
//     let assignedCount = 0;

//     for (const sheet of sheets) {
//       const subjectId = sheet.subjectId._id.toString();
//       const studentCollege = sheet.studentId.collegeId.toString();

//       const eligibleStaff = allStaff.filter(st => {
//         const teachesSubject = st.subjects.some(
//           (sub) => sub._id.toString() === subjectId
//         );

//         const notFromSameCollege =
//           st.collegeId.toString() !== studentCollege;

//         const isAvailable = st.available === true; // <-- NEW CONDITION

//         return teachesSubject && notFromSameCollege && isAvailable;
//       });

//       if (eligibleStaff.length === 0) {
//         console.log("NO staff found for subject:", sheet.subjectId.subjectName);
//         continue;
//       }

//       eligibleStaff.sort((a, b) => {
//         const loadA = staffLoad[a._id] || 0;
//         const loadB = staffLoad[b._id] || 0;
//         return loadA - loadB;
//       });

//       const assignedStaff = eligibleStaff[0];

//       sheet.assignedStaff = assignedStaff._id;
//       sheet.status = "assigned";
//       await sheet.save();

//       staffLoad[assignedStaff._id] =
//         (staffLoad[assignedStaff._id] || 0) + 1;

//       assignedCount++;
//     }

//     return res.json({
//       msg: `Allocation completed`,
//       allocated: assignedCount,
//     });
//   } catch (err) {
//     return res.status(500).json({ msg: err.message });
//   }
// };

export const allocateAnswerSheets = async (req, res) => {
  try {
    const sessionId = req.params.sessionId;

    const sheets = await AnswerSheet.find({
      sessionId,
      assignedStaff: null
    })
      .populate("subjectId")
      .populate("studentId");

    if (sheets.length === 0) {
      return res.json({ msg: "No unassigned sheets found" });
    }

    const allStaff = await Staff.find().populate("subjects");

    const staffLoad = {};
    let assignedCount = 0;

    const failedAllocations = []; // 👈 track failures

    for (const sheet of sheets) {
      const subjectId = sheet.subjectId._id.toString();
      const studentCollege = sheet.studentId.collegeId.toString();

      const eligibleStaff = allStaff.filter(st => {
        const teachesSubject = st.subjects.some(
          sub => sub._id.toString() === subjectId
        );

        const notFromSameCollege =
          st.collegeId.toString() !== studentCollege;

        const isAvailable = st.available === true;

        return teachesSubject && notFromSameCollege && isAvailable;
      });

      if (eligibleStaff.length === 0) {
        failedAllocations.push({
          sheetId: sheet._id,
          subject: sheet.subjectId.subjectName,
          reason: "No eligible staff available"
        });
        continue;
      }

      eligibleStaff.sort((a, b) => {
        const loadA = staffLoad[a._id] || 0;
        const loadB = staffLoad[b._id] || 0;
        return loadA - loadB;
      });

      const assignedStaff = eligibleStaff[0];

      sheet.assignedStaff = assignedStaff._id;
      sheet.status = "assigned";
      await sheet.save();

      staffLoad[assignedStaff._id] =
        (staffLoad[assignedStaff._id] || 0) + 1;

      assignedCount++;
    }

    return res.json({
      msg: "Allocation completed",
      totalSheets: sheets.length,
      allocated: assignedCount,
      failed: failedAllocations.length,
      failedAllocations // send details to UI
    });

  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};





import Result from "../Models/Result.js";
import Subject from "../Models/Subject.js";
import NOTIFICATION from "../Models/Notification.js";
import Student from "../Models/Student.js";
import Complaint from "../Models/Complaints.js";
import College from "../Models/College.js";
import Exam from "../Models/Exam.js";
import RevaluationRequest from "../Models/RevaluationRequest.js";


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
// export const publishResults = async (req, res) => {
//   try {
//     const sessionId = req.params.sessionId;

//     // 1️⃣ Load all evaluated answer sheets
//     const evaluatedSheets = await AnswerSheet.find({
//       sessionId,
//       status: "evaluated"
//     })
//       .populate("studentId")
//       .populate("subjectId");

//     if (evaluatedSheets.length === 0) {
//       return res.status(400).json({ msg: "No evaluated sheets to publish" });
//     }

//     // 2️⃣ Convert into Result model entries
//     const results = evaluatedSheets.map((sheet) => ({
//       sessionId,
//       studentId: sheet.studentId._id,
//       subjectId: sheet.subjectId._id,
//       marks: sheet.marks,
//       totalMark: sheet.subjectId.total_mark,
//       published: true
//     }));

//     // 3️⃣ Remove old published results for this session (if republishing)
//     await Result.deleteMany({ sessionId });

//     // 4️⃣ Save all results
//     await Result.insertMany(results);

//     return res.json({
//       msg: "Results published successfully",
//       publishedCount: results.length
//     });

//   } catch (err) {
//     console.log("PUBLISH RESULT ERROR:", err);
//     return res.status(500).json({ msg: err.message });
//   }
// };

export const publishResults = async (req, res) => {
  try {
    const sessionId = req.params.sessionId;

    // Fetch evaluated sheets
    const evaluatedSheets = await AnswerSheet.find({
      sessionId,
      status: "evaluated"
    })
      .populate("studentId")
      .populate("subjectId");

    if (evaluatedSheets.length === 0) {
      return res.status(400).json({ msg: "No evaluated sheets to publish" });
    }

    // Convert to result entries
    const results = evaluatedSheets.map(sheet => ({
      sessionId,
      studentId: sheet.studentId._id,
      collegeId: sheet.studentId.collegeId,    // <-- ADDED HERE
      subjectId: sheet.subjectId._id,
      marks: sheet.marks,
      totalMark: sheet.subjectId.total_mark,
      published: true
    }));

    // Remove old results for re-publishing
    await Result.deleteMany({ sessionId });

    // Insert all new results
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


// GET pending sheets for a session
export const getPendingSheets = async (req, res) => {
  try {
    const sessionId = req.params.sessionId;
    // console.log(sessionId);


    const pending = await AnswerSheet.find({
      sessionId,
      status: { $ne: "evaluated" }
    })
      .populate({
        path: "studentId",
        populate: { path: "collegeId" }
      })
      .populate({
        path: "assignedStaff",
        populate: { path: "collegeId" }
      })
      .populate("subjectId");

    // console.log(pending);

    return res.json(pending);
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};


// export const postNotifiaction = async(req,res)=>{
//   try{
// const {message,semester}= req.body
// // console.log(message,Semester);
// const newNotification = await NOTIFICATION.create({
// message,semester
// })
// return res.status(200).json({message:"Notification Sent Successfully",newNotification})
//   }
//   catch(e){
//     console.log(e);
//         return res.status(500).json({ msg: e.message });

//   }
// }

// export const postNotifiaction = async (req, res) => {
//   try {
//     const { message, semester } = req.body;

//     if (!message || !semester || semester.length === 0) {
//       return res.status(400).json({ message: "Message & semester required" });
//     }

//     const newNotification = await NOTIFICATION.create({
//       message,
//       semester, // ✅ array saved directly
//     });

//     return res.status(200).json({
//       message: "Notification Sent Successfully",
//       newNotification,
//     });
//   } catch (e) {
//     console.log(e);
//     return res.status(500).json({ msg: e.message });
//   }
// };
export const postNotifiaction = async (req, res) => {
  try {
    const { message, semester, target } = req.body;

    if (!message || !target) {
      return res.status(400).json({
        message: "Message and target are required",
      });
    }

    // Semester is ONLY required if target is student
    if (target === "student" && (!semester || semester.length === 0)) {
      return res.status(400).json({
        message: "Semester selection is required for student notifications",
      });
    }

    const newNotification = await NOTIFICATION.create({
      message,
      semester: target === "student" ? semester : [1, 2, 3, 4, 5, 6, 7, 8],
      target, // ✅ saved
    });

    return res.status(200).json({
      message: "Notification Sent Successfully",
      newNotification,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ msg: e.message });
  }
};


export const allnotifications = async (req, res) => {
  try {
    const all = await NOTIFICATION.find().sort({ createdAt: -1 })
    return res.status(200).json({ message: "Notification get Successfully", notifications: all })

  }
  catch (e) {
    console.log(e);
    return res.status(500).json({ msg: e.message });

  }
}

export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params
    console.log(id);
    const deleted = await NOTIFICATION.findByIdAndDelete(id)

    return res.status(200).json({ message: "Notification deleted Successfully", deleted })

  }
  catch (e) {
    console.log(e);
    return res.status(500).json({ msg: e.message });

  }
}

// export const studentNotifications = async(req,res)=>{
//   try{
//     const {id} = req.params
//     const sem = await Student.findById(id).select("semester -_id")
//     const semester = sem.semester
//     console.log(semester);

//     const notifications = await NOTIFICATION.find({semester})
//     console.log(notifications);


//   }
//   catch(e){
//     console.log(e);

//   }
// }


// export const studentNotifications = async (req, res) => {
//   try {
//     const { id } = req.params;

//     // 1️⃣ Get student's semester
//     const student = await Student.findById(id).select("semester");

//     if (!student) {
//       return res.status(404).json({ message: "Student not found" });
//     }

//     const semester = Number(student.semester); // ensure number
//     // console.log("Student semester:", semester);
//     console.log("Raw student semester:", student.semester);
// console.log("Type:", typeof student.semester);

// console.log(semester,'dddddddddddddd');

//     // 2️⃣ Fetch notifications for that semester
//     const notifications = await NOTIFICATION.find({ semester })
//       // .sort({ createdAt: -1 });
//       console.log(notifications);


//     // 3️⃣ Send response
//     return res.status(200).json({
//       semester,
//       notifications
//     });

//   } catch (e) {
//     console.error("STUDENT NOTIFICATION ERROR:", e);
//     return res.status(500).json({ message: "Server error" });
//   }
// };



// export const studentNotifications = async (req, res) => {
//   try {
//     const { id } = req.params;

//     // -----------------------------------------
//     // 1. Fetch student semester safely
//     // -----------------------------------------
//     const student = await Student.findById(id).select("semester").lean();
// console.log(student,'student');

//     if (!student || student.semester === undefined || student.semester === null) {
//       return res.status(404).json({
//         message: "Student not found or semester missing"
//       });
//     }

//     // Normalize semester (string, trimmed)
//     const semester = String(student.semester).trim();

//     // -----------------------------------------
//     // 2. DEBUG LOGS (remove after confirmation)
//     // -----------------------------------------
//     // console.log("Student semester value:", student.semester);
//     // console.log("Normalized semester:", semester);
//     // console.log("Notification collection:", NOTIFICATION.collection.name);

//     // -----------------------------------------
//     // 3. Fetch ALL notifications (sanity check)
//     // -----------------------------------------
//     // const allNotifications = await NOTIFICATION.find();
//     // console.log("ALL notifications count:", allNotifications.length);

//     // -----------------------------------------
//     // 4. Semester-safe query (handles string/number/space)
//     // -----------------------------------------
//     const notifications = await NOTIFICATION.find({
//       $expr: {
//         $eq: [
//           { $trim: { input: { $toString: "$semester" } } },
//           semester
//         ]
//       }
//     })
//       .sort({ createdAt: -1 })
//       .lean();

//     // -----------------------------------------
//     // 5. Final response
//     // -----------------------------------------
//     return res.status(200).json({
//       semester,
//       count: notifications.length,
//       notifications
//     });

//   } catch (error) {
//     console.error("STUDENT NOTIFICATION ERROR:", error);
//     return res.status(500).json({
//       message: "Server error",
//       error: error.message
//     });
//   }
// };

export const studentNotifications = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await Student.findById(id).select("semester").lean();

    if (!student || student.semester == null) {
      return res.status(404).json({ message: "Student not found or semester missing" });
    }

    const semester = Number(student.semester);

    // Filter by semester AND target (student or both)
    const notifications = await NOTIFICATION.find({
      semester: { $in: [semester] },
      target: { $in: ["student", "both"] }
    })
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      semester,
      count: notifications.length,
      notifications,
    });
  } catch (error) {
    console.error("STUDENT NOTIFICATION ERROR:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const staffNotifications = async (req, res) => {
  try {
    // Staff are not bound by semester in the model, but they evaluate subjects in semesters.
    // However, for simplicity and based on the current schema, we fetch all notifications targetting staff or both.
    const notifications = await NOTIFICATION.find({
      target: { $in: ["staff", "both"] }
    })
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      notifications,
    });
  } catch (error) {
    console.error("STAFF NOTIFICATION ERROR:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const getComplaints = async (req, res) => {
  const { status } = req.query
  // console.log(status);
  try {
    const complaints = await Complaint.find({ status }).populate("studentId", "name").populate("collegeId", "name")
    // console.log(complaints);
    return res.status(200).json({
      complaints
    });

  }
  catch (e) {
    console.log(e);
    return res.status(500).json({
      message: "Server error",
      error: e.message
    });
  }
}


export const replayComplaints = async (req, res) => {

  // console.log(complaintId,reply,status);
  try {
    const { complaintId } = req.params
    const { reply, status } = req.body
    const replyed = await Complaint.findByIdAndUpdate(complaintId, { status, reply })
    return res.status(200).json({
      replyed
    });
  }
  catch (e) {
    console.log(e);
    return res.status(500).json({
      message: "Server error",
      error: e.message
    });
  }
}

export const fetchCounts = async (req, res) => {
  try {
    const subjects = await Subject.countDocuments()
    const colleges = await College.countDocuments()
    const sessions = await ExamSession.countDocuments()
    const exams = await Exam.countDocuments()
    return res.status(200).json({
      subjects, colleges, sessions, exams
    });
  }
  catch (e) {
    console.log(e);
    return res.status(500).json({
      message: "Server error",
      error: e.message
    });
  }
}

// university history related


export const valuationHistory = async (req, res) => {
  try {
    const data = await AnswerSheet.find({ status: "evaluated" })
      .populate("studentId", "name registerNo")
      .populate("subjectId", "subjectName subjectCode")
      .populate("sessionId", "name academicYear semester")
      .populate("collegeId", "name")
      .populate({
        path: "assignedStaff",
        select: "name collegeId",
        populate: {
          path: "collegeId",
          select: "name"
        }
      })
      .sort({ updatedAt: -1 });

    res.json(data);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};



export const revaluationHistory = async (req, res) => {
  try {
    const data = await RevaluationRequest.find()
      .populate("studentId", "name registerNo")
      .populate({
        path: "answerSheetId",
        populate: [
          { path: "subjectId", select: "subjectName subjectCode" },
          { path: "sessionId", select: "name academicYear semester" },
          { path: "collegeId", select: "name" }
        ]
      })
      .populate({
        path: "assignedStaff",
        select: "name collegeId",
        populate: {
          path: "collegeId",
          select: "name"
        }
      })
      .sort({ updatedAt: -1 });

    res.json(data);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};


import AnswerCopyRequest from "../Models/AnswerCopyRequest.js";

export const answerCopyHistory = async (req, res) => {
  try {
    const data = await AnswerCopyRequest.find()
      .populate("studentId", "name registerNo")
      .populate("subjectId", "subjectName subjectCode")
      .populate("sessionId", "name academicYear semester")
      .populate("collegeId", "name")
      .populate("examId", "examDate")
      .sort({ createdAt: -1 });

    res.json(data);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
