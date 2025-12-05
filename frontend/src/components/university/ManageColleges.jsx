import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api";

function ManageColleges() {
  const navigate = useNavigate();
  const [colleges, setColleges] = useState([]);

  // Fetch all colleges from backend
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

    // Remove deleted college from UI
    setColleges(colleges.filter((c) => c._id !== id));

    alert("College deleted successfully!");
  } catch (err) {
    console.log("Delete error:", err);
    alert("Error deleting college");
  }
};

  return (
    <div className="college-page">

      {/* Header + Add Button */}
      <div className="college-header">
        <h2>Manage Colleges</h2>
        <button
          className="add-college-btn"
          onClick={() => navigate("/admin/register-college")}
        >
          + Add College
        </button>
      </div>

      {/* Colleges Table */}
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
                <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>
                  No colleges available
                </td>
              </tr>
            )}

            {colleges.map((c, index) => (
              <tr key={c._id}>
                <td>{index + 1}</td>
                <td>{c.name}</td>
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
  );
}

export default ManageColleges;
