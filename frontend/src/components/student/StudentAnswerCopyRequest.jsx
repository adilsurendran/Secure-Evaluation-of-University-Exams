// src/components/student/StudentAnswerCopyRequest.jsx
import React, { useEffect, useState } from "react";
import StudentLayout from "./StudentLayout";
import api from "../../../api";

function StudentAnswerCopyRequest() {
  const studentId = localStorage.getItem("studentId");
  const [exams, setExams] = useState([]);

  useEffect(() => {
    const loadExams = async () => {
      const res = await api.get(`/student/exams-written/${studentId}`);
      setExams(res.data);
    };
    loadExams();
  }, []);

  const requestCopy = async (examId) => {
    await api.post("/answercopy/request", { studentId, examId });
    alert("Answer Copy Requested Successfully!");
  };

  return (
    <StudentLayout>
      <h2>Answer Sheet Copy Request</h2>

      <table className="college-table">
        <thead>
          <tr>
            <th>Subject</th>
            <th>Exam Date</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {exams.map((e) => (
            <tr key={e._id}>
              <td>{e.subjectId.subjectName}</td>
              <td>{e.examDate}</td>
              <td>
                <button onClick={() => requestCopy(e._id)}>Request Copy</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </StudentLayout>
  );
}

export default StudentAnswerCopyRequest;
