import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api";

function ViewNotification() {
  const navigate = useNavigate();
  const [notification, setNotification] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNotification();
  }, []);

  // ---------------- GET NOTIFICATIONS ----------------
  const getNotification = async () => {
    try {
      setLoading(true);
      const res = await api.get("/university/getnotification");
      setNotification(res.data.notifications || []);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- DATE FORMAT ----------------
  const formatDateTime = (dateString) =>
    new Date(dateString).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

  const collegeNotifications = notification.filter(
    (n) => n.target === "college" || n.target === "both"
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        .college-page {
          padding: 32px;
          min-height: 100vh;
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 25%, #bfdbfe 50%, #e0f2fe 75%, #f0f9ff 100%);
          font-family: 'Inter', sans-serif;
        }

        .back-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: white;
          color: #1e40af;
          border: 2px solid #e0f2fe;
          border-radius: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-bottom: 24px;
          width: fit-content;
          box-shadow: 0 2px 8px rgba(30, 64, 175, 0.05);
        }

        .back-btn:hover {
          background: #f0f9ff;
          border-color: #3b82f6;
          transform: translateX(-4px);
        }

        .college-header {
          margin-bottom: 32px;
          padding-bottom: 24px;
          border-bottom: 2px solid #cce3f1;
        }

        .college-header h2 {
          font-size: 32px;
          font-weight: 800;
          background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0 0 8px 0;
        }

        .college-header p {
          color: #64748b;
          font-size: 16px;
          margin: 0;
        }

        .notification-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
          max-width: 900px;
          margin: 0 auto;
        }

        .notification-card {
          background: white;
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
          border: 1.5px solid #e2e8f0;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .notification-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 25px rgba(30, 64, 175, 0.08);
          border-color: #bfdbfe;
        }

        .notification-card::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          height: 100%;
          width: 4px;
          background: #3b82f6;
        }

        .notification-content {
          flex: 1;
        }

        .notification-message {
          font-size: 17px;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 8px;
          line-height: 1.5;
        }

        .notification-meta {
          display: flex;
          align-items: center;
          gap: 16px;
          color: #64748b;
          font-size: 14px;
        }

        .notification-date {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .badges-area {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 8px;
        }

        .badge-premium {
          padding: 6px 14px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.8px;
        }

        .badge-target {
          background: #eff6ff;
          color: #2563eb;
          border: 1px solid #dbeafe;
        }

        .badge-semester {
          background: #f0f9ff;
          color: #0369a1;
          border: 1px solid #e0f2fe;
        }

        .loading-state {
          text-align: center;
          padding: 60px;
        }

        .empty-state {
          text-align: center;
          padding: 80px;
          background: white;
          border-radius: 24px;
          border: 2px dashed #cbd5e1;
        }

        .empty-state h3 { color: #475569; margin-bottom: 8px; }
        .empty-state p { color: #94a3b8; }

        @media (max-width: 768px) {
          .college-page { padding: 16px; }
          .notification-card { flex-direction: column; gap: 16px; }
          .badges-area { flex-direction: row; align-items: center; }
        }
      `}</style>

      <div className="college-page">
        {/* <button className="back-btn" onClick={() => navigate("/college/dashboard")}>
          ← Back to Dashboard
        </button> */}

        <div className="college-header">
          <h2>🔔 Recent Notifications</h2>
          <p>Official announcements and updates from the University Panel.</p>
        </div>

        {loading ? (
          <div className="loading-state">
            <p style={{ fontStyle: "italic", color: "#64748b" }}>Loading important updates...</p>
          </div>
        ) : collegeNotifications.length === 0 ? (
          <div className="empty-state">
            <h3>No Notifications</h3>
            <p>You're all caught up! Check back later for new updates.</p>
          </div>
        ) : (
          <div className="notification-grid">
            {collegeNotifications.map((n) => (
              <div className="notification-card" key={n._id}>
                <div className="notification-content">
                  <div className="notification-message">{n.message}</div>
                  <div className="notification-meta">
                    <span className="notification-date">
                      {formatDateTime(n.createdAt)}
                    </span>
                  </div>
                </div>

                <div className="badges-area">
                  <span className="badge-premium badge-target">
                    {n.target}
                  </span>
                  <span className="badge-premium badge-semester">
                    Sem {n.semester.join(", ")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default ViewNotification;
