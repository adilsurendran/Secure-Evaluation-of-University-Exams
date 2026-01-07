import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api";

export default function CollegeViewRevaluationResult() {
  const navigate = useNavigate();
  const collegeId = localStorage.getItem("collegeId");

  const [sessions, setSessions] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedSession, setSelectedSession] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // ----------------------------------------
  // LOAD SESSIONS & SUBJECTS
  // ----------------------------------------
  useEffect(() => {
    const load = async () => {
      try {
        const [sessRes, subRes] = await Promise.all([
          api.get("/exam-sessions/all"),
          api.get("/subjects/all")
        ]);
        setSessions(sessRes.data);
        setSubjects(subRes.data);
      } catch (err) {
        console.log(err);
      }
    };
    load();
  }, []);

  // ----------------------------------------
  // LOAD REVALUATION RESULTS
  // ----------------------------------------
  const fetchResults = async () => {
    setLoading(true);
    try {
      const res = await api.get(
        `/colleges/revaluation-results/${collegeId}`,
        {
          params: {
            sessionId: selectedSession,
            subjectId: selectedSubject,
          },
        }
      );
      setResults(res.data || []);
    } catch (err) {
      console.log(err);
      alert("Failed to fetch revaluation results");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchResults();
  }, [selectedSession, selectedSubject]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        .college-page {
          padding: 32px;
          min-height: 100vh;
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 25%, #bfdbfe 50%, #e0f2fe 75%, #f0f9ff 100%);
          font-family: 'Inter', sans-serif;
        }

        .back-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: white;
          color: #1e40af;
          border: 2px solid #e0f2fe;
          border-radius: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-bottom: 24px;
          width: fit-content;
          box-shadow: 0 2px 8px rgba(30, 64, 175, 0.05);
        }

        .back-btn:hover {
          background: #f0f9ff;
          border-color: #3b82f6;
          transform: translateX(-4px);
        }

        .college-header {
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
          margin: 0 0 8px 0;
        }

        .college-header p {
          color: #64748b;
          font-size: 16px;
          margin: 0;
        }

        /* FILTER BAR */
        .filter-bar {
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

        .filter-bar select {
          flex: 1;
          min-width: 250px;
          padding: 10px 16px;
          border: 1.5px solid #e2e8f0;
          border-radius: 10px;
          font-size: 14px;
          font-family: inherit;
          color: #1e293b;
          background: #f8fafc;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .filter-bar select:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
        }

        .clear-btn {
          padding: 10px 20px;
          background: #f1f5f9;
          color: #475569;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .clear-btn:hover {
          background: #e2e8f0;
          color: #1e293b;
        }

        /* TABLE Styles */
        .table-container {
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

        .college-table tbody td {
          padding: 16px;
          color: #1e293b;
        }

        .subtext {
          font-size: 12px;
          color: #64748b;
          display: block;
          margin-top: 2px;
        }

        .marks-diff {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .old-marks {
          color: #94a3b8;
          text-decoration: line-through;
          font-size: 13px;
        }

        .new-marks {
          color: #059669;
          font-weight: 700;
          font-size: 16px;
          background: #f0fdf4;
          padding: 4px 10px;
          border-radius: 8px;
          border: 1px solid #bbf7d0;
        }

        .total-badge {
          font-weight: 600;
          color: #1e40af;
        }

        @media (max-width: 768px) {
          .college-page { padding: 20px; }
          .filter-bar { flex-direction: column; }
          .table-container { overflow-x: auto; }
        }
      `}</style>

      <div className="college-page">
        {/* <button className="back-btn" onClick={() => navigate("/college/dashboard")}>
          ← Back to Dashboard
        </button> */}

        <div className="college-header">
          <h2>♻️ College Revaluation Results</h2>
          <p>Review updated marks and academic standing for revaluation applications.</p>
        </div>

        {/* FILTERS */}
        <div className="filter-bar">
          <select
            value={selectedSession}
            onChange={(e) => setSelectedSession(e.target.value)}
          >
            <option value="">All Exam Sessions</option>
            {sessions.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name} - {s.academicYear} (Sem {s.semester})
              </option>
            ))}
          </select>

          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
          >
            <option value="">All Subjects</option>
            {subjects.map((s) => (
              <option key={s._id} value={s._id}>
                {s.subjectCode} - {s.subjectName}
              </option>
            ))}
          </select>

          <button
            className="clear-btn"
            onClick={() => {
              setSelectedSession("");
              setSelectedSubject("");
            }}
          >
            Reset Filters
          </button>
        </div>

        {/* RESULTS TABLE */}
        <div className="table-container">
          <table className="college-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Student</th>
                <th>Subject</th>
                <th>Marks Update</th>
                <th>Total Out Of</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center", padding: "40px", fontStyle: "italic", color: "#64748b" }}>
                    Loading updated results...
                  </td>
                </tr>
              ) : results.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>
                    No revaluation results found.
                  </td>
                </tr>
              ) : (
                results.map((r, i) => (
                  <tr key={r._id}>
                    <td>{i + 1}</td>
                    <td>
                      <strong>{r.studentId?.name}</strong>
                      <span className="subtext">ID: {r.studentId?.admissionNo}</span>
                    </td>
                    <td>
                      <strong>{r.subjectId?.subjectName}</strong>
                      <span className="subtext">Code: {r.subjectId?.subjectCode}</span>
                    </td>
                    <td>
                      <div className="marks-diff">
                        <span className="old-marks">{r.oldMarks}</span>
                        <span className="new-marks">{r.newMarks}</span>
                      </div>
                    </td>
                    <td className="total-badge">{r.totalMark}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
