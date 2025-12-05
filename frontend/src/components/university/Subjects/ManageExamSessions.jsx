import React, { useEffect, useState } from "react";
import api from "../../../../api";
import { useNavigate } from "react-router-dom";

function ManageExamSessions() {
  const [sessions, setSessions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSessions = async () => {
      const res = await api.get("/exam-sessions/all");
      setSessions(res.data);
    };
    fetchSessions();
  }, []);

  const deleteSession = async (id) => {
    if (!window.confirm("Delete session?")) return;

    await api.delete(`/exam-sessions/delete/${id}`);
    setSessions(sessions.filter((s) => s._id !== id));
  };

  return (
    <div className="college-page">

      {/* Header + Add Button */}
      <div className="college-header">
        <h2>Manage Exam Sessions</h2>
        <div>
        <button
          className="add-college-btn"
          onClick={() => navigate("/admin/exams/add-session")}
        >
          + Add Session
        </button>
        <button className="add-college-btn ms-2" onClick={() => navigate("/admin/exams/schedule")}>
  Schedule Exam
</button>
</div>
      </div>

      <div className="college-table-container">
        <table className="college-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Session</th>
              <th>Academic Year</th>
              <th>Semester</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {sessions.map((s, i) => (
              <tr key={s._id}>
                <td>{i + 1}</td>
                <td>{s.name}</td>
                <td>{s.academicYear}</td>
                <td>{s.semester}</td>
                <td>
                  <button className="add-college-btn" onClick={() => deleteSession(s._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

    </div>
  );
}

export default ManageExamSessions;
