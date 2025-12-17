import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import "./college.css";
import { Button } from "react-bootstrap";

function CollegeLayout() {
  const navigate = useNavigate()
  function logout(){
localStorage.removeItem("collegeId")
navigate("/")
  }
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
            <li><Link to="/college/manage-answer">Manage Answer Sheets</Link></li>
            <li><Link to="/college/results">View Results</Link></li>
            <li><Link to="/college/revaluation">Revaluation result</Link></li>
            <li><Link to="/college/notification">Notifications</Link></li>
            <li><Button variant="danger" onClick={logout}>LOGOUT</Button></li>
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
