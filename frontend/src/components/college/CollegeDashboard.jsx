import React from "react";

function CollegeDashboard() {
  return (
    <div>
      <h1>College Dashboard</h1>

      <div className="dashboard-grid">

        <div className="dashboard-card">
          <h3>Total Students</h3>
          <p>--</p>
        </div>

        <div className="dashboard-card">
          <h3>Total Staff</h3>
          <p>--</p>
        </div>

        <div className="dashboard-card">
          <h3>Uploaded Answer Sheets</h3>
          <p>--</p>
        </div>

        <div className="dashboard-card">
          <h3>Pending Revaluation</h3>
          <p>--</p>
        </div>

      </div>
    </div>
  );
}

export default CollegeDashboard;
