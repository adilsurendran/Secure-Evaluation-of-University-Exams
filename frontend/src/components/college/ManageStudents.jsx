import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api";

function ManageStudents() {
  const navigate = useNavigate();
  const collegeId = localStorage.getItem("collegeId");

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔍 search + filters
  const [search, setSearch] = useState("");
  const [semesterFilter, setSemesterFilter] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");

  // ================= LOAD STUDENTS =================
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/student/college/${collegeId}`);
        setStudents(res.data);
      } catch (err) {
        console.log("Error loading students:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [collegeId]);

  // ================= DELETE =================
  const deleteStudent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;

    try {
      await api.delete(`/student/delete/${id}`);
      setStudents((prev) => prev.filter((s) => s._id !== id));
      alert("Student deleted successfully!");
    } catch (err) {
      console.log("Delete error:", err);
      alert("Error deleting student");
    }
  };

  // ================= DERIVED FILTERED DATA =================
  const filteredStudents = useMemo(() => {
    return students.filter((stu) => {
      const searchMatch =
        stu.name.toLowerCase().includes(search) ||
        stu.admissionNo.toLowerCase().includes(search);

      const semesterMatch =
        !semesterFilter || String(stu.semester) === semesterFilter;

      const departmentMatch =
        !departmentFilter || stu.department === departmentFilter;

      return searchMatch && semesterMatch && departmentMatch;
    });
  }, [students, search, semesterFilter, departmentFilter]);

  // Unique departments for filter dropdown
  const departments = useMemo(() => {
    return [...new Set(students.map((s) => s.department).filter(Boolean))];
  }, [students]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        .college-page {
          padding: 32px;
          min-height: 100vh;
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 25%, #bfdbfe 50%, #e0f2fe 75%, #f0f9ff 100%);
          font-family: 'Inter', sans-serif;
        }

        .college-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
          padding-bottom: 24px;
          border-bottom: 2px solid #e2e8f0;
        }

        .college-header h2 {
          font-size: 32px;
          font-weight: 800;
          background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0;
        }

        .add-btn {
          padding: 12px 24px;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        }

        .add-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
        }

        /* FILTER BAR Styles */
        .filter-bar {
          display: flex;
          gap: 16px;
          background: white;
          padding: 16px;
          border-radius: 16px;
          margin-bottom: 24px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          border: 1px solid #e2e8f0;
          flex-wrap: wrap;
        }

        .filter-bar input,
        .filter-bar select {
          padding: 10px 16px;
          border: 1.5px solid #e2e8f0;
          border-radius: 10px;
          font-size: 14px;
          font-family: inherit;
          color: #1e293b;
          transition: all 0.3s ease;
        }

        .filter-bar input:focus,
        .filter-bar select:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
        }

        .filter-bar input { flex: 1; min-width: 250px; }
        .filter-bar select { min-width: 150px; cursor: pointer; }

        .clear-btn {
          padding: 10px 20px;
          background: #f1f5f9;
          color: #475569;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .clear-btn:hover { background: #e2e8f0; color: #1e293b; }

        /* TABLE Styles */
        .table-container {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          border: 2px solid #e2e8f0;
        }

        .college-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 15px;
        }

        .college-table thead {
          background: #1e40af;
          color: white;
        }

        .college-table thead th {
          padding: 16px;
          text-align: left;
          font-weight: 600;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .college-table tbody tr {
          border-bottom: 1px solid #e2e8f0;
          transition: all 0.2s ease;
        }

        .college-table tbody tr:hover {
          background: #f8fafc;
        }

        .college-table tbody tr:last-child {
          border-bottom: none;
        }

        .college-table tbody td {
          padding: 16px;
          color: #1e293b;
        }

        .action-col {
          display: flex;
          gap: 8px;
          justify-content: center;
        }

        .edit-btn,
        .delete-btn {
          padding: 8px 16px;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }

        .edit-btn {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          color: white;
          box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
        }

        .edit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
        }

        .delete-btn {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          color: white;
          box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
        }

        .delete-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
        }

        @media (max-width: 1024px) {
          .filter-bar { flex-direction: column; align-items: stretch; }
          .filter-bar input { flex: none; }
        }

        @media (max-width: 768px) {
          .college-page { padding: 20px; }
          .college-header { flex-direction: column; align-items: flex-start; gap: 16px; }
          .table-container { overflow-x: auto; }
          .college-table { font-size: 13px; }
          .action-col { flex-direction: column; }
        }
      `}</style>

      <div className="college-page">
        {/* HEADER */}
        <div className="college-header">
          <h2>🎓 Manage Students</h2>
          <button
            className="add-btn"
            onClick={() => navigate("/college/students/add")}
          >
            + Add New Student
          </button>
        </div>

        {/* FILTER BAR */}
        <div className="filter-bar">
          <input
            type="text"
            placeholder="Search by name or admission number..."
            value={search}
            onChange={(e) => setSearch(e.target.value.toLowerCase())}
          />
          <select
            value={semesterFilter}
            onChange={(e) => setSemesterFilter(e.target.value)}
          >
            <option value="">All Semesters</option>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
              <option key={s} value={s}>Semester {s}</option>
            ))}
          </select>
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
          >
            <option value="">All Courses</option>
            {departments.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          <button
            className="clear-btn"
            onClick={() => {
              setSearch("");
              setSemesterFilter("");
              setDepartmentFilter("");
            }}
          >
            Clear Filters
          </button>
        </div>

        {/* TABLE */}
        <div className="table-container">
          <table className="college-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Full Name</th>
                <th>Admission ID</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Semester</th>
                <th>Course</th>
                <th style={{ textAlign: "center" }}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: "center", padding: "40px", fontStyle: "italic", color: "#64748b" }}>
                    Fetching student records...
                  </td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>
                    {search || semesterFilter || departmentFilter
                      ? "No matching student records found."
                      : "No students registered yet. Click \"Add New Student\" to start."}
                  </td>
                </tr>
              ) : (
                filteredStudents.map((stu, index) => (
                  <tr key={stu._id}>
                    <td>{index + 1}</td>
                    <td><strong>{stu.name}</strong></td>
                    <td><code>{stu.admissionNo}</code></td>
                    <td>{stu.email}</td>
                    <td>{stu.phone}</td>
                    <td>Sem {stu.semester}</td>
                    <td>{stu.department}</td>
                    <td className="action-col">
                      <button
                        onClick={() => navigate(`/college/students/edit/${stu._id}`)}
                        className="edit-btn"
                      >
                        Edit
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => deleteStudent(stu._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default ManageStudents;
