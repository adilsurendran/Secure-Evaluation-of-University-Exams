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
  const [loading, setLoading] = useState(false);

  // --------------------------
  // 1. Load Exam Sessions + Students
  // --------------------------
  useEffect(() => {
    const loadInitial = async () => {
      try {
        const [sessRes, studentRes] = await Promise.all([
          api.get("/exam-sessions/all"),
          api.get(`/student/college/${collegeId}`),
        ]);

        setSessions(sessRes.data);
        setStudents(studentRes.data);
      } catch (err) {
        console.log(err);
      }
    };
    loadInitial();
  }, [collegeId]);

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

    if (loading) return;
    if (!validate()) return alert("Please correct the errors!");

    setLoading(true);

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
      setForm({ ...form, pdf: null, studentId: "" }); // Reset some parts
      // navigate("/college/view-uploads"); // Optional: redirect to view page
    } catch (err) {
      console.log(err);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleExamChange = (examId) => {
    const exam = exams.find((e) => e._id === examId);
    setForm({
      ...form,
      examId,
      subjectId: exam?.subjectId?._id || "",
    });
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        .admin-page {
          padding: 40px;
          min-height: 100vh;
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 25%, #bfdbfe 50%, #e0f2fe 75%, #f0f9ff 100%);
          font-family: 'Inter', sans-serif;
        }

        .form-card {
          max-width: 700px;
          margin: 0 auto;
          background: white;
          border-radius: 24px;
          padding: 40px;
          box-shadow: 0 4px 25px rgba(0, 0, 0, 0.08);
          border: 2px solid #e2e8f0;
        }

        .form-card h2 {
          font-size: 32px;
          font-weight: 800;
          background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0 0 12px 0;
          text-align: center;
        }

        .form-card p.subtitle {
          text-align: center;
          color: #64748b;
          margin-bottom: 32px;
          font-size: 15px;
        }

        .form-card form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-group label {
          font-size: 14px;
          font-weight: 600;
          color: #1e293b;
          margin-left: 4px;
        }

        .form-card select,
        .form-card input[type="text"],
        .form-card input[type="file"] {
          width: 100%;
          padding: 14px 18px;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          font-size: 15px;
          background: #f8fafc;
          transition: all 0.3s ease;
          color: #1e293b;
        }

        .form-card select:focus,
        .form-card input:focus {
          outline: none;
          border-color: #3b82f6;
          background: white;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
        }

        .form-card input[type="file"] {
          padding: 10px;
          background: white;
          border: 2px dashed #bfdbfe;
          cursor: pointer;
        }

        .form-card input[type="file"]:hover {
          border-color: #3b82f6;
          background: #f0f9ff;
        }

        /* AUTO-FILLED SUBJECT DISPLAY */
        .subject-display {
          background: #eff6ff;
          border: 2px solid #bfdbfe;
          color: #1e40af;
          padding: 14px 18px;
          border-radius: 12px;
          font-weight: 600;
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .text-danger {
          color: #ef4444;
          font-size: 12px;
          margin: 4px 0 0 4px;
          font-weight: 500;
        }

        .submit-btn {
          width: 100%;
          padding: 18px;
          background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 10px;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 10px;
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(37, 99, 235, 0.4);
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
        }

        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .upload-icon {
          font-size: 1.2rem;
        }

        @media (max-width: 768px) {
          .admin-page { padding: 20px; }
          .form-card { padding: 24px; }
        }
      `}</style>

      <div className="admin-page">
        <div className="form-card">
          <h2>📄 Upload Answer Sheet</h2>
          <p className="subtitle">Securely bridge the gap between physical exams and digital evaluation.</p>

          <form onSubmit={handleSubmit}>
            {/* SESSION SELECT */}
            <div className="form-group">
              <label>Exam Session</label>
              <select
                value={form.sessionId}
                onChange={(e) =>
                  setForm({
                    ...form,
                    sessionId: e.target.value,
                    examId: "",
                    subjectId: "",
                  })
                }
                disabled={loading}
              >
                <option value="">Select Exam Session</option>
                {sessions.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name} - {s.academicYear} (Sem {s.semester})
                  </option>
                ))}
              </select>
              {errors.sessionId && <p className="text-danger">{errors.sessionId}</p>}
            </div>

            {/* EXAM SELECT */}
            <div className="form-group">
              <label>Specific Exam</label>
              <select
                value={form.examId}
                onChange={(e) => handleExamChange(e.target.value)}
                disabled={!form.sessionId || loading}
              >
                <option value="">Select Exam</option>
                {exams.map((ex) => (
                  <option key={ex._id} value={ex._id}>
                    {ex.subjectId.subjectName} ({ex.subjectId.subjectCode})
                  </option>
                ))}
              </select>
              {errors.examId && <p className="text-danger">{errors.examId}</p>}
            </div>

            {/* SUBJECT (AUTO-FILLED) */}
            {form.subjectId && (
              <div className="form-group">
                <label>Mapped Subject ID</label>
                <div className="subject-display">
                  🆔 {form.subjectId}
                </div>
              </div>
            )}

            {/* STUDENT SELECT */}
            <div className="form-group">
              <label>Student</label>
              <select
                value={form.studentId}
                onChange={(e) =>
                  setForm({ ...form, studentId: e.target.value })
                }
                disabled={loading}
              >
                <option value="">Select Student</option>
                {students.map((st) => (
                  <option key={st._id} value={st._id}>
                    {st.name} - {st.admissionNo}
                  </option>
                ))}
              </select>
              {errors.studentId && <p className="text-danger">{errors.studentId}</p>}
            </div>

            {/* PDF UPLOAD */}
            <div className="form-group">
              <label>Answer Sheet (PDF only)</label>
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) =>
                  setForm({ ...form, pdf: e.target.files[0] })
                }
                disabled={loading}
              />
              {errors.pdf && <p className="text-danger">{errors.pdf}</p>}
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Processing Secure Upload..." : "Upload Answer Sheet"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default UploadAnswerSheet;
