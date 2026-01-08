import React, { useEffect, useState } from "react";
import api from "../../../api";
import StudentLayout from "./StudentLayout";
import "./student.css";

export default function StudentComplaints() {
  const studentId = localStorage.getItem("studentId");

  const [complaintText, setComplaintText] = useState("");
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const loadComplaints = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/student/complaints/${studentId}`);
      setComplaints(res.data.complaints || []);
    } catch (err) {
      console.error("Error loading complaints:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComplaints();
  }, [studentId]);

  const submitComplaint = async (e) => {
    e.preventDefault();

    if (!complaintText.trim()) {
      alert("Please enter your complaint");
      return;
    }

    try {
      setSubmitting(true);
      await api.post("/student/complaints", {
        studentId,
        complaint: complaintText,
      });

      alert("Complaint submitted successfully");
      setComplaintText("");
      loadComplaints();
    } catch (err) {
      console.error(err);
      alert("Failed to submit complaint");
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case 'resolved': return { bg: '#dcfce7', text: '#166534', label: 'Resolved' };
      case 'rejected': return { bg: '#fee2e2', text: '#991b1b', label: 'Rejected' };
      default: return { bg: '#fef3c7', text: '#92400e', label: 'Pending' };
    }
  };

  return (
    <StudentLayout>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        .complaints-container {
          max-width: 1000px;
          margin: 0 auto;
          font-family: 'Inter', sans-serif;
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
          padding-bottom: 24px;
          border-bottom: 2px solid rgba(30, 64, 175, 0.1);
        }

        .page-header h2 {
          font-size: 32px;
          font-weight: 800;
          background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0;
        }

        .complaint-form-card {
          background: white;
          border-radius: 24px;
          padding: 32px;
          box-shadow: 0 10px 30px rgba(30, 64, 175, 0.05);
          border: 1px solid #e2e8f0;
          margin-bottom: 40px;
        }

        .form-title {
          font-size: 20px;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .premium-textarea {
          width: 100%;
          padding: 18px;
          border: 2px solid #f1f5f9;
          border-radius: 16px;
          font-size: 15px;
          font-family: inherit;
          color: #334155;
          background-color: #f8fafc;
          transition: all 0.3s ease;
          resize: vertical;
          min-height: 120px;
        }

        .premium-textarea:focus {
          outline: none;
          border-color: #3b82f6;
          background-color: white;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
        }

        .submit-btn {
          margin-top: 20px;
          padding: 14px 32px;
          border-radius: 12px;
          background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
          color: white;
          font-weight: 700;
          font-size: 16px;
          border: none;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(30, 64, 175, 0.2);
        }

        .submit-btn:disabled {
          background: #e2e8f0;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

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
          font-size: 12px;
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
          font-size: 14px;
        }

        .status-pill {
          padding: 6px 12px;
          border-radius: 99px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .reply-box {
          background: #f8fafc;
          padding: 8px 12px;
          border-radius: 8px;
          border-left: 3px solid #3b82f6;
          font-style: italic;
          color: #475569;
        }

        @media (max-width: 900px) {
          .premium-table thead { display: none; }
          .premium-table td { display: block; text-align: right; padding: 12px 16px; border-bottom: none; }
          .premium-table td::before { content: attr(data-label); float: left; font-weight: 700; color: #64748b; }
          .premium-table tr { border-bottom: 2px solid #e2e8f0; display: block; padding: 10px 0; }
        }
      `}</style>

      <div className="complaints-container">
        <div className="page-header">
          <h2>💬 Help & Support</h2>
          <div style={{ color: '#64748b', fontWeight: 600 }}>Support ID: {studentId?.slice(-6).toUpperCase()}</div>
        </div>

        {/* SUBMIT COMPLAINT */}
        <div className="complaint-form-card">
          <div className="form-title">📝 Raise a New Ticket</div>
          <form onSubmit={submitComplaint}>
            <textarea
              className="premium-textarea"
              placeholder="Describe your issue or feedback in detail..."
              value={complaintText}
              onChange={(e) => setComplaintText(e.target.value)}
            />
            <button
              type="submit"
              className="submit-btn"
              disabled={submitting}
            >
              {submitting ? "Sending..." : "📤 Submit Complaint"}
            </button>
          </form>
        </div>

        {/* COMPLAINTS HISTORY */}
        <div className="form-title" style={{ paddingLeft: '8px' }}>📂 Ticket History</div>
        <div className="table-container">
          <table className="premium-table">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>#</th>
                <th>Complaint Description</th>
                <th>Current Status</th>
                <th>Official Reply</th>
                <th>Date Filed</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '40px' }}>Retrieving your tickets...</td></tr>
              ) : complaints.length === 0 ? (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>No complaints filed yet.</td></tr>
              ) : (
                complaints.map((c, i) => {
                  const status = getStatusStyles(c.status);
                  return (
                    <tr key={c._id}>
                      <td data-label="#">{i + 1}</td>
                      <td data-label="Complaint" style={{ maxWidth: '300px' }}>
                        <div style={{ fontWeight: 500 }}>{c.complaint}</div>
                      </td>
                      <td data-label="Status">
                        <span className="status-pill" style={{ background: status.bg, color: status.text }}>
                          {status.label}
                        </span>
                      </td>
                      <td data-label="Reply">
                        {c.reply ? (
                          <div className="reply-box">{c.reply}</div>
                        ) : (
                          <span style={{ color: "#94a3b8", fontSize: '12px' }}>Awaiting response...</span>
                        )}
                      </td>
                      <td data-label="Date">
                        {new Date(c.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </StudentLayout>
  );
}
