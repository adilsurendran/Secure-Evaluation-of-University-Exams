// src/components/student/StudentSidebar.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

function StudentSidebar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("studentId");
    navigate("/login");
  };

  return (
    <div className="sidebar">
      <h2 className="sidebar-title">Student Panel</h2>

      <ul className="sidebar-menu">
        <li onClick={() => navigate("/student/home")}>Home</li>
        <li onClick={() => navigate("/student/profile")}>Profile</li>
        <li onClick={() => navigate("/student/exam-schedule")}>Exam Schedule</li>
        <li onClick={() => navigate("/student/results")}>Results</li>
        <li onClick={() => navigate("/student/results/revaluation")}>Revaluation Results</li>
        <li onClick={() => navigate("/student/revaluation")}>Revaluation Request</li>
        <li onClick={() => navigate("/student/revaluation-view")}>view revaluation</li>
        <li onClick={() => navigate("/student/answer-copy")}>Answer Sheet Copy Request</li>
      </ul>

      <button className="logout-btn" onClick={logout}>Logout</button>
    </div>
  );
}

export default StudentSidebar;
