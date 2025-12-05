// src/components/student/StudentRevaluation.jsx
import React, { useEffect, useState } from "react";
import StudentLayout from "./StudentLayout";
import api from "../../../api";

function StudentRevaluation() {
  const studentId = localStorage.getItem("studentId");
  const [results, setResults] = useState([]);

  useEffect(() => {
    const loadOptions = async () => {
      const res = await api.get(`/student/results/${studentId}`);
      setResults(res.data);
    };
    loadOptions();
  }, []);

  const request = async (resultId) => {
    await api.post("/revaluation/request", { studentId, resultId });
    alert("Revaluation Request Submitted!");
  };

  return (
    <StudentLayout>
      <h2>Revaluation Request</h2>

      <table className="college-table">
        <thead>
          <tr>
            <th>Subject</th>
            <th>Marks</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {results.map((r) => (
            <tr key={r._id}>
              <td>{r.subjectId.subjectName}</td>
              <td>{r.marks}</td>
              <td>
                <button onClick={() => request(r._id)}>Request</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </StudentLayout>
  );
}

export default StudentRevaluation;
