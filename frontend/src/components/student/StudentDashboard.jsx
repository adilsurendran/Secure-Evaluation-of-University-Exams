// src/components/student/StudentDashboard.jsx
import React, { useEffect, useState } from "react";
import StudentLayout from "./StudentLayout";
import api from "../../../api";
import "./student.css"

function StudentDashboard() {
  const studentId = localStorage.getItem("studentId");

  const [student, setStudent] = useState(null);
  const [upcomingExams, setUpcomingExams] = useState([]);
  // const [recentResults, setRecentResults] = useState([]);
  // const [revaluationCount, setRevaluationCount] = useState(0);
  // const [answerCopyCount, setAnswerCopyCount] = useState(0);

  // --------------------------------------------
  // LOAD ALL DASHBOARD DATA
  // --------------------------------------------
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // 1️⃣ Student Profile
        const s = await api.get(`/student/${studentId}`);
        setStudent(s.data);

        // 2️⃣ Upcoming Exams
        const exams = await api.get(`/student/exam-schedule/${studentId}`);
        // console.log(exams);
        
        setUpcomingExams(exams.data.slice(0, 3)); // show only top 3

        // 3️⃣ Latest Results
        // const results = await api.get(`/student/results/${studentId}`);
        // setRecentResults(results.data.slice(0, 3)); // show only top 3

        // 4️⃣ Revaluation Requests Count
        // const reval = await api.get(`/student/revaluation/status/${studentId}`);
        // setRevaluationCount(reval.data.count || 0);

        // 5️⃣ Answer Copy Request Count
        // const copies = await api.get(`/student/answercopy/status/${studentId}`);
        // setAnswerCopyCount(copies.data.count || 0);
      } catch (err) {
        console.log(err);
      }
    };

    fetchDashboardData();
  }, []);

  if (!student)
    return (
      <StudentLayout>
        <p>Loading dashboard...</p>
      </StudentLayout>
    );

  return (
    <StudentLayout>
      <h2>Welcome, {student.name} 👋</h2>

      {/* Top Summary Cards */}
      <div className="dashboard-cards">

        <div className="dash-card">
          <h3>Upcoming Exams</h3>
          <p>{upcomingExams.length}</p>
        </div>

        {/* <div className="dash-card">
          <h3>Recent Results</h3>
          <p>{recentResults.length}</p>
        </div> */}

        {/* <div className="dash-card">
          <h3>Revaluation Requests</h3>
          <p>{revaluationCount}</p>
        </div> */}

        {/* <div className="dash-card">
          <h3>Answer Copy Requests</h3>
          <p>{answerCopyCount}</p>
        </div> */}

      </div>

      {/* Upcoming Exams Table */}
      <div className="section">
        <h3>Upcoming Exams</h3>
        {upcomingExams.length === 0 ? (
          <p>No upcoming exams found</p>
        ) : (
          <table className="college-table">
            <thead>
              <tr>
                <th>Subject</th>
                <th>Date</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {upcomingExams.map((exam) => (
                <tr key={exam._id}>
                  <td>{exam.subjectId.subjectName}</td>
                  <td>{exam.examDate}</td>
                  <td>{exam.examTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Recent Results Table */}
      {/* <div className="section">
        <h3>Recent Results</h3>

        {recentResults.length === 0 ? (
          <p>No results available yet</p>
        ) : (
          <table className="college-table">
            <thead>
              <tr>
                <th>Subject</th>
                <th>Marks</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentResults.map((res) => (
                <tr key={res._id}>
                  <td>{res.subjectId.subjectName}</td>
                  <td>{res.marks}</td>
                  <td>{res.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div> */}
    </StudentLayout>
  );
}

export default StudentDashboard;
