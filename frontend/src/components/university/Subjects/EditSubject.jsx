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

    const COURSE_LIST = [
  // UG – Arts & Science
  "BA English",
  "BA Malayalam",
  "BA Economics",
  "BA History",
  "BA Political Science",
  "BSc Mathematics",
  "BSc Physics",
  "BSc Chemistry",
  "BSc Computer Science",
  "BSc Statistics",
  "BSc Psychology",
  "BSc Biotechnology",
  "BSc Zoology",
  "BSc Botany",

  // UG – Commerce & Management
  "BCom Finance",
  "BCom Cooperation",
  "BCom Computer Applications",
  "BBA",
  "BBM",

  // UG – Computer / Tech
  "BCA",
  "BSc IT",
  "BTech Computer Science",
  "BTech Information Technology",
  "BTech Electronics",
  "BTech Mechanical",
  "BTech Civil",

  // PG – Arts & Science
  "MA English",
  "MA Economics",
  "MA History",
  "MSc Mathematics",
  "MSc Physics",
  "MSc Chemistry",
  "MSc Computer Science",
  "MSc Psychology",

  // PG – Commerce / Management
  "MCom Finance",
  "MCom Marketing",
  "MBA",
  "MBA Finance",
  "MBA HR",
  "MBA Marketing",

  // PG – Tech
  "MCA",
  "MTech Computer Science",
  "MTech Electronics",

  // Education & Others
  "BEd",
  "MEd",
  "LLB",
  "LLM",
  "Diploma in Computer Applications",
  "Diploma in Electronics"
];

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

          <select
  value={form.course}
  onChange={(e) =>
    setForm({ ...form, course: e.target.value })
  }
  required
>
  <option value="">Select Course</option>

  {COURSE_LIST.map((course, index) => (
    <option key={index} value={course}>
      {course}
    </option>
  ))}
</select>


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
