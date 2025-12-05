import React, { useState, useEffect } from "react";
import api from "../../../api";
import { useNavigate } from "react-router-dom";


function RegisterCollege() {
  const [open, setOpen] = useState(false);
    const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    address: "",
    contact: "",
    email: "",
    password:"",
    subjects: [],
  });

  const [errors, setErrors] = useState({});
  const [subjectsList, setSubjectsList] = useState([]);
  const [searchText, setSearchText] = useState("");
const [showSuggestions, setShowSuggestions] = useState(false);


  // Load subjects from database
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await api.get("/subjects/all");
        setSubjectsList(res.data);
      } catch (e) {
        console.log(e);
      }
    };
    fetchSubjects();
  }, []);

  // Validation
  const validate = () => {
    let err = {};

    if (!form.name.trim()) err.name = "Name is required";
    if (!form.address.trim()) err.address = "Address is required";
    if (!form.password.trim()) err.password = "Password is required";

    if (!/^\d{10}$/.test(form.contact))
      err.contact = "Enter valid 10-digit contact number";

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      err.email = "Enter valid email";

    if (form.subjects.length === 0)
      err.subjects = "Select at least 1 subject";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate())
      return alert("Complete all fields in required format");

    try {
      const res = await api.post("/colleges/register", form);
      alert("College Registered Successfully!");

setForm({
  name: "",
  address: "",
  contact: "",
  email: "",
  password: "",
  subjects: [],
});

// Close dropdown if open
setOpen(false);

// Navigate to Manage Colleges
navigate("/admin/manage-colleges");

    } catch (error) {
      console.log(error);
    }
  };

  // Handle subject selection
  // const handleSubjectSelect = (e) => {
  //   const selected = Array.from(e.target.selectedOptions, (opt) => opt.value);
  //   setForm({ ...form, subjects: selected });
  // };

  return (
    <div className="bgg">
      <div className="college-form-wrapper">
        <h2>College Registration</h2>

        <form onSubmit={handleSubmit}>
          
          <input
            placeholder="College Name"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <p className="error text-danger">{errors.name}</p>

          <textarea
            placeholder="Address"
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />
          <p className="error text-danger">{errors.address}</p>

          <input
            placeholder="Contact Number"
            onChange={(e) => setForm({ ...form, contact: e.target.value })}
          />
          <p className="error text-danger">{errors.contact}</p>

          <input
            placeholder="Email"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <p className="error text-danger">{errors.email}</p>

          <input
            placeholder="Password"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <p className="error text-danger">{errors.password}</p>

          {/* SUBJECT MULTI SELECT */}
{/* <div className="multi-select-box">
  <div className="selected-area" onClick={() => setOpen(!open)}>
    {form.subjects.length === 0 && (
      <span>Select Subjects</span>
    )}

    {form.subjects.map((subId) => {
      const sub = subjectsList.find((s) => s._id === subId);
      return (
        <span key={subId} className="chip">
          {sub.subjectName}
          <span
            className="remove-chip"
            onClick={(e) => {
              e.stopPropagation();
              setForm({
                ...form,
                subjects: form.subjects.filter((id) => id !== subId),
              });
            }}
          >
            ×
          </span>
        </span>
      );
    })}
  </div>

  {open && (
    <div className="dropdown">
      {subjectsList.map((sub) => (
        <div
          key={sub._id}
          className="dropdown-item"
          onClick={() => {
            if (!form.subjects.includes(sub._id)) {
              setForm({
                ...form,
                subjects: [...form.subjects, sub._id],
              });
            }
          }}
        >
          {sub.subjectCode} - {sub.subjectName}
        </div>
      ))}
    </div>
  )}
</div> */}
{/* SUBJECT SEARCH + MULTI SELECT */}
<div className="subject-search-box">

  {/* Search Input */}
  <input
    type="text"
    className="subject-search-input"
    placeholder="Search subject by name or code..."
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

  {/* Suggestions Dropdown */}
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




          <button>Submit</button>
        </form>
      </div>
    </div>
  );
}

export default RegisterCollege;
