import React, { useEffect, useState } from "react";
import api from "../../../api";
import { useNavigate } from "react-router-dom";
import "./collegecss.css";

function ScheduleExam() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    sessionId: "",
    subjectId: "",
    examDate: "",
    examTime: "",
  });

  const [sessions, setSessions] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await api.get("/exam-sessions/all");
        setSessions(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchSessions();
  }, []);

  const selectedSession = sessions.find((s) => s._id === form.sessionId);
  const availableSubjects = selectedSession?.subjects || [];

  const validate = () => {
    let err = {};

    if (!form.sessionId) err.sessionId = "Select an exam session";
    if (!form.subjectId) err.subjectId = "Select a subject";
    if (!form.examDate) err.examDate = "Select exam date";
    if (!form.examTime.trim()) err.examTime = "Enter exam time";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return alert("Fix validation errors");

    try {
      await api.post("/exams/create", form);
      alert("Exam scheduled successfully");

      setForm({
        sessionId: "",
        subjectId: "",
        examDate: "",
        examTime: "",
      });

      setErrors({});
      navigate("/admin/exams/manage");
    } catch (err) {
      console.log(err);
      alert("Error scheduling exam");
    }
  };

  return (
    <div className="bgg">
      <div className="college-form-wrapper">
        <h2>📝 Schedule Exam</h2>

        <form onSubmit={handleSubmit}>
          <select
            value={form.sessionId}
            onChange={(e) =>
              setForm({
                ...form,
                sessionId: e.target.value,
                subjectId: "",
              })
            }
          >
            <option value="">Select Exam Session</option>
            {sessions.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name} - {s.academicYear} (Sem {s.semester})
              </option>
            ))}
          </select>
          <p className="error">{errors.sessionId}</p>

          <select
            value={form.subjectId}
            onChange={(e) =>
              setForm({ ...form, subjectId: e.target.value })
            }
            disabled={!form.sessionId}
          >
            <option value="">
              {form.sessionId ? "Select Subject" : "Select session first"}
            </option>

            {availableSubjects.map((sub) => (
              <option key={sub._id} value={sub._id}>
                {sub.subjectCode} - {sub.subjectName}
              </option>
            ))}
          </select>
          <p className="error">{errors.subjectId}</p>

          <label>Exam Date</label>
          <input
            type="date"
            min={
              selectedSession
                ? selectedSession.startDate.split("T")[0]
                : ""
            }
            max={
              selectedSession
                ? selectedSession.endDate.split("T")[0]
                : ""
            }
            value={form.examDate}
            onChange={(e) =>
              setForm({ ...form, examDate: e.target.value })
            }
          />
          <p className="error">{errors.examDate}</p>

          <input
            placeholder="Exam Time (e.g. 10 AM - 1 PM)"
            value={form.examTime}
            onChange={(e) =>
              setForm({ ...form, examTime: e.target.value })
            }
          />
          <p className="error">{errors.examTime}</p>

          <p className="form-label">
            💡 Allowed colleges are automatically applied from the exam session.
          </p>

          <button type="submit">Schedule Exam</button>
        </form>
      </div>
    </div>
  );
}

export default ScheduleExam;
