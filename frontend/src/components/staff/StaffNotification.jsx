import React, { useEffect, useState, useMemo } from "react";
import api from "../../../api";
import StaffSidebar from "./StaffSidebar";
import "./staff.css";

function StaffNotification() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getNotifications();
  }, []);

  const getNotifications = async () => {
    try {
      setLoading(true);
      const res = await api.get("/university/staff-notifications");
      setNotifications(res.data.notifications || []);
    } catch (e) {
      console.error("Error fetching staff notifications:", e);
    } finally {
      setLoading(false);
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

  // Derived filtered data
  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) =>
      n.message.toLowerCase().includes(search.toLowerCase())
    );
  }, [notifications, search]);

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

        /* NOTIFICATION LIST */
        .notification-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
          max-width: 1000px;
        }

        .notification-card {
          background: white;
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
          border: 1.5px solid #e2e8f0;
          display: flex;
          justify-content: space-between;
          align-items: center;
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
          width: 6px;
          background: linear-gradient(to bottom, #1e40af, #3b82f6);
        }

        .notification-content {
          flex: 1;
          padding-right: 20px;
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

        .badge-target {
          padding: 6px 14px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          background: #eff6ff;
          color: #2563eb;
          border: 1px solid #dbeafe;
          white-space: nowrap;
        }

        .loading-state, .empty-state {
          text-align: center;
          padding: 80px 40px;
          background: white;
          border-radius: 24px;
          border: 2px dashed #cbd5e1;
          color: #64748b;
        }

        @media (max-width: 768px) {
          .staff-page { padding: 16px; }
          .notification-card { flex-direction: column; align-items: flex-start; gap: 16px; }
          .notification-content { padding-right: 0; }
        }
      `}</style>

      <div className="staff-main-content staff-page">
        <div className="staff-header">
          <h2>🔔 Official Notifications</h2>
          <div style={{ color: '#64748b', fontWeight: 600 }}>
            {filteredNotifications.length} Active Updates
          </div>
        </div>

        <div className="filter-bar">
          <input
            type="text"
            placeholder="Search through messages..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="loading-state">
            <h3>Fetching updates...</h3>
            <p>Please wait while we connect to the portal.</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="empty-state">
            <h3>No Notifications Found</h3>
            <p>{search ? "No announcements match your search criteria." : "You're all caught up! There are no new notifications for staff."}</p>
          </div>
        ) : (
          <div className="notification-list">
            {filteredNotifications.map((n) => (
              <div className="notification-card" key={n._id}>
                <div className="notification-content">
                  <div className="notification-message">{n.message}</div>
                  <div className="notification-meta">
                    <span className="time-stamp">🕒 {formatDateTime(n.createdAt)}</span>
                  </div>
                </div>
                <div className="badges-area">
                  <span className="badge-target">
                    {n.target === "all" ? "📢 Global Broadcast" : "👨‍🏫 Staff Update"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default StaffNotification;
