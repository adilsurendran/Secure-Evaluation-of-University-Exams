// import ExamSession from "../Models/ExamSession.js";

// export const createExamSession = async (req, res) => {
//   try {
//     const session = await ExamSession.create(req.body);

//     return res.status(201).json({
//       msg: "Exam Session created successfully",
//       session,
//     });
//   } catch (err) {
//     return res.status(500).json({ msg: "Server error", error: err.message });
//   }
// };

// export const getAllExamSessions = async (req, res) => {
//   try {
//     const sessions = await ExamSession.find().populate("subjects");
//     res.json(sessions);
//   } catch (err) {
//     res.status(500).json({ msg: "Server error", error: err.message });
//   }
// };

// export const deleteExamSession = async (req, res) => {
//   try {
//     await ExamSession.findByIdAndDelete(req.params.id);
//     res.json({ msg: "Exam session deleted" });
//   } catch (err) {
//     res.status(500).json({ msg: "Server error", error: err.message });
//   }
// };


import ExamSession from "../Models/ExamSession.js";

/**
 * Create a new exam session
 */
export const createExamSession = async (req, res) => {
  try {
    const { name, academicYear, semester, startDate, endDate, subjects } = req.body;

    // Basic validation
    if (!name || !academicYear || !semester || !startDate || !endDate) {
      return res.status(400).json({ msg: "All required fields must be provided" });
    }

    // Check if same session already exists for same semester in same year
    const exists = await ExamSession.findOne({
      name,
      academicYear,
      semester,
    });

    if (exists) {
      return res.status(409).json({
        msg: "Exam session already exists with same name/year/semester",
      });
    }

    // Create exam session
    const session = await ExamSession.create({
      name,
      academicYear,
      semester,
      startDate,
      endDate,
      subjects: subjects || [],
    });

    return res.status(201).json({
      msg: "Exam Session created successfully",
      session,
    });

  } catch (error) {
    console.error("Create session error:", error);
    return res.status(500).json({
      msg: "Server error while creating exam session",
      error: error.message,
    });
  }
};

/**
 * Get all exam sessions
 */
export const getAllExamSessions = async (req, res) => {
  try {
    const sessions = await ExamSession.find()
      .populate("subjects", "subjectName subjectCode")
      .sort({ createdAt: -1 });

    return res.status(200).json(sessions);

  } catch (error) {
    console.error("Fetch sessions error:", error);
    return res.status(500).json({
      msg: "Server error while fetching exam sessions",
      error: error.message,
    });
  }
};

/**
 * Delete an exam session
 */
export const deleteExamSession = async (req, res) => {
  try {
    const { id } = req.params;

    const session = await ExamSession.findById(id);

    if (!session) {
      return res.status(404).json({ msg: "Exam session not found" });
    }

    await ExamSession.findByIdAndDelete(id);

    return res.status(200).json({ msg: "Exam session deleted successfully" });

  } catch (error) {
    console.error("Delete session error:", error);
    return res.status(500).json({
      msg: "Server error while deleting exam session",
      error: error.message,
    });
  }
};
