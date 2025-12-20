import React, { useEffect, useState } from "react";
import api from "../../../api";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate()


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
    navigate("/admin/exams")
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

          <select
  value={form.semester}
  onChange={(e) => setForm({ ...form, semester: e.target.value })}
>
  <option value="">Select Semester</option>
  <option value="1">Semester 1</option>
  <option value="2">Semester 2</option>
  <option value="3">Semester 3</option>
  <option value="4">Semester 4</option>
  <option value="5">Semester 5</option>
  <option value="6">Semester 6</option>
  <option value="7">Semester 7</option>
  <option value="8">Semester 8</option>
</select>

{/* <label>Start Date</label> */}
          {/* <input type="date"
            onChange={(e) => setForm({ ...form, startDate: e.target.value })} /> */}
            {/* <input
  type="date"
  className="form-control"
  min={new Date().toISOString().split("T")[0]}
  onChange={(e) =>
    setForm({ ...form, startDate: e.target.value })
  }
/>

<label>End Date</label>

          <input type="date"
            onChange={(e) => setForm({ ...form, endDate: e.target.value })} /> */}
            <label>Start Date</label>
<input
  type="date"
  className="form-control mb-3"
  min={new Date().toISOString().split("T")[0]}
  onChange={(e) =>
    setForm({ ...form, startDate: e.target.value })
  }
/>

<label>End Date</label>
<input
  type="date"
  className="form-control"
  min={form.startDate || new Date().toISOString().split("T")[0]}
  onChange={(e) =>
    setForm({ ...form, endDate: e.target.value })
  }
  disabled={!form.startDate}
/>



          {/* SUBJECT SEARCH + MULTI SELECT */}
{/* <div className="subject-search-box">

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
</div> */}

{/* SUBJECT SEARCH + MULTI SELECT */}
<div className="subject-search-box">

  {!form.semester && (
    <p className="text-danger">Please select semester first</p>
  )}

  {form.semester && (
    <>
      {/* Search box */}
      <input
        type="text"
        className="subject-search-input"
        placeholder="Search subject..."
        value={searchText}
        onChange={(e) => {
          setSearchText(e.target.value.toLowerCase());
          setShowSuggestions(true);
        }}
      />

      {/* Selected chips */}
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

      {/* Suggestions */}
      {showSuggestions && searchText && (
        <div className="dropdown">
          {subjectsList
            .filter(
              (s) =>
                s.semester === Number(form.semester) && // 🔥 FILTER BY SEMESTER
                (s.subjectName.toLowerCase().includes(searchText) ||
                  s.subjectCode.toLowerCase().includes(searchText))
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
    </>
  )}
</div>



          <button>Create Session</button>
        </form>
      </div>
    </div>
  );
}

export default CreateExamSession;
