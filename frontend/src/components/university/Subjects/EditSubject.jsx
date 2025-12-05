import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../admincss.css"
import api from "../../../../api";


function EditSubject() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    subjectCode: "",
    subjectName: "",
    course: "",
    semester: "",
    // status: "",
  });

  useEffect(() => {
    api.get(`/subjects/${id}`).then((res) => setForm(res.data));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await api.put(`/subjects/update/${id}`, form);
    alert("Subject updated successfully");
    navigate("/admin/subjects");
  };

  return (
    <div className="admin-page">

      <div className="form-card">
        <h2>Edit Subject</h2>

        <form onSubmit={handleSubmit}>
          <input
            value={form.subjectCode}
            disabled
          />

          <input
            value={form.subjectName}
            onChange={(e) =>
              setForm({ ...form, subjectName: e.target.value })
            }
          />

          <input
            value={form.course}
            onChange={(e) =>
              setForm({ ...form, course: e.target.value })
            }
          />

          <input
            type="number"
            value={form.semester}
            onChange={(e) =>
              setForm({ ...form, semester: e.target.value })
            }
          />

          {/* <select
            value={form.status}
            onChange={(e) =>
              setForm({ ...form, status: e.target.value })
            }
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select> */}

          <button type="submit">Save Changes</button>
        </form>
      </div>

    </div>
  );
}

export default EditSubject;
