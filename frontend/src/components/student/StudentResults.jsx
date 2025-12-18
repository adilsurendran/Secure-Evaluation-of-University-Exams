
import React, { useEffect, useState } from "react";
import api from "../../../api";
import StudentSidebar from "./StudentSidebar";
import "./student.css";

export default function StudentResults() {
  const studentId = localStorage.getItem("studentId");

  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState("");
  const [marksheet, setMarksheet] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load exam sessions
  useEffect(() => {
    console.log("StudentResults mounted");

    const fetchSessions = async () => {
      try {
        const res = await api.get("/exam-sessions/all");
        console.log("Sessions:", res.data);
        setSessions(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchSessions();
  }, []);

  const loadResults = async (sessionId) => {
    setLoading(true);
    setMarksheet(null);

    try {
      const res = await api.get(`/student/results/${studentId}/${sessionId}`);
      console.log("Results response:", res.data);
      setMarksheet(res.data);
    } catch (err) {
      console.log(err);
      alert("Failed to load results");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex">
          <StudentSidebar />
    <div className="student-container">
      

      <div className="student-main" style={{ padding: "20px" }}>
        <h1>Exam Results</h1>

        {/* SESSION SELECT */}
        <select
          value={selectedSession}
          onChange={(e) => {
            setSelectedSession(e.target.value);
            loadResults(e.target.value);
          }}
          style={{ marginTop: "10px", marginBottom: "20px" }}
        >
          <option value="">Select Exam Session</option>
          {sessions.map((s) => (
            <option key={s._id} value={s._id}>
              {s.name} - {s.academicYear} (Sem {s.semester})
            </option>
          ))}
        </select>

        {/* LOADING */}
        {loading && <p>Loading results...</p>}

        {/* INITIAL STATE */}
        {!loading && !selectedSession && (
          <p style={{ color: "#666" }}>Please select an exam session to view results.</p>
        )}

        {/* RESULT NOT ANNOUNCED */}
        {marksheet && marksheet.published === false && (
          <div className="not-published-box">
            <h3>Results Not Announced</h3>
            <p>The university has not published results for this session.</p>
          </div>
        )}

        {/* SHOW MARKSHEET */}
        {marksheet && marksheet.published && (
          <div className="result-card">
            <h2>
              {marksheet.session.name} – AY {marksheet.session.academicYear}
            </h2>

            <table className="result-table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Code</th>
                  <th>Marks</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {marksheet.results.map((r) => (
                  <tr key={r._id}>
                    <td>{r.subjectId.subjectName}</td>
                    <td>{r.subjectId.subjectCode}</td>
                    <td>{r.marks}</td>
                    <td>{r.totalMark}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* TOTAL MARKS */}
            <h3 style={{ marginTop: "20px" }}>
              Total Score:{" "}
              {marksheet.results.reduce((sum, r) => sum + Number(r.marks), 0)} /{" "}
              {marksheet.results.reduce((sum, r) => sum + Number(r.totalMark), 0)}
            </h3>
          </div>
        )}
      </div>
    </div>
    </div>
  );
}
