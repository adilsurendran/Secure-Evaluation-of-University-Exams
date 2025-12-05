// src/components/student/StudentExamSchedule.jsx
import React, { useEffect, useState } from "react";
import StudentLayout from "./StudentLayout";
import api from "../../../api";

function StudentExamSchedule() {
  const studentId = localStorage.getItem("studentId");
  const [exams, setExams] = useState([]);

  useEffect(() => {
    const fetchSchedule = async () => {
      const res = await api.get(`/student/exam-schedule/${studentId}`);
      setExams(res.data);
    };
    fetchSchedule();
  }, []);

  return (
    <StudentLayout>
      <h2>Exam Schedule</h2>

      <table className="college-table">
        <thead>
          <tr>
            <th>Subject</th>
            <th>Date</th>
            <th>Time</th>
          </tr>
        </thead>

        <tbody>
          {exams.map((e) => (
            <tr key={e._id}>
              <td>{e.subjectId.subjectName}</td>
              <td>{e.examDate}</td>
              <td>{e.examTime}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </StudentLayout>
  );
}

export default StudentExamSchedule;
