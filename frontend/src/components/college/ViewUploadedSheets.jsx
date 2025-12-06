// src/components/college/ViewUploadedSheets.jsx
import React, { useEffect, useState } from "react";
import api from "../../../api";
import { useNavigate } from "react-router-dom";

function ViewUploadedSheets() {
  const navigate = useNavigate();
  const collegeId = localStorage.getItem("collegeId");

  const [sheets, setSheets] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [students, setStudents] = useState([]);

  const [filters, setFilters] = useState({
    sessionId: "",
    studentId: "",
  });

  // =====================================================
  // LOAD ALL DATA: sessions, students, answer sheets
  // =====================================================
  useEffect(() => {
    const loadData = async () => {
      try {
        const [sessRes, studentRes, sheetRes] = await Promise.all([
          api.get("/exam-sessions/all"),
          api.get(`/student/college/${collegeId}`),
          api.get(`/answers/college/${collegeId}`),
        ]);

        setSessions(sessRes.data);
        setStudents(studentRes.data);
        setSheets(sheetRes.data);
      } catch (err) {
        console.log(err);
      }
    };

    loadData();
  }, []);

  // =====================================================
  // FILTER FUNCTION
  // =====================================================
  const filteredSheets = sheets.filter((s) => {
    const bySession =
      !filters.sessionId || s.sessionId?._id === filters.sessionId;

    const byStudent =
      !filters.studentId || s.studentId?._id === filters.studentId;

    return bySession && byStudent;
  });

  // =====================================================
  // DELETE UPLOADED SHEET
  // =====================================================
  const deleteSheet = async (id) => {
    if (!window.confirm("Delete this uploaded sheet?")) return;

    try {
      await api.delete(`/answers/${id}`);
      setSheets(sheets.filter((s) => s._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="college-page">
      {/* HEADER */}
      <div className="college-header">
        <h2>Uploaded Answer Sheets</h2>
      </div>

      {/* FILTERS */}
      <div className="filters-row">
        {/* FILTER BY SESSION */}
        <select
          value={filters.sessionId}
          onChange={(e) =>
            setFilters({ ...filters, sessionId: e.target.value })
          }
        >
          <option value="">All Sessions</option>
          {sessions.map((s) => (
            <option key={s._id} value={s._id}>
              {s.name} - {s.academicYear}
            </option>
          ))}
        </select>

        {/* FILTER BY STUDENT */}
        <select
          value={filters.studentId}
          onChange={(e) =>
            setFilters({ ...filters, studentId: e.target.value })
          }
        >
          <option value="">All Students</option>
          {students.map((st) => (
            <option key={st._id} value={st._id}>
              {st.name} ({st.admissionNo})
            </option>
          ))}
        </select>
      </div>

      {/* TABLE */}
      <div className="college-table-container">
        <table className="college-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Student</th>
              <th>Subject</th>
              <th>Exam Date</th>
              <th>Status</th>
              <th>File</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredSheets.map((s, i) => (
              <tr key={s._id}>
                <td>{i + 1}</td>

                <td>
                  {s.studentId?.name} ({s.studentId?.admissionNo})
                </td>

                <td>
                  {s.subjectId?.subjectName} ({s.subjectId?.subjectCode})
                </td>

                <td>{new Date(s.examId?.examDate).toLocaleDateString()}</td>

                <td>
                  <span
                    className={
                      s.status === "evaluated"
                        ? "status-green"
                        : "status-orange"
                    }
                  >
                    {s.status}
                  </span>
                </td>

                <td>
                  <a
                    href={s.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="view-link"
                  >
                    View PDF
                  </a>
                </td>

                <td>
                  <button
                    className="delete-btn"
                    onClick={() => deleteSheet(s._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {filteredSheets.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center text-muted">
                  No answer sheets uploaded
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ViewUploadedSheets;
