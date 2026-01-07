import React, { useEffect, useState } from "react";
import api from "../../../api";

function AdminAnswerCopyRequests() {
  const [requests, setRequests] = useState([]);
  const [statusFilter, setStatusFilter] = useState("pending");
  const [loading, setLoading] = useState(true);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectNote, setRejectNote] = useState("");
  const [activeRequestId, setActiveRequestId] = useState(null);

  const loadRequests = async (status = "pending") => {
    setLoading(true);
    try {
      const res = await api.get(
        `/university/answer-copy/requests?status=${status}`
      );
      setRequests(res.data || []);
    } catch (err) {
      console.log(err);
      alert("Failed to load answer copy requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests(statusFilter);
  }, [statusFilter]);

  const approveRequest = async (id) => {
    if (!window.confirm("Approve this answer sheet copy request?")) return;

    try {
      const res = await api.put(
        `/university/answer-copy/${id}/approve`
      );
      alert(res.data?.msg || "Request approved");
      loadRequests(statusFilter);
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.msg || "Failed to approve request");
    }
  };

  const openRejectModal = (id) => {
    setActiveRequestId(id);
    setRejectNote("");
    setShowRejectModal(true);
  };

  const submitReject = async () => {
    if (!rejectNote.trim()) {
      return alert("Please enter a reject note");
    }

    try {
      const res = await api.put(
        `/university/answer-copy/${activeRequestId}/reject`,
        { adminNote: rejectNote }
      );
      alert(res.data?.msg || "Request rejected");

      setShowRejectModal(false);
      setActiveRequestId(null);
      setRejectNote("");

      loadRequests(statusFilter);
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.msg || "Failed to reject request");
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

        .university-page {
          padding: 32px;
          min-height: 100vh;
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 25%, #bfdbfe 50%, #e0f2fe 75%, #f0f9ff 100%);
          font-family: 'Inter', sans-serif;
        }

        .header {
          text-align: center;
          margin-bottom: 32px;
          padding: 40px;
          background: white;
          border-radius: 24px;
          box-shadow: 0 8px 32px rgba(30, 64, 175, 0.15);
          border: 3px solid #60a5fa;
          animation: headerGlow 3s ease-in-out infinite;
        }

        @keyframes headerGlow {
          0%, 100% {
            border-color: #60a5fa;
            box-shadow: 0 8px 32px rgba(96, 165, 250, 0.2);
          }
          50% {
            border-color: #3b82f6;
            box-shadow: 0 12px 48px rgba(59, 130, 246, 0.4);
          }
        }

        .header h2 {
          font-size: 42px;
          font-weight: 900;
          background: linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #60a5fa 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0 0 12px 0;
          animation: slideDown 0.8s ease;
        }

        .subtitle {
          color: #64748b;
          font-size: 16px;
          margin: 0;
          animation: fadeIn 1s ease;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
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

        .filter-row {
          margin-bottom: 32px;
          display: flex;
          align-items: center;
          gap: 16px;
          background: white;
          padding: 24px;
          border-radius: 20px;
          box-shadow: 0 4px 20px rgba(30, 64, 175, 0.1);
          border: 2px solid #93c5fd;
        }

        .filter-row label {
          font-weight: 700;
          color: #1e293b;
          font-size: 16px;
        }

        .filter-select {
          padding: 14px 20px;
          border: 2px solid #60a5fa;
          border-radius: 14px;
          font-size: 15px;
          background: white;
          cursor: pointer;
          transition: all 0.3s ease;
          flex: 1;
          max-width: 350px;
          font-weight: 600;
        }

        .filter-select:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 4px rgba(96, 165, 250, 0.2);
        }

        .table-container {
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(30, 64, 175, 0.15);
          animation: slideUp 0.8s ease;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .college-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 14px;
        }

        .college-table thead {
          background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
          color: white;
        }

        .college-table thead th {
          padding: 18px 14px;
          text-align: left;
          font-weight: 700;
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.8px;
        }

        .college-table tbody tr {
          border-bottom: 1px solid #dbeafe;
          transition: all 0.3s ease;
        }

        .college-table tbody tr:hover {
          background: linear-gradient(135deg, #f0f9ff 0%, #dbeafe 100%);
          transform: scale(1.01);
          box-shadow: 0 4px 16px rgba(59, 130, 246, 0.1);
        }

        .college-table tbody td {
          padding: 16px 14px;
          color: #1e293b;
        }

        .text-muted {
          color: #94a3b8;
          font-style: italic;
          text-align: center;
          padding: 60px 20px;
        }

        .status-blue {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          color: white;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
        }

        .status-gray {
          background: linear-gradient(135deg, #64748b 0%, #475569 100%);
          color: white;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
        }

        .status-light {
          background: linear-gradient(135deg, #93c5fd 0%, #60a5fa 100%);
          color: white;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
        }

        .btn-approve {
          padding: 8px 18px;
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
        }

        .btn-approve:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(59, 130, 246, 0.5);
        }

        .btn-reject {
          padding: 8px 18px;
          background: linear-gradient(135deg, #64748b 0%, #475569 100%);
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(100, 116, 139, 0.4);
        }

        .btn-reject:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(100, 116, 139, 0.5);
        }

        .text-blue {
          color: #3b82f6;
          font-weight: 600;
        }

        .text-gray {
          color: #64748b;
          font-weight: 600;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(30, 64, 175, 0.4);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.3s ease;
        }

        .modal-box {
          background: white;
          border-radius: 24px;
          padding: 32px;
          max-width: 500px;
          width: 90%;
          box-shadow: 0 24px 64px rgba(30, 64, 175, 0.3);
          border: 2px solid #3b82f6;
          animation: scaleUp 0.3s ease;
        }

        @keyframes scaleUp {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        .modal-box h3 {
          font-size: 24px;
          font-weight: 700;
          background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0 0 12px 0;
        }

        .modal-box p {
          color: #64748b;
          margin: 0 0 20px 0;
        }

        .modal-textarea {
          width: 100%;
          padding: 14px 18px;
          border: 2px solid #dbeafe;
          border-radius: 12px;
          font-size: 15px;
          font-family: 'Inter', sans-serif;
          background: #f8fafc;
          transition: all 0.3s ease;
          resize: vertical;
          margin-bottom: 20px;
        }

        .modal-textarea:focus {
          outline: none;
          border-color: #3b82f6;
          background: white;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
        }

        .modal-buttons {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
        }

        .modal-submit {
          padding: 12px 28px;
          background: linear-gradient(135deg, #64748b 0%, #475569 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(100, 116, 139, 0.4);
        }

        .modal-submit:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(100, 116, 139, 0.5);
        }

        .modal-cancel {
          padding: 12px 28px;
          background: #cbd5e1;
          color: #475569;
          border: none;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .modal-cancel:hover {
          background: #94a3b8;
          color: white;
        }

        @media (max-width: 768px) {
          .university-page {
            padding: 20px;
          }

          .header h2 {
            font-size: 28px;
          }

          .filter-row {
            flex-direction: column;
            align-items: flex-start;
          }

          .filter-select {
            max-width: 100%;
          }

          .table-container {
            overflow-x: auto;
          }

          .college-table {
            font-size: 12px;
          }

          .college-table thead th,
          .college-table tbody td {
            padding: 12px 8px;
          }
        }
      `}</style>

      <div className="university-page">
        <div className="header">
          <h2>📄 Answer Sheet Copy Requests</h2>
          <p className="subtitle">
            Review and approve/reject student requests to view scanned answer sheets.
          </p>
        </div>

        <div className="filter-row">
          <label>Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="">All</option>
          </select>
        </div>

        <div className="table-container">
          {loading ? (
            <p style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>Loading requests...</p>
          ) : requests.length === 0 ? (
            <p className="text-muted">No requests found.</p>
          ) : (
            <table className="college-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Student</th>
                  <th>College</th>
                  <th>Session</th>
                  <th>Subject</th>
                  <th>Exam Date</th>
                  <th>Status</th>
                  <th>Note / Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((r, i) => (
                  <tr key={r._id}>
                    <td><strong>{i + 1}</strong></td>
                    <td>
                      <strong>{r.studentId?.name}</strong> ({r.studentId?.admissionNo})
                    </td>
                    <td>{r.collegeId?.name}</td>
                    <td>
                      {r.sessionId?.name} - {r.sessionId?.academicYear} (Sem{" "}
                      {r.sessionId?.semester})
                    </td>
                    <td>
                      {r.subjectId?.subjectName} (
                      {r.subjectId?.subjectCode})
                    </td>
                    <td>
                      {r.examId?.examDate
                        ? new Date(
                          r.examId.examDate
                        ).toLocaleDateString()
                        : "-"}
                    </td>
                    <td>
                      <span
                        className={
                          r.status === "approved"
                            ? "status-blue"
                            : r.status === "rejected"
                              ? "status-gray"
                              : "status-light"
                        }
                      >
                        {r.status.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      {r.status === "pending" && (
                        <>
                          <button
                            className="btn-approve"
                            onClick={() => approveRequest(r._id)}
                            style={{ marginRight: "8px" }}
                          >
                            Approve
                          </button>
                          <button
                            className="btn-reject"
                            onClick={() => openRejectModal(r._id)}
                          >
                            Reject
                          </button>
                        </>
                      )}

                      {r.status === "approved" && (
                        <span className="text-blue">
                          Approved (student can view)
                        </span>
                      )}

                      {r.status === "rejected" && (
                        <span className="text-gray">
                          {r.adminNote || "Rejected"}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {showRejectModal && (
          <div className="modal-overlay" onClick={() => setShowRejectModal(false)}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
              <h3>Reject Request</h3>
              <p>Provide reason for rejection (visible to student):</p>

              <textarea
                rows="3"
                className="modal-textarea"
                value={rejectNote}
                onChange={(e) => setRejectNote(e.target.value)}
              />

              <div className="modal-buttons">
                <button
                  className="modal-cancel"
                  onClick={() => setShowRejectModal(false)}
                >
                  Cancel
                </button>
                <button className="modal-submit" onClick={submitReject}>
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default AdminAnswerCopyRequests;
