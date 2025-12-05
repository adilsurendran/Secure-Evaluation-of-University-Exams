// src/components/staff/StaffHome.jsx
import React, { useEffect, useState } from "react";
import StaffSidebar from "./StaffSidebar";
import api from "../../../api";
import "./staff.css"

function StaffHome() {
  const staffId = localStorage.getItem("staffId");
  const [stats, setStats] = useState({
    totalExams: 0,
    pending: 0,
    completed: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // API call coming later
        // const res = await api.get(`/staff/stats/${staffId}`);
        // setStats(res.data);

        setStats({
          totalExams: 5,
          pending: 2,
          completed: 3,
        });
      } catch (err) {
        console.log(err);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="staff-container">
      <StaffSidebar />

      <div className="staff-main">
        <h1>Staff Dashboard</h1>

        <div className="dashboard-cards">
          <div className="card">
            <h3>Total Exams Assigned</h3>
            <p>{stats.totalExams}</p>
          </div>

          <div className="card">
            <h3>Pending Evaluations</h3>
            <p>{stats.pending}</p>
          </div>

          <div className="card">
            <h3>Completed Evaluations</h3>
            <p>{stats.completed}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StaffHome;
