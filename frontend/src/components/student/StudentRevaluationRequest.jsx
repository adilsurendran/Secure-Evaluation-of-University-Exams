import React, { useEffect, useState } from "react";
import api from "../../../api";
import StudentLayout from "./StudentLayout";
import "./student.css";

export default function StudentRevaluationRequest() {
  const studentId = localStorage.getItem("studentId");

  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState("");

  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState("");

  const [evaluatedSheets, setEvaluatedSheets] = useState([]);
  const [selectedSheet, setSelectedSheet] = useState("");

  const [fee, setFee] = useState(100);
  const [loading, setLoading] = useState(false);

  // 🔒 NEW STATES
  const [allowed, setAllowed] = useState(false);
  const [checking, setChecking] = useState(false);
  const [blockMessage, setBlockMessage] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/exam-sessions/all");
        setSessions(res.data);
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  useEffect(() => {
    if (!selectedSession) {
      setExams([]);
      setSelectedExam("");
      return;
    }

    (async () => {
      try {
        const res = await api.get(`/exams/session/${selectedSession}`);
        setExams(res.data);
      } catch (err) {
        console.log(err);
      }
    })();
  }, [selectedSession]);

  useEffect(() => {
    if (!selectedExam) {
      setEvaluatedSheets([]);
      setSelectedSheet("");
      return;
    }

    (async () => {
      try {
        const res = await api.get(`/student/evaluated-sheets/${studentId}/${selectedExam}`);
        setEvaluatedSheets(res.data);
      } catch (err) {
        console.log(err);
      }
    })();
  }, [selectedExam, studentId]);

  useEffect(() => {
    if (!selectedSheet || !selectedSession) {
      setAllowed(false);
      setBlockMessage("");
      return;
    }

    (async () => {
      try {
        setChecking(true);
        const res = await api.get(`/revaluation/check/${studentId}/${selectedSession}/${selectedSheet}`);
        setAllowed(res.data.allowed);
        setBlockMessage(res.data.message || "");
      } catch (err) {
        setAllowed(false);
        setBlockMessage("Unable to verify revaluation status");
      } finally {
        setChecking(false);
      }
    })();
  }, [selectedSheet, selectedSession, studentId]);

  const submit = async (e) => {
    e.preventDefault();

    if (!selectedSheet) return alert("Select evaluated sheet to request revaluation");
    if (!allowed) return alert("Revaluation already requested or not allowed for this subject");

    try {
      setLoading(true);
      const payload = {
        answerSheetId: selectedSheet,
        feeAmount: fee,
        studentId
      };
      await api.post("/revaluation/student/create", payload);
      alert("Revaluation request submitted successfully. Please proceed to pay from the status page.");

      setSelectedSession("");
      setSelectedExam("");
      setSelectedSheet("");
      setAllowed(false);
      setBlockMessage("");
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.msg || "Failed to create request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <StudentLayout>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        .reval-container {
          max-width: 800px;
          margin: 0 auto;
          font-family: 'Inter', sans-serif;
        }

        .reval-header {
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

        .reval-header p {
          color: #64748b;
          font-weight: 500;
          margin-top: 8px;
        }

        .premium-form-card {
          background: white;
          border-radius: 24px;
          padding: 40px;
          box-shadow: 0 10px 30px rgba(30, 64, 175, 0.05);
          border: 1px solid #e2e8f0;
        }

        .form-group {
          margin-bottom: 28px;
        }

        .form-group label {
          display: block;
          font-size: 14px;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 10px;
          text-transform: uppercase;
          letter-spacing: 0.025em;
        }

        .premium-select, .premium-input {
          width: 100%;
          padding: 14px 18px;
          border: 2px solid #f1f5f9;
          border-radius: 12px;
          font-size: 15px;
          font-family: inherit;
          color: #334155;
          background-color: #f8fafc;
          transition: all 0.3s ease;
          appearance: none;
        }

        .premium-select:focus, .premium-input:focus {
          outline: none;
          border-color: #3b82f6;
          background-color: white;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
        }

        .premium-select:disabled {
          background-color: #f1f5f9;
          cursor: not-allowed;
          opacity: 0.7;
        }

        .custom-select-wrapper {
          position: relative;
        }

        .custom-select-wrapper::after {
          content: '▼';
          position: absolute;
          right: 18px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 12px;
          color: #94a3b8;
          pointer-events: none;
        }

        .status-alert {
          padding: 16px 20px;
          border-radius: 12px;
          margin-bottom: 28px;
          font-size: 14px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .status-checking { background: #f0f9ff; color: #0369a1; border: 1px solid #bae6fd; }
        .status-blocked { background: #ecfdf5; color: #047857; border: 1px solid #6ee7b7; }
        .status-error { background: #fff1f2; color: #be123c; border: 1px solid #fecdd3; }

        .fee-display {
           background: #eff6ff;
           padding: 24px;
           border-radius: 16px;
           margin-top: 32px;
           border: 1px solid #dbeafe;
           display: flex;
           justify-content: space-between;
           align-items: center;
        }

        .fee-label {
          color: #1e40af;
          font-weight: 700;
          font-size: 16px;
        }

        .fee-amount {
          font-size: 24px;
          font-weight: 800;
          color: #1e40af;
        }

        .submit-btn {
          width: 100%;
          padding: 16px;
          margin-top: 32px;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 10px;
        }

        .btn-active {
          background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
          color: white;
          box-shadow: 0 8px 20px rgba(30, 64, 175, 0.2);
        }

        .btn-active:hover { transform: translateY(-2px); box-shadow: 0 12px 24px rgba(30, 64, 175, 0.3); }

        .btn-disabled {
          background: #e2e8f0;
          color: #94a3b8;
          cursor: not-allowed;
        }

        @media (max-width: 600px) {
          .premium-form-card { padding: 24px; }
        }
      `}</style>

      <div className="reval-container">
        <div className="reval-header">
          <h2>🔄 Revaluation Request</h2>
          <p>Apply for a re-evaluation of your answer scripts by following the steps below.</p>
        </div>

        <div className="premium-form-card">
          <form onSubmit={submit}>
            <div className="form-group">
              <label>Step 1: Exam Session</label>
              <div className="custom-select-wrapper">
                <select
                  className="premium-select"
                  value={selectedSession}
                  onChange={(e) => setSelectedSession(e.target.value)}
                >
                  <option value="">Choose Session...</option>
                  {sessions.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name} - {s.academicYear} (Sem {s.semester})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Step 2: Subject Exam</label>
              <div className="custom-select-wrapper">
                <select
                  className="premium-select"
                  value={selectedExam}
                  onChange={(e) => setSelectedExam(e.target.value)}
                  disabled={!selectedSession}
                >
                  <option value="">Choose Subject...</option>
                  {exams.map((ex) => (
                    <option key={ex._id} value={ex._id}>
                      {ex.subjectId?.subjectName} ({ex.subjectId?.subjectCode})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Step 3: Answer Script</label>
              <div className="custom-select-wrapper">
                <select
                  className="premium-select"
                  value={selectedSheet}
                  onChange={(e) => setSelectedSheet(e.target.value)}
                  disabled={!selectedExam}
                >
                  <option value="">Select Evaluated Paper...</option>
                  {evaluatedSheets.map((sh) => (
                    <option key={sh._id} value={sh._id}>
                      {sh.subjectId?.subjectName} — Scored: {sh.marks} Marks
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* STATUS FEEDBACK */}
            {checking && (
              <div className="status-alert status-checking">
                <span>🔍</span> Verifying application eligibility...
              </div>
            )}

            {!checking && blockMessage && !allowed && (
              <div className="status-alert status-blocked">
                <span>✅</span> {blockMessage}
              </div>
            )}

            <div className="form-group">
              <label>Fee Amount (₹)</label>
              <input
                className="premium-input"
                type="number"
                value={fee}
                onChange={(e) => setFee(e.target.value)}
                readOnly
              />
            </div>

            <div className="fee-display">
              <span className="fee-label">Total Application Fee</span>
              <span className="fee-amount">₹{fee}</span>
            </div>

            <button
              type="submit"
              className={`submit-btn ${loading || checking || !allowed ? 'btn-disabled' : 'btn-active'}`}
              disabled={loading || checking || !allowed}
            >
              {loading ? (
                "Submitting Request..."
              ) : checking ? (
                "Verifying..."
              ) : allowed ? (
                <><span>📤</span> Request Revaluation</>
              ) : (
                "Already Applied / Not Allowed"
              )}
            </button>
          </form>
        </div>
      </div>
    </StudentLayout>
  );
}
