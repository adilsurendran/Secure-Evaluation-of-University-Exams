import React, { useEffect, useState } from "react";
import api from "../../../api";

export default function AdminRevaluationList() {
  const [sessions, setSessions] = useState([]);
  const [sessionId, setSessionId] = useState("");
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    const loadSessions = async () => {
      try {
        const res = await api.get("/exam-sessions/all");
        setSessions(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    loadSessions();
  }, []);

  const loadRequests = async (id) => {
    if (!id) return setRequests([]);

    setLoading(true);
    try {
      const res = await api.get(
        `/revaluation/admin/all?status=pending&sessionId=${id}`
      );
      setRequests(res.data);
    } catch (err) {
      console.log(err);
      alert("Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  const handleSessionChange = (e) => {
    const id = e.target.value;
    setSessionId(id);
    loadRequests(id);
  };

  const autoAssign = async () => {
    if (!sessionId) return;

    if (!window.confirm("Auto assign all paid revaluation requests?")) return;

    setAssigning(true);
    try {
      const res = await api.post(
        `/revaluation/admin/auto-assign/${sessionId}`
      );
      alert(
        `${res.data.assigned} assigned, ${res.data.rejected} rejected`
      );
      loadRequests(sessionId);
    } catch (err) {
      console.log(err);
      alert("Auto assign failed");
    } finally {
      setAssigning(false);
    }
  };

  const reject = async (id) => {
    const reason = prompt("Enter rejection reason:");
    if (reason === null) return;

    try {
      await api.put(`/revaluation/admin/reject/${id}`, { reason });
      loadRequests(sessionId);
    } catch (err) {
      console.log(err);
      alert("Reject failed");
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

        .admin-page {
          padding: 32px;
          min-height: 100vh;
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 25%, #bfdbfe 50%, #e0f2fe 75%, #f0f9ff 100%);
          font-family: 'Inter', sans-serif;
        }

        .admin-page h2 {
          text-align: center;
          font-size: 42px;
          font-weight: 900;
          background: linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #60a5fa 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0 0 32px 0;
          padding: 32px;
          background-color: white;
          border-radius: 24px;
          box-shadow: 0 8px 32px rgba(30, 64, 175, 0.15);
          border: 3px solid #60a5fa;
          animation: slideInDown 0.8s ease, borderShine 3s ease-in-out infinite;
        }

        @keyframes slideInDown {
          from {
            opacity: 0;
            transform: translateY(-40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes borderShine {
          0%, 100% {
            border-color: #60a5fa;
            box-shadow: 0 8px 32px rgba(96, 165, 250, 0.2);
          }
          50% {
            border-color: #3b82f6;
            box-shadow: 0 12px 48px rgba(59, 130, 246, 0.4);
          }
        }

        .filter-row {
          margin-bottom: 32px;
          display: flex;
          align-items: center;
          gap: 16px;
          background: white;
          padding: 24px;
          border-radius: 20px;
          box-shadow: 0 4px 20px rgba(30, 64, 175, 0.1);
          border: 2px solid #93c5fd;
        }

        .filter-row label {
          font-weight: 700;
          color: #1e293b;
          font-size: 16px;
        }

        .filter-select {
          padding: 14px 20px;
          border: 2px solid #60a5fa;
          border-radius: 14px;
          font-size: 15px;
          background: white;
          cursor: pointer;
          transition: all 0.3s ease;
          flex: 1;
          max-width: 500px;
          font-weight: 600;
        }

        .filter-select:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 4px rgba(96, 165, 250, 0.2);
        }

        .btn-blue {
          padding: 12px 28px;
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          color: white;
          border: none;
          border-radius: 14px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 16px rgba(59, 130, 246, 0.4);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .btn-blue:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 24px rgba(59, 130, 246, 0.5);
        }

        .btn-blue:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          animation: pulse 1.5s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 0.6;
          }
          50% {
            opacity: 0.9;
          }
        }

        .college-table {
          width: 100%;
          border-collapse: collapse;
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(30, 64, 175, 0.15);
          animation: fadeInUp 0.8s ease;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .college-table thead {
          background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
          color: white;
        }

        .college-table thead th {
          padding: 18px 16px;
          text-align: left;
          font-weight: 700;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.8px;
        }

        .college-table tbody tr {
          border-bottom: 1px solid #dbeafe;
          transition: all 0.3s ease;
        }

        .college-table tbody tr:hover {
          background: linear-gradient(135deg, #f0f9ff 0%, #dbeafe 100%);
          transform: scale(1.01);
          box-shadow: 0 4px 16px rgba(59, 130, 246, 0.1);
        }

        .college-table tbody tr:last-child {
          border-bottom: none;
        }

        .college-table tbody td {
          padding: 16px;
          color: #1e293b;
        }

        .small-text {
          font-size: 12px;
          color: #64748b;
          margin-top: 4px;
        }

        .text-muted {
          color: #94a3b8;
          font-weight: 500;
        }

        .text-center {
          text-align: center;
        }

        .btn-reject {
          padding: 8px 18px;
          background: linear-gradient(135deg, #64748b 0%, #475569 100%);
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(100, 116, 139, 0.4);
        }

        .btn-reject:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(100, 116, 139, 0.5);
        }

        @media (max-width: 768px) {
          .admin-page {
            padding: 20px;
          }

          .admin-page h2 {
            font-size: 28px;
          }

          .filter-row {
            flex-direction: column;
            align-items: flex-start;
          }

          .filter-select {
            max-width: 100%;
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

      <div className="admin-page">
        <h2>🔄 Revaluation Requests</h2>

        <div className="filter-row">
          <label>Select Exam Session:</label>
          <select
            className="filter-select"
            value={sessionId}
            onChange={handleSessionChange}
          >
            <option value="">-- Select --</option>
            {sessions.map(s => (
              <option key={s._id} value={s._id}>
                {s.name} | AY {s.academicYear} | Sem {s.semester}
              </option>
            ))}
          </select>

          {sessionId && (
            <button
              className="btn-blue"
              disabled={assigning}
              onClick={autoAssign}
            >
              {assigning ? "Assigning..." : "Auto Assign"}
            </button>
          )}
        </div>

        {loading && <p style={{ textAlign: 'center', color: '#64748b', fontSize: '16px', padding: '40px' }}>Loading...</p>}

        {!loading && (
          <table className="college-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Student</th>
                <th>College</th>
                <th>Subject</th>
                <th>Fee</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r, i) => (
                <tr key={r._id}>
                  <td><strong>{i + 1}</strong></td>
                  <td><strong>{r.studentId?.name}</strong></td>
                  <td>{r.studentId?.collegeId?.name}</td>
                  <td>
                    <strong>{r.subjectId?.subjectName}</strong>
                    <div className="small-text">
                      {r.subjectId?.subjectCode}
                    </div>
                  </td>
                  <td>{r.feeAmount} ({r.paymentStatus})</td>
                  <td>
                    <button
                      className="btn-reject"
                      onClick={() => reject(r._id)}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}

              {requests.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-muted text-center" style={{ padding: '60px' }}>
                    No pending revaluation requests
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
