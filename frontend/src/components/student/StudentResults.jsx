// src/components/student/StudentResults.jsx
import React, { useEffect, useState } from "react";
import StudentLayout from "./StudentLayout";
import api from "../../../api";

function StudentResults() {
  const studentId = localStorage.getItem("studentId");
  const [results, setResults] = useState([]);

  useEffect(() => {
    const loadResults = async () => {
      const res = await api.get(`/student/results/${studentId}`);
      setResults(res.data);
    };
    loadResults();
  }, []);

  return (
    <StudentLayout>
      <h2>My Results</h2>

      <table className="college-table">
        <thead>
          <tr>
            <th>Subject</th>
            <th>Marks</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {results.map((r) => (
            <tr key={r._id}>
              <td>{r.subjectId.subjectName}</td>
              <td>{r.marks}</td>
              <td>{r.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </StudentLayout>
  );
}

export default StudentResults;
