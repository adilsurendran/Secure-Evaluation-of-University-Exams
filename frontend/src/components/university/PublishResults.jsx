import React, { useEffect, useState } from "react";
import api from "../../../api";

function PublishResults() {
  const [sessions, setSessions] = useState([]);
  const [selectedSessionId, setSelectedSessionId] = useState("");
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [pendingList, setPendingList] = useState([]);
  const [showPendingModal, setShowPendingModal] = useState(false);
  const [loadingPending, setLoadingPending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadSessions = async () => {
      try {
        const res = await api.get("/exam-sessions/all");
        setSessions(res.data);
      } catch (err) {
        console.log(err);
        setError("Failed to load exam sessions");
      }
    };

    loadSessions();
  }, []);

  const fetchStats = async (sessionId) => {
    if (!sessionId) {
      setStats(null);
      return;
    }

    setLoadingStats(true);
    setError("");

    try {
      const res = await api.get(`/university/result-stats/${sessionId}`);
      setStats(res.data);
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.msg || "Failed to load result stats");
      setStats(null);
    } finally {
      setLoadingStats(false);
    }
  };

  const handleSessionChange = (e) => {
    const id = e.target.value;
    setSelectedSessionId(id);
    fetchStats(id);
  };

  const publishResults = async () => {
    if (!selectedSessionId) return;

    if (!stats || stats.pendingSheets > 0) {
      return alert("Some papers are still pending. Cannot publish yet.");
    }

    if (!window.confirm("Are you sure you want to publish results for this session?")) {
      return;
    }

    setPublishing(true);
    setError("");

    try {
      const res = await api.post(`/university/publish/${selectedSessionId}`);
      alert(res.data?.msg || "Results published successfully!");
      fetchStats(selectedSessionId);
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.msg || "Failed to publish results");
    } finally {
      setPublishing(false);
    }
  };

  const canPublish = stats && stats.totalSheets > 0 && stats.pendingSheets === 0;

  const loadPendingSheets = async () => {
    if (!selectedSessionId) return;

    setLoadingPending(true);

    try {
      const res = await api.get(`/university/pending-sheets/${selectedSessionId}`);
      setPendingList(res.data);
      setShowPendingModal(true);
    } catch (err) {
      console.log(err);
      alert("Failed to load pending sheets");
    } finally {
      setLoadingPending(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

        .university-page {
          padding: 32px;
          min-height: 100vh;
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 25%, #bfdbfe 50%, #e0f2fe 75%, #f0f9ff 100%);
          font-family: 'Inter', sans-serif;
        }

        .header {
          text-align: center;
          margin-bottom: 32px;
          padding: 40px;
          background: white;
          border-radius: 24px;
          box-shadow: 0 8px 32px rgba(30, 64, 175, 0.15);
          border: 3px solid #3b82f6;
          animation: headerPulse 3s ease-in-out infinite;
        }

        @keyframes headerPulse {
          0%, 100% {
            border-color: #3b82f6;
            box-shadow: 0 8px 32px rgba(59, 130, 246, 0.2);
          }
          50% {
            border-color: #2563eb;
            box-shadow: 0 12px 48px rgba(37, 99, 235, 0.3);
          }
        }

        .header h2 {
          font-size: 40px;
          font-weight: 900;
          background: linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #60a5fa 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0 0 12px 0;
          animation: fadeInDown 0.6s ease;
        }

        .subtitle {
          color: #64748b;
          font-size: 16px;
          margin: 0;
          animation: fadeIn 0.8s ease;
        }

        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .filter-row {
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .filter-row label {
          font-weight: 600;
          color: #1e293b;
        }

        .filter-select {
          padding: 14px 20px;
          border: 2px solid #3b82f6;
          border-radius: 14px;
          font-size: 15px;
          background: white;
          cursor: pointer;
          transition: all 0.3s ease;
          min-width: 350px;
          font-weight: 500;
        }

        .filter-select:focus {
          outline: none;
          border-color: #2563eb;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.2);
        }

        .text-danger {
          color: #1e40af;
          background: #dbeafe;
          padding: 12px 20px;
          border-radius: 12px;
          border-left: 4px solid #2563eb;
          font-weight: 500;
        }

        .cards-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 20px;
          margin-bottom: 24px;
          animation: slideUp 0.8s ease;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .card {
          background: white;
          padding: 24px;
          border-radius: 20px;
          box-shadow: 0 4px 16px rgba(30, 64, 175, 0.1);
          border: 2px solid #dbeafe;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #3b82f6, #60a5fa);
        }

        .card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 32px rgba(59, 130, 246, 0.25);
          border-color: #3b82f6;
        }

        .card h4 {
          font-size: 14px;
          color: #64748b;
          margin: 0 0 12px 0;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 600;
        }

        .card p {
          font-size: 28px;
          font-weight: 800;
          margin: 0;
          color: #1e293b;
        }

        .card .muted {
          font-size: 13px;
          color: #94a3b8;
          font-weight: 500;
          margin-top: 8px;
        }

        .card.small-card:nth-child(4) {
          cursor: pointer;
          border: 2px solid #3b82f6;
        }

        .card.small-card:nth-child(4):hover {
          border-color: #2563eb;
          background: linear-gradient(135deg, #f0f9ff 0%, #dbeafe 100%);
        }

        .card h6 {
          font-size: 12px;
          color: #2563eb;
          margin: 8px 0 0 0;
          font-weight: 600;
        }

        .text-blue {
          color: #3b82f6 !important;
        }

        .text-gray {
          color: #64748b !important;
        }

        .text-muted {
          color: #94a3b8;
          font-style: italic;
        }

        .btn-blue {
          padding: 14px 32px;
          background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
          color: white;
          border: none;
          border-radius: 14px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 6px 24px rgba(37, 99, 235, 0.4);
          position: relative;
          overflow: hidden;
        }

        .btn-blue::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          transform: translate(-50%, -50%);
          transition: width 0.6s, height 0.6s;
        }

        .btn-blue:hover::before {
          width: 400px;
          height: 400px;
        }

        .btn-blue:hover {
          transform: translateY(-4px) scale(1.02);
          box-shadow: 0 12px 40px rgba(37, 99, 235, 0.5);
        }

        .btn-blue:active {
          transform: translateY(-2px);
        }

        .btn-blue:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-disabled {
          padding: 14px 32px;
          background: #cbd5e1;
          color: #64748b;
          border: none;
          border-radius: 14px;
          font-size: 16px;
          font-weight: 700;
          cursor: not-allowed;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(30, 64, 175, 0.4);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.3s ease;
        }

        .modal-box {
          background: white;
          border-radius: 24px;
          padding: 32px;
          max-width: 90%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 24px 64px rgba(30, 64, 175, 0.3);
          border: 2px solid #3b82f6;
          animation: scaleUp 0.3s ease;
        }

        @keyframes scaleUp {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        .modal-box h3 {
          font-size: 24px;
          font-weight: 700;
          background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0 0 24px 0;
        }

        .pending-table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
        }

        .pending-table thead {
          background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
          color: white;
        }

        .pending-table th {
          padding: 12px;
          text-align: left;
          font-size: 13px;
          font-weight: 600;
          text-transform: uppercase;
        }

        .pending-table td {
          padding: 12px;
          border-bottom: 1px solid #e0f2fe;
          font-size: 14px;
        }

        .pending-table tbody tr:hover {
          background: #f0f9ff;
        }

        @media (max-width: 768px) {
          .university-page {
            padding: 20px;
          }

          .header h2 {
            font-size: 28px;
          }

          .cards-row {
            grid-template-columns: 1fr;
          }

          .filter-select {
            min-width: 100%;
          }
        }
      `}</style>

      <div className="university-page">
        <div className="header">
          <h2>🎓 Publish Exam Results</h2>
          <p className="subtitle">
            Select an exam session, verify all answer sheets are evaluated, then publish results.
          </p>
        </div>

        <div className="filter-row">
          <label>Select Exam Session:</label>
          <select
            value={selectedSessionId}
            onChange={handleSessionChange}
            className="filter-select"
          >
            <option value="">-- Choose Session --</option>
            {sessions.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name} - {s.academicYear} (Sem {s.semester})
              </option>
            ))}
          </select>
        </div>

        {error && <p className="text-danger">{error}</p>}

        {loadingStats && <p>Loading stats...</p>}

        {!loadingStats && stats && (
          <>
            <div className="cards-row">
              <div className="card small-card">
                <h4>Session</h4>
                <p>
                  <b>{stats.session?.name}</b>
                </p>
                <p className="muted">
                  AY: {stats.session?.academicYear} | Sem {stats.session?.semester}
                </p>
              </div>

              <div className="card small-card">
                <h4>Total Answer Sheets</h4>
                <p>{stats.totalSheets}</p>
              </div>

              <div className="card small-card">
                <h4>Evaluated Sheets</h4>
                <p className="text-blue">{stats.evaluatedSheets}</p>
              </div>

              <div
                className="card small-card"
                style={{ cursor: "pointer" }}
                onClick={() => loadPendingSheets()}
              >
                <h4>Pending Evaluation</h4>
                <p className={stats.pendingSheets === 0 ? "text-blue" : "text-gray"}>
                  {stats.pendingSheets}
                </p>
                <h6>Click to view Pending details !!</h6>
              </div>
            </div>

            <div style={{ marginTop: "25px" }}>
              {stats.totalSheets === 0 && (
                <p className="text-muted">
                  No answer sheets found for this session. Nothing to publish.
                </p>
              )}

              {stats.totalSheets > 0 && stats.pendingSheets > 0 && (
                <p className="text-gray">
                  Some papers are still not evaluated. Publishing is disabled.
                </p>
              )}

              <button
                className={canPublish ? "btn-blue" : "btn-disabled"}
                onClick={publishResults}
                disabled={!canPublish || publishing}
              >
                {publishing ? "Publishing..." : "Publish Results"}
              </button>
            </div>
          </>
        )}

        {!loadingStats && !stats && !selectedSessionId && (
          <p className="text-muted" style={{ marginTop: "10px" }}>
            Please select an exam session to view result status.
          </p>
        )}

        {showPendingModal && (
          <div className="modal-overlay" onClick={() => setShowPendingModal(false)}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
              <h3>Pending Evaluations</h3>

              {loadingPending && <p>Loading...</p>}

              {!loadingPending && pendingList.length === 0 && (
                <p>No pending evaluations found.</p>
              )}

              {!loadingPending && pendingList.length > 0 && (
                <table className="pending-table">
                  <thead>
                    <tr>
                      <th>Admission No</th>
                      <th>Student College</th>
                      <th>Subject</th>
                      <th>Staff Assigned</th>
                      <th>Staff College</th>
                      <th>Staff Phone</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingList.map((p) => (
                      <tr key={p._id}>
                        <td>{p.studentId?.admissionNo}</td>
                        <td>{p.studentId?.collegeId?.name}</td>
                        <td>{p.subjectId?.subjectName}</td>
                        <td>{p.assignedStaff ? p.assignedStaff.name : "Not Assigned"}</td>
                        <td>{p.assignedStaff?.collegeId?.name || "-"}</td>
                        <td>{p.assignedStaff?.phone}</td>
                        <td className="text-gray">{p.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              <button
                className="btn-blue"
                style={{ marginTop: "20px" }}
                onClick={() => setShowPendingModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default PublishResults;
