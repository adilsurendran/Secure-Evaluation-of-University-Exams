// src/components/student/StudentLayout.jsx
import React from "react";
import StudentSidebar from "./StudentSidebar";

function StudentLayout({ children }) {
  return (
    <div className="student-layout">
      <StudentSidebar />

      <div className="student-content">
        {children}
      </div>
    </div>
  );
}

export default StudentLayout;
