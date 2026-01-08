import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StudentSidebar from "./StudentSidebar";
import api from "../../../api";
import "./student.css";

function StudentDashboard() {
  const navigate = useNavigate();
  const studentId = localStorage.getItem("studentId");

  const [student, setStudent] = useState(null);
  const [stats, setStats] = useState({
    exams: 0,
    results: 0,
    revaluation: 0,
    answerCopy: 0
  });
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // 1. Student Profile
      const studentRes = await api.get(`/student/${studentId}`);
      setStudent(studentRes.data);

      // 2. Stats
      const statsRes = await api.get(`/student/stats/${studentId}`);
      setStats(statsRes.data);

      // 3. Notifications for Ticker
      const notifyRes = await api.get(`/university/getnotifications/${studentId}`);
      setNotifications(notifyRes.data.notifications || []);

      setLoading(false);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setLoading(false);
    }
  };

  const academicCards = [
    {
      count: stats.exams,
      label: "Upcoming Exams",
      icon: "📅",
      gradient: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
      shadowColor: "rgba(59, 130, 246, 0.3)",
      path: "/student/exam-schedule"
    },
    {
      count: stats.results,
      label: "Results Published",
      icon: "🎓",
      gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
      shadowColor: "rgba(16, 185, 129, 0.3)",
      path: "/student/results"
    }
  ];

  const requestCards = [
    {
      count: stats.revaluation,
      label: "Active Revaluation",
      icon: "🔄",
      gradient: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
      shadowColor: "rgba(139, 92, 246, 0.3)",
      path: "/student/revaluation-view"
    },
    {
      count: stats.answerCopy,
      label: "Answer Copy Requests",
      icon: "📄",
      gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
      shadowColor: "rgba(245, 158, 11, 0.3)",
      path: "/student/answer-copy"
    }
  ];

  if (!student && loading) {
    return (
      <div className="student-layout">
        <StudentSidebar />
        <div className="student-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <p>Initializing your portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="student-layout">
      <StudentSidebar />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        .student-content {
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
        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 40px;
          padding-bottom: 20px;
          border-bottom: 2px solid rgba(30, 64, 175, 0.1);
        }

        .dashboard-header h1 {
          font-size: 32px;
          font-weight: 800;
          background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0;
        }

        .student-badge {
          background: #eff6ff;
          color: #1e40af;
          padding: 8px 16px;
          border-radius: 99px;
          font-weight: 700;
          font-size: 14px;
          border: 1px solid #dbeafe;
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

        /* STAT CARDS */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
        }

        .stat-card-premium {
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

        .stat-card-premium:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 40px var(--card-shadow);
          border-color: transparent;
        }

        .stat-card-premium::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 6px;
          background: var(--card-gradient);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.4s ease;
        }

        .stat-card-premium:hover::before { transform: scaleX(1); }

        .card-icon-lg {
          font-size: 40px;
          margin-bottom: 20px;
          display: inline-block;
          filter: drop-shadow(0 4px 8px rgba(0,0,0,0.1));
        }

        .stat-card-premium h2 {
          font-size: 42px;
          font-weight: 800;
          background: var(--card-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: 0 0 8px 0;
        }

        .stat-card-premium p {
          font-size: 16px;
          font-weight: 600;
          color: #64748b;
          margin: 0;
        }

        .card-arrow {
          position: absolute;
          bottom: 20px;
          right: 24px;
          font-size: 24px;
          opacity: 0;
          transform: translateX(-10px);
          transition: all 0.3s ease;
        }

        .stat-card-premium:hover .card-arrow {
          opacity: 1;
          transform: translateX(0);
        }

        .profile-summary {
          background: white;
          border-radius: 20px;
          padding: 24px;
          margin-top: 32px;
          border: 1px solid #e2e8f0;
          display: flex;
          gap: 40px;
          align-items: center;
          box-shadow: 0 4px 12px rgba(0,0,0,0.03);
        }

        .profile-info-item {
           display: flex;
           flex-direction: column;
           gap: 4px;
        }

        .profile-info-item label {
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #94a3b8;
          font-weight: 700;
        }

        .profile-info-item span {
          font-weight: 600;
          color: #334155;
        }

        @media (max-width: 768px) {
          .profile-summary { flex-direction: column; align-items: flex-start; gap: 20px; }
        }
      `}</style>

      <div className="student-content">
        {/* TICKER SYSTEM */}
        <div className="notification-ticker">
          <div className="ticker-label">公告 NEWS</div>
          <div className="ticker-content">
            <div className="ticker-scroll">
              {notifications.length > 0 ? (
                notifications.map((n) => (
                  <span
                    key={n._id}
                    className="ticker-item"
                    onClick={() => navigate("/student/notification")}
                  >
                    • {n.message}
                  </span>
                ))
              ) : (
                <span className="ticker-item">No new updates. All systems operational.</span>
              )}
              {/* Duplicate for seamless scrolling */}
              {notifications.map((n) => (
                <span key={n._id + '-copy'} className="ticker-item">• {n.message}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="dashboard-header">
          <h1>Welcome, {student?.name?.split(' ')[0]} 👋</h1>
          <div className="student-badge">Semester {student?.semester} • {student?.department}</div>
        </div>

        {/* ACADEMIC PROGRESS */}
        <h3 className="section-title">🎓 Academic Progress</h3>
        <div className="stats-grid">
          {academicCards.map((card, idx) => (
            <div
              key={idx}
              className="stat-card-premium"
              onClick={() => navigate(card.path)}
              style={{
                '--card-gradient': card.gradient,
                '--card-shadow': card.shadowColor
              }}
            >
              <div className="card-icon-lg">{card.icon}</div>
              <h2>{card.count}</h2>
              <p>{card.label}</p>
              <span className="card-arrow">→</span>
            </div>
          ))}
        </div>

        {/* REQUESTS & APPLICATIONS */}
        <h3 className="section-title">📩 Requests & Applications</h3>
        <div className="stats-grid">
          {requestCards.map((card, idx) => (
            <div
              key={idx}
              className="stat-card-premium"
              onClick={() => navigate(card.path)}
              style={{
                '--card-gradient': card.gradient,
                '--card-shadow': card.shadowColor
              }}
            >
              <div className="card-icon-lg">{card.icon}</div>
              <h2>{card.count}</h2>
              <p>{card.label}</p>
              <span className="card-arrow">→</span>
            </div>
          ))}
        </div>

        {/* QUICK PROFILE SUMMARY */}
        <div className="profile-summary">
          <div className="profile-info-item">
            <label>Admission No</label>
            <span>{student?.admissionNo}</span>
          </div>
          <div className="profile-info-item">
            <label>Email Address</label>
            <span>{student?.email}</span>
          </div>
          <div className="profile-info-item">
            <label>Current Status</label>
            <span style={{ color: '#10b981' }}>Active</span>
          </div>
          <div
            className="profile-info-item"
            style={{ marginLeft: 'auto', cursor: 'pointer' }}
            onClick={() => navigate("/student/profile")}
          >
            <span style={{ color: '#2563eb', fontWeight: 700 }}>Full Profile →</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
