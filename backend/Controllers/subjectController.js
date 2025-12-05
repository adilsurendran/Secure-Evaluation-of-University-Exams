import Subject from "../Models/Subject.js";

// ==========================
// CREATE SUBJECT
// ==========================
export const addSubject = async (req, res) => {
  try {
    const { subjectCode, subjectName, course, semester } = req.body;

    const exists = await Subject.findOne({ subjectCode });

    if (exists)
      return res.status(400).json({ msg: "Subject code already exists" });

    const subject = await Subject.create({
      subjectCode,
      subjectName,
      course,
      semester,
    });

    res.status(201).json({ msg: "Subject created successfully", subject });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// ==========================
// GET ALL SUBJECTS
// ==========================
export const getAllSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find().sort({ createdAt: -1 });
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// ==========================
// GET SINGLE SUBJECT BY ID
// ==========================
export const getSubjectById = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);

    if (!subject) return res.status(404).json({ msg: "Subject not found" });

    res.json(subject);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// ==========================
// UPDATE SUBJECT
// ==========================
export const updateSubject = async (req, res) => {
  try {
    const { subjectName, course, semester, status } = req.body;

    const subject = await Subject.findByIdAndUpdate(
      req.params.id,
      { subjectName, course, semester, status },
      { new: true }
    );

    if (!subject) return res.status(404).json({ msg: "Subject not found" });

    res.json({ msg: "Subject updated", subject });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// ==========================
// DELETE SUBJECT
// ==========================
export const deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findByIdAndDelete(req.params.id);

    if (!subject) return res.status(404).json({ msg: "Subject not found" });

    res.json({ msg: "Subject deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};
