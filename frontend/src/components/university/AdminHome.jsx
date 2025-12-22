// import React from "react";
// import { Outlet, useNavigate } from "react-router-dom";
// import "./admincss.css";

// function AdminHome() {
//   const navigate = useNavigate();

//   return (
//     <div className="admin-container">

//       {/* Sidebar */}
//       <div className="admin-sidebar">
//         <h2 className="admin-title">University Admin</h2>

//         <ul className="admin-menu">
//           <li onClick={() => navigate("/admin/dashboard")}>Dashboard</li>
//           <li onClick={() => navigate("/admin/subjects")}>Manage Subjects</li>
//           <li onClick={() => navigate("/admin/manage-colleges")}>Manage Colleges</li>
//           <li onClick={() => navigate("/admin/exams")}>Manage Schedule Exams</li>
//           <li onClick={() => navigate("/admin/exams/manage")}>Manage Exams</li>
//           <li onClick={() => navigate("/admin/assign/staff")}>Assign Staff to Evaluated</li>
//           <li onClick={() => navigate("/admin/publish-results")}>Publish Results</li>
//           <li onClick={() => navigate("/admin/revaluation/result")}>Publish Revaluation Results</li>
//           {/* <li onClick={() => navigate("/admin/auditing")}>Auditing</li> */}
//           <li onClick={() => navigate("/admin/answersheetRequest")}>View Answer Sheet Req</li>
//           <li onClick={() => navigate("/admin/revaluation")}>Revaluation Requests</li>
//           <li onClick={() => navigate("/admin/notification")}>Notification</li>
//           <li onClick={() => navigate("/admin/complaints")}>Complaints</li>
//           <li onClick={()=> navigate("/")} className="bg-danger" style={{textAlign:"center"}}><b>Logout</b></li>
//         </ul>
//       </div>

//       {/* Content */}
//       <div className="admin-content">
//         <Outlet />
//       </div>

//     </div>
//   );
// }

// export default AdminHome;

import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import api from "../../../api"; // axios instance
import "./admincss.css";

function AdminHome() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // 1️⃣ Call backend logout (invalidate refresh token)
      await api.post("/auth/logout");

    } catch (err) {
      // Even if this fails, continue logout
      console.error("Logout API failed", err);
    } finally {
      // 2️⃣ Clear frontend auth state
      localStorage.removeItem("accessToken");
      localStorage.removeItem("role");
      localStorage.removeItem("adminId");

      // Optional: clear everything
      // localStorage.clear();

      // 3️⃣ Redirect to login
      navigate("/");
    }
  };

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
          <li onClick={() => navigate("/admin/assign/staff")}>Assign Staff to Evaluated</li>
          <li onClick={() => navigate("/admin/publish-results")}>Publish Results</li>
          <li onClick={() => navigate("/admin/revaluation/result")}>Publish Revaluation Results</li>
          <li onClick={() => navigate("/admin/answersheetRequest")}>View Answer Sheet Req</li>
          <li onClick={() => navigate("/admin/revaluation")}>Revaluation Requests</li>
          <li onClick={() => navigate("/admin/notification")}>Notification</li>
          <li onClick={() => navigate("/admin/complaints")}>Complaints</li>
          <li onClick={() => navigate("/admin/history")}>History</li>

          <li
            onClick={handleLogout}
            className="bg-danger"
            style={{ textAlign: "center", cursor: "pointer" }}
          >
            <b>Logout</b>
          </li>
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
