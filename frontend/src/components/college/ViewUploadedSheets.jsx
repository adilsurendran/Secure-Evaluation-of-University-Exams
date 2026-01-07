import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api";

function ViewUploadedSheets() {
  const navigate = useNavigate();
  const collegeId = localStorage.getItem("collegeId");

  const [sheets, setSheets] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    sessionId: "",
    studentId: "",
  });

  // ================= LOAD ALL DATA =================
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [sessRes, studentRes, sheetRes] = await Promise.all([
          api.get("/colleges/exam-sessions/all"),
          api.get(`/colleges/student/college/${collegeId}`),
          api.get(`/colleges/answers/college/${collegeId}`),
        ]);

        setSessions(sessRes.data);
        setStudents(studentRes.data);
        setSheets(sheetRes.data);
      } catch (err) {
        console.log("LOAD ERROR", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [collegeId]);

  // ================= FILTERING =================
  const filteredSheets = useMemo(() => {
    return sheets.filter((s) => {
      const bySession = !filters.sessionId || s.sessionId?._id === filters.sessionId;
      const byStudent = !filters.studentId || s.studentId?._id === filters.studentId;
      return bySession && byStudent;
    });
  }, [sheets, filters]);

  // ================= DELETE UPLOADED SHEET =================
  const deleteSheet = async (id) => {
    if (!window.confirm("Are you sure you want to delete this uploaded sheet? This action cannot be undone.")) return;

    try {
      await api.delete(`/colleges/answers/${id}`);
      setSheets((prev) => prev.filter((s) => s._id !== id));
      alert("Answer sheet deleted successfully.");
    } catch (err) {
      console.log("DELETE ERROR", err);
      alert("Failed to delete answer sheet.");
    }
  };

  // ================= OPEN SECURE SIGNED PDF LINK =================
  const openPdf = async (encryptedId) => {
    try {
      const res = await api.get(`/colleges/answers/signed-url/${encryptedId}`);
      if (res.data?.url) {
        window.open(res.data.url, "_blank");
      } else {
        alert("Unable to generate secure link");
      }
    } catch (err) {
      console.log("SIGNED URL ERROR", err);
      alert("Failed to open secure PDF");
    }
  };

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
          display: flex;
          justify-content: space-between;
          align-items: center;
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
          min-width: 200px;
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

        /* TABLE */
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

        .status-badge {
          display: inline-flex;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .status-evaluated {
          background: #dcfce7;
          color: #15803d;
          border: 1px solid #bbf7d0;
        }

        .status-pending {
          background: #fef3c7;
          color: #92400e;
          border: 1px solid #fde68a;
        }

        .action-col {
          display: flex;
          gap: 8px;
          justify-content: center;
        }

        .view-btn, .delete-btn {
          padding: 8px 16px;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .view-btn {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          color: white;
          box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
        }

        .view-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
        }

        .delete-btn {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          color: white;
          box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
        }

        .delete-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
        }

        @media (max-width: 768px) {
          .college-page { padding: 20px; }
          .college-header h2 { font-size: 24px; }
          .table-container { overflow-x: auto; }
          .action-col { flex-direction: column; }
        }
      `}</style>

      <div className="college-page">
        {/* <button className="back-btn" onClick={() => navigate("/college/dashboard")}>
          ← Back to Dashboard
        </button> */}

        <div className="college-header">
          <h2>🗂️ Uploaded Answer Sheets</h2>
        </div>

        {/* FILTERS */}
        <div className="filter-bar">
          <select
            value={filters.sessionId}
            onChange={(e) => setFilters({ ...filters, sessionId: e.target.value })}
          >
            <option value="">All Exam Sessions</option>
            {sessions.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name} ({s.academicYear})
              </option>
            ))}
          </select>

          <select
            value={filters.studentId}
            onChange={(e) => setFilters({ ...filters, studentId: e.target.value })}
          >
            <option value="">All Students</option>
            {students.map((st) => (
              <option key={st._id} value={st._id}>
                {st.name} ({st.admissionNo})
              </option>
            ))}
          </select>

          <button
            className="clear-btn"
            onClick={() => setFilters({ sessionId: "", studentId: "" })}
          >
            Clear Filters
          </button>
        </div>

        {/* TABLE */}
        <div className="table-container">
          <table className="college-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Student Details</th>
                <th>Subject Info</th>
                <th>Exam Date</th>
                <th>Evaluation Status</th>
                <th style={{ textAlign: "center" }}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", padding: "40px", fontStyle: "italic", color: "#64748b" }}>
                    Loading answer sheets...
                  </td>
                </tr>
              ) : filteredSheets.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>
                    No answer sheets found for the selected filters.
                  </td>
                </tr>
              ) : (
                filteredSheets.map((s, i) => (
                  <tr key={s._id}>
                    <td>{i + 1}</td>
                    <td>
                      <strong>{s.studentId?.name}</strong>
                      <div style={{ fontSize: "12px", color: "#64748b" }}>ID: {s.studentId?.admissionNo}</div>
                    </td>
                    <td>
                      <strong>{s.subjectId?.subjectName}</strong>
                      <div style={{ fontSize: "12px", color: "#64748b" }}>Code: {s.subjectId?.subjectCode}</div>
                    </td>
                    <td>{new Date(s.examId?.examDate).toLocaleDateString()}</td>
                    <td>
                      <span className={`status-badge ${s.status === "evaluated" ? "status-evaluated" : "status-pending"}`}>
                        ● {s.status}
                      </span>
                    </td>
                    <td className="action-col">
                      <button
                        className="view-btn"
                        onClick={() => openPdf(s.filePublicId)}
                      >
                        View PDF
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => deleteSheet(s._id)}
                      >
                        Delete
                      </button>
                    </td>
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

export default ViewUploadedSheets;
