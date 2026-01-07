import React, { useEffect, useState } from "react";
import api from "../../../api";

export default function UniversityAllocateDashboard() {
  const [sessions, setSessions] = useState([]);
  const [loadingSession, setLoadingSession] = useState(null);

  const loadStats = async () => {
    try {
      const res = await api.get("/university/allocation-stats");
      setSessions(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const allocatePapers = async (sessionId) => {
    if (!window.confirm("Allocate papers for this session?")) return;

    try {
      setLoadingSession(sessionId);

      const res = await api.post(`/university/allocate/${sessionId}`);
      const { totalSheets, allocated, failed, failedAllocations } = res.data;

      if (failed === 0) {
        alert(`✅ Allocation completed successfully\nAllocated: ${allocated}`);
      } else if (allocated > 0) {
        let message =
          `⚠️ Partial allocation completed\n\n` +
          `Total: ${totalSheets}\n` +
          `Allocated: ${allocated}\n` +
          `Failed: ${failed}\n\n` +
          `Reasons:\n`;

        failedAllocations.forEach((f, i) => {
          message += `${i + 1}. ${f.subject} → ${f.reason}\n`;
        });

        alert(message);
      } else {
        alert(
          `❌ Allocation failed\n\nNo sheets were allocated.\n` +
          `Reason: No eligible staff available`
        );
      }

      loadStats();
    } catch (err) {
      console.log(err);
      alert("❌ Allocation request failed");
    } finally {
      setLoadingSession(null);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        .university-page {
          padding: 32px;
          min-height: 100vh;
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 25%, #bfdbfe 50%, #e0f2fe 75%, #f0f9ff 100%);
          font-family: 'Inter', sans-serif;
        }

        .header {
          text-align: center;
          margin-bottom: 40px;
          padding: 32px;
          background: white;
          border-radius: 24px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
          border: 2px solid #e0f2fe;
        }

        .header h2 {
          font-size: 36px;
          font-weight: 800;
          background: linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #06b6d4 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0;
          animation: fadeInDown 0.6s ease;
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
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .table-container {
          background: white;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          border: 2px solid #e0f2fe;
          animation: slideUp 0.6s ease;
        }

        .college-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 15px;
        }

        .college-table thead {
          background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
          color: white;
        }

        .college-table thead th {
          padding: 20px 16px;
          text-align: left;
          font-weight: 700;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 1px;
          position: relative;
        }

        .college-table thead th::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent);
        }

        .college-table tbody tr {
          border-bottom: 1px solid #e0f2fe;
          transition: all 0.3s ease;
          animation: fadeIn 0.6s ease;
        }

        .college-table tbody tr:hover {
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
          transform: scale(1.01);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
        }

        .college-table tbody tr:last-child {
          border-bottom: none;
        }

        .college-table tbody td {
          padding: 20px 16px;
          color: #1e293b;
        }

        .text-green {
          color: #10b981;
          font-weight: 700;
          font-size: 18px;
        }

        .text-orange {
          color: #f59e0b;
          font-weight: 700;
          font-size: 18px;
        }

        .text-center {
          text-align: center;
        }

        .text-muted {
          color: #94a3b8;
          font-style: italic;
        }

        .btn-green {
          padding: 10px 24px;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 700;
          cursor: not-allowed;
          box-shadow: 0 4px 16px rgba(16, 185, 129, 0.3);
          opacity: 0.9;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .btn-blue {
          padding: 10px 24px;
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 16px rgba(59, 130, 246, 0.4);
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
          width: 300px;
          height: 300px;
        }

        .btn-blue:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 24px rgba(59, 130, 246, 0.5);
        }

        .btn-blue:active {
          transform: translateY(-1px);
        }

        .btn-blue:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* Pulse animation for loading */
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        .btn-blue:disabled {
          animation: pulse 1.5s ease-in-out infinite;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .university-page {
            padding: 20px;
          }

          .header h2 {
            font-size: 28px;
          }

          .table-container {
            overflow-x: auto;
          }

          .college-table {
            font-size: 13px;
          }

          .college-table thead th,
          .college-table tbody td {
            padding: 14px 10px;
          }
        }
      `}</style>

      <div className="university-page">
        <div className="header">
          <h2>📋 Exam Paper Allocation Dashboard</h2>
        </div>

        <div className="table-container">
          <table className="college-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Exam Session</th>
                <th>Academic Year</th>
                <th>Semester</th>
                <th>Total Sheets</th>
                <th>Allocated</th>
                <th>Pending</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {sessions.map((item, i) => {
                const fullyAllocated =
                  item.pendingSheets === 0 && item.allocatedSheets > 0;

                return (
                  <tr key={item.session._id}>
                    <td><strong>{i + 1}</strong></td>
                    <td><strong>{item.session.name}</strong></td>
                    <td>{item.session.academicYear}</td>
                    <td>Sem {item.session.semester}</td>

                    <td><strong>{item.totalSheets}</strong></td>
                    <td className="text-green">{item.allocatedSheets}</td>
                    <td className="text-orange">{item.pendingSheets}</td>

                    <td>
                      {fullyAllocated ? (
                        <button className="btn-green" disabled>
                          ✔ Allocated
                        </button>
                      ) : (
                        <button
                          className="btn-blue"
                          disabled={loadingSession === item.session._id}
                          onClick={() => allocatePapers(item.session._id)}
                        >
                          {loadingSession === item.session._id
                            ? "Allocating..."
                            : item.allocatedSheets > 0
                              ? "Retry Allocation"
                              : "Allocate Now"}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}

              {sessions.length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center text-muted" style={{ padding: '60px' }}>
                    No sessions available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
