import bcrypt from "bcryptjs";
import Student from "../Models/Student.js";
import LOGIN from "../Models/Login.js";
import Exam from "../Models/Exam.js";
import ExamSession from "../Models/ExamSession.js";


/* ======================================================
    CREATE STUDENT
    */
export const createStudent = async (req, res) => {
  try {
    const {
      collegeId,
      name,
      admissionNo,
      phone,
      email,
      password,
      semester,
      department,
      subjects,   // ✅ read subjects
    } = req.body;

    // Duplicate check
    const exists = await LOGIN.findOne({ username: email });
    if (exists) {
      return res.status(400).json({ msg: "Student already registered" });
    }

    // Validate password
    if (!password || password.length < 6) {
      return res
        .status(400)
        .json({ msg: "Password must be at least 6 characters" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create Login entry
    const loginUser = await LOGIN.create({
      username: email,
      password: hashedPassword,
      role: "student",
    });

    // Create Student record
    const student = await Student.create({
      collegeId,
      name,
      admissionNo,
      phone,
      email,
      password: hashedPassword,
      semester,
      department,
      subjects: subjects || [],  // ✅ save subjects
      commonKey: loginUser._id,
    });

    return res.status(201).json({
      msg: "Student registered successfully",
      student,
    });

  } catch (err) {
    return res.status(500).json({
      msg: "Server error",
      error: err.message,
    });
  }
};

/* ======================================================
    GET STUDENTS BY COLLEGE
====================================================== */
export const getStudentsByCollege = async (req, res) => {
  try {
    const students = await Student.find({ collegeId: req.params.collegeId });
    return res.json(students);
  } catch (err) {
    return res.status(500).json({ msg: "Server error", error: err.message });
  }
};

/* ======================================================
    GET STUDENT BY ID
====================================================== */
export const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
    .populate("subjects", "subjectName subjectCode"); // ← FIX
    if (!student) return res.status(404).json({ msg: "Student not found" });
    return res.json(student);
  } catch (err) {
    return res.status(500).json({ msg: "Server error", error: err.message });
  }
};

/* ======================================================
    UPDATE STUDENT (Password optional)
*/
export const updateStudent = async (req, res) => {
  try {
    const {
      name,
      phone,
      semester,
      department,
      subjects,   // ✅ allow updating subjects
      password,
      admissionNo,
    } = req.body;

    // Build update object
    const updateData = {
      name,
      phone,
      semester,
      department,
      subjects: subjects || [], // ✅ update subjects if provided
      admissionNo  
    };

    // --- PASSWORD UPDATE HANDLING ---
    if (password && password.trim().length >= 6) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;

      // Update LOGIN credentials
      const student = await Student.findById(req.params.id);
      if (student) {
        await LOGIN.findOneAndUpdate(
          { username: student.email }, // Email cannot be changed
          { password: hashedPassword }
        );
      }
    }

    // --- UPDATE STUDENT RECORD ---
    const updated = await Student.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    }).populate("subjects", "subjectName subjectCode");

    if (!updated) {
      return res.status(404).json({ msg: "Student not found" });
    }

    return res.json({
      msg: "Student updated successfully",
      student: updated,
    });

  } catch (err) {
    return res.status(500).json({
      msg: "Server error",
      error: err.message,
    });
  }
};


/* ======================================================
    DELETE STUDENT
====================================================== */
export const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) return res.status(404).json({ msg: "Student not found" });

    await LOGIN.findOneAndDelete({ username: student.email });
    await Student.findByIdAndDelete(req.params.id);

    return res.json({ msg: "Student deleted successfully" });

  } catch (err) {
    return res.status(500).json({ msg: "Server error", error: err.message });
  }
};



export const getStudentExamSchedule = async (req, res) => {
  try {
    const studentId = req.params.studentId;

    // 1️⃣ Fetch student info
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({ msg: "Student not found" });
    }

    const { semester, subjects, collegeId } = student;

    // 2️⃣ Find all exam sessions of this semester
    const sessions = await ExamSession.find({ semester }).select("_id");

    const sessionIds = sessions.map((s) => s._id);

    // 3️⃣ Fetch exams matching all conditions
    const exams = await Exam.find({
      sessionId: { $in: sessionIds },
      subjectId: { $in: subjects },
      allowedColleges: collegeId,
    })
      .populate("subjectId", "subjectName subjectCode")
      .populate("sessionId", "name semester academicYear")
      .sort({ examDate: 1 });

    return res.json(exams);

  } catch (err) {
    console.log(err);

    return res.status(500).json({
      msg: "Server error",
      error: err.message,
    });
  }
};


// controllers/student.result.controller.js
import Result from "../Models/Result.js";

export const getStudentResults = async (req, res) => {
  try {
    const { studentId, sessionId } = req.params;

    // Check if results are published for this session
    const anyPublished = await Result.findOne({
      studentId,
      sessionId,
      published: true,
    });

    if (!anyPublished) {
      return res.status(200).json({
        published: false,
        msg: "Results not announced yet",
        results: []
      });
    }

    // Fetch all subject results
    const results = await Result.find({
      studentId,
      sessionId
    }).populate("subjectId");

    const session = await ExamSession.findById(sessionId);

    return res.json({
      published: true,
      session,
      results
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: err.message });
  }
};


