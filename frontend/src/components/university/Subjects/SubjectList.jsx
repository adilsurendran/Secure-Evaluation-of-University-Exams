import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../../api";

function SubjectList() {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);

  const fetchSubjects = async () => {
    const res = await api.get("/subjects/all");
    setSubjects(res.data);
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const deleteSubject = async (id) => {
    if (!window.confirm("Are you sure you want to delete this subject?")) return;

    await api.delete(`/subjects/delete/${id}`);
    fetchSubjects();
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        .admin-page {
          padding: 32px;
          min-height: 100vh;
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 25%, #bfdbfe 50%, #e0f2fe 75%, #f0f9ff 100%);
          font-family: 'Inter', sans-serif;
        }

        .admin-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
          padding-bottom: 24px;
          border-bottom: 2px solid #e2e8f0;
        }

        .admin-header h2 {
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

        .college-table-container {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          border: 2px solid #e2e8f0;
        }

        .admin-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 15px;
        }

        .admin-table thead {
          background: #1e40af;
          color: white;
        }

        .admin-table thead th {
          padding: 16px;
          text-align: left;
          font-weight: 600;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .admin-table tbody tr {
          border-bottom: 1px solid #e2e8f0;
          transition: all 0.2s ease;
        }

        .admin-table tbody tr:hover {
          background: #f8fafc;
        }

        .admin-table tbody tr:last-child {
          border-bottom: none;
        }

        .admin-table tbody td {
          padding: 16px;
          color: #1e293b;
        }

        .action-col {
          text-align: center;
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

        /* Responsive */
        @media (max-width: 768px) {
          .admin-page {
            padding: 20px;
          }

          .admin-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }

          .admin-header h2 {
            font-size: 24px;
          }

          .college-table-container {
            overflow-x: auto;
          }

          .admin-table {
            font-size: 13px;
          }

          .admin-table thead th,
          .admin-table tbody td {
            padding: 12px 8px;
          }

          .action-col {
            flex-direction: column;
          }
        }
      `}</style>

      <div className="admin-page">
        <div className="admin-header">
          <h2>📚 Manage Subjects</h2>
          <button
            className="add-btn"
            onClick={() => navigate("/admin/subjects/add")}
          >
            + Add Subject
          </button>
        </div>

        <div className="college-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Code</th>
                <th>Name</th>
                <th>Course</th>
                <th>Semester</th>
                <th style={{ textAlign: "center" }}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {subjects.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>
                    No subjects found. Click "Add Subject" to get started.
                  </td>
                </tr>
              ) : (
                subjects.map((sub, index) => (
                  <tr key={sub._id}>
                    <td>{index + 1}</td>
                    <td><strong>{sub.subjectCode}</strong></td>
                    <td>{sub.subjectName}</td>
                    <td>{sub.course}</td>
                    <td>Sem {sub.semester}</td>
                    <td className="action-col">
                      <button
                        className="edit-btn"
                        onClick={() =>
                          navigate(`/admin/subjects/edit/${sub._id}`)
                        }
                      >
                        Edit
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() => deleteSubject(sub._id)}
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

export default SubjectList;

