import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import api from "../../../api";

function AdminHome() {
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
    handleResize(); // Initial check

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close sidebar on route change on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.error("Logout API failed", err);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("role");
      localStorage.removeItem("adminId");
      navigate("/");
    }
  };

  const menuItems = [
    { path: "/admin/dashboard", label: "Dashboard", icon: "📊" },
    { path: "/admin/subjects", label: "Manage Subjects", icon: "📚" },
    { path: "/admin/manage-colleges", label: "Manage Colleges", icon: "🏛️" },
    { path: "/admin/exams", label: "Schedule Exams", icon: "📅" },
    { path: "/admin/exams/manage", label: "Manage Exams", icon: "📝" },
    { path: "/admin/assign/staff", label: "Assign Staff", icon: "👥" },
    { path: "/admin/publish-results", label: "Publish Results", icon: "🎯" },
    { path: "/admin/revaluation/result", label: "Publish Revaluation", icon: "🔄" },
    { path: "/admin/answersheetRequest", label: "Answer Sheet Requests", icon: "📄" },
    { path: "/admin/revaluation", label: "Revaluation Requests", icon: "🔍" },
    { path: "/admin/notification", label: "Notifications", icon: "🔔" },
    { path: "/admin/complaints", label: "Complaints", icon: "💬" },
    { path: "/admin/history", label: "History", icon: "📖" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Inter', sans-serif;
          overflow-x: hidden;
        }

        .admin-layout {
          display: flex;
          min-height: 100vh;
        }

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
        }

        .logout-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(239, 68, 68, 0.3);
        }

        /* MAIN CONTENT */
        .main-content {
          flex: 1;
          margin-left: 280px;
          min-height: 100vh;
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 25%, #bfdbfe 50%, #e0f2fe 75%, #f0f9ff 100%);
          transition: margin-left 0.3s ease;
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

          .main-content {
            margin-left: 0;
            padding-top: 60px;
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

      <div className="admin-layout">
        {/* Mobile Header Bar */}
        <div className="mobile-header">
          <button className="mobile-toggle" onClick={() => setSidebarOpen(true)}>
            ☰
          </button>
          <span style={{ fontWeight: 800 }}>University Panel</span>
          <div style={{ width: '24px' }}></div> {/* Spacer */}
        </div>

        {/* Sidebar Overlay (Mobile) */}
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        ></div>

        {/* Sidebar */}
        <nav className="sidebar">
          <div className="sidebar-header">
            <span className="sidebar-title">University Panel</span>
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
            <button className="logout-btn" onClick={handleLogout}>
              🚪 <span>Logout</span>
            </button>
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </>
  );
}

export default AdminHome;
