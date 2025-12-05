// // import Exam from "../Models/Exam.js";

// // export const createExam = async (req, res) => {
// //   try {
// //     const exam = await Exam.create(req.body);

// //     return res.status(201).json({
// //       msg: "Exam scheduled successfully",
// //       exam,
// //     });
// //   } catch (err) {
// //     return res.status(500).json({ msg: "Server error", error: err.message });
// //   }
// // };

// // export const getExamsBySession = async (req, res) => {
// //   try {
// //     const exams = await Exam.find({ sessionId: req.params.sessionId })
// //       .populate("subjectId")
// //       .populate("allowedColleges");

// //     res.json(exams);
// //   } catch (err) {
// //     res.status(500).json({ msg: "Server error", error: err.message });
// //   }
// // };

// // export const deleteExam = async (req, res) => {
// //   try {
// //     await Exam.findByIdAndDelete(req.params.id);
// //     res.json({ msg: "Exam deleted" });
// //   } catch (err) {
// //     res.status(500).json({ msg: "Server error", error: err.message });
// //   }
// // };


// import Exam from "../Models/Exam.js";
// import ExamSession from "../Models/ExamSession.js";
// import Subject from "../Models/Subject.js";
// import College from "../Models/College.js";

// /**
//  * CREATE EXAM (University schedules exam for a subject)
//  */
// export const createExam = async (req, res) => {
//   try {
//     const { sessionId, subjectId, examDate, examTime, allowedColleges } = req.body;

//     // --- VALIDATION ---
//     if (!sessionId || !subjectId || !examDate || !examTime) {
//       return res.status(400).json({ msg: "All fields are required." });
//     }

//     // Check if session exists
//     const sessionExists = await ExamSession.findById(sessionId);
//     if (!sessionExists) {
//       return res.status(404).json({ msg: "Exam session not found." });
//     }

//     // Check if subject is valid
//     const subjectExists = await Subject.findById(subjectId);
//     if (!subjectExists) {
//       return res.status(404).json({ msg: "Subject not found." });
//     }

//     // Duplicate exam check: same session + subject
//     const duplicateExam = await Exam.findOne({
//       sessionId,
//       subjectId,
//     });

//     if (duplicateExam) {
//       return res.status(409).json({
//         msg: "Exam for this subject is already scheduled in this session.",
//       });
//     }

//     // Create exam
//     const exam = await Exam.create({
//       sessionId,
//       subjectId,
//       examDate,
//       examTime,
//       allowedColleges: allowedColleges || [],
//     });

//     return res.status(201).json({
//       msg: "Exam scheduled successfully",
//       exam,
//     });

//   } catch (error) {
//     console.error("Create Exam Error:", error);
//     return res.status(500).json({
//       msg: "Server error while scheduling exam",
//       error: error.message,
//     });
//   }
// };

// /**
//  * GET EXAMS BY EXAM SESSION
//  */
// export const getExamsBySession = async (req, res) => {
//   try {
//     const exams = await Exam.find({ sessionId: req.params.sessionId })
//       .populate("subjectId", "subjectName subjectCode")
//       .populate("allowedColleges", "name code email")
//       .sort({ examDate: 1 });

//     return res.status(200).json(exams);

//   } catch (error) {
//     console.error("Get Exams Error:", error);
//     return res.status(500).json({
//       msg: "Server error while fetching exams",
//       error: error.message,
//     });
//   }
// };

// /**
//  * DELETE EXAM
//  */
// export const deleteExam = async (req, res) => {
//   try {
//     const exam = await Exam.findById(req.params.id);

//     if (!exam) {
//       return res.status(404).json({ msg: "Exam not found" });
//     }

//     await Exam.findByIdAndDelete(req.params.id);

//     return res.json({ msg: "Exam deleted successfully" });

//   } catch (error) {
//     console.error("Delete Exam Error:", error);
//     return res.status(500).json({
//       msg: "Server error while deleting exam",
//       error: error.message,
//     });
//   }
// };


import Exam from "../Models/Exam.js";
import ExamSession from "../Models/ExamSession.js";
import Subject from "../Models/Subject.js";
import College from "../Models/College.js";

/* ======================================================
   CREATE EXAM
====================================================== */
export const createExam = async (req, res) => {
  try {
    const { sessionId, subjectId, examDate, examTime, allowedColleges } = req.body;

    if (!sessionId || !subjectId || !examDate || !examTime) {
      return res.status(400).json({ msg: "All fields are required." });
    }

    // Validate session
    const session = await ExamSession.findById(sessionId);
    if (!session) return res.status(404).json({ msg: "Exam session not found." });

    // Validate subject
    const subject = await Subject.findById(subjectId);
    if (!subject) return res.status(404).json({ msg: "Subject not found." });

    // Prevent duplicate exam for same session + subject
    const duplicateExam = await Exam.findOne({ sessionId, subjectId });
    if (duplicateExam) {
      return res.status(409).json({
        msg: "Exam for this subject already exists in this session.",
      });
    }

    const exam = await Exam.create({
      sessionId,
      subjectId,
      examDate,
      examTime,
      allowedColleges: allowedColleges || [],
    });

    return res.status(201).json({
      msg: "Exam scheduled successfully",
      exam,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      msg: "Server error while scheduling exam",
      error: error.message,
    });
  }
};

/* ======================================================
   GET ALL EXAMS
====================================================== */
export const getAllExams = async (req, res) => {
  try {
    const exams = await Exam.find()
      .populate("sessionId", "name academicYear semester")
      .populate("subjectId", "subjectName subjectCode")
      .populate("allowedColleges", "name email");

    return res.json(exams);

  } catch (err) {
    return res.status(500).json({
      msg: "Server error fetching exams",
      error: err.message,
    });
  }
};

/* ======================================================
   GET EXAMS BY SESSION ID
====================================================== */
export const getExamsBySession = async (req, res) => {
  try {
    const exams = await Exam.find({ sessionId: req.params.sessionId })
      .populate("subjectId", "subjectName subjectCode")
      .populate("allowedColleges", "name email")
      .sort({ examDate: 1 });

    return res.json(exams);

  } catch (error) {
    return res.status(500).json({
      msg: "Server error fetching exams",
      error: error.message,
    });
  }
};

/* ======================================================
   DELETE EXAM
====================================================== */
export const deleteExam = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);

    if (!exam) {
      return res.status(404).json({ msg: "Exam not found" });
    }

    await Exam.findByIdAndDelete(req.params.id);

    return res.json({ msg: "Exam deleted successfully" });

  } catch (error) {
    return res.status(500).json({
      msg: "Server error deleting exam",
      error: error.message,
    });
  }
};
