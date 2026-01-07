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

        .college-header div {
          display: flex;
          gap: 12px;
        }

        .add-college-btn {
          padding: 12px 24px;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        }

        .add-college-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
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

          .college-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }

          .college-header h2 {
            font-size: 24px;
          }

          .college-table-container {
            overflow-x: auto;
          }
        }
      `}</style>

      <div className="college-page">
        <div className="college-header">
          <h2>📅 Manage Exam Sessions</h2>
          <div>
            <button
              className="add-college-btn"
              onClick={() => navigate("/admin/exams/add-session")}
            >
              + Add Session
            </button>
            <button
              className="add-college-btn"
              onClick={() => navigate("/admin/exams/schedule")}
            >
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
              {sessions.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                    No exam sessions available. Click "Add Session" to create one.
                  </td>
                </tr>
              )}

              {sessions.map((s, i) => (
                <tr key={s._id}>
                  <td>{i + 1}</td>
                  <td><strong>{s.name}</strong></td>
                  <td>{s.academicYear}</td>
                  <td>Semester {s.semester}</td>
                  <td>
                    <button className="delete-btn" onClick={() => deleteSession(s._id)}>
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

export default ManageExamSessions;
