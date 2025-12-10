import React, { useEffect, useState } from "react";
import api from "../../../api";
import "./college.css";

export default function CollegeResultsDashboard() {
  const collegeId = localStorage.getItem("collegeId");

  const [sessions, setSessions] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [selectedSession, setSelectedSession] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load sessions + subjects
  useEffect(() => {
    const load = async () => {
      const s1 = await api.get("/exam-sessions/all");
      setSessions(s1.data);

      const s2 = await api.get("/subjects/all");
      setSubjects(s2.data);
    };
    load();
  }, []);

  // Load results on filter change
  const fetchResults = async () => {
    setLoading(true);
    try {
      const res = await api.get(
        `/colleges/results/${collegeId}?sessionId=${selectedSession}&subjectId=${selectedSubject}`
      );
      setResults(res.data);
    } catch (err) {
      console.log(err);
      alert("Failed to fetch results");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchResults();
  }, [selectedSession, selectedSubject]);

  return (
    <div className="college-results-page">
      <h2>College Results Dashboard</h2>
      <p>View results of all students in your college.</p>

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
              <th>Marks</th>
              <th>Total</th>
              {/* <th>Status</th> */}
            </tr>
          </thead>

          <tbody>
            {results.map((r, i) => (
              <tr key={r._id}>
                <td>{i + 1}</td>
                <td>
                  {r.studentId?.name}
                  <br />
                  <span className="subtext">{r.studentId?.admissionNo}</span>
                </td>
                <td>
                  {r.subjectId?.subjectName}
                  <br />
                  <span className="subtext">{r.subjectId?.subjectCode}</span>
                </td>
                <td>{r.marks}</td>
                <td>{r.totalMark}</td>

                {/* <td className={r.marks >= r.totalMark * 0.4 ? "pass" : "fail"}>
                  {r.marks >= r.totalMark * 0.4 ? "PASS" : "FAIL"}
                </td> */}
              </tr>
            ))}

            {results.length === 0 && (
              <tr>
                <td colSpan="6" className="no-data">
                  No results found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
