import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../api";

function EditStaff() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    qualification: "",
    phone: "",
    email: "",
    subjects: [],
  });

  const [errors, setErrors] = useState({});
  const [subjectsList, setSubjectsList] = useState([]);

  // Search
  const [searchText, setSearchText] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  // ==========================
  // Load staff + subjects
  // ==========================
  useEffect(() => {
    const loadData = async () => {
      try {
        const [subjectRes, staffRes] = await Promise.all([
          api.get("/subjects/all"),
          api.get(`/staff/${id}`)
        ]);

        setSubjectsList(subjectRes.data);

        const s = staffRes.data;

        setForm({
          name: s.name,
          qualification: s.qualification,
          phone: s.phone,
          email: s.email,       // cannot edit
          subjects: s.subjects.map((x) => x._id),
        });

      } catch (err) {
        console.log(err);
      }
    };

    loadData();
  }, [id]);

  // ==========================
  // Validation
  // ==========================
  const validate = () => {
    const err = {};

    if (!form.name.trim()) err.name = "Name is required";

    if (!form.qualification.trim())
      err.qualification = "Qualification required";

    if (!/^\d{10}$/.test(form.phone))
      err.phone = "Enter valid 10-digit phone number";

    if (form.subjects.length === 0)
      err.subjects = "Select at least one subject";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  // ==========================
  // Submit Update
  // ==========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return alert("Fix errors before submitting");

    try {
      await api.put(`/staff/update/${id}`, form);
      alert("Staff updated successfully!");
      navigate("/college/staff");
    } catch (err) {
      console.log(err);
      alert("Error updating staff");
    }
  };

  return (
    <div className="bgg">
      <div className="college-form-wrapper">
        <h2>Edit Staff</h2>

        <form onSubmit={handleSubmit}>

          {/* Name */}
          <input
            value={form.name}
            placeholder="Staff Name"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <p className="error text-danger">{errors.name}</p>

          {/* Qualification */}
          <input
            value={form.qualification}
            placeholder="Qualification"
            onChange={(e) =>
              setForm({ ...form, qualification: e.target.value })
            }
          />
          <p className="error text-danger">{errors.qualification}</p>

          {/* Phone */}
          <input
            value={form.phone}
            placeholder="Phone Number"
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <p className="error text-danger">{errors.phone}</p>

          {/* Email (NON-editable) */}
          <input value={form.email} disabled />

          {/* SUBJECT MULTI SELECT */}
          <div className="subject-search-box">

            {/* Search input */}
            <input
              type="text"
              className="subject-search-input"
              placeholder="Search subjects…"
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value.toLowerCase());
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
            />

            {/* Selected chips */}
            <div className="selected-area">
              {form.subjects.map((id) => {
                const sub = subjectsList.find((s) => s._id === id);
                return (
                  <span key={id} className="chip">
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

            {/* Suggestions */}
            {showSuggestions && searchText && (
              <div className="dropdown">
                {subjectsList
                  .filter(
                    (s) =>
                      s.subjectName.toLowerCase().includes(searchText) ||
                      s.subjectCode.toLowerCase().includes(searchText)
                  )
                  .slice(0, 8)
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

          <button type="submit">Save Changes</button>
        </form>
      </div>
    </div>
  );
}

export default EditStaff;
