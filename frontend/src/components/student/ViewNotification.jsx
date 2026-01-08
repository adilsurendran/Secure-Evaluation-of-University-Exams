import React, { useEffect, useState } from "react";
import api from "../../../api";
import StudentLayout from "./StudentLayout";
import "./student.css";

function ViewNotifications() {
  const studentId = localStorage.getItem("studentId");
  const [notification, setNotification] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNotification();
  }, []);

  const getNotification = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/university/getnotifications/${studentId}`);
      setNotification(res.data.notifications || []);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      time: date.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    };
  };

  return (
    <StudentLayout>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        .notifications-container {
          max-width: 900px;
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

        .notification-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .notification-card {
          background: white;
          border-radius: 20px;
          padding: 24px;
          display: flex;
          align-items: flex-start;
          gap: 20px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .notification-card:hover {
          transform: translateX(8px);
          box-shadow: 0 8px 24px rgba(30, 64, 175, 0.08);
          border-color: #3b82f6;
        }

        .notification-card::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 6px;
          background: linear-gradient(to bottom, #1e40af, #3b82f6);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .notification-card:hover::before {
          opacity: 1;
        }

        .notif-icon {
          width: 48px;
          height: 48px;
          background: #eff6ff;
          color: #2563eb;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          flex-shrink: 0;
        }

        .notif-content {
          flex: 1;
        }

        .notif-message {
          font-size: 16px;
          font-weight: 600;
          color: #1e293b;
          line-height: 1.5;
          margin-bottom: 8px;
        }

        .notif-meta {
          display: flex;
          align-items: center;
          gap: 16px;
          color: #94a3b8;
          font-size: 13px;
          font-weight: 500;
        }

        .notif-meta-item {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .empty-state {
          text-align: center;
          padding: 60px;
          background: white;
          border-radius: 24px;
          border: 2px dashed #cbd5e1;
          color: #64748b;
        }

        .loading-shimmer {
          height: 100px;
          background: linear-gradient(90deg, #f1f5f9 25%, #f8fafc 50%, #f1f5f9 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 16px;
        }

        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

      <div className="notifications-container">
        <div className="page-header">
          <h2>📢 Notifications</h2>
          <div className="count-badge" style={{ background: '#eff6ff', color: '#1e40af', padding: '8px 16px', borderRadius: '99px', fontWeight: 700, fontSize: '14px', border: '1px solid #dbeafe' }}>
            {notification.length} Updates
          </div>
        </div>

        {loading ? (
          <div className="notification-list">
            {[1, 2, 3].map(i => <div key={i} className="loading-shimmer"></div>)}
          </div>
        ) : notification.length === 0 ? (
          <div className="empty-state">
            <h3>No new announcements</h3>
            <p>You're all caught up! Important updates from the university will appear here.</p>
          </div>
        ) : (
          <div className="notification-list">
            {notification
              .filter(n => n.target === "student" || n.target === "both")
              .map((n) => {
                const dt = formatDateTime(n.createdAt);
                return (
                  <div key={n._id} className="notification-card">
                    <div className="notif-icon">🔔</div>
                    <div className="notif-content">
                      <div className="notif-message">{n.message}</div>
                      <div className="notif-meta">
                        <div className="notif-meta-item">
                          <span>📅</span> {dt.date}
                        </div>
                        <div className="notif-meta-item">
                          <span>🕒</span> {dt.time}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </StudentLayout>
  );
}

export default ViewNotifications;
