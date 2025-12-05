import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import "./admincss.css";

function AdminHome() {
  const navigate = useNavigate();

  return (
    <div className="admin-container">

      {/* Sidebar */}
      <div className="admin-sidebar">
        <h2 className="admin-title">University Admin</h2>

        <ul className="admin-menu">
          <li onClick={() => navigate("/admin/dashboard")}>Dashboard</li>
          <li onClick={() => navigate("/admin/subjects")}>Manage Subjects</li>
          <li onClick={() => navigate("/admin/manage-colleges")}>Manage Colleges</li>
          <li onClick={() => navigate("/admin/exams")}>Manage Schedule Exams</li>
          <li onClick={() => navigate("/admin/exams/manage")}>Manage Exams</li>
          <li onClick={() => navigate("/admin/publish-results")}>Publish Results</li>
          <li onClick={() => navigate("/admin/auditing")}>Auditing</li>
          <li onClick={() => navigate("/admin/revaluation")}>Revaluation Requests</li>
        </ul>
      </div>

      {/* Content */}
      <div className="admin-content">
        <Outlet />
      </div>

    </div>
  );
}

export default AdminHome;
