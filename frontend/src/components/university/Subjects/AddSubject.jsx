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

          {/* <input
            placeholder="Course (e.g., BCA)"
            onChange={(e) =>
              setForm({ ...form, course: e.target.value })
            }
            required
          /> */}

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
