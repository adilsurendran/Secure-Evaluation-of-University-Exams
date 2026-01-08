import React, { useEffect, useState, useMemo } from "react";
import StudentLayout from "./StudentLayout";
import api from "../../../api";
import "./student.css";

function StudentExamSchedule() {
  const studentId = localStorage.getItem("studentId");
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/student/exam-schedule/${studentId}`);
        setExams(res.data);
      } catch (err) {
        console.error("Error fetching schedule:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSchedule();
  }, [studentId]);

  const filteredExams = useMemo(() => {
    return exams.filter(e =>
      e.subjectId.subjectName.toLowerCase().includes(search.toLowerCase()) ||
      e.subjectId.subjectCode.toLowerCase().includes(search.toLowerCase())
    );
  }, [exams, search]);

  return (
    <StudentLayout>
      <style>{`
        .exam-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
          padding-bottom: 24px;
          border-bottom: 2px solid rgba(30, 64, 175, 0.1);
        }

        .exam-header h2 {
          font-size: 32px;
          font-weight: 800;
          background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0;
        }

        .count-badge {
          background: #eff6ff;
          color: #1e40af;
          padding: 8px 16px;
          border-radius: 99px;
          font-weight: 700;
          font-size: 14px;
          border: 1px solid #dbeafe;
        }

        .filter-bar {
          display: flex;
          gap: 16px;
          background: white;
          padding: 16px;
          border-radius: 16px;
          margin-bottom: 24px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          border: 1px solid #e2e8f0;
        }

        .filter-bar input {
          flex: 1;
          padding: 12px 16px;
          border: 1.5px solid #e2e8f0;
          border-radius: 10px;
          font-size: 14px;
          transition: all 0.3s;
        }

        .filter-bar input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
        }

        .table-container {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
          border: 1px solid #e2e8f0;
        }

        .premium-table {
          width: 100%;
          border-collapse: collapse;
        }

        .premium-table thead {
          background: #1e40af;
          color: white;
        }

        .premium-table th {
          padding: 18px 16px;
          text-align: left;
          font-weight: 600;
          text-transform: uppercase;
          font-size: 13px;
          letter-spacing: 0.5px;
        }

        .premium-table tr {
          border-bottom: 1px solid #f1f5f9;
          transition: all 0.2s;
        }

        .premium-table tr:hover {
          background: #f8fafc;
        }

        .premium-table td {
          padding: 18px 16px;
          color: #334155;
          font-size: 15px;
        }

        .subject-info .code {
          font-size: 12px;
          color: #64748b;
          font-weight: 600;
          display: block;
        }

        .subject-info .name {
          font-weight: 700;
          color: #1e293b;
        }

        .date-badge {
          display: inline-block;
          padding: 6px 12px;
          background: #f0fdf4;
          color: #166534;
          border-radius: 8px;
          font-weight: 700;
          font-size: 13px;
          border: 1px solid #dcfce7;
        }

        .time-badge {
          display: inline-block;
          padding: 6px 12px;
          background: #fffbeb;
          color: #92400e;
          border-radius: 8px;
          font-weight: 700;
          font-size: 13px;
          border: 1px solid #fef3c7;
        }

        @media (max-width: 768px) {
           .premium-table thead { display: none; }
           .premium-table td { display: block; text-align: right; padding: 12px 16px; border-bottom: none; }
           .premium-table td::before { content: attr(data-label); float: left; font-weight: 700; color: #64748b; }
           .premium-table tr { border-bottom: 2px solid #e2e8f0; padding: 8px 0; display: block; }
        }
      `}</style>

      <div className="exam-header">
        <h2>📅 Exam Schedule</h2>
        <div className="count-badge">{filteredExams.length} Subjects Scheduled</div>
      </div>

      <div className="filter-bar">
        <input
          type="text"
          placeholder="Search subject by name or code..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="table-container">
        <table className="premium-table">
          <thead>
            <tr>
              <th style={{ width: "80px" }}>#</th>
              <th>Subject</th>
              <th>Exam Date</th>
              <th>Time Slot</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                  Locating your exam schedule...
                </td>
              </tr>
            ) : filteredExams.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                  {search ? "No subjects match your search." : "No exams have been scheduled yet."}
                </td>
              </tr>
            ) : (
              filteredExams.map((e, i) => (
                <tr key={e._id}>
                  <td data-label="#">{i + 1}</td>
                  <td data-label="Subject">
                    <div className="subject-info">
                      <span className="name">{e.subjectId.subjectName}</span>
                      <span className="code">{e.subjectId.subjectCode}</span>
                    </div>
                  </td>
                  <td data-label="Exam Date">
                    <span className="date-badge">{e.examDate}</span>
                  </td>
                  <td data-label="Time Slot">
                    <span className="time-badge">{e.examTime}</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </StudentLayout>
  );
}

export default StudentExamSchedule;
