import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api";

function AddStudent() {
  const navigate = useNavigate();

  // Auto-fill collegeId from login
  const collegeId = localStorage.getItem("collegeId");

  const [form, setForm] = useState({
    collegeId,
    name: "",
    admissionNo: "",
    email: "",
    phone: "",
    password: "",
    semester: "",
    department: "",
    subjects: [], // Optional: assigned subjects
  });

  const [errors, setErrors] = useState({});
  const [subjectsList, setSubjectsList] = useState([]);

  // For searchable subjects
  const [searchText, setSearchText] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Load subjects assigned to this college
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await api.get("/subjects/all");
        setSubjectsList(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchSubjects();
  }, []);

  // Validation function
  const validate = () => {
    const err = {};

    if (!form.name.trim()) err.name = "Name is required";
    if (!form.admissionNo.trim()) err.admissionNo = "Admission No is required";

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      err.email = "Enter valid email";

    if (!/^\d{10}$/.test(form.phone))
      err.phone = "Enter valid 10-digit phone number";

    if (!form.password || form.password.length < 6)
      err.password = "Password must be at least 6 characters";

    if (!form.semester) err.semester = "Select a semester";
    if (!form.department.trim()) err.department = "Department is required";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  // Submit student
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return alert("Please correct the errors!");

    try {
      await api.post("/student/create", form);

      alert("Student Registered Successfully!");

      setForm({
        collegeId,
        name: "",
        admissionNo: "",
        email: "",
        phone: "",
        password: "",
        semester: "",
        department: "",
        subjects: [],
      });

      navigate("/college/students");
    } catch (err) {
      console.log(err);
      alert("Error registering student");
    }
  };

  return (
    <div className="bgg">
      <div className="college-form-wrapper">
        <h2>Add Student</h2>

        <form onSubmit={handleSubmit}>

          {/* Name */}
          <input
            placeholder="Student Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <p className="error text-danger">{errors.name}</p>

          {/* Admission No */}
          <input
            placeholder="Admission Number"
            value={form.admissionNo}
            onChange={(e) => setForm({ ...form, admissionNo: e.target.value })}
          />
          <p className="error text-danger">{errors.admissionNo}</p>

          {/* Email */}
          <input
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <p className="error text-danger">{errors.email}</p>

          {/* Phone */}
          <input
            placeholder="Phone Number"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <p className="error text-danger">{errors.phone}</p>

          {/* Password */}
          <input
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <p className="error text-danger">{errors.password}</p>

          {/* Semester */}
          <select
            value={form.semester}
            onChange={(e) => setForm({ ...form, semester: e.target.value })}
          >
            <option value="">Select Semester</option>
            <option value="1">Sem 1</option>
            <option value="2">Sem 2</option>
            <option value="3">Sem 3</option>
            <option value="4">Sem 4</option>
            <option value="5">Sem 5</option>
            <option value="6">Sem 6</option>
            <option value="6">Sem 7</option>
            <option value="6">Sem 8</option>
          </select>
          <p className="error text-danger">{errors.semester}</p>

          {/* Department */}
          <input
            placeholder="Department (e.g. BCA, BSc CS)"
            value={form.department}
            onChange={(e) => setForm({ ...form, department: e.target.value })}
          />
          <p className="error text-danger">{errors.department}</p>

          {/* OPTIONAL SUBJECT SELECT (Same UI as staff) */}
          <div className="subject-search-box">
            <input
              type="text"
              className="subject-search-input"
              placeholder="Search subjects..."
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value.toLowerCase());
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
            />

            <div className="selected-area">
              {form.subjects.length === 0 && (
                <span className="placeholder">No subjects selected</span>
              )}

              {form.subjects.map((id) => {
                const sub = subjectsList.find((s) => s._id === id);
                return (
                  <span className="chip" key={id}>
                    {sub.subjectName} ({sub.subjectCode})
                    <span
                      className="remove-chip"
                      onClick={() =>
                        setForm({
                          ...form,
                          subjects: form.subjects.filter((x) => x !== id),
                        })
                      }
                    >
                      ×
                    </span>
                  </span>
                );
              })}
            </div>

            {showSuggestions && searchText && (
              <div className="dropdown">
                {subjectsList
                  .filter(
                    (s) =>
                      s.subjectName.toLowerCase().includes(searchText) ||
                      s.subjectCode.toLowerCase().includes(searchText)
                  )
                  .slice(0, 7)
                  .map((s) => (
                    <div
                      key={s._id}
                      className="dropdown-item"
                      onClick={() => {
                        if (!form.subjects.includes(s._id)) {
                          setForm({
                            ...form,
                            subjects: [...form.subjects, s._id],
                          });
                        }
                        setShowSuggestions(false);
                        setSearchText("");
                      }}
                    >
                      {s.subjectName} ({s.subjectCode})
                    </div>
                  ))}
              </div>
            )}
          </div>

          <button type="submit">Register Student</button>
        </form>
      </div>
    </div>
  );
}

export default AddStudent;
