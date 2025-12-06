// src/components/college/UploadAnswerSheet.jsx
import React, { useEffect, useState } from "react";
import api from "../../../api";
import { useNavigate } from "react-router-dom";

function UploadAnswerSheet() {
  const navigate = useNavigate();
  const collegeId = localStorage.getItem("collegeId");

  const [sessions, setSessions] = useState([]);
  const [exams, setExams] = useState([]);
  const [students, setStudents] = useState([]);

  const [form, setForm] = useState({
    sessionId: "",
    examId: "",
    subjectId: "",
    studentId: "",
    collegeId,
    pdf: null,
  });

  const [errors, setErrors] = useState({});

  // --------------------------
  // 1. Load Exam Sessions + Students
  // --------------------------
  useEffect(() => {
    const loadInitial = async () => {
      try {
        const s1 = await api.get("/exam-sessions/all");
        const s2 = await api.get(`/student/college/${collegeId}`);

        setSessions(s1.data);
        setStudents(s2.data);
      } catch (err) {
        console.log(err);
      }
    };
    loadInitial();
  }, []);

  // --------------------------
  // 2. Load Exams when Session changes
  // --------------------------
  useEffect(() => {
    const loadExams = async () => {
      if (!form.sessionId) return;

      try {
        const res = await api.get(`/exams/session/${form.sessionId}`);
        setExams(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    loadExams();
  }, [form.sessionId]);

  // --------------------------
  // 3. Basic Validation
  // --------------------------
  const validate = () => {
    const err = {};

    if (!form.sessionId) err.sessionId = "Select exam session";
    if (!form.examId) err.examId = "Select exam";
    if (!form.studentId) err.studentId = "Select student";
    if (!form.pdf) err.pdf = "Upload answer sheet PDF";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  // --------------------------
  // 4. Handle submission
  // --------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return alert("Please correct the errors!");

    const fd = new FormData();
    fd.append("pdf", form.pdf);
    fd.append("sessionId", form.sessionId);
    fd.append("examId", form.examId);
    fd.append("studentId", form.studentId);
    fd.append("subjectId", form.subjectId);
    fd.append("collegeId", collegeId);

    try {
      await api.post("/colleges/upload", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Answer Sheet Uploaded Successfully!");
      navigate("/college/uploaded-sheets");
    } catch (err) {
      console.log(err);
      alert("Upload failed");
    }
  };

  // --------------------------
  // When exam changes → set subjectId automatically
  // --------------------------
  const handleExamChange = (examId) => {
    const exam = exams.find((e) => e._id === examId);
    setForm({
      ...form,
      examId,
      subjectId: exam?.subjectId?._id || "",
    });
  };

  return (
    <div className="bgg">
      <div className="college-form-wrapper">
        <h2>Upload Answer Sheet</h2>

        <form onSubmit={handleSubmit}>
          {/* SESSION SELECT */}
          <select
            value={form.sessionId}
            onChange={(e) =>
              setForm({ ...form, sessionId: e.target.value, examId: "", subjectId: "" })
            }
          >
            <option value="">Select Exam Session</option>
            {sessions.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name} - {s.academicYear} (Sem {s.semester})
              </option>
            ))}
          </select>
          <p className="error text-danger">{errors.sessionId}</p>

          {/* EXAM SELECT */}
          <select
            value={form.examId}
            onChange={(e) => handleExamChange(e.target.value)}
            disabled={!form.sessionId}
          >
            <option value="">Select Exam</option>
            {exams.map((ex) => (
              <option key={ex._id} value={ex._id}>
                {ex.subjectId.subjectName} ({ex.subjectId.subjectCode})
              </option>
            ))}
          </select>
          <p className="error text-danger">{errors.examId}</p>

          {/* STUDENT SELECT */}
          <select
            value={form.studentId}
            onChange={(e) => setForm({ ...form, studentId: e.target.value })}
          >
            <option value="">Select Student</option>
            {students.map((st) => (
              <option key={st._id} value={st._id}>
                {st.name} - {st.admissionNo}
              </option>
            ))}
          </select>
          <p className="error text-danger">{errors.studentId}</p>

          {/* SHOW SUBJECT (AUTO-FILLED) */}
          {form.subjectId && (
            <input value={`Subject ID: ${form.subjectId}`} disabled />
          )}

          {/* PDF UPLOAD */}
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setForm({ ...form, pdf: e.target.files[0] })}
          />
          <p className="error text-danger">{errors.pdf}</p>

          <button type="submit">Upload Answer Sheet</button>
        </form>
      </div>
    </div>
  );
}

export default UploadAnswerSheet;
