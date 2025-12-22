// src/components/student/StudentSidebar.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api";

function StudentSidebar() {
  const navigate = useNavigate();

  // const logout = async() => {
  //   localStorage.removeItem("studentId");
  //   const logouttt = await api.post("/auth/logout");
  //   console.log(logouttt);
    
  //   navigate("/");
  // };

//   const logout = async () => {
//   try {
//     await api.post("/auth/logout");
//   } catch (e) {
//     console.log(e);
//   }

//   // 🔥 CLEAR EVERYTHING
//   localStorage.clear();

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
        localStorage.removeItem("studentId");
        localStorage.removeItem("role");
  
        // Optional: wipe everything
        // localStorage.clear();
  
        // 3️⃣ Redirect to login
        navigate("/");
      }
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
        <li onClick={() => navigate("/student/notification")}>Notification</li>
        <li onClick={() => navigate("/student/complaint")}>Complaints</li>
      </ul>

      <button className="logout-btn" onClick={logout}>Logout</button>
    </div>
  );
}

export default StudentSidebar;
