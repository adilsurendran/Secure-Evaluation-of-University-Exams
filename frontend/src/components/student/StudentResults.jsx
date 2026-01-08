import React, { useEffect, useState, useMemo } from "react";
import StudentLayout from "./StudentLayout";
import api from "../../../api";
import "./student.css";

export default function StudentResults() {
  const studentId = localStorage.getItem("studentId");

  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState("");
  const [marksheet, setMarksheet] = useState(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await api.get("/exam-sessions/all");
        setSessions(res.data);
      } catch (err) {
        console.error("Error fetching sessions:", err);
      }
    };
    fetchSessions();
  }, []);

  const loadResults = async (sessionId) => {
    if (!sessionId) {
      setMarksheet(null);
      return;
    }
    setLoading(true);
    setMarksheet(null);

    try {
      const res = await api.get(`/student/results/${studentId}/${sessionId}`);
      setMarksheet(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load results for this session");
    } finally {
      setLoading(false);
    }
  };

  const filteredResults = useMemo(() => {
    if (!marksheet || !marksheet.results) return [];
    return marksheet.results.filter(r =>
      r.subjectId.subjectName.toLowerCase().includes(search.toLowerCase()) ||
      r.subjectId.subjectCode.toLowerCase().includes(search.toLowerCase())
    );
  }, [marksheet, search]);

  const totalObtained = useMemo(() => {
    if (!marksheet || !marksheet.results) return 0;
    return marksheet.results.reduce((sum, r) => sum + Number(r.marks), 0);
  }, [marksheet]);

  const totalMax = useMemo(() => {
    if (!marksheet || !marksheet.results) return 0;
    return marksheet.results.reduce((sum, r) => sum + Number(r.totalMark), 0);
  }, [marksheet]);

  const percentage = useMemo(() => {
    if (totalMax === 0) return 0;
    return ((totalObtained / totalMax) * 100).toFixed(2);
  }, [totalObtained, totalMax]);

  return (
    <StudentLayout>
      <style>{`
        .results-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
          padding-bottom: 24px;
          border-bottom: 2px solid rgba(30, 64, 175, 0.1);
        }

        .results-header h2 {
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

        /* SUMMARY CARD */
        .results-summary {
          display: flex;
          gap: 24px;
          margin-bottom: 32px;
        }

        .summary-card-lg {
          flex: 1;
          background: white;
          border-radius: 24px;
          padding: 30px;
          border: 1.5px solid #e2e8f0;
          display: flex;
          align-items: center;
          gap: 24px;
          box-shadow: 0 8px 16px rgba(0,0,0,0.03);
          transition: transform 0.3s;
        }

        .summary-card-lg:hover { transform: translateY(-4px); }

        .score-circle {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: #eff6ff;
          border: 4px solid #3b82f6;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 20px;
          color: #1e40af;
        }

        .score-details h4 { margin: 0; font-size: 14px; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; }
        .score-details .score-val { font-size: 32px; font-weight: 800; color: #1e293b; }

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

        .grade-badge {
          padding: 4px 12px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 13px;
        }

        .grade-pass { background: #dcfce7; color: #166534; }
        .grade-fail { background: #fee2e2; color: #991b1b; }

        .not-announced {
          text-align: center;
          padding: 60px;
          background: #fff;
          border-radius: 24px;
          border: 2px dashed #cbd5e1;
          color: #64748b;
        }

        @media (max-width: 768px) {
          .results-summary { flex-direction: column; }
          .premium-table thead { display: none; }
          .premium-table td { display: block; text-align: right; padding: 12px 16px; border-bottom: none; }
          .premium-table td::before { content: attr(data-label); float: left; font-weight: 700; color: #64748b; }
          .premium-table tr { border-bottom: 2px solid #e2e8f0; display: block; padding: 10px 0; }
        }
      `}</style>

      <div className="results-header">
        <h2>📝 Examination Results</h2>
        {marksheet && marksheet.published && (
          <div className="count-badge">AY {marksheet.session.academicYear}</div>
        )}
      </div>

      <div className="dropdown-bar">
        <select
          value={selectedSession}
          onChange={(e) => {
            setSelectedSession(e.target.value);
            loadResults(e.target.value);
          }}
        >
          <option value="">Choose Exam Session...</option>
          {sessions.map((s) => (
            <option key={s._id} value={s._id}>
              {s.name} - Sem {s.semester} ({s.academicYear})
            </option>
          ))}
        </select>

        {marksheet && marksheet.published && (
          <input
            type="text"
            placeholder="Search within results..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        )}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>
          <h4>Retrieving Marks...</h4>
          <p>Connecting to the examination database.</p>
        </div>
      ) : !selectedSession ? (
        <div className="not-announced">
          <h3>Select Session</h3>
          <p>Pick an exam session from the dropdown to see your scores.</p>
        </div>
      ) : marksheet && marksheet.published === false ? (
        <div className="not-announced">
          <h3>Results Awaited ⏳</h3>
          <p>The university has not yet published the results for this exam session. Please check back later.</p>
        </div>
      ) : marksheet && marksheet.published ? (
        <>
          <div className="results-summary">
            <div className="summary-card-lg">
              <div className="score-circle">{percentage}%</div>
              <div className="score-details">
                <h4>Total Obtained</h4>
                <div className="score-val">{totalObtained} <span style={{ fontSize: '18px', color: '#94a3b8' }}>/ {totalMax}</span></div>
              </div>
            </div>
            <div className="summary-card-lg">
              <div className="score-circle" style={{ borderColor: '#10b981', color: '#059669', background: '#ecfdf5' }}>PASS</div>
              <div className="score-details">
                <h4>Overall Status</h4>
                <div className="score-val" style={{ color: '#059669' }}>Successful</div>
              </div>
            </div>
          </div>

          <div className="table-container">
            <table className="premium-table">
              <thead>
                <tr>
                  <th style={{ width: '80px' }}>#</th>
                  <th>Subject Details</th>
                  <th>Marks Secured</th>
                  <th>Maximum</th>
                  <th>Outcome</th>
                </tr>
              </thead>
              <tbody>
                {filteredResults.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '40px' }}>No records found.</td>
                  </tr>
                ) : (
                  filteredResults.map((r, i) => (
                    <tr key={r._id}>
                      <td data-label="#">{i + 1}</td>
                      <td data-label="Subject">
                        <strong>{r.subjectId.subjectName}</strong>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>{r.subjectId.subjectCode}</div>
                      </td>
                      <td data-label="Marks Secured" style={{ fontWeight: 800, color: '#1e40af' }}>{r.marks}</td>
                      <td data-label="Maximum">{r.totalMark}</td>
                      <td data-label="Outcome">
                        <span className={`grade-badge ${r.marks >= (r.totalMark * 0.4) ? 'grade-pass' : 'grade-fail'}`}>
                          {r.marks >= (r.totalMark * 0.4) ? 'PASS' : 'FAIL'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      ) : null}
    </StudentLayout>
  );
}
