// import React from "react";

// function Dashboard() {
//   return (
//     <div>
//       <h1>Dashboard</h1>
//       <p>Welcome, Admin!</p>
//     </div>
//   );
// }

// export default Dashboard;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api";
import "./admincss.css";

function Dashboard() {
  const navigate = useNavigate();

  const [counts, setCounts] = useState({
    subjects: 0,
    colleges: 0,
    sessions: 0,
    exams: 0,
  });

  // =========================
  // LOAD COUNTS
  // =========================
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const res = await api.get("/university/dashboard-counts");
        setCounts(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchCounts();
  }, []);

  return (
    <div className="admin-dashboard">

      {/* HEADER */}
      <div className="dashboard-header">
        <h2>Admin Dashboard</h2>

        <button
          className="notification-btn"
          onClick={() => navigate("/admin/notification")}
          title="Notifications"
        >
          🔔
        </button>
      </div>

      {/* CARDS */}
      <div className="dashboard-cards">

        <div
          className="dashboard-card"
          onClick={() => navigate("/admin/subjects")}
        >
          <h3>{counts.subjects}</h3>
          <p>Manage Subjects</p>
        </div>

        <div
          className="dashboard-card"
          onClick={() => navigate("/admin/manage-colleges")}
        >
          <h3>{counts.colleges}</h3>
          <p>Manage Colleges</p>
        </div>

        <div
          className="dashboard-card"
          onClick={() => navigate("/admin/exams")}
        >
          <h3>{counts.sessions}</h3>
          <p>Manage Exam Sessions</p>
        </div>

        <div
          className="dashboard-card"
          onClick={() => navigate("/admin/exams/manage")}
        >
          <h3>{counts.exams}</h3>
          <p>Manage Exams</p>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;
