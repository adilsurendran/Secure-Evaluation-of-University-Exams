import React, { useEffect, useState } from "react";
import api from "../../../api";

function UniversityComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [statusFilter, setStatusFilter] = useState("pending");
  const [showModal, setShowModal] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(true);

  const getComplaints = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/university/complaints?status=${statusFilter}`);
      setComplaints(res.data.complaints || []);
    } catch (e) {
      console.log(e);
      alert("Failed to load complaints");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getComplaints();
  }, [statusFilter]);

  const openReplyModal = (complaint) => {
    setSelectedComplaint(complaint);
    setReply(complaint.reply || "");
    setShowModal(true);
  };

  const submitReply = async () => {
    if (!reply.trim()) {
      alert("Reply is required");
      return;
    }

    try {
      await api.put(`/university/complaints/${selectedComplaint._id}/reply`, {
        reply,
        status: "resolved",
      });

      alert("Complaint updated successfully");
      setShowModal(false);
      getComplaints();
    } catch (e) {
      console.log(e);
      alert("Failed to update complaint");
    }
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

        .complaints-page {
          padding: 40px;
          min-height: 100vh;
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 25%, #bfdbfe 50%, #e0f2fe 75%, #f0f9ff 100%);
          font-family: 'Inter', sans-serif;
        }

        .premium-header {
          text-align: center;
          margin-bottom: 40px;
          animation: slideDown 0.8s ease;
        }

        .premium-header h2 {
          font-size: 42px;
          font-weight: 900;
          background: linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #60a5fa 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0;
          letter-spacing: -1px;
        }

        .premium-header p {
          color: #64748b;
          font-size: 18px;
          font-weight: 500;
          margin-top: 8px;
        }

        .control-panel {
          max-width: 1400px;
          margin: 0 auto 32px;
          display: flex;
          justify-content: center;
          gap: 16px;
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(10px);
          padding: 12px;
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.8);
          box-shadow: 0 4px 20px rgba(30, 64, 175, 0.05);
          width: fit-content;
        }

        .status-tab {
          padding: 12px 32px;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
          background: transparent;
          color: #64748b;
        }

        .status-tab:hover {
          background: #f0f9ff;
          color: #3b82f6;
        }

        .status-tab.active {
          background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
          color: white;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
        }

        .complaints-list {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 20px;
          padding: 0;
          list-style: none;
        }

        .complaint-card {
          background: white;
          border-radius: 24px;
          padding: 32px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          animation: fadeInUp 0.6s ease both;
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .complaint-card:hover {
          transform: translateY(-4px);
          border-color: #3b82f6;
          box-shadow: 0 12px 32px rgba(59, 130, 246, 0.15);
        }

        .complaint-card::after {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          height: 100%;
          width: 5px;
          background: linear-gradient(to bottom, #3b82f6, #1e40af);
        }

        .card-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
        }

        .complaint-text {
          font-size: 18px;
          font-weight: 700;
          color: #1e3a8a;
          line-height: 1.5;
          margin-bottom: 16px;
        }

        .details-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          padding: 20px;
          background: #f8fafc;
          border-radius: 16px;
          border: 1px solid #f1f5f9;
        }

        .detail-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .detail-label {
          font-size: 11px;
          font-weight: 700;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .detail-value {
          font-size: 14px;
          font-weight: 600;
          color: #1e293b;
        }

        .reply-section {
          margin-top: 20px;
          padding: 16px;
          background: #eff6ff;
          border-radius: 12px;
          color: #1e40af;
          font-size: 14px;
          line-height: 1.6;
        }

        .reply-section b {
          display: block;
          margin-bottom: 4px;
          font-size: 12px;
          text-transform: uppercase;
        }

        .action-row {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          gap: 12px;
          margin-top: 24px;
        }

        .status-pill {
          padding: 6px 16px;
          border-radius: 100px;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
        }

        .status-pending { background: #fef9c3; color: #a16207; }
        .status-resolved { background: #dcfce7; color: #15803d; }

        .premium-btn {
          padding: 10px 24px;
          background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(30, 64, 175, 0.2);
        }

        .premium-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(30, 64, 175, 0.3);
        }

        /* MODAL */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          animation: fadeIn 0.3s ease;
        }

        .modal-card {
          background: white;
          border-radius: 32px;
          padding: 40px;
          max-width: 600px;
          width: 90%;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        @keyframes popIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }

        .modal-card h3 {
          font-size: 28px;
          font-weight: 900;
          color: #1e3a8a;
          margin-bottom: 12px;
          text-align: center;
        }

        .modal-card p {
          color: #64748b;
          text-align: center;
          margin-bottom: 32px;
        }

        .modal-textarea {
          width: 100%;
          padding: 20px;
          border: 2px solid #e2e8f0;
          border-radius: 20px;
          font-size: 16px;
          background: #f8fafc;
          transition: all 0.3s ease;
          resize: none;
          min-height: 150px;
          margin-bottom: 24px;
        }

        .modal-textarea:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
          background: white;
        }

        .modal-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .cancel-btn {
          padding: 14px;
          background: #f1f5f9;
          color: #475569;
          border: none;
          border-radius: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .cancel-btn:hover { background: #e2e8f0; }

        .submit-btn {
          padding: 14px;
          background: linear-gradient(135deg, #1e40af, #3b82f6);
          color: white;
          border: none;
          border-radius: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 8px 16px rgba(30, 64, 175, 0.2);
        }

        .submit-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 24px rgba(30, 64, 175, 0.3); }

        .no-data {
          text-align: center;
          padding: 80px;
          color: #94a3b8;
          font-style: italic;
          font-size: 18px;
        }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-30px); } to { opacity: 1; transform: translateY(0); } }

        @media (max-width: 768px) {
          .complaints-page { padding: 20px; }
          .details-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="complaints-page">
        <div className="premium-header">
          <h2>💬 Inquiry Management</h2>
          <p>Respond to university-wide complaints and student inquiries</p>
        </div>

        <div className="control-panel">
          <button
            className={`status-tab ${statusFilter === 'pending' ? 'active' : ''}`}
            onClick={() => setStatusFilter('pending')}
          >
            Pending Issues
          </button>
          <button
            className={`status-tab ${statusFilter === 'resolved' ? 'active' : ''}`}
            onClick={() => setStatusFilter('resolved')}
          >
            Resolved History
          </button>
        </div>

        {loading ? (
          <div className="no-data">Syncing complaints database...</div>
        ) : complaints.length === 0 ? (
          <div className="no-data">
            ✨ All clear! No {statusFilter} complaints found.
          </div>
        ) : (
          <ul className="complaints-list">
            {complaints.map((c, index) => (
              <li key={c._id} className="complaint-card" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="card-top">
                  <div className="complaint-text">"{c.complaint}"</div>
                  <span className={`status-pill status-${c.status}`}>
                    {c.status}
                  </span>
                </div>

                <div className="details-grid">
                  <div className="detail-item">
                    <span className="detail-label">🎓 Student</span>
                    <span className="detail-value">{c.studentId?.name || "N/A"}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">🏛️ College</span>
                    <span className="detail-value">{c.collegeId?.name || "N/A"}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">📅 Logged On</span>
                    <span className="detail-value">{formatDateTime(c.createdAt)}</span>
                  </div>
                </div>

                {c.reply && (
                  <div className="reply-section">
                    <b>✅ Response:</b>
                    {c.reply}
                  </div>
                )}

                <div className="action-row">
                  <button
                    className="premium-btn"
                    onClick={() => openReplyModal(c)}
                  >
                    {c.reply ? "Modify Reply" : "Compose Reply"} ⚡
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
              <h3>Send Official Response</h3>
              <p>Responding to student: <b>{selectedComplaint?.studentId?.name}</b></p>

              <textarea
                className="modal-textarea"
                placeholder="Compose your reply here..."
                value={reply}
                onChange={(e) => setReply(e.target.value)}
              />

              <div className="modal-actions">
                <button className="cancel-btn" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button className="submit-btn" onClick={submitReply}>
                  Finalize & Resolve 🚀
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default UniversityComplaints;
