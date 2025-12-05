// src/components/student/StudentProfile.jsx
import React, { useEffect, useState } from "react";
import StudentLayout from "./StudentLayout";
import api from "../../../api";

function StudentProfile() {
  const studentId = localStorage.getItem("studentId");
  const [student, setStudent] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      const res = await api.get(`/student/${studentId}`);
      console.log(res);
      
      setStudent(res.data);
    };
    loadProfile();
  }, []);

  if (!student) return <StudentLayout>Loading...</StudentLayout>;

  return (
    <StudentLayout>
      <h2>My Profile</h2>
      <div className="profile-box">
        <p><b>Name:</b> {student.name}</p>
        <p><b>Admission No:</b> {student.admissionNo}</p>
        <p><b>Email:</b> {student.email}</p>
        <p><b>Phone:</b> {student.phone}</p>
        <p><b>Semester:</b> {student.semester}</p>
        <p><b>Department:</b> {student.department}</p>
      </div>
    </StudentLayout>
  );
}

export default StudentProfile;
