import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../admincss.css"
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
    <div className="admin-page">

      <div className="admin-header">
        <h2>Manage Subjects</h2>
        <button
          className="add-btn"
          onClick={() => navigate("/admin/subjects/add")}
        >
          + Add Subject
        </button>
      </div>

      <div className="mt-3 college-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Code</th>
              <th>Name</th>
              <th>Course</th>
              <th>Semester</th>
              {/* <th>Status</th> */}
              <th style={{ textAlign: "center" }}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {subjects.map((sub, index) => (
              <tr key={sub._id}>
                <td>{index + 1}</td>
                <td>{sub.subjectCode}</td>
                <td>{sub.subjectName}</td>
                <td>{sub.course}</td>
                <td>{sub.semester}</td>
                {/* <td>{sub.status}</td> */}
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
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default SubjectList;
