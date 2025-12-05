import React, { useEffect, useState } from "react";
import api from "../../../api";

function ManageExams() {
  const [exams, setExams] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [filterSession, setFilterSession] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [examRes, sessionRes] = await Promise.all([
        api.get("/exams/all"),
        api.get("/exam-sessions/all"),
      ]);

      setExams(examRes.data);
      setSessions(sessionRes.data);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteExam = async (id) => {
    if (!window.confirm("Delete this exam?")) return;

    try {
      await api.delete(`/exams/delete/${id}`);
      setExams(exams.filter((ex) => ex._id !== id));
      alert("Exam deleted successfully");
    } catch (err) {
      console.log(err);
    }
  };

  // Filter exams by session
  const filteredExams = filterSession
    ? exams.filter((ex) => ex.sessionId?._id === filterSession)
    : exams;

  return (
    <div className="college-page">

      {/* Header */}
      <div className="college-header">
        <h2>Manage Scheduled Exams</h2>
      </div>

      {/* FILTER SECTION */}
      <div className="filter-row">
        <select
          value={filterSession}
          onChange={(e) => setFilterSession(e.target.value)}
        >
          <option value="">Filter by Session</option>
          {sessions.map((s) => (
            <option key={s._id} value={s._id}>
              {s.name} ({s.academicYear}) - Sem {s.semester}
            </option>
          ))}
        </select>
      </div>

      {/* EXAMS TABLE */}
      <div className="college-table-container">
        <table className="college-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Session</th>
              <th>Subject</th>
              <th>Date</th>
              <th>Time</th>
              <th>Allowed Colleges</th>
              <th style={{ textAlign: "center" }}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredExams.length === 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: "center", padding: "20px" }}>
                  No exams found.
                </td>
              </tr>
            )}

            {filteredExams.map((ex, index) => (
              <tr key={ex._id}>
                <td>{index + 1}</td>

                <td>
                  {ex.sessionId?.name}
                  <br />
                  <small>
                    {ex.sessionId?.academicYear} — Sem {ex.sessionId?.semester}
                  </small>
                </td>

                <td>
                  {ex.subjectId?.subjectCode} — {ex.subjectId?.subjectName}
                </td>

                <td>{ex.examDate?.slice(0, 10)}</td>
                <td>{ex.examTime}</td>

                <td>
                  {ex.allowedColleges.length === 0 ? (
                    <span>No Colleges</span>
                  ) : (
                    ex.allowedColleges.map((c) => (
                      <div key={c._id}>• {c.name}</div>
                    ))
                  )}
                </td>

                <td className="action-col">
                  <button className="delete-btn" onClick={() => deleteExam(ex._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
}

export default ManageExams;
