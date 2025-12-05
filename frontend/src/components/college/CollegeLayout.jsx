import React from "react";
import { Link, Outlet } from "react-router-dom";
import "./college.css";

function CollegeLayout() {
  return (
    <div className="college-container">

      {/* Sidebar */}
      <aside className="college-sidebar">
        <h2 className="sidebar-title">College Panel</h2>

        <nav>
          <ul>
            <li><Link to="/college/dashboard">Dashboard</Link></li>
            <li><Link to="/college/students">Manage Students</Link></li>
            <li><Link to="/college/staff">Manage Staff</Link></li>
            <li><Link to="/college/upload-answer">Upload Answer Sheets</Link></li>
            <li><Link to="/college/results">View Results</Link></li>
            <li><Link to="/college/revaluation">Revaluation Requests</Link></li>
          </ul>
        </nav>
      </aside>

      {/* Content */}
      <main className="college-content">
        <Outlet />
      </main>
      
    </div>
  );
}

export default CollegeLayout;
