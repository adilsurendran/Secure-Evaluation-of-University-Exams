import React, { useState, useEffect } from "react";
import api from "../../../api";

const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];

function Notification() {
  const [message, setMessage] = useState("");
  const [semester, setSemester] = useState([]);
  const [target, setTarget] = useState("");
  const [notification, setNotification] = useState([]);

  useEffect(() => {
    getNotifications();
  }, []);

  const toggleSemester = (sem) => {
    setSemester((prev) =>
      prev.includes(sem)
        ? prev.filter((s) => s !== sem)
        : [...prev, sem]
    );
  };

  const sendNotification = async () => {
    // Semester is required ONLY for students
    const isStudent = target === "student";
    const isSemesterEmpty = semester.length === 0;

    if (!message || !target || (isStudent && isSemesterEmpty)) {
      alert(isStudent ? "Select target semester(s) and enter message" : "Select audience and enter message");
      return;
    }

    try {
      const res = await api.post("/university/sendntification", {
        message,
        semester: target === "student" ? semester : [1, 2, 3, 4, 5, 6, 7, 8],
        target,
      });

      alert(res.data.message || "Notification sent");
      setMessage("");
      setSemester([]);
      setTarget("");
      getNotifications();
    } catch (e) {
      console.log(e);
      alert("Failed to send notification");
    }
  };

  const getNotifications = async () => {
    try {
      const res = await api.get("/university/getnotification");
      setNotification(res.data.notifications || []);
    } catch (e) {
      console.log(e);
    }
  };

  const deleteNotification = async (id) => {
    if (!window.confirm("Delete this notification?")) return;

    try {
      const res = await api.delete(`/university/delete/${id}`);
      alert(res.data.message || "Deleted");
      getNotifications();
    } catch (e) {
      console.log(e);
    }
  };

  const formatDateTime = (dateString) =>
    new Date(dateString).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

        .notification-page {
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

        .notification-page {
          padding: 24px 32px;
          min-height: 100vh;
          width: 100%;
          overflow-x: hidden;
        }

        .notification-grid {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 32px;
          width: 100%;
          align-items: stretch;
          height: calc(100vh - 180px);
          min-height: 600px;
        }

        .notification-card {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          border-radius: 24px;
          padding: 32px;
          box-shadow: 0 8px 32px rgba(30, 64, 175, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.8);
          animation: fadeIn 0.8s ease;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .notification-card h4 {
          font-size: 24px;
          font-weight: 800;
          color: #1e3a8a;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .notification-card h4 .icon {
          background: linear-gradient(135deg, #3b82f6, #1e40af);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .form-group {
          margin-bottom: 24px;
        }

        .form-label {
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 12px;
          display: block;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .custom-radio-group {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }

        .custom-radio {
          flex: 1;
          min-width: 120px;
        }

        .custom-radio input {
          display: none;
        }

        .radio-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 16px;
          background: #f8fafc;
          border: 2px solid #e2e8f0;
          border-radius: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: center;
          font-weight: 600;
          color: #64748b;
        }

        .custom-radio input:checked + .radio-box {
          background: #eff6ff;
          border-color: #3b82f6;
          color: #1e40af;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
          transform: translateY(-2px);
        }

        .semester-chips {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }

        .semester-chip {
          display: none;
        }

        .chip-label {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 10px;
          background: #f8fafc;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          color: #64748b;
          transition: all 0.3s ease;
        }

        .semester-chip:checked + .chip-label {
          background: linear-gradient(135deg, #3b82f6, #1e40af);
          border-color: transparent;
          color: white;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
        }

        textarea {
          width: 100%;
          padding: 16px;
          border: 2px solid #e2e8f0;
          border-radius: 16px;
          font-size: 15px;
          font-family: 'Inter', sans-serif;
          background: #f8fafc;
          transition: all 0.3s ease;
          resize: none;
          min-height: 120px;
        }

        textarea:focus {
          outline: none;
          border-color: #3b82f6;
          background: white;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
        }

        .send-btn {
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
          color: white;
          border: none;
          border-radius: 16px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          box-shadow: 0 8px 16px rgba(30, 64, 175, 0.2);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .send-btn:hover {
          transform: translateY(-4px) scale(1.02);
          box-shadow: 0 12px 24px rgba(30, 64, 175, 0.3);
        }

        .send-btn:active {
          transform: scale(0.98);
        }

        .recent-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
          padding: 4px 12px 4px 4px;
          margin: 0 -12px 0 0;
        }

        .recent-list::-webkit-scrollbar {
          width: 6px;
        }

        .recent-list::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }

        .recent-list::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }

        .recent-item {
          background: white;
          border-radius: 20px;
          padding: 24px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          flex-shrink: 0;
        }

        .recent-item:hover {
          transform: translateX(8px);
          border-color: #3b82f6;
          box-shadow: 0 8px 24px rgba(59, 130, 246, 0.1);
        }

        .recent-item::after {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          height: 100%;
          width: 4px;
          background: linear-gradient(to bottom, #3b82f6, #1e40af);
        }

        .item-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;
        }

        .item-main {
          margin-bottom: 16px;
        }

        .item-message {
          font-size: 16px;
          font-weight: 600;
          color: #1e293b;
          line-height: 1.5;
        }

        .item-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .time-box {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #94a3b8;
          font-size: 12px;
          font-weight: 500;
        }

        .badge-group {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .premium-badge {
          padding: 6px 14px;
          border-radius: 100px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .badge-target {
          background: #eff6ff;
          color: #1e40af;
        }

        .badge-sem {
          background: #f1f5f9;
          color: #64748b;
        }

        .delete-icon-btn {
          background: #fef2f2;
          color: #ef4444;
          width: 32px;
          height: 32px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .delete-icon-btn:hover {
          background: #ef4444;
          color: white;
          transform: rotate(90deg);
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }

        .empty-icon {
          font-size: 48px;
          margin-bottom: 16px;
          opacity: 0.5;
        }

        @media (max-width: 1024px) {
          .notification-grid {
            grid-template-columns: 1fr;
            height: auto;
            min-height: auto;
          }
          .notification-card {
            height: auto;
            max-height: 800px;
          }
        }

        @media (max-width: 768px) {
          .semester-chips {
            grid-template-columns: repeat(2, 1fr);
          }
          .notification-page {
            padding: 24px;
          }
        }
      `}</style>

      <div className="notification-page">
        <div className="premium-header">
          <h2>📢 Management Notifications</h2>
          <p>Broadcast information to colleges and students instantly</p>
        </div>

        <div className="notification-grid">
          {/* LEFT SIDE: SEND FORM */}
          <div className="notification-card">
            <h4>
              <span className="icon">✉️</span>
              Create Broadcast
            </h4>

            <div className="form-group">
              <label className="form-label">Broadcast Audience</label>
              <div className="custom-radio-group">
                <label className="custom-radio">
                  <input
                    type="radio"
                    name="target"
                    value="college"
                    checked={target === "college"}
                    onChange={(e) => setTarget(e.target.value)}
                  />
                  <div className="radio-box">🏛️ Colleges</div>
                </label>

                <label className="custom-radio">
                  <input
                    type="radio"
                    name="target"
                    value="student"
                    checked={target === "student"}
                    onChange={(e) => setTarget(e.target.value)}
                  />
                  <div className="radio-box">🎓 Students</div>
                </label>

                <label className="custom-radio">
                  <input
                    type="radio"
                    name="target"
                    value="staff"
                    checked={target === "staff"}
                    onChange={(e) => setTarget(e.target.value)}
                  />
                  <div className="radio-box">👨‍🏫 Staff</div>
                </label>

                <label className="custom-radio">
                  <input
                    type="radio"
                    name="target"
                    value="both"
                    checked={target === "both"}
                    onChange={(e) => setTarget(e.target.value)}
                  />
                  <div className="radio-box">👥 All</div>
                </label>
              </div>
            </div>

            {target === "student" && (
              <div className="form-group" style={{ animation: 'fadeIn 0.5s ease' }}>
                <label className="form-label">Target Semesters</label>
                <div className="semester-chips">
                  {SEMESTERS.map((s) => (
                    <div key={s}>
                      <input
                        type="checkbox"
                        id={`sem-${s}`}
                        className="semester-chip"
                        checked={semester.includes(s)}
                        onChange={() => toggleSemester(s)}
                      />
                      <label htmlFor={`sem-${s}`} className="chip-label">
                        Sem {s}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Message Content</label>
              <textarea
                rows={4}
                placeholder="Write your announcement here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            <button className="send-btn" onClick={sendNotification}>
              🚀 Launch Broadcast
            </button>
          </div>

          {/* RIGHT SIDE: RECENT LIST */}
          <div className="notification-card">
            <h4>
              <span className="icon">📨</span>
              Broadcast History
            </h4>

            <div className="recent-list">
              {notification.length === 0 ? (
                <div className="no-data">
                  <div className="empty-icon">📭</div>
                  <p>No broadcast history available</p>
                </div>
              ) : (
                notification.map((n) => (
                  <div key={n._id} className="recent-item">
                    <div className="item-header">
                      <div className="badge-group">
                        <span className="premium-badge badge-target">
                          {n.target === 'both' ? '👥 All' : n.target === 'college' ? '🏛️ College' : n.target === 'staff' ? '👨‍🏫 Staff' : '🎓 Student'}
                        </span>
                        {n.target === "student" ? (
                          n.semester.map((s) => (
                            <span key={s} className="premium-badge badge-sem">
                              S{s}
                            </span>
                          ))
                        ) : (
                          <span className="premium-badge badge-sem">All Semesters</span>
                        )}
                      </div>
                      <button
                        className="delete-icon-btn"
                        onClick={() => deleteNotification(n._id)}
                        title="Delete Broadcast"
                      >
                        🗑️
                      </button>
                    </div>

                    <div className="item-main">
                      <div className="item-message">{n.message}</div>
                    </div>

                    <div className="item-footer">
                      <div className="time-box">
                        📅 {formatDateTime(n.createdAt)}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Notification;
