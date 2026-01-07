import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../api";
import "./collegecss.css";

function EditCollege() {
  const { id } = useParams();
  const navigate = useNavigate();

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
  const [selectedCourses, setSelectedCourses] = useState([]);

  const COURSE_LIST = [
    "BA English", "BA Malayalam", "BA Economics", "BA History", "BA Political Science",
    "BSc Mathematics", "BSc Physics", "BSc Chemistry", "BSc Computer Science",
    "BSc Statistics", "BSc Psychology", "BSc Biotechnology", "BSc Zoology", "BSc Botany",
    "BCom Finance", "BCom Cooperation", "BCom Computer Applications", "BBA", "BBM",
    "BCA", "BSc IT", "BTech Computer Science", "BTech Information Technology",
    "BTech Electronics", "BTech Mechanical", "BTech Civil",
    "MA English", "MA Economics", "MA History", "MSc Mathematics", "MSc Physics",
    "MSc Chemistry", "MSc Computer Science", "MSc Psychology",
    "MCom Finance", "MCom Marketing", "MBA", "MBA Finance", "MBA HR", "MBA Marketing",
    "MCA", "MTech Computer Science", "MTech Electronics",
    "BEd", "MEd", "LLB", "LLM", "Diploma in Computer Applications", "Diploma in Electronics",
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const subRes = await api.get("/subjects/all");
        const subjects = subRes.data;
        setSubjectsList(subjects);

        const colRes = await api.get(`/colleges/${id}`);
        const data = colRes.data;

        const subjectIds = data.subjects?.map((s) => s._id) || [];

        setForm({
          name: data.name,
          address: data.address,
          contact: data.contact,
          email: data.email,
          subjects: subjectIds,
        });

        const detectedCourses = subjects
          .filter((s) => subjectIds.includes(s._id))
          .map((s) => s.course);

        setSelectedCourses([...new Set(detectedCourses)]);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [id]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return alert("Fix validation errors");

    try {
      await api.put(`/colleges/update/${id}`, form);
      alert("College Updated Successfully");
      navigate("/admin/manage-colleges");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="bgg">
      <div className="back-container">
        <button className="back-btn" onClick={() => navigate("/admin/manage-colleges")}>
          ← Back to Colleges
        </button>
      </div>
      <div className="college-form-wrapper">
        <h2>✏️ Edit College</h2>

        <form onSubmit={handleSubmit}>
          <input
            placeholder="College Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <p className="error">{errors.name}</p>

          <textarea
            placeholder="Address"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />
          <p className="error">{errors.address}</p>

          <input
            placeholder="Contact Number"
            value={form.contact}
            onChange={(e) => setForm({ ...form, contact: e.target.value })}
          />
          <p className="error">{errors.contact}</p>

          <input value={form.email} disabled />
          <p className="form-label">Email cannot be changed</p>
          <p className="error">{errors.email}</p>

          <select
            onChange={(e) => {
              const course = e.target.value;
              if (!course || selectedCourses.includes(course)) return;

              setSelectedCourses((prev) => [...prev, course]);

              const courseSubjectIds = subjectsList
                .filter((s) => s.course === course)
                .map((s) => s._id);

              setForm((prev) => ({
                ...prev,
                subjects: Array.from(
                  new Set([...prev.subjects, ...courseSubjectIds])
                ),
              }));
            }}
          >
            <option value="">Select Course (Optional)</option>
            {COURSE_LIST.map((c, i) => (
              <option key={i} value={c}>
                {c}
              </option>
            ))}
          </select>

          <div className="selected-area">
            {selectedCourses.length === 0 && (
              <span className="placeholder">No courses selected</span>
            )}

            {selectedCourses.map((course) => (
              <span key={course} className="chip course-chip">
                {course}
                <span
                  className="remove-chip"
                  onClick={() => {
                    setSelectedCourses((prev) => prev.filter((c) => c !== course));
                    const courseSubjectIds = subjectsList
                      .filter((s) => s.course === course)
                      .map((s) => s._id);
                    setForm((prev) => ({
                      ...prev,
                      subjects: prev.subjects.filter(
                        (id) => !courseSubjectIds.includes(id)
                      ),
                    }));
                  }}
                >
                  ×
                </span>
              </span>
            ))}
          </div>

          <div className="subject-search-box">
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

            <div className="selected-area">
              {form.subjects.length === 0 && (
                <span className="placeholder">No subjects selected</span>
              )}

              {form.subjects.map((id) => {
                const sub = subjectsList.find((s) => s._id === id);
                return (
                  <span key={id} className="chip">
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

          <p className="error">{errors.subjects}</p>

          <div className="form-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate("/admin/manage-colleges")}
            >
              Cancel
            </button>
            <button type="submit">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditCollege;
