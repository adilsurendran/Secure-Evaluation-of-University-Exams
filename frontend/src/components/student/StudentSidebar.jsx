import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../../api";

function StudentSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 1024;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("studentId");
      localStorage.removeItem("role");
      navigate("/");
    }
  };

  const menuItems = [
    { path: "/student/home", label: "Dashboard", icon: "📊" },
    { path: "/student/profile", label: "My Profile", icon: "👤" },
    { path: "/student/exam-schedule", label: "Exam Schedule", icon: "📅" },
    { path: "/student/results", label: "Exam Results", icon: "📝" },
    { path: "/student/results/revaluation", label: "Revaluation Results", icon: "🔄" },
    { path: "/student/revaluation", label: "Revaluation Request", icon: "📩" },
    { path: "/student/revaluation-view", label: "View Revaluation", icon: "👁️" },
    { path: "/student/answer-copy", label: "Answer Sheet Request", icon: "📄" },
    { path: "/student/notification", label: "Notifications", icon: "🔔" },
    { path: "/student/complaint", label: "Complaints", icon: "⚠️" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        /* MOBILE HEADER */
        .mobile-header {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 60px;
          background: #1e40af;
          color: white;
          padding: 0 20px;
          align-items: center;
          justify-content: space-between;
          z-index: 1100;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .mobile-toggle {
          background: transparent;
          border: none;
          color: white;
          font-size: 24px;
          cursor: pointer;
          display: flex;
          align-items: center;
        }

        /* SIDEBAR */
        .sidebar {
          width: 280px;
          background: linear-gradient(180deg, #1e40af 0%, #1e3a8a 100%);
          color: white;
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          z-index: 1200;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          flex-direction: column;
          box-shadow: 4px 0 20px rgba(0, 0, 0, 0.15);
          padding: 0 !important;
        }

        .sidebar-header {
          padding: 30px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .sidebar-title {
          font-size: 22px;
          font-weight: 800;
          letter-spacing: -0.5px;
          margin: 0 !important;
        }

        .close-sidebar-btn {
          display: none;
          background: rgba(255, 255, 255, 0.1);
          border: none;
          color: white;
          width: 32px;
          height: 32px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 20px;
        }

        .menu-list {
          list-style: none;
          padding: 20px 0;
          flex: 1;
          overflow-y: auto;
        }

        .menu-list::-webkit-scrollbar {
          width: 4px;
        }

        .menu-list::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 2px;
        }

        .menu-item {
          margin: 4px 16px;
          padding: 12px 16px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          color: rgba(255, 255, 255, 0.8);
          font-weight: 500;
          font-size: 15px;
        }

        .menu-item:hover {
          background: rgba(255, 255, 255, 0.1);
          color: white;
          transform: translateX(4px);
        }

        .menu-item.active {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          font-weight: 700;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .menu-icon {
          font-size: 18px;
        }

        .logout-section {
          padding: 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .logout-btn {
          width: 100%;
          padding: 12px;
          background: linear-gradient(135deg, #ef4444, #b91c1c);
          border: none;
          color: white;
          border-radius: 12px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
          margin-top: 0 !important;
        }

        .logout-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(239, 68, 68, 0.3);
        }

        /* OVERLAY */
        .sidebar-overlay {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
          z-index: 1150;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        /* RESPONSIVE LOGIC */
        @media (max-width: 1024px) {
          .mobile-header {
            display: flex;
          }

          .sidebar {
            transform: translateX(${sidebarOpen ? '0' : '-100%'});
          }

          .sidebar-overlay {
            display: ${sidebarOpen ? 'block' : 'none'};
          }

          .close-sidebar-btn {
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }
      `}</style>

      {/* Mobile Header Bar */}
      <div className="mobile-header">
        <button className="mobile-toggle" onClick={() => setSidebarOpen(true)}>
          ☰
        </button>
        <span style={{ fontWeight: 800 }}>Student Portal</span>
        <div style={{ width: '24px' }}></div>
      </div>

      {/* Sidebar Overlay (Mobile) */}
      <div
        className="sidebar-overlay"
        onClick={() => setSidebarOpen(false)}
      ></div>

      {/* Sidebar */}
      <nav className="sidebar">
        <div className="sidebar-header">
          <span className="sidebar-title">Student Portal</span>
          <button className="close-sidebar-btn" onClick={() => setSidebarOpen(false)}>
            ✕
          </button>
        </div>

        <ul className="menu-list">
          {menuItems.map((item) => (
            <li
              key={item.path}
              className={`menu-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              <span className="menu-icon">{item.icon}</span>
              <span className="menu-label">{item.label}</span>
            </li>
          ))}
        </ul>

        <div className="logout-section">
          <button className="logout-btn" onClick={logout}>
            🚪 <span>Logout</span>
          </button>
        </div>
      </nav>
    </>
  );
}

export default StudentSidebar;
