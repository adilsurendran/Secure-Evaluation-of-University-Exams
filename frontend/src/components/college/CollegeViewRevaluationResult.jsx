// import React from 'react'

// function CollegeViewRevaluationResult() {
//   return (
//     <div>

//     </div>
//   )
// }

// export default CollegeViewRevaluationResult

import React, { useEffect, useState } from "react";
import api from "../../../api";
import "./college.css";

export default function CollegeViewRevaluationResult() {
  const collegeId = localStorage.getItem("collegeId");

  const [sessions, setSessions] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [selectedSession, setSelectedSession] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // ----------------------------------------
  // LOAD SESSIONS & SUBJECTS
  // ----------------------------------------
  useEffect(() => {
    const load = async () => {
      try {
        const s1 = await api.get("/exam-sessions/all");
        setSessions(s1.data);

        const s2 = await api.get("/subjects/all");
        setSubjects(s2.data);
      } catch (err) {
        console.log(err);
        alert("Failed to load filters");
      }
    };
    load();
  }, []);

  // ----------------------------------------
  // LOAD REVALUATION RESULTS
  // ----------------------------------------
  const fetchResults = async () => {
    setLoading(true);
    try {
      const res = await api.get(
        `/colleges/revaluation-results/${collegeId}`,
        {
          params: {
            sessionId: selectedSession,
            subjectId: selectedSubject,
          },
        }
      );
      console.log(res);
      
      setResults(res.data || []);
    } catch (err) {
      console.log(err);
      alert("Failed to fetch revaluation results");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchResults();
  }, [selectedSession, selectedSubject]);

  return (
    <div className="college-results-page">
      <h2>College Revaluation Results</h2>
      <p>View revaluation marks of students in your college.</p>

      {/* FILTERS */}
      <div className="filters">
        <select
          value={selectedSession}
          onChange={(e) => setSelectedSession(e.target.value)}
        >
          <option value="">All Sessions</option>
          {sessions.map((s) => (
            <option key={s._id} value={s._id}>
              {s.name} - {s.academicYear} (Sem {s.semester})
            </option>
          ))}
        </select>

        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
        >
          <option value="">All Subjects</option>
          {subjects.map((s) => (
            <option key={s._id} value={s._id}>
              {s.subjectCode} - {s.subjectName}
            </option>
          ))}
        </select>
      </div>

      {/* RESULTS TABLE */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="results-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Student</th>
              <th>Subject</th>
              <th>Original Marks</th>
              <th>Revaluation Marks</th>
              <th>Total</th>
            </tr>
          </thead>

          <tbody>
            {results.map((r, i) => (
              <tr key={r._id}>
                <td>{i + 1}</td>

                <td>
                  {r.studentId?.name}
                  <br />
                  <span className="subtext">
                    {r.studentId?.admissionNo}
                  </span>
                </td>

                <td>
                  {r.subjectId?.subjectName}
                  <br />
                  <span className="subtext">
                    {r.subjectId?.subjectCode}
                  </span>
                </td>

                <td>{r.oldMarks}</td>
                <td className="fw-bold">
                  {r.newMarks}
                </td>
                <td>{r.totalMark}</td>
              </tr>
            ))}

            {results.length === 0 && (
              <tr>
                <td colSpan="6" className="no-data">
                  No revaluation results found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
