import React, { useEffect, useState, useMemo } from "react";
import StaffSidebar from "./StaffSidebar";
import api from "../../../api";
import "./staff.css";

function StaffHistory() {
  const staffId = localStorage.getItem("staffId");

  const [selected, setSelected] = useState("valuation");
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/staff/evalhistory/${staffId}`, {
        params: { selected },
      });
      setList(res.data.history || []);
    } catch (e) {
      console.error("Error fetching history:", e);
      alert(e.response?.data?.message || "Failed to load history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [selected, staffId]);

  // Derived filtered data
  const filteredList = useMemo(() => {
    return list.filter((item) => {
      const sessionName = item.sessionId?.name?.toLowerCase() || "";
      const subName = item.subjectId?.subjectName?.toLowerCase() || "";
      const subCode = item.subjectId?.subjectCode?.toLowerCase() || "";

      return sessionName.includes(search) || subName.includes(search) || subCode.includes(search);
    });
  }, [list, search]);

  return (
    <div className="staff-container">
      <StaffSidebar />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        .staff-page {
          min-height: 100vh;
          font-family: 'Inter', sans-serif;
        }

        .staff-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
          padding-bottom: 24px;
          border-bottom: 2px solid rgba(30, 64, 175, 0.1);
        }

        .staff-header h2 {
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

        .filter-bar input,
        .filter-bar select {
          padding: 12px 16px;
          border: 1.5px solid #e2e8f0;
          border-radius: 10px;
          font-size: 14px;
          font-family: inherit;
          color: #1e293b;
          transition: all 0.3s ease;
        }

        .filter-bar input:focus,
        .filter-bar select:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
        }

        .filter-bar input { flex: 1; min-width: 250px; }
        .filter-bar select { min-width: 200px; cursor: pointer; }

        /* TABLE */
        .table-container {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          border: 2px solid #e2e8f0;
        }

        .premium-table {
          width: 100%;
          border-collapse: collapse;
        }

        .premium-table thead {
          background: #1e40af;
          color: white;
        }

        .premium-table thead th {
          padding: 16px;
          text-align: left;
          font-weight: 600;
          font-size: 14px;
          text-transform: uppercase;
        }

        .premium-table tbody tr {
          border-bottom: 1px solid #e2e8f0;
          transition: background 0.2s ease;
        }

        .premium-table tbody tr:hover {
          background: #f8fafc;
        }

        .premium-table td {
          padding: 16px;
          color: #334155;
          font-size: 15px;
        }

        .badge-session {
          padding: 6px 12px;
          background: #eff6ff;
          color: #2563eb;
          border-radius: 8px;
          font-weight: 600;
          font-size: 13px;
        }

        .badge-code {
          font-family: monospace;
          background: #f1f5f9;
          padding: 4px 8px;
          border-radius: 4px;
          color: #475569;
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .staff-page { padding: 16px; }
          .filter-bar { padding: 12px; }
          .premium-table thead { display: none; }
          .premium-table td { display: block; text-align: right; padding: 12px 16px; }
          .premium-table td::before { content: attr(data-label); float: left; font-weight: 700; color: #64748b; }
        }
      `}</style>

      <div className="staff-main-content staff-page">
        <div className="staff-header">
          <h2>📜 Evaluation History</h2>
          <div style={{ color: '#64748b', fontWeight: 600 }}>
            {filteredList.length} Records Found
          </div>
        </div>

        <div className="filter-bar">
          <input
            type="text"
            placeholder="Search by session, subject or paper code..."
            value={search}
            onChange={(e) => setSearch(e.target.value.toLowerCase())}
          />
          <select
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
          >
            <option value="valuation">Normal Valuation</option>
            <option value="revaluation">Revaluation</option>
          </select>
        </div>

        <div className="table-container">
          <table className="premium-table">
            <thead>
              <tr>
                <th style={{ width: "60px" }}>#</th>
                <th>Exam Session</th>
                <th>Subject Code</th>
                <th>Subject Name</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center", padding: "48px", color: "#64748b" }}>
                    Loading history logs...
                  </td>
                </tr>
              ) : filteredList.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center", padding: "48px", color: "#94a3b8" }}>
                    {search ? "No matching records found." : "No evaluation history found for this category."}
                  </td>
                </tr>
              ) : (
                filteredList.map((item, index) => (
                  <tr key={item._id}>
                    <td data-label="#">{index + 1}</td>
                    <td data-label="Exam Session">
                      <span className="badge-session">{item.sessionId?.name}</span>
                    </td>
                    <td data-label="Subject Code">
                      <span className="badge-code">{item.subjectId?.subjectCode}</span>
                    </td>
                    <td data-label="Subject Name">
                      <strong>{item.subjectId?.subjectName}</strong>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default StaffHistory;