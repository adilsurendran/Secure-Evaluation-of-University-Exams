import React, { useEffect, useState } from "react";
import HistoryFilters from "./HistoryFilters";
import api from "../../../../api";

export default function ValuationHistory() {
  const [data, setData] = useState([]);
  const [meta, setMeta] = useState({ sessions: [], subjects: [], colleges: [] });
  const [filters, setFilters] = useState({
    session: "",
    subject: "",
    college: ""
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await api.get("/university/history/valuation");
      console.log(res);
      setData(res.data);

      setMeta({
        sessions: [...new Map(res.data.map(d => [d.sessionId?._id, d.sessionId])).values()].filter(Boolean),
        subjects: [...new Map(res.data.map(d => [d.subjectId?._id, d.subjectId])).values()].filter(Boolean),
        colleges: [...new Map(res.data.map(d => [d.collegeId?._id, d.collegeId])).values()].filter(Boolean),
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = data.filter(d =>
    (!filters.session || d.sessionId?._id === filters.session) &&
    (!filters.subject || d.subjectId?._id === filters.subject) &&
    (!filters.college || d.collegeId?._id === filters.college)
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

        .empty-state {
          padding: 60px;
          text-align: center;
          color: #94a3b8;
          font-style: italic;
          font-size: 16px;
        }

        .marks-badge {
          background: #dbeafe;
          color: #1e40af;
          padding: 4px 12px;
          border-radius: 12px;
          font-weight: 800;
          font-size: 15px;
        }

        .date-text {
          color: #64748b;
          font-size: 13px;
          font-weight: 500;
        }
      `}</style>

      <HistoryFilters {...meta} filters={filters} setFilters={setFilters} />

      <div className="table-container">
        {loading ? (
          <div className="empty-state">Loading history records...</div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">No records matching your filters.</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Student</th>
                <th>Session</th>
                <th>Subject</th>
                <th>College</th>
                <th>Staff & College</th>
                <th style={{ textAlign: 'center' }}>Marks</th>
                <th>Evaluated On</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, i) => (
                <tr key={row._id}>
                  <td><strong>{i + 1}</strong></td>
                  <td>
                    <div style={{ fontWeight: 700 }}>{row.studentId?.name}</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>{row.studentId?.admissionNo}</div>
                  </td>
                  <td>{row.sessionId?.name}</td>
                  <td>{row.subjectId?.subjectName}</td>
                  <td>{row.collegeId?.name}</td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{row.assignedStaff?.name}</div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>{row.assignedStaff?.collegeId?.name}</div>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <span className="marks-badge">{row.marks}</span>
                  </td>
                  <td>
                    <span className="date-text">{new Date(row.updatedAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
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
