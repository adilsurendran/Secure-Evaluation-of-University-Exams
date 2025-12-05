import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api";

function ManageStudents() {
  const navigate = useNavigate();

  const collegeId = localStorage.getItem("collegeId");
  const [students, setStudents] = useState([]);

  // Load all students under this college
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await api.get(`/student/college/${collegeId}`);
        setStudents(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchStudents();
  }, []);

  // Delete student
  const deleteStudent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;

    try {
      await api.delete(`/student/delete/${id}`);
      setStudents(students.filter((s) => s._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="college-page">
      {/* Header */}
      <div className="college-header">
        <h2>Manage Students</h2>

        <button
          className="add-college-btn"
          onClick={() => navigate("/college/students/add")}
        >
          + Add Student
        </button>
      </div>

      {/* Table */}
      <div className="college-table-container">
        <table className="college-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Admission No</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Semester</th>
              <th>Department</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {students.map((stu, index) => (
              <tr key={stu._id}>
                <td>{index + 1}</td>
                <td>{stu.name}</td>
                <td>{stu.admissionNo}</td>
                <td>{stu.email}</td>
                <td>{stu.phone}</td>
                <td>{stu.semester}</td>
                <td>{stu.department}</td>

                <td>
                  <button
                    onClick={() =>
                      navigate(`/college/students/edit/${stu._id}`)
                    }
                    className="delete-btn"
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
            ))}
          </tbody>
        </table>

        {students.length === 0 && (
          <p className="text-center mt-3">No students found</p>
        )}
      </div>
    </div>
  );
}

export default ManageStudents;
