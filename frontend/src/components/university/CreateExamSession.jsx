import React, { useEffect, useState } from "react";
import api from "../../../api";

function CreateExamSession() {
  const [form, setForm] = useState({
    name: "",
    academicYear: "",
    semester: "",
    startDate: "",
    endDate: "",
    subjects: [],
    courses: [],
  });

  const [subjectsList, setSubjectsList] = useState([]);
  const [open, setOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);


  useEffect(() => {
    const fetchSubjects = async () => {
      const res = await api.get("/subjects/all");
      setSubjectsList(res.data);
    };
    fetchSubjects();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await api.post("/exam-sessions/create", form);
    alert("Exam Session Created!");
  };

  return (
    <div className="bgg">
      <div className="college-form-wrapper">
        <h2>Create Exam Session</h2>

        <form onSubmit={handleSubmit}>
          
          <input placeholder="Session Name"
            onChange={(e) => setForm({ ...form, name: e.target.value })} />

          <input placeholder="Academic Year"
            onChange={(e) => setForm({ ...form, academicYear: e.target.value })} />

          <input placeholder="Semester"
            onChange={(e) => setForm({ ...form, semester: e.target.value })} />

          <input type="date"
            onChange={(e) => setForm({ ...form, startDate: e.target.value })} />

          <input type="date"
            onChange={(e) => setForm({ ...form, endDate: e.target.value })} />

          {/* SUBJECT MULTI SELECT */}
          {/* <div className="multi-select-box">
            <div className="selected-area" onClick={() => setOpen(!open)}>
              {form.subjects.length === 0 ? "Select Subjects" : ""}
              {form.subjects.map((id) => (
                <span key={id} className="chip">
                  {subjectsList.find((s) => s._id === id)?.subjectName}
                  <span
                    className="remove-chip"
                    onClick={(e) => {
                      e.stopPropagation();
                      setForm({
                        ...form,
                        subjects: form.subjects.filter((x) => x !== id),
                      });
                    }}
                  >
                    ×
                  </span>
                </span>
              ))}
            </div>

            {open && (
              <div className="dropdown">
                {subjectsList.map((s) => (
                  <div
                    key={s._id}
                    className="dropdown-item"
                    onClick={() =>
                      setForm({
                        ...form,
                        subjects: [...form.subjects, s._id],
                      })
                    }
                  >
                    {s.subjectName +"-"+ s.subjectCode}
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
    onChange={(e) => {
      const text = e.target.value.toLowerCase();
      setSearchText(text);
      setShowSuggestions(true);
    }}
  />

  {/* Selected Subjects as Chips */}
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
        .slice(0, 7) // limit suggestions
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


          <button>Create Session</button>
        </form>
      </div>
    </div>
  );
}

export default CreateExamSession;
