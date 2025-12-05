import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../api";

function EditCollege() {
  const { id } = useParams(); // college ID from URL
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    name: "",
    address: "",
    contact: "",
    email: "",
    subjects: [],
  });

  const [subjectsList, setSubjectsList] = useState([]);
  const [errors, setErrors] = useState({});
  const [searchText, setSearchText] = useState("");
const [showSuggestions, setShowSuggestions] = useState(false);


  // Load subjects + existing college data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const subRes = await api.get("/subjects/all");
        setSubjectsList(subRes.data);

        const colRes = await api.get(`/colleges/${id}`);
        const data = colRes.data;

        setForm({
          name: data.name,
          address: data.address,
          contact: data.contact,
          email: data.email,
          subjects: data.subjects?.map((s) => s._id) || [],
        });
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [id]);

  // Validation
  const validate = () => {
    let err = {};

    if (!form.name.trim()) err.name = "Name is required";
    if (!form.address.trim()) err.address = "Address is required";

    if (!/^\d{10}$/.test(form.contact))
      err.contact = "Enter valid 10-digit contact number";

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      err.email = "Enter valid email";

    if (form.subjects.length === 0)
      err.subjects = "Select at least 1 subject";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  // Submit update
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate())
      return alert("Complete all fields in required format");

    try {
      await api.put(`/colleges/update/${id}`, form);
      alert("College Updated Successfully!");
      navigate("/admin/manage-colleges");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="bgg">
      <div className="college-form-wrapper">
        <h2>Edit College</h2>

        <form onSubmit={handleSubmit}>

          <input
            placeholder="College Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <p className="error text-danger">{errors.name}</p>

          <textarea
            placeholder="Address"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />
          <p className="error text-danger">{errors.address}</p>

          <input
            placeholder="Contact Number"
            value={form.contact}
            onChange={(e) => setForm({ ...form, contact: e.target.value })}
          />
          <p className="error text-danger">{errors.contact}</p>

          <input
            placeholder="Email"
            disabled
            value={form.email}
          />
          <p className="error text-danger">{errors.email}</p>

          {/* SUBJECT MULTI SELECT */}
          {/* <div className="multi-select-box">
            <div className="selected-area" onClick={() => setOpen(!open)}>
              {form.subjects.length === 0 && <span>Select Subjects</span>}

              {form.subjects.map((subId) => {
                const sub = subjectsList.find((s) => s._id === subId);
                return (
                  <span key={subId} className="chip">
                    {sub?.subjectName}
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
          </div>

          <p className="error text-danger">{errors.subjects}</p> */}
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
          {sub?.subjectName} ({sub?.subjectCode})
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


          <button>Save Changes</button>
        </form>
      </div>
    </div>
  );
}

export default EditCollege;
