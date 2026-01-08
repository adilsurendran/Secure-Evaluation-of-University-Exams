import React, { useEffect, useState, useMemo } from "react";
import api from "../../../api";
import StudentLayout from "./StudentLayout";
import "./student.css";

export default function StudentRevaluationResults() {
  const studentId = localStorage.getItem("studentId");

  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState("");
  const [marksheet, setMarksheet] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const loadSessions = async () => {
    try {
      const res = await api.get(`/student/results/sessions/${studentId}`);
      setSessions(res.data);
    } catch (err) {
      console.error("Error loading sessions:", err);
    }
  };

  useEffect(() => {
    loadSessions();
  }, [studentId]);

  const fetchMarksheet = async (sessionId) => {
    if (!sessionId) {
      setMarksheet(null);
      return;
    }

    setLoading(true);
    setError("");
    setMarksheet(null);

    try {
      const res = await api.get(`/student/results/marksheet/${studentId}/${sessionId}`);
      setMarksheet(res.data);
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to load revaluation results");
    } finally {
      setLoading(false);
    }
  };

  const handleSessionChange = (e) => {
    const id = e.target.value;
    setSelectedSession(id);
    fetchMarksheet(id);
  };

  const revaluationResults = useMemo(() => {
    if (!marksheet || !marksheet.subjects) return [];
    return marksheet.subjects.filter((r) => r.revaluation);
  }, [marksheet]);

  const filteredRevaluation = useMemo(() => {
    return revaluationResults.filter(r =>
      r.subjectName.toLowerCase().includes(search.toLowerCase()) ||
      r.subjectCode.toLowerCase().includes(search.toLowerCase())
    );
  }, [revaluationResults, search]);

  const hasRevaluation = revaluationResults.length > 0;

  return (
    <StudentLayout>
      <style>{`
        .reval-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
          padding-bottom: 24px;
          border-bottom: 2px solid rgba(30, 64, 175, 0.1);
        }

        .reval-header h2 {
          font-size: 32px;
          font-weight: 800;
          background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0;
        }

        .dropdown-bar {
          display: flex;
          gap: 16px;
          background: white;
          padding: 16px;
          border-radius: 16px;
          margin-bottom: 24px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          border: 1px solid #e2e8f0;
          flex-wrap: wrap;
        }

        .dropdown-bar select, .dropdown-bar input {
          padding: 12px 16px;
          border: 1.5px solid #e2e8f0;
          border-radius: 10px;
          font-size: 14px;
          font-family: inherit;
          color: #1e293b;
          transition: all 0.3s;
        }

        .dropdown-bar select { flex: 1; min-width: 250px; cursor: pointer; }
        .dropdown-bar input { flex: 1; min-width: 250px; }

        .dropdown-bar select:focus, .dropdown-bar input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
        }

        /* INFO CARDS */
        .reval-summary {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 24px;
          margin-bottom: 32px;
        }

        .summary-card {
          background: white;
          border-radius: 20px;
          padding: 24px;
          border: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          gap: 20px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.02);
        }

        .icon-box {
          width: 56px;
          height: 56px;
          background: #eff6ff;
          color: #1e40af;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
        }

        .summary-text label { display: block; font-size: 12px; color: #64748b; font-weight: 700; text-transform: uppercase; margin-bottom: 4px; }
        .summary-text span { font-size: 20px; font-weight: 800; color: #1e293b; }

        /* TABLE */
        .table-container {
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
          border: 1px solid #e2e8f0;
        }

        .premium-table {
          width: 100%;
          border-collapse: collapse;
        }

        .premium-table thead {
          background: #1e40af;
          color: white;
        }

        .premium-table th {
          padding: 18px 16px;
          text-align: left;
          font-weight: 600;
          text-transform: uppercase;
          font-size: 13px;
          letter-spacing: 0.5px;
        }

        .premium-table tr {
          border-bottom: 1px solid #f1f5f9;
          transition: background 0.2s;
        }

        .premium-table tr:hover { background: #f8fafc; }

        .premium-table td {
          padding: 18px 16px;
          color: #334155;
          font-size: 15px;
        }

        .mark-pill {
          padding: 4px 10px;
          background: #eff6ff;
          color: #2563eb;
          border-radius: 6px;
          font-weight: 700;
          font-size: 14px;
          display: inline-block;
        }

        .status-badge {
          padding: 6px 14px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
        }

        .status-pass { background: #dcfce7; color: #166534; }
        .status-fail { background: #fee2e2; color: #991b1b; }

        .empty-state {
          text-align: center;
          padding: 60px;
          background: white;
          border-radius: 24px;
          border: 2px dashed #cbd5e1;
          color: #64748b;
        }

        @media (max-width: 768px) {
          .premium-table thead { display: none; }
          .premium-table td { display: block; text-align: right; padding: 12px 16px; border-bottom: none; }
          .premium-table td::before { content: attr(data-label); float: left; font-weight: 700; color: #64748b; }
          .premium-table tr { border-bottom: 2px solid #e2e8f0; display: block; padding: 10px 0; }
        }
      `}</style>

      <div className="reval-header">
        <h2>🔄 Revaluation Results</h2>
        {marksheet && (
          <div className="count-badge">Sem {marksheet.session.semester}</div>
        )}
      </div>

      <div className="dropdown-bar">
        <select
          value={selectedSession}
          onChange={handleSessionChange}
        >
          <option value="">Select Examination Session...</option>
          {sessions.map((s) => (
            <option key={s._id} value={s._id}>
              {s.name} - {s.academicYear} (Sem {s.semester})
            </option>
          ))}
        </select>

        {hasRevaluation && (
          <input
            type="text"
            placeholder="Search subjects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        )}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>
          <h4>Processing Results...</h4>
          <p>Analyzing published revaluation entries.</p>
        </div>
      ) : !selectedSession ? (
        <div className="empty-state">
          <h3>Welcome to Revaluation Portal</h3>
          <p>Please select an exam session from the dropdown above to check your updated marks.</p>
        </div>
      ) : error ? (
        <div className="empty-state" style={{ borderColor: '#fca5a5', background: '#fef2f2' }}>
          <h3 style={{ color: '#b91c1c' }}>Notice</h3>
          <p style={{ color: '#991b1b' }}>{error}</p>
        </div>
      ) : hasRevaluation ? (
        <>
          <div className="reval-summary">
            <div className="summary-card">
              <div className="icon-box">📊</div>
              <div className="summary-text">
                <label>Total Updated</label>
                <span>{revaluationResults.length} Subjects</span>
              </div>
            </div>
            <div className="summary-card">
              <div className="icon-box" style={{ background: '#ecfdf5', color: '#059669' }}>✅</div>
              <div className="summary-text">
                <label>Session</label>
                <span>{marksheet.session.name}</span>
              </div>
            </div>
          </div>

          <div className="table-container">
            <table className="premium-table">
              <thead>
                <tr>
                  <th style={{ width: '60px' }}>#</th>
                  <th>Subject Details</th>
                  <th>Total Marks</th>
                  <th>Updated Marks</th>
                  <th>Final Outcome</th>
                </tr>
              </thead>
              <tbody>
                {filteredRevaluation.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '40px' }}>No matches found for "{search}"</td>
                  </tr>
                ) : (
                  filteredRevaluation.map((r, i) => (
                    <tr key={i}>
                      <td data-label="#">{i + 1}</td>
                      <td data-label="Subject">
                        <div style={{ fontWeight: 800, color: '#1e293b' }}>{r.subjectName}</div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>{r.subjectCode}</div>
                      </td>
                      <td data-label="Total Marks">{r.totalMark}</td>
                      <td data-label="Updated Marks">
                        <span className="mark-pill">{r.revaluation.newMarks}</span>
                      </td>
                      <td data-label="Final Outcome">
                        <span className={`status-badge ${r.revaluation.newMarks >= r.totalMark * 0.4 ? 'status-pass' : 'status-fail'}`}>
                          {r.revaluation.newMarks >= r.totalMark * 0.4 ? 'PASS' : 'FAIL'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="empty-state">
          <h3>No Data Found</h3>
          <p>There are no revaluation entries recorded for you in this session.</p>
        </div>
      )}
    </StudentLayout>
  );
}
