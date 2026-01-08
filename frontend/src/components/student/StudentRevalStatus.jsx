import React, { useEffect, useState, useMemo } from "react";
import api from "../../../api";
import StudentLayout from "./StudentLayout";
import "./student.css";

export default function StudentRevaluationStatus() {
  const studentId = localStorage.getItem("studentId");
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/revaluation/student/requests/${studentId}`);
      setRequests(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [studentId]);

  const filteredRequests = useMemo(() => {
    return requests.filter(r =>
      r.subjectId?.subjectName?.toLowerCase().includes(search.toLowerCase()) ||
      r.subjectId?.subjectCode?.toLowerCase().includes(search.toLowerCase())
    );
  }, [requests, search]);

  const handlePayment = async (reqId, amount, status) => {
    if (status === "rejected") {
      return alert("Your request was rejected by the university. Please contact registration immediately.");
    }
    if (!window.confirm(`Confirm payment of ₹${amount} for revaluation?`)) return;

    try {
      await api.put(`/revaluation/student/mark-paid/${reqId}`, {
        paymentStatus: "paid"
      });
      alert("Payment Successful");
      load();
    } catch (err) {
      console.error(err);
      alert("Payment failed. Please try again.");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return { bg: '#dcfce7', text: '#166534', label: 'Completed' };
      case 'rejected': return { bg: '#fee2e2', text: '#991b1b', label: 'Rejected' };
      case 'assigned': return { bg: '#eff6ff', text: '#1e40af', label: 'Processing' };
      case 'approved': return { bg: '#fef3c7', text: '#92400e', label: 'Awaiting Assignment' };
      default: return { bg: '#f1f5f9', text: '#475569', label: status };
    }
  };

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
          transition: all 0.3s;
        }

        .filter-bar input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
        }

        .table-container {
          background: white;
          border-radius: 16px;
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
          transition: all 0.2s;
        }

        .premium-table tr:hover {
          background: #f8fafc;
        }

        .premium-table td {
          padding: 18px 16px;
          color: #334155;
          font-size: 15px;
        }

        .subject-info .code { color: #64748b; font-size: 12px; font-weight: 700; }
        .subject-info .name { color: #1e293b; font-weight: 700; display: block; }

        .status-pill {
          padding: 6px 14px;
          border-radius: 99px;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          display: inline-block;
        }

        .btn-pay {
          padding: 8px 16px;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 700;
          font-size: 13px;
          cursor: pointer;
          transition: transform 0.2s;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
        }

        .btn-pay:hover { transform: translateY(-2px); }

        .paid-badge {
          color: #10b981;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .fee-tag {
          font-family: 'Inter', sans-serif;
          font-weight: 800;
          color: #1e293b;
        }

        .date-text { font-size: 13px; color: #64748b; }

        @media (max-width: 1024px) {
           .premium-table thead { display: none; }
           .premium-table td { display: block; text-align: right; padding: 12px 16px; border-bottom: none; }
           .premium-table td::before { content: attr(data-label); float: left; font-weight: 700; color: #64748b; }
           .premium-table tr { border-bottom: 2px solid #e2e8f0; padding: 8px 0; display: block; }
        }
      `}</style>

      <div className="reval-header">
        <h2>🔄 Revaluation Status</h2>
        <div style={{ color: '#64748b', fontWeight: 600 }}>
          {filteredRequests.length} Applications Found
        </div>
      </div>

      <div className="filter-bar">
        <input
          type="text"
          placeholder="Filter by subject name or code..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="table-container">
        <table className="premium-table">
          <thead>
            <tr>
              <th style={{ width: "60px" }}>#</th>
              <th>Subject Details</th>
              <th>Submitted On</th>
              <th>Fee Amount</th>
              <th>Application Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: "48px", color: "#64748b" }}>
                  Retrieving your applications...
                </td>
              </tr>
            ) : filteredRequests.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: "48px", color: "#94a3b8" }}>
                  {search ? "No matching revaluation requests found." : "You haven't submitted any revaluation requests."}
                </td>
              </tr>
            ) : (
              filteredRequests.map((r, i) => {
                const status = getStatusColor(r.status);
                return (
                  <tr key={r._id}>
                    <td data-label="#">{i + 1}</td>
                    <td data-label="Subject">
                      <div className="subject-info">
                        <span className="name">{r.subjectId?.subjectName}</span>
                        <span className="code">{r.subjectId?.subjectCode}</span>
                      </div>
                    </td>
                    <td data-label="Submitted On">
                      <div className="date-text">{new Date(r.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                      <div style={{ fontSize: '11px', color: '#94a3b8' }}>{new Date(r.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</div>
                    </td>
                    <td data-label="Fee Amount">
                      <div className="fee-tag">₹{r.feeAmount}</div>
                      <div style={{ fontSize: '11px', color: r.paymentStatus === 'paid' ? '#10b981' : '#f59e0b', fontWeight: 700 }}>
                        {r.paymentStatus.toUpperCase()}
                      </div>
                    </td>
                    <td data-label="Status">
                      <span className="status-pill" style={{ backgroundColor: status.bg, color: status.text }}>
                        {status.label}
                      </span>
                    </td>
                    <td data-label="Action">
                      {r.paymentStatus === "pending" ? (
                        <button
                          className="btn-pay"
                          onClick={() => handlePayment(r._id, r.feeAmount, r.status)}
                        >
                          💸 Pay Fee
                        </button>
                      ) : (
                        <span className="paid-badge">
                          <span>✅</span> Paid
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </StudentLayout>
  );
}
