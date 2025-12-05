import React, { useState, useEffect } from "react";
import api from "../../../api";
import { useNavigate } from "react-router-dom";

function AddStaff() {
  const navigate = useNavigate();
    const collegeId = localStorage.getItem("collegeId");


  const [form, setForm] = useState({
    collegeId: collegeId,        // auto-filled from logged-in college later
    name: "",
    qualification: "",
    phone: "",
    email: "",
    password: "",
    subjects: [],
  });

  const [errors, setErrors] = useState({});
  const [subjectsList, setSubjectsList] = useState([]);

  // Searchable subject box state
  const [searchText, setSearchText] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  // -------------------------------------------
  // Load subjects from backend
  // -------------------------------------------
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

  // -------------------------------------------
  // Validate form
  // -------------------------------------------
  const validate = () => {
    const err = {};

    if (!form.name.trim()) err.name = "Name is required";
    if (!form.qualification.trim()) err.qualification = "Qualification required";

    if (!/^\d{10}$/.test(form.phone))
      err.phone = "Enter valid 10-digit phone number";

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      err.email = "Enter valid email";

    if (!form.password.trim() || form.password.length < 6)
      err.password = "Password must be at least 6 characters";

    if (form.subjects.length === 0)
      err.subjects = "Select at least one subject";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  // -------------------------------------------
  // Submit handler
  // -------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return alert("Please correct the errors!");
    console.log(form);
    

    try {
      const res = await api.post("/staff/create", form);
      alert("Staff Registered Successfully!");

      // Reset form
      setForm({
        collegeId: form.collegeId,
        name: "",
        qualification: "",
        phone: "",
        email: "",
        password: "",
        subjects: [],
      });

      navigate("/college/staff");
    } catch (err) {
      console.log(err);
      alert("Error registering staff");
    }
  };

//   console.log(form);
  

  return (
    <div className="bgg">
      <div className="college-form-wrapper">
        <h2>Add Staff</h2>

        <form onSubmit={handleSubmit}>

          {/* Name */}
          <input
            placeholder="Staff Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <p className="error text-danger">{errors.name}</p>

          {/* Qualification */}
          <input
            placeholder="Qualification (MCA, M.Sc, PhD...)"
            value={form.qualification}
            onChange={(e) =>
              setForm({ ...form, qualification: e.target.value })
            }
          />
          <p className="error text-danger">{errors.qualification}</p>

          {/* Phone */}
          <input
            placeholder="Phone Number"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <p className="error text-danger">{errors.phone}</p>

          {/* Email */}
          <input
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <p className="error text-danger">{errors.email}</p>

          {/* Password */}
          <input
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <p className="error text-danger">{errors.password}</p>

          {/* SUBJECT SEARCH + MULTI SELECT */}
          <div className="subject-search-box">

            {/* Search box */}
            <input
              type="text"
              className="subject-search-input"
              placeholder="Search subjects by name or code..."
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value.toLowerCase());
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
            />

            {/* Selected Subjects */}
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

            {/* Suggestions list */}
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

          <p className="error text-danger">{errors.subjects}</p>

          <button type="submit">Register Staff</button>
        </form>
      </div>
    </div>
  );
}

export default AddStaff;
