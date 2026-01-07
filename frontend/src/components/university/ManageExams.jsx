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

  const filteredExams = filterSession
    ? exams.filter((ex) => ex.sessionId?._id === filterSession)
    : exams;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        .college-page {
          padding: 32px;
          min-height: 100vh;
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 25%, #bfdbfe 50%, #e0f2fe 75%, #f0f9ff 100%);
          font-family: 'Inter', sans-serif;
        }

        .college-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
          padding-bottom: 24px;
          border-bottom: 2px solid #e2e8f0;
        }

        .college-header h2 {
          font-size: 32px;
          font-weight: 800;
          background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0;
        }

        .filter-row {
          margin-bottom: 24px;
        }

        .filter-row select {
          padding: 12px 18px;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          font-size: 15px;
          background: #f8fafc;
          cursor: pointer;
          transition: all 0.3s ease;
          max-width: 400px;
        }

        .filter-row select:focus {
          outline: none;
          border-color: #3b82f6;
          background: white;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
        }

        .college-table-container {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          border: 2px solid #e2e8f0;
        }

        .college-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 15px;
        }

        .college-table thead {
          background: #1e40af;
          color: white;
        }

        .college-table thead th {
          padding: 16px;
          text-align: left;
          font-weight: 600;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .college-table tbody tr {
          border-bottom: 1px solid #e2e8f0;
          transition: all 0.2s ease;
        }

        .college-table tbody tr:hover {
          background: #f8fafc;
        }

        .college-table tbody tr:last-child {
          border-bottom: none;
        }

        .college-table tbody td {
          padding: 16px;
          color: #1e293b;
        }

        .college-table tbody td small {
          color: #64748b;
          font-size: 13px;
        }

        .action-col {
          text-align: center;
        }

        .delete-btn {
          padding: 8px 16px;
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
        }

        .delete-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
        }

        @media (max-width: 768px) {
          .college-page {
            padding: 20px;
          }

          .college-header h2 {
            font-size: 24px;
          }

          .college-table-container {
            overflow-x: auto;
          }

          .college-table {
            font-size: 13px;
          }

          .college-table thead th,
          .college-table tbody td {
            padding: 12px 8px;
          }
        }
      `}</style>

      <div className="college-page">
        <div className="college-header">
          <h2>📋 Manage Scheduled Exams</h2>
        </div>

        <div className="filter-row">
          <select
            value={filterSession}
            onChange={(e) => setFilterSession(e.target.value)}
          >
            <option value="">All Sessions</option>
            {sessions.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name} ({s.academicYear}) - Sem {s.semester}
              </option>
            ))}
          </select>
        </div>

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
                  <td colSpan="7" style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>
                    No exams found.
                  </td>
                </tr>
              )}

              {filteredExams.map((ex, index) => (
                <tr key={ex._id}>
                  <td>{index + 1}</td>

                  <td>
                    <strong>{ex.sessionId?.name}</strong>
                    <br />
                    <small>
                      {ex.sessionId?.academicYear} — Sem {ex.sessionId?.semester}
                    </small>
                  </td>

                  <td>
                    <strong>{ex.subjectId?.subjectCode}</strong> — {ex.subjectId?.subjectName}
                  </td>

                  <td>{ex.examDate?.slice(0, 10)}</td>
                  <td>{ex.examTime}</td>

                  <td>
                    {ex.allowedColleges.length === 0 ? (
                      <span style={{ color: '#94a3b8' }}>No Colleges</span>
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
    </>
  );
}

export default ManageExams;
