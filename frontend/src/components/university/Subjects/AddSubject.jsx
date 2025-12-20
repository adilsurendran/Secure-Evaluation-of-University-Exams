import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../admincss.css"
import api from "../../../../api";


function AddSubject() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    subjectCode: "",
    subjectName: "",
    course: "",
    semester: "",
    total_mark: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    await api.post("/subjects/add", form);
    alert("Subject added successfully");
    navigate("/admin/subjects");
  };

  return (
    <div className="admin-page">

      <div className="form-card">
        <h2>Add Subject</h2>

        <form onSubmit={handleSubmit}>

          <input
            placeholder="Subject Code"
            onChange={(e) =>
              setForm({ ...form, subjectCode: e.target.value })
            }
            required
          />

          <input
            placeholder="Subject Name"
            onChange={(e) =>
              setForm({ ...form, subjectName: e.target.value })
            }
            required
          />

          <input
            placeholder="Course (e.g., BCA)"
            onChange={(e) =>
              setForm({ ...form, course: e.target.value })
            }
            required
          />

          {/* <input
            type="number"
            placeholder="Semester"
            onChange={(e) =>
              setForm({ ...form, semester: e.target.value })
            }
            required
          /> */}
          <select
  value={form.semester}
  onChange={(e) =>
    setForm({ ...form, semester: e.target.value })
  }
  required
>
  <option value="">Select Semester</option>
  <option value="1">1</option>
  <option value="2">2</option>
  <option value="3">3</option>
  <option value="4">4</option>
  <option value="5">5</option>
  <option value="6">6</option>
  <option value="7">7</option>
  <option value="8">8</option>
</select>


          <input
            type="number"
            placeholder="Total mark"
            onChange={(e) =>
              setForm({ ...form, total_mark: e.target.value })
            }
            required
          />

          <button type="submit">Add Subject</button>
        </form>
      </div>

    </div>
  );
}

export default AddSubject;
