import React, { useEffect, useState } from "react";
import HistoryFilters from "./HistoryFilters";
import api from "../../../../api";

export default function RevaluationHistory() {
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({ session: "", subject: "", college: "" });
  const [meta, setMeta] = useState({ sessions: [], subjects: [], colleges: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await api.get("/university/history/revaluation");
      console.log(res);
      setData(res.data);

      setMeta({
        sessions: [...new Map(res.data.map(d => [d.answerSheetId?.sessionId?._id, d.answerSheetId?.sessionId])).values()].filter(Boolean),
        subjects: [...new Map(res.data.map(d => [d.answerSheetId?.subjectId?._id, d.answerSheetId?.subjectId])).values()].filter(Boolean),
        colleges: [...new Map(res.data.map(d => [d.answerSheetId?.collegeId?._id, d.answerSheetId?.collegeId])).values()].filter(Boolean),
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = data.filter(r =>
    (!filters.session || r.answerSheetId?.sessionId?._id === filters.session) &&
    (!filters.subject || r.answerSheetId?.subjectId?._id === filters.subject) &&
    (!filters.college || r.answerSheetId?.collegeId?._id === filters.college)
  );

  return (
    <>
      <style>{`
        .table-container {
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(30, 64, 175, 0.15);
          margin-top: 24px;
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

        .marks-diff {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .old-marks {
          color: #94a3b8;
          text-decoration: line-through;
          font-size: 13px;
        }

        .new-marks {
          font-weight: 800;
          color: #1e40af;
          font-size: 16px;
        }

        .status-badge {
          padding: 6px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
        }

        .status-completed { background: #dcfce7; color: #15803d; }
        .status-pending { background: #fef9c3; color: #a16207; }

        .empty-state {
          padding: 60px;
          text-align: center;
          color: #94a3b8;
          font-style: italic;
          font-size: 16px;
        }
      `}</style>

      <HistoryFilters {...meta} filters={filters} setFilters={setFilters} />

      <div className="table-container">
        {loading ? (
          <div className="empty-state">Loading revaluation records...</div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">No revaluation records found.</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>College</th>
                <th>Subject</th>
                <th>Marks (Old → New)</th>
                <th>Staff</th>
                <th>Status</th>
                <th>Payment</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r._id}>
                  <td>
                    <div style={{ fontWeight: 700 }}>{r.studentId?.name}</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>{r.studentId?.admissionNo}</div>
                  </td>
                  <td>{r.answerSheetId?.collegeId?.name}</td>
                  <td>{r.answerSheetId?.subjectId?.subjectName}</td>
                  <td>
                    <div className="marks-diff">
                      <span className="old-marks">{r.oldMarks}</span>
                      <span style={{ color: '#3b82f6' }}>→</span>
                      <span className="new-marks">{r.newMarks ?? "-"}</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{r.assignedStaff?.name}</div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>{r.assignedStaff?.collegeId?.name}</div>
                  </td>
                  <td>
                    <span className={`status-badge ${r.status === 'completed' ? 'status-completed' : 'status-pending'}`}>
                      {r.status}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 600, color: r.paymentStatus === 'paid' ? '#15803d' : '#ef4444' }}>
                      {r.paymentStatus}
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
