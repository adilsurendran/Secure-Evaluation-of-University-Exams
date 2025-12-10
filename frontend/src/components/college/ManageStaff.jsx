import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api";

function ManageStaff() {
  const navigate = useNavigate();
  const [staff, setStaff] = useState([]);

  const collegeId = localStorage.getItem("collegeId");
//   console.log(collegeId);
  

  useEffect(() => {
    const fetchStaff = async () => {
      const res = await api.get(`/staff/college/${collegeId}`);
      setStaff(res.data);
    };

    fetchStaff();
  }, []);

  const deleteStaff = async (id) => {
    if (!window.confirm("Delete this staff?")) return;

    await api.delete(`/staff/delete/${id}`);
    setStaff(staff.filter((s) => s._id !== id));
  };

  const toggleAvailability = async (item) => {
  const newStatus = !item.available;

  const confirmMsg = newStatus 
    ? "Mark this staff as AVAILABLE?" 
    : "Mark this staff as NOT AVAILABLE?";

  if (!window.confirm(confirmMsg)) return;

  const res = await api.put(`/staff/availability/${item._id}`, {
    available: newStatus
  });

  setStaff(staff.map((s) =>
    s._id === item._id ? { ...s, available: newStatus } : s
  ));
};


  return (
    <div className="college-page">
      <div className="college-header">
        <h2>Manage Staff</h2>
        <button
          className="add-college-btn"
          onClick={() => navigate("/college/staff/add")}
        >
          + Add Staff
        </button>
      </div>

      <div className="college-table-container">
        <table className="college-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Subjects</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {staff.map((s, index) => (
              <tr key={s._id}>
                <td>{index + 1}</td>
                <td>{s.name}</td>
                <td>{s.email}</td>
                <td>{s.phone}</td>
                <td>
                  {s.subjects.map((sub) => (
                    <span key={sub._id} className="chip-small">
                      {sub.subjectCode}
                    </span>
                  ))}
                </td>
                {/* <td>
                  <button onClick={() => navigate(`/college/staff/edit/${s._id}`)} className="delete-btn">
                    Edit
                  </button>
                  <button onClick={() => deleteStaff(s._id)} className="delete-btn">
                    Delete
                  </button>
                </td> */}
                <td>
  <button 
    onClick={() => navigate(`/college/staff/edit/${s._id}`)} 
    className="delete-btn"
  >
    Edit
  </button>

  <button 
    onClick={() => deleteStaff(s._id)} 
    className="delete-btn"
  >
    Delete
  </button>

  {/* NEW AVAILABILITY BUTTON */}
  <button
    onClick={() => toggleAvailability(s)}
    className={s.available ? "delete-btn bg-green-600" : "delete-btn bg-red-600"}
  >
    {s.available ? "Available" : "Unavailable"}
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

export default ManageStaff;
