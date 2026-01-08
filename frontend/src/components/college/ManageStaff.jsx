import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api";

function ManageStaff() {
  const navigate = useNavigate();
  const collegeId = localStorage.getItem("collegeId");

  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔍 search + filters
  const [search, setSearch] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState("");

  // ================= LOAD STAFF =================
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/staff/college/${collegeId}`);
        setStaff(res.data);
      } catch (err) {
        console.log("Error loading staff:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, [collegeId]);

  // ================= DELETE =================
  const deleteStaff = async (id) => {
    if (!window.confirm("Are you sure you want to delete this staff member?")) return;

    try {
      await api.delete(`/staff/delete/${id}`);
      setStaff(staff.filter((s) => s._id !== id));
      alert("Staff member removed successfully!");
    } catch (err) {
      console.log("Delete error:", err);
      alert("Error deleting staff");
    }
  };

  // ================= TOGGLE AVAILABILITY =================
  const toggleAvailability = async (item) => {
    const newStatus = !item.available;
    const confirmMsg = newStatus
      ? "Mark this staff as AVAILABLE for evaluation?"
      : "Mark this staff as NOT AVAILABLE?";

    if (!window.confirm(confirmMsg)) return;

    try {
      await api.put(`/staff/availability/${item._id}`, {
        available: newStatus
      });

      setStaff(staff.map((s) =>
        s._id === item._id ? { ...s, available: newStatus } : s
      ));
    } catch (err) {
      console.log("Update availability error:", err);
    }
  };

  // ================= DERIVED FILTERED DATA =================
  const filteredStaff = useMemo(() => {
    return staff.filter((s) => {
      const searchMatch = s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.email.toLowerCase().includes(search.toLowerCase());

      const statusMatch = !availabilityFilter ||
        (availabilityFilter === "available" && s.available) ||
        (availabilityFilter === "unavailable" && !s.available);

      return searchMatch && statusMatch;
    });
  }, [staff, search, availabilityFilter]);

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

        /* FILTER BAR */
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
        .filter-bar select { min-width: 180px; }

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

        /* TABLE */
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

        .college-table tbody td {
          padding: 16px;
          color: #1e293b;
        }

        /* CHIPS */
        .chip-small {
          display: inline-flex;
          padding: 4px 10px;
          background: #eff6ff;
          color: #1e40af;
          border: 1px solid #bfdbfe;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          margin: 2px;
        }

        .status-badge {
          display: inline-flex;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .status-available {
          background: #dcfce7;
          color: #15803d;
          border: 1px solid #bbf7d0;
        }

        .status-available:hover {
          background: #bbf7d0;
        }

        .status-unavailable {
          background: #fee2e2;
          color: #b91c1c;
          border: 1px solid #fecaca;
        }

        .status-unavailable:hover {
          background: #fecaca;
        }

        .action-col {
          display: flex;
          gap: 8px;
          justify-content: center;
        }

        .edit-btn,
        .delete-btn,
        .availability-btn {
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

        .availability-btn {
          background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
          color: white;
          box-shadow: 0 2px 8px rgba(99, 102, 241, 0.3);
        }

        .availability-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
        }

        @media (max-width: 1024px) {
          .filter-bar { flex-direction: column; align-items: stretch; }
        }

        @media (max-width: 768px) {
          .college-page { padding: 20px; }
          .college-header { flex-direction: column; align-items: flex-start; gap: 16px; }
          .table-container { overflow-x: auto; }
          .action-col { flex-direction: column; }
        }
      `}</style>

      <div className="college-page">
        {/* HEADER */}
        <div className="college-header">
          <h2>👥 Manage Staff</h2>
          <button
            className="add-btn"
            onClick={() => navigate("/college/staff/add")}
          >
            + Add New Staff
          </button>
        </div>

        {/* FILTER BAR */}
        <div className="filter-bar">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            value={availabilityFilter}
            onChange={(e) => setAvailabilityFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="available">Available</option>
            <option value="unavailable">Unavailable</option>
          </select>
          <button
            className="clear-btn"
            onClick={() => {
              setSearch("");
              setAvailabilityFilter("");
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
                <th>Staff Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Subjects</th>
                <th>Status</th>
                <th style={{ textAlign: "center" }}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center", padding: "40px", fontStyle: "italic", color: "#64748b" }}>
                    Fetching staff records...
                  </td>
                </tr>
              ) : filteredStaff.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>
                    {search || availabilityFilter
                      ? "No matching staff records found."
                      : "No staff members registered yet."}
                  </td>
                </tr>
              ) : (
                filteredStaff.map((s, index) => (
                  <tr key={s._id}>
                    <td>{index + 1}</td>
                    <td><strong>{s.name}</strong></td>
                    <td>{s.email}</td>
                    <td>{s.phone}</td>
                    <td>
                      {s.subjects && s.subjects.length > 0 ? (
                        s.subjects.map((sub) => (
                          <span key={sub._id} className="chip-small">
                            {sub.subjectCode}
                          </span>
                        ))
                      ) : (
                        <span style={{ color: "#94a3b8", fontStyle: "italic" }}>No subjects</span>
                      )}
                    </td>
                    <td>
                      <span
                        className={`status-badge ${s.available ? "status-available" : "status-unavailable"}`}
                        onClick={() => toggleAvailability(s)}
                        title="Click to toggle availability"
                      >
                        {s.available ? "● Available" : "● Unavailable"}
                      </span>
                    </td>
                    <td className="action-col">
                      <button
                        onClick={() => toggleAvailability(s)}
                        className="availability-btn"
                      >
                        Available?
                      </button>
                      <button
                        onClick={() => navigate(`/college/staff/edit/${s._id}`)}
                        className="edit-btn"
                      >
                        Edit
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => deleteStaff(s._id)}
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

export default ManageStaff;
