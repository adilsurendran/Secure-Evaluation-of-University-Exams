import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api";

function ManageColleges() {
  const navigate = useNavigate();
  const [colleges, setColleges] = useState([]);

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const res = await api.get("/colleges/all");
        setColleges(res.data);
      } catch (err) {
        console.log("Error loading colleges:", err);
      }
    };

    fetchColleges();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this college?")) {
      return;
    }

    try {
      await api.delete(`/colleges/delete/${id}`);
      setColleges(colleges.filter((c) => c._id !== id));
      alert("College deleted successfully!");
    } catch (err) {
      console.log("Delete error:", err);
      alert("Error deleting college");
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

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

        .add-college-btn {
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

        .add-college-btn:hover {
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

        @media (max-width: 768px) {
          .college-page {
            padding: 20px;
          }

          .college-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }

          .college-header h2 {
            font-size: 24px;
          }

          .college-table-container {
            overflow-x: auto;
          }

          .college-table {
            font-size: 13px;
          }

          .college-table thead th,
          .college-table tbody td {
            padding: 12px 8px;
          }

          .action-col {
            flex-direction: column;
          }
        }
      `}</style>

      <div className="college-page">
        <div className="college-header">
          <h2>🏛️ Manage Colleges</h2>
          <button
            className="add-college-btn"
            onClick={() => navigate("/admin/register-college")}
          >
            + Add College
          </button>
        </div>

        <div className="college-table-container">
          <table className="college-table">
            <thead>
              <tr>
                <th>#</th>
                <th>College Name</th>
                <th>Email</th>
                <th>Contact</th>
                <th>Subjects</th>
                <th style={{ textAlign: "center" }}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {colleges.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>
                    No colleges available. Click "Add College" to get started.
                  </td>
                </tr>
              )}

              {colleges.map((c, index) => (
                <tr key={c._id}>
                  <td>{index + 1}</td>
                  <td><strong>{c.name}</strong></td>
                  <td>{c.email}</td>
                  <td>{c.contact}</td>
                  <td>
                    {c.subjects?.map((s) => s.subjectName).join(", ") || "—"}
                  </td>
                  <td className="action-col">
                    <button
                      className="edit-btn"
                      onClick={() => navigate(`/admin/college/edit/${c._id}`)}
                    >
                      Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(c._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default ManageColleges;
