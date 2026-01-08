import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StaffSidebar from "./StaffSidebar";
import api from "../../../api";
import "./staff.css";

function StaffHome() {
  const navigate = useNavigate();
  const staffId = localStorage.getItem("staffId");

  const [stats, setStats] = useState({
    valuation: { total: 0, pending: 0, completed: 0 },
    revaluation: { total: 0, pending: 0, completed: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // 1. Fetch Stats
      const statsRes = await api.get(`/staff/stats/${staffId}`);
      setStats(statsRes.data);

      // 2. Fetch Latest Notifications for Ticker
      const notifyRes = await api.get("/university/staff-notifications");
      setNotifications(notifyRes.data.notifications || []);

      setLoading(false);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setLoading(false);
    }
  };

  const valuationCards = [
    {
      count: stats.valuation.total,
      label: "Total Valuation",
      icon: "✍️",
      gradient: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
      shadowColor: "rgba(59, 130, 246, 0.3)",
      path: "/staff/evaluate"
    },
    {
      count: stats.valuation.pending,
      label: "Pending Valuation",
      icon: "⏳",
      gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
      shadowColor: "rgba(245, 158, 11, 0.3)",
      path: "/staff/evaluate"
    },
    {
      count: stats.valuation.completed,
      label: "Completed Valuation",
      icon: "✅",
      gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
      shadowColor: "rgba(16, 185, 129, 0.3)",
      path: "/staff/history"
    }
  ];

  const revaluationCards = [
    {
      count: stats.revaluation.total,
      label: "Total Revaluation",
      icon: "🔄",
      gradient: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
      shadowColor: "rgba(139, 92, 246, 0.3)",
      path: "/staff/revaluation"
    },
    {
      count: stats.revaluation.pending,
      label: "Pending Revaluation",
      icon: "🕒",
      gradient: "linear-gradient(135deg, #ec4899 0%, #db2777 100%)",
      shadowColor: "rgba(236, 72, 153, 0.3)",
      path: "/staff/revaluation"
    }
  ];

  return (
    <div className="staff-container">
      <StaffSidebar />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        .staff-main-content {
          min-height: 100vh;
          font-family: 'Inter', sans-serif;
        }

        /* TICKER SYSTEM */
        .notification-ticker {
          background: white;
          border-radius: 16px;
          height: 50px;
          display: flex;
          align-items: center;
          overflow: hidden;
          margin-bottom: 32px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
          border: 1px solid #e2e8f0;
          position: relative;
        }

        .ticker-label {
          background: #1e40af;
          color: white;
          padding: 0 20px;
          height: 100%;
          display: flex;
          align-items: center;
          font-weight: 700;
          font-size: 14px;
          z-index: 2;
          white-space: nowrap;
          box-shadow: 4px 0 12px rgba(0,0,0,0.1);
        }

        .ticker-content {
          flex: 1;
          overflow: hidden;
          position: relative;
        }

        .ticker-scroll {
          display: flex;
          white-space: nowrap;
          animation: ticker 30s linear infinite;
          padding-left: 100%;
        }

        .ticker-scroll:hover {
          animation-play-state: paused;
        }

        .ticker-item {
          padding: 0 40px;
          color: #334155;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
        }

        .ticker-item:hover { color: #2563eb; }

        @keyframes ticker {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }

        /* HEADER */
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 40px;
          padding-bottom: 20px;
          border-bottom: 2px solid rgba(30, 64, 175, 0.1);
        }

        .page-header h1 {
          font-size: 32px;
          font-weight: 800;
          background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0;
        }

        /* SECTION TITLES */
        .section-title {
          font-size: 20px;
          font-weight: 700;
          color: #1e293b;
          margin: 32px 0 20px 0;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        /* DASHBOARD CARDS */
        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
        }

        .stat-card {
          background: white;
          border-radius: 20px;
          padding: 32px;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          position: relative;
          overflow: hidden;
          border: 1px solid #e2e8f0;
          box-shadow: 0 4px 6px rgba(0,0,0,0.02);
        }

        .stat-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 40px var(--card-shadow);
          border-color: transparent;
        }

        .stat-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 6px;
          background: var(--card-gradient);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.4s ease;
        }

        .stat-card:hover::before { transform: scaleX(1); }

        .card-icon {
          font-size: 40px;
          margin-bottom: 20px;
          display: inline-block;
          filter: drop-shadow(0 4px 8px rgba(0,0,0,0.1));
        }

        .stat-card h2 {
          font-size: 42px;
          font-weight: 800;
          background: var(--card-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: 0 0 8px 0;
        }

        .stat-card p {
          font-size: 16px;
          font-weight: 600;
          color: #64748b;
          margin: 0;
        }

        .card-link {
          position: absolute;
          bottom: 20px;
          right: 24px;
          font-size: 24px;
          opacity: 0;
          transform: translateX(-10px);
          transition: all 0.3s ease;
        }

        .stat-card:hover .card-link {
          opacity: 1;
          transform: translateX(0);
        }

        .loading-state {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 400px;
          font-weight: 500;
          color: #64748b;
        }
      `}</style>

      <div className="staff-main-content">
        {/* LATEST NOTIFICATIONS TICKER */}
        <div className="notification-ticker">
          <div className="ticker-label">🔔 LATEST UPDATES</div>
          <div className="ticker-content">
            <div className="ticker-scroll">
              {notifications.length > 0 ? (
                notifications.map((n) => (
                  <span
                    key={n._id}
                    className="ticker-item"
                    onClick={() => navigate("/staff/notification")}
                  >
                    • {n.message}
                  </span>
                ))
              ) : (
                <span className="ticker-item">No new updates from the university.</span>
              )}
              {/* Duplicate for seamless scrolling */}
              {notifications.map((n) => (
                <span key={n._id + '-copy'} className="ticker-item">• {n.message}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="page-header">
          <h1>Staff Dashboard</h1>
        </div>

        {loading ? (
          <div className="loading-state">Loading your dashboard stats...</div>
        ) : (
          <>
            {/* VALUATION SECTION */}
            <h3 className="section-title">✍️ Answer Sheet Evaluation</h3>
            <div className="dashboard-grid">
              {valuationCards.map((card, idx) => (
                <div
                  key={idx}
                  className="stat-card"
                  onClick={() => navigate(card.path)}
                  style={{
                    '--card-gradient': card.gradient,
                    '--card-shadow': card.shadowColor
                  }}
                >
                  <div className="card-icon">{card.icon}</div>
                  <h2>{card.count}</h2>
                  <p>{card.label}</p>
                  <span className="card-link">→</span>
                </div>
              ))}
            </div>

            {/* REVALUATION SECTION */}
            <h3 className="section-title">🔄 Revaluation Requests</h3>
            <div className="dashboard-grid">
              {revaluationCards.map((card, idx) => (
                <div
                  key={idx}
                  className="stat-card"
                  onClick={() => navigate(card.path)}
                  style={{
                    '--card-gradient': card.gradient,
                    '--card-shadow': card.shadowColor
                  }}
                >
                  <div className="card-icon">{card.icon}</div>
                  <h2>{card.count}</h2>
                  <p>{card.label}</p>
                  <span className="card-link">→</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default StaffHome;
