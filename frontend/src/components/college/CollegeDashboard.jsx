import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api";

function CollegeDashboard() {
  const navigate = useNavigate();
  const collegeId = localStorage.getItem("collegeId");

  const [counts, setCounts] = useState({
    staff: 0,
    student: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashDetails();
  }, []);

  const getDashDetails = async () => {
    try {
      const res = await api.get(`/colleges/details/${collegeId}`);
      setCounts({
        staff: res.data.staff || 0,
        student: res.data.student || 0,
      });
      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };

  const dashboardCards = [
    {
      count: counts.student,
      label: "Total Students",
      path: "/college/students",
      icon: "🎓",
      gradient: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
      shadowColor: "rgba(59, 130, 246, 0.3)",
    },
    {
      count: counts.staff,
      label: "Total Staff",
      path: "/college/staff",
      icon: "👥",
      gradient: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
      shadowColor: "rgba(139, 92, 246, 0.3)",
    },
    {
      count: "Upload",
      label: "Answer Sheets",
      path: "/college/upload-answer",
      icon: "📤",
      gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
      shadowColor: "rgba(16, 185, 129, 0.3)",
    },
    {
      count: "View",
      label: "Exam Results",
      path: "/college/results",
      icon: "🎯",
      gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
      shadowColor: "rgba(245, 158, 11, 0.3)",
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        .college-dashboard {
          padding: 32px;
          min-height: 100vh;
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 25%, #bfdbfe 50%, #e0f2fe 75%, #f0f9ff 100%);
        }

        /* HEADER */
        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 40px;
          padding-bottom: 24px;
          border-bottom: 2px solid #e2e8f0;
        }

        .dashboard-header h2 {
          font-size: 32px;
          font-weight: 800;
          background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0;
        }

        .notification-btn {
          position: relative;
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          color: white;
          border: none;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          font-size: 24px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 16px rgba(59, 130, 246, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .notification-btn:hover {
          transform: translateY(-4px) scale(1.05);
          box-shadow: 0 8px 24px rgba(59, 130, 246, 0.4);
        }

        /* WELCOME SECTION */
        .welcome-section {
          background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
          border-radius: 20px;
          padding: 32px;
          margin-bottom: 32px;
          border: 2px solid #bfdbfe;
        }

        .welcome-section h3 {
          font-size: 24px;
          font-weight: 700;
          color: #1e40af;
          margin: 0 0 8px 0;
        }

        .welcome-section p {
          font-size: 16px;
          color: #475569;
          margin: 0;
        }

        /* CARDS GRID */
        .dashboard-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
          margin-bottom: 32px;
        }

        .dashboard-card {
          background: white;
          border-radius: 20px;
          padding: 32px;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          position: relative;
          overflow: hidden;
          border: 2px solid #e2e8f0;
        }

        .dashboard-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 6px;
          background: var(--card-gradient);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.4s ease;
        }

        .dashboard-card:hover::before {
          transform: scaleX(1);
        }

        .dashboard-card:hover {
          transform: translateY(-8px);
          border-color: transparent;
          box-shadow: 0 12px 40px var(--card-shadow);
        }

        .card-icon {
          font-size: 48px;
          margin-bottom: 16px;
          display: inline-block;
          transition: transform 0.4s ease;
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
        }

        .dashboard-card:hover .card-icon {
          transform: scale(1.2) rotate(5deg);
        }

        .dashboard-card h3 {
          font-size: 42px;
          font-weight: 800;
          background: var(--card-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0 0 12px 0;
          line-height: 1;
        }

        .dashboard-card p {
          font-size: 16px;
          font-weight: 600;
          color: #1e293b;
          margin: 0;
        }

        .card-arrow {
          position: absolute;
          bottom: 20px;
          right: 20px;
          font-size: 24px;
          opacity: 0;
          transform: translateX(-10px);
          transition: all 0.3s ease;
        }

        .dashboard-card:hover .card-arrow {
          opacity: 1;
          transform: translateX(0);
        }

        /* LOADING STATE */
        .loading-skeleton {
          background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
          background-size: 200% 100%;
          animation: loading 1.5s ease-in-out infinite;
          border-radius: 20px;
          height: 200px;
        }

        @keyframes loading {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        @media (max-width: 768px) {
          .college-dashboard { padding: 20px; }
          .dashboard-header h2 { font-size: 28px; }
          .dashboard-card h3 { font-size: 36px; }
        }
      `}</style>

      <div className="college-dashboard">
        {/* HEADER */}
        <div className="dashboard-header">
          <h2>College Dashboard</h2>
          <button
            className="notification-btn"
            onClick={() => navigate("/college/notification")}
            title="Notifications"
          >
            🔔
          </button>
        </div>

        {/* WELCOME SECTION */}
        <div className="welcome-section">
          <h3>Welcome to College Panel! 👋</h3>
          <p>Manage your students, staff, and examination records efficiently.</p>
        </div>

        {/* CARDS */}
        <div className="dashboard-cards">
          {loading ? (
            <>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="loading-skeleton"></div>
              ))}
            </>
          ) : (
            dashboardCards.map((card, index) => (
              <div
                key={index}
                className="dashboard-card"
                onClick={() => navigate(card.path)}
                style={{
                  '--card-gradient': card.gradient,
                  '--card-shadow': card.shadowColor,
                }}
              >
                <div className="card-icon">{card.icon}</div>
                <h3>{card.count}</h3>
                <p>{card.label}</p>
                <span className="card-arrow">→</span>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default CollegeDashboard;
