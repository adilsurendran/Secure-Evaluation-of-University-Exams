import React, { useEffect, useState, useMemo } from "react";
import StaffSidebar from "./StaffSidebar";
import api from "../../../api";
import "./staff.css";

function StaffAssigned() {
  const staffId = localStorage.getItem("staffId");

  const [sheets, setSheets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Modal States
  const [showModal, setShowModal] = useState(false);
  const [selectedSheetId, setSelectedSheetId] = useState(null);
  const [marks, setMarks] = useState("");
  const [maxMark, setMaxMark] = useState(null);

  // Load assigned sheets
  const fetchSheets = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/staff/assigned/${staffId}`);
      setSheets(res.data);
    } catch (err) {
      console.error("Error loading assigned sheets:", err);
      alert("Failed to load assigned sheets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSheets();
  }, [staffId]);

  // Derived filtered data
  const filteredSheets = useMemo(() => {
    return sheets.filter((s) => {
      const regNo = s.studentId?.admissionNo?.toLowerCase() || "";
      const subName = s.subjectId?.subjectName?.toLowerCase() || "";
      const subCode = s.subjectId?.subjectCode?.toLowerCase() || "";

      return regNo.includes(search) || subName.includes(search) || subCode.includes(search);
    });
  }, [sheets, search]);

  const openPdf = async (encryptedPublicId) => {
    try {
      const res = await api.get(`/colleges/answers/signed-url/${encryptedPublicId}`);
      if (res.data.url) {
        window.open(res.data.url, "_blank");
      } else {
        alert("Unable to load PDF");
      }
    } catch (err) {
      alert("Failed to open secure PDF");
    }
  };

  const openMarkModal = (sheetId) => {
    const sheet = sheets.find((s) => s._id === sheetId);
    setMaxMark(sheet.subjectId?.total_mark || 100);
    setSelectedSheetId(sheetId);
    setMarks("");
    setShowModal(true);
  };

  const submitMarks = async () => {
    const num = Number(marks);
    if (isNaN(num) || num < 0) {
      return alert("Marks cannot be negative");
    }
    if (num > maxMark) {
      return alert(`Maximum allowed mark is ${maxMark}`);
    }

    try {
      await api.put(`/staff/evaluate/${selectedSheetId}`, {
        marks: num,
        status: "evaluated",
      });

      // Update local state
      setSheets((prev) => prev.filter((s) => s._id !== selectedSheetId));
      setShowModal(false);
      alert("Evaluation completed successfully!");
    } catch (err) {
      console.error("Submit marks error:", err);
      alert("Failed to submit marks");
    }
  };

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
        }

        .filter-bar input {
          flex: 1;
          padding: 12px 16px;
          border: 1.5px solid #e2e8f0;
          border-radius: 10px;
          font-size: 14px;
          font-family: inherit;
          color: #1e293b;
          transition: all 0.3s ease;
        }

        .filter-bar input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
        }

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
        }

        /* BUTTONS */
        .btn-view {
          padding: 8px 16px;
          background: #eff6ff;
          color: #2563eb;
          border: 1px solid #dbeafe;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-view:hover {
          background: #dbeafe;
          transform: translateY(-1px);
        }

        .btn-mark {
          padding: 8px 16px;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 2px 8px rgba(16, 185, 129, 0.2);
        }

        .btn-mark:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        }

        /* MODAL */
        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(4px);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 2000;
        }

        .modal-card {
          background: white;
          width: 100%;
          max-width: 400px;
          border-radius: 20px;
          padding: 32px;
          box-shadow: 0 20px 50px rgba(0,0,0,0.2);
          animation: modalIn 0.3s ease-out;
        }

        @keyframes modalIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        .modal-card h3 {
          margin: 0 0 8px 0;
          color: #1e293b;
          font-weight: 800;
        }

        .modal-card p {
          color: #64748b;
          font-size: 14px;
          margin-bottom: 24px;
        }

        .modal-input {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          font-size: 16px;
          margin-bottom: 24px;
          transition: border-color 0.3s;
        }

        .modal-input:focus {
          outline: none;
          border-color: #3b82f6;
        }

        .modal-actions {
          display: flex;
          gap: 12px;
        }

        .btn-submit {
          flex: 1;
          padding: 12px;
          background: #1e40af;
          color: white;
          border: none;
          border-radius: 12px;
          font-weight: 700;
          cursor: pointer;
        }

        .btn-cancel {
          flex: 1;
          padding: 12px;
          background: #f1f5f9;
          color: #475569;
          border: none;
          border-radius: 12px;
          font-weight: 700;
          cursor: pointer;
        }

        @media (max-width: 768px) {
          .staff-page { padding: 16px; }
          .filter-bar { padding: 12px; }
          .premium-table thead { display: none; }
          .premium-table td { display: block; text-align: right; padding: 8px 16px; }
          .premium-table td::before { content: attr(data-label); float: left; font-weight: 700; color: #64748b; }
        }
      `}</style>

      <div className="staff-main-content staff-page">
        <div className="staff-header">
          <h2>✍️ Assigned Evaluations</h2>
          <div className="badge-total">{filteredSheets.length} Pending Papers</div>
        </div>

        <div className="filter-bar">
          <input
            type="text"
            placeholder="Search by student ID or subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value.toLowerCase())}
          />
        </div>

        <div className="table-container">
          <table className="premium-table">
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Subject Name</th>
                <th>Subject Code</th>
                <th>Exam Date</th>
                <th style={{ textAlign: "center" }}>Answer Sheet</th>
                <th style={{ textAlign: "center" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", padding: "48px", color: "#64748b" }}>
                    Fetching assigned papers...
                  </td>
                </tr>
              ) : filteredSheets.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", padding: "48px", color: "#94a3b8" }}>
                    {search ? "No matching papers found." : "No papers assigned for evaluation at the moment."}
                  </td>
                </tr>
              ) : (
                filteredSheets.map((s) => (
                  <tr key={s._id}>
                    <td data-label="Student ID"><strong>{s.studentId?.admissionNo}</strong></td>
                    <td data-label="Subject Name">{s.subjectId?.subjectName}</td>
                    <td data-label="Subject Code"><code>{s.subjectId?.subjectCode}</code></td>
                    <td data-label="Exam Date">{new Date(s.examId?.examDate).toLocaleDateString()}</td>
                    <td data-label="Answer Sheet" style={{ textAlign: "center" }}>
                      <button className="btn-view" onClick={() => openPdf(s.filePublicId)}>
                        📄 View PDF
                      </button>
                    </td>
                    <td data-label="Action" style={{ textAlign: "center" }}>
                      <button className="btn-mark" onClick={() => openMarkModal(s._id)}>
                        📝 Mark Complete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3>Submit Evaluation</h3>
            <p>Enter the marks obtained by the student. Max allowed: <strong>{maxMark}</strong></p>

            <input
              type="number"
              className="modal-input"
              placeholder={`Enter marks (0-${maxMark})`}
              value={marks}
              onChange={(e) => setMarks(e.target.value)}
              autoFocus
            />

            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn-submit" onClick={submitMarks}>Confirm & Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StaffAssigned;
