import React, { useEffect, useState } from "react";
import api from "../../../../api";

export default function AnswerCopyHistory() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get("/university/history/answer-copy")
      .then(res => {
        setData(res.data);
        console.log(res.data);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <style>{`
        .table-container {
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(30, 64, 175, 0.15);
        }

        .admin-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 14px;
        }

        .admin-table thead {
          background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
          color: white;
        }

        .admin-table thead th {
          padding: 18px 14px;
          text-align: left;
          font-weight: 700;
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.8px;
        }

        .admin-table tbody tr {
          border-bottom: 1px solid #dbeafe;
          transition: all 0.3s ease;
        }

        .admin-table tbody tr:hover {
          background: linear-gradient(135deg, #f0f9ff 0%, #dbeafe 100%);
          transform: scale(1.005);
          box-shadow: 0 4px 16px rgba(59, 130, 246, 0.1);
        }

        .admin-table tbody td {
          padding: 16px 14px;
          color: #1e293b;
        }

        .status-badge {
          padding: 6px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
        }

        .status-approved { background: #dcfce7; color: #15803d; }
        .status-pending { background: #fef9c3; color: #a16207; }
        .status-rejected { background: #fee2e2; color: #b91c1c; }

        .empty-state {
          padding: 60px;
          text-align: center;
          color: #94a3b8;
          font-style: italic;
          font-size: 16px;
        }
      `}</style>

      <div className="table-container">
        {loading ? (
          <div className="empty-state">Loading history records...</div>
        ) : data.length === 0 ? (
          <div className="empty-state">No answer copy requests found.</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Subject</th>
                <th>Session</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Requested On</th>
              </tr>
            </thead>
            <tbody>
              {data.map(r => (
                <tr key={r._id}>
                  <td>
                    <div style={{ fontWeight: 700 }}>{r.studentId?.name}</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>{r.studentId?.admissionNo}</div>
                  </td>
                  <td>{r.subjectId?.subjectName}</td>
                  <td>{r.sessionId?.name}</td>
                  <td>
                    <span className={`status-badge status-${r.status}`}>
                      {r.status}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 600, color: r.paymentStatus === 'paid' ? '#15803d' : '#a16207' }}>
                      {r.paymentStatus}
                    </span>
                  </td>
                  <td>
                    <span style={{ color: '#64748b', fontWeight: 500 }}>
                      {new Date(r.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
