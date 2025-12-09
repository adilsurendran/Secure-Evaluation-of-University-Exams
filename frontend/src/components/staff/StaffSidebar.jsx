// src/components/staff/StaffSidebar.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

function StaffSidebar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("staffId");
    navigate("/");
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
