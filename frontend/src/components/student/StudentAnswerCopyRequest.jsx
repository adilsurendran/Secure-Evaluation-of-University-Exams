import React, { useEffect, useMemo, useState } from "react";
import api from "../../../api";
import StudentLayout from "./StudentLayout";
import "./student.css";

function StudentAnswerCopyRequest() {
  const studentId = localStorage.getItem("studentId");

  const [sheets, setSheets] = useState([]);
  const [myRequests, setMyRequests] = useState([]);

  const [selectedSessionId, setSelectedSessionId] = useState("");
  const [selectedExamId, setSelectedExamId] = useState("");

  const [loading, setLoading] = useState(true);
  const [loadingRequests, setLoadingRequests] = useState(true);

  /* ===========================
     LOAD OPTIONS + MY REQUESTS
  ============================ */
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const res = await api.get(
          `/student/answer-copy/options/${studentId}`
        );
        setSheets(res.data || []);
      } catch (err) {
        console.log(err);
        alert("Failed to load answer sheet options");
      } finally {
        setLoading(false);
      }
    };

    const fetchMyRequests = async () => {
      try {
        const res = await api.get(
          `/student/answer-copy/my-requests/${studentId}`
        );
        setMyRequests(res.data || []);
      } catch (err) {
        console.log(err);
      } finally {
        setLoadingRequests(false);
      }
    };

    fetchOptions();
    fetchMyRequests();
  }, [studentId]);

  /* ===========================
     DERIVED SESSION OPTIONS
  ============================ */
  const sessionOptions = useMemo(() => {
    const map = new Map();
    sheets.forEach((s) => {
      if (s.sessionId) {
        map.set(s.sessionId._id, s.sessionId);
      }
    });
    return Array.from(map.values());
  }, [sheets]);

  const examOptions = useMemo(() => {
    if (!selectedSessionId) return [];
    return sheets
      .filter((s) => s.sessionId?._id === selectedSessionId)
      .map((s) => ({
        examId: s.examId?._id,
        subjectName: s.subjectId?.subjectName,
        subjectCode: s.subjectId?.subjectCode,
        examDate: s.examId?.examDate,
      }))
      .filter(
        (item, index, self) =>
          index === self.findIndex((x) => x.examId === item.examId)
      );
  }, [sheets, selectedSessionId]);

  /* ===========================
     SUBMIT REQUEST
  ============================ */
  const handleSubmitRequest = async (e) => {
    e.preventDefault();

    if (!selectedSessionId || !selectedExamId) {
      return alert("Please select session and exam");
    }

    try {
      const res = await api.post("/student/answer-copy/request", {
        studentId,
        sessionId: selectedSessionId,
        examId: selectedExamId,
      });

      alert(res.data?.msg || "Request submitted");

      const r2 = await api.get(
        `/student/answer-copy/my-requests/${studentId}`
      );
      setMyRequests(r2.data || []);
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.msg || "Failed to submit request");
    }
  };

  /* ===========================
     PAY NOW
  ============================ */
  const handlePayNow = async (requestId) => {
    const ok = window.confirm("Pay ₹50 now?");
    if (!ok) return;

    try {
      const res = await api.put(
        `/student/answer-copy/pay/${requestId}`
      );

      alert(res.data?.msg || "Payment successful");

      const r2 = await api.get(
        `/student/answer-copy/my-requests/${studentId}`
      );
      setMyRequests(r2.data || []);
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.msg || "Payment failed");
    }
  };

  /* ===========================
     VIEW PDF
  ============================ */
  const viewApprovedPdf = async (requestId) => {
    try {
      const res = await api.get(
        `/student/answer-copy/pdf/${requestId}`
      );

      if (res.data?.url) {
        window.open(res.data.url, "_blank");
      } else {
        alert("Unable to load PDF");
      }
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.msg || "Failed to open PDF");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return { bg: '#dcfce7', text: '#166534', label: 'Approved' };
      case 'rejected': return { bg: '#fee2e2', text: '#991b1b', label: 'Rejected' };
      case 'pending': return { bg: '#fef3c7', text: '#92400e', label: 'Pending Review' };
      default: return { bg: '#f1f5f9', text: '#475569', label: status };
    }
  };

  return (
    <StudentLayout>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        .copy-request-container {
          max-width: 1100px;
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

        .premium-card {
          background: white;
          border-radius: 24px;
          padding: 32px;
          box-shadow: 0 10px 30px rgba(30, 64, 175, 0.05);
          border: 1px solid #e2e8f0;
          margin-bottom: 40px;
        }

        .card-title {
          font-size: 20px;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr auto;
          gap: 20px;
          align-items: flex-end;
        }

        .form-group label {
          display: block;
          font-size: 13px;
          font-weight: 700;
          color: #64748b;
          margin-bottom: 8px;
          text-transform: uppercase;
        }

        .premium-select {
          width: 100%;
          padding: 14px 18px;
          border: 1.5px solid #e2e8f0;
          border-radius: 12px;
          font-size: 14px;
          background: #f8fafc;
          transition: all 0.3s;
          cursor: pointer;
        }

        .premium-select:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
          outline: none;
        }

        .btn-submit {
          padding: 14px 28px;
          border-radius: 12px;
          background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
          color: white;
          font-weight: 700;
          border: none;
          cursor: pointer;
          transition: all 0.3s;
          white-space: nowrap;
        }

        .btn-submit:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(30, 64, 175, 0.2);
        }

        /* TABLE STYLING */
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

        .premium-table tr { border-bottom: 1px solid #f1f5f9; transition: background 0.2s; }
        .premium-table tr:hover { background: #f8fafc; }
        .premium-table td { padding: 18px 16px; color: #334155; font-size: 14px; }

        .status-pill {
          padding: 6px 12px;
          border-radius: 99px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
        }

        .action-btns { display: flex; gap: 10px; }

        .btn-action-pay {
          background: #ecfdf5;
          color: #059669;
          border: 1px solid #6ee7b7;
          padding: 6px 14px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-action-pay:hover { background: #d1fae5; }

        .btn-action-view {
          background: #eff6ff;
          color: #2563eb;
          border: 1px solid #bfdbfe;
          padding: 6px 14px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-action-view:hover { background: #dbeafe; }

        .meta-text { font-size: 12px; color: #64748b; margin-top: 4px; }

        @media (max-width: 900px) {
          .form-grid { grid-template-columns: 1fr; }
          .premium-table thead { display: none; }
          .premium-table td { display: block; text-align: right; padding: 12px 16px; border-bottom: none; }
          .premium-table td::before { content: attr(data-label); float: left; font-weight: 700; color: #64748b; }
          .premium-table tr { border-bottom: 2px solid #e2e8f0; display: block; padding: 10px 0; }
        }
      `}</style>

      <div className="copy-request-container">
        <div className="page-header">
          <h2>📄 Answer Copy Portal</h2>
        </div>

        {/* NEW REQUEST SECTION */}
        <div className="premium-card">
          <div className="card-title">✨ Create New Request</div>

          {loading ? (
            <div style={{ color: '#64748b', fontSize: '14px' }}>Scanning for completed exams...</div>
          ) : sessionOptions.length === 0 ? (
            <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', color: '#64748b', textAlign: 'center' }}>
              No completed exams available for copy requests at this moment.
            </div>
          ) : (
            <form onSubmit={handleSubmitRequest} className="form-grid">
              <div className="form-group">
                <label>Academic Session</label>
                <select
                  className="premium-select"
                  value={selectedSessionId}
                  onChange={(e) => {
                    setSelectedSessionId(e.target.value);
                    setSelectedExamId("");
                  }}
                >
                  <option value="">Select Exam Session...</option>
                  {sessionOptions.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name} - {s.academicYear} (Sem {s.semester})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Target Subject</label>
                <select
                  className="premium-select"
                  value={selectedExamId}
                  onChange={(e) => setSelectedExamId(e.target.value)}
                  disabled={!selectedSessionId}
                >
                  <option value="">
                    {selectedSessionId
                      ? "Choose Subject..."
                      : "Choose session first"}
                  </option>
                  {examOptions.map((e) => (
                    <option key={e.examId} value={e.examId}>
                      {e.subjectName} ({e.subjectCode})
                    </option>
                  ))}
                </select>
              </div>

              <button type="submit" className="btn-submit">
                Submit Request
              </button>
            </form>
          )}
        </div>

        {/* TRACKING SECTION */}
        <div className="card-title" style={{ paddingLeft: '8px' }}>📋 Request History & Tracking</div>

        <div className="table-container">
          <table className="premium-table">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>#</th>
                <th>Academic Progress</th>
                <th>Subject Details</th>
                <th>Processing Status</th>
                <th>Billing</th>
                <th>Available Actions</th>
              </tr>
            </thead>
            <tbody>
              {loadingRequests ? (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>Retrieving history...</td></tr>
              ) : myRequests.length === 0 ? (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>No requests submitted yet.</td></tr>
              ) : (
                myRequests.map((r, i) => {
                  const statusInfo = getStatusColor(r.status);
                  return (
                    <tr key={r._id}>
                      <td data-label="#">{i + 1}</td>
                      <td data-label="Session">
                        <div style={{ fontWeight: 700, color: '#1e293b' }}>{r.sessionId?.name}</div>
                        <div className="meta-text">{r.sessionId?.academicYear} (Sem {r.sessionId?.semester})</div>
                      </td>
                      <td data-label="Subject">
                        <div style={{ fontWeight: 600 }}>{r.subjectId?.subjectName}</div>
                        <div className="meta-text">{r.subjectId?.subjectCode}</div>
                      </td>
                      <td data-label="Status">
                        <span className="status-pill" style={{ backgroundColor: statusInfo.bg, color: statusInfo.text }}>
                          {statusInfo.label}
                        </span>
                      </td>
                      <td data-label="Billing">
                        {r.paymentStatus === "completed" ? (
                          <span style={{ color: '#10b981', fontWeight: 800, fontSize: '11px' }}>✅ PAID</span>
                        ) : (
                          <span style={{ color: '#f59e0b', fontWeight: 800, fontSize: '11px' }}>⏳ PENDING</span>
                        )}
                      </td>
                      <td data-label="Action">
                        <div className="action-btns">
                          {r.paymentStatus === "pending" && r.status !== "rejected" && (
                            <button className="btn-action-pay" onClick={() => handlePayNow(r._id)}>
                              💸 Pay ₹50
                            </button>
                          )}

                          {r.paymentStatus === "completed" && (
                            <button className="btn-action-view" onClick={() => viewApprovedPdf(r._id)}>
                              👁️ View PDF
                            </button>
                          )}

                          {r.status === "rejected" && (
                            <span style={{ color: '#be123c', fontSize: '12px', fontWeight: 600 }}>
                              {r.adminNote || "Rejected by Admin"}
                            </span>
                          )}

                          {r.status === "pending" && r.paymentStatus === "completed" && (
                            <span style={{ color: '#64748b', fontSize: '12px', fontStyle: 'italic' }}>Awaiting Approval</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </StudentLayout>
  );
}

export default StudentAnswerCopyRequest;
