// src/components/staff/StaffSidebar.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api";

function StaffSidebar() {
  const navigate = useNavigate();

  // const logout = () => {
  //   localStorage.removeItem("staffId");
  //   navigate("/");
  // };
  const logout = async () => {
      try {
        // 1️⃣ Invalidate refresh token (server-side)
        await api.post("/auth/logout");
      } catch (err) {
        // Even if backend fails, continue logout
        console.error("Logout failed:", err);
      } finally {
        // 2️⃣ Clear frontend auth data
        localStorage.removeItem("accessToken");
        localStorage.removeItem("staffId");
        localStorage.removeItem("role");
  
        // Optional: wipe everything
        // localStorage.clear();
  
        // 3️⃣ Redirect to login
        navigate("/");
      }
    };

  return (
    <div className="sidebar">
      <h2 className="sidebar-title">Staff Panel</h2>

      <ul className="sidebar-menu">
        <li onClick={() => navigate("/staff/home")}>Dashboard</li>

        <li onClick={() => navigate("/staff/evaluate")}>
          Evaluate Answer Sheets
        </li>

        <li onClick={() => navigate("/staff/revaluation")}>
          Revaluation Evaluation
        </li>

        <li onClick={() => navigate("/staff/history")}>
          Evaluation History
        </li>
      </ul>

      <button className="logout-btn" onClick={logout}>
        Logout
      </button>
    </div>
  );
}

export default StaffSidebar;
