import React, { useEffect, useState } from "react";
import api from "../../../api";

export default function AdminPublishRevaluation() {
  const [sessions, setSessions] = useState([]);
  const [sessionId, setSessionId] = useState("");
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/exam-sessions/all");
        setSessions(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    load();
  }, []);

  const loadEvaluated = async (id) => {
    if (!id) return setList([]);

    setLoading(true);
    try {
      const res = await api.get(`/revaluation/admin/evaluated/${id}`);
      setList(res.data);
    } catch (err) {
      console.log(err);
      alert("Error loading data");
    } finally {
      setLoading(false);
    }
  };

  const handleSessionChange = (e) => {
    const id = e.target.value;
    setSessionId(id);
    loadEvaluated(id);
  };

  const publish = async () => {
    if (!sessionId) return;

    if (!window.confirm("Publish revaluation results for this session?"))
      return;

    setPublishing(true);
    try {
      const res = await api.post(`/revaluation/admin/publish/${sessionId}`);
      alert(res.data.msg || "Revaluation results published");

      loadEvaluated(sessionId);
    } catch (err) {
      console.log(err);
      alert("Failed to publish");
    } finally {
      setPublishing(false);
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
          border: 3px solid #3b82f6;
          animation: slideInDown 0.8s ease, borderPulse 3s ease-in-out infinite;
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

        @keyframes borderPulse {
          0%, 100% {
            border-color: #3b82f6;
            box-shadow: 0 8px 32px rgba(59, 130, 246, 0.2);
          }
          50% {
            border-color: #2563eb;
            box-shadow: 0 12px 48px rgba(37, 99, 235, 0.3);
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
          border: 2px solid #3b82f6;
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
          border-color: #2563eb;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.2);
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
          letter-spacing: 1px;
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

        .text-blue {
          color: #3b82f6;
          font-weight: 700;
        }

        .text-center {
          text-align: center;
        }

        .btn-blue {
          padding: 14px 36px;
          background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
          color: white;
          border: none;
          border-radius: 16px;
          font-size: 17px;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 6px 24px rgba(37, 99, 235, 0.4);
          position: relative;
          overflow: hidden;
          text-transform: uppercase;
          letter-spacing: 1px;
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
          transform: translateY(-4px) scale(1.05);
          box-shadow: 0 12px 48px rgba(37, 99, 235, 0.6);
        }

        .btn-blue:active {
          transform: translateY(-2px);
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
        <h2>🔄 Publish Revaluation Results</h2>

        <div className="filter-row">
          <label>Select Exam Session:</label>
          <select
            className="filter-select"
            value={sessionId}
            onChange={handleSessionChange}
          >
            <option value="">-- Select Session --</option>
            {sessions.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name} | AY {s.academicYear} | Sem {s.semester}
              </option>
            ))}
          </select>
        </div>

        {loading && <p style={{ textAlign: 'center', color: '#64748b', fontSize: '16px' }}>Loading revaluation results…</p>}

        {!loading && sessionId && (
          <>
            <table className="college-table" style={{ marginTop: 20 }}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Student</th>
                  <th>College</th>
                  <th>Subject</th>
                  <th>Old Mark</th>
                  <th>New Mark</th>
                  <th>Staff</th>
                  <th>Fee Status</th>
                </tr>
              </thead>

              <tbody>
                {list.map((r, i) => (
                  <tr key={r._id}>
                    <td><strong>{i + 1}</strong></td>

                    <td>
                      <strong>{r.studentId?.name}</strong>
                      <div className="small-text">
                        {r.studentId?.admissionNo}
                      </div>
                    </td>

                    <td>{r.studentId?.collegeId?.name}</td>

                    <td>
                      <strong>{r.subjectId?.subjectName}</strong>
                      <div className="small-text">
                        {r.subjectId?.subjectCode}
                      </div>
                    </td>

                    <td className="text-muted">{r.oldMarks}</td>

                    <td className="text-blue"><b>{r.newMarks}</b></td>

                    <td>
                      <strong>{r.assignedStaff?.name}</strong>
                      <div className="small-text">
                        {r.assignedStaff?.collegeId?.name}
                      </div>
                      <div className="small-text">
                        {r.assignedStaff?.phone}
                      </div>
                    </td>

                    <td>{r.paymentStatus}</td>
                  </tr>
                ))}

                {list.length === 0 && (
                  <tr>
                    <td colSpan="10" className="text-muted text-center" style={{ padding: '60px' }}>
                      No evaluated revaluation requests found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {list.length > 0 && (
              <div style={{ marginTop: 32, textAlign: 'center' }}>
                <button
                  className="btn-blue"
                  disabled={publishing}
                  onClick={publish}
                >
                  {publishing ? "Publishing…" : "Publish Revaluation Results"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
