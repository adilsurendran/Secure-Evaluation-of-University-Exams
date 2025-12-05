import React, { useEffect, useState } from "react";
import api from "../../../api";

function ScheduleExam() {
  const [form, setForm] = useState({
    sessionId: "",
    subjectId: "",
    examDate: "",
    examTime: "",
    allowedColleges: [],
  });

  const [sessions, setSessions] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [errors, setErrors] = useState({});
  const [openCollegeDropdown, setOpenCollegeDropdown] = useState(false);
const [collegeSearch, setCollegeSearch] = useState("");
const [showCollegeSuggestions, setShowCollegeSuggestions] = useState(false);

  // Fetch sessions + colleges
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sessionRes, collegeRes] = await Promise.all([
          api.get("/exam-sessions/all"),
          api.get("/colleges/all"),
        ]);

        setSessions(sessionRes.data);
        setColleges(collegeRes.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  // Get subjects from selected session
  const selectedSession = sessions.find(
    (s) => s._id === form.sessionId
  );
  const availableSubjects = selectedSession?.subjects || [];

  const validate = () => {
    let err = {};

    if (!form.sessionId) err.sessionId = "Select an exam session";
    if (!form.subjectId) err.subjectId = "Select a subject";
    if (!form.examDate) err.examDate = "Select exam date";
    if (!form.examTime.trim()) err.examTime = "Enter exam time";
    if (form.allowedColleges.length === 0)
      err.allowedColleges = "Select at least one college";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      alert("Please fix the errors and try again");
      return;
    }

    try {
      await api.post("/exams/create", form);
      alert("Exam scheduled successfully!");

      setForm({
        sessionId: "",
        subjectId: "",
        examDate: "",
        examTime: "",
        allowedColleges: [],
      });
      setErrors({});
      setOpenCollegeDropdown(false);
    } catch (err) {
      console.log(err);
      alert("Error scheduling exam");
    }
  };

  // Toggle college selection (chips)
  const toggleCollege = (id) => {
    if (form.allowedColleges.includes(id)) {
      setForm({
        ...form,
        allowedColleges: form.allowedColleges.filter((x) => x !== id),
      });
    } else {
      setForm({
        ...form,
        allowedColleges: [...form.allowedColleges, id],
      });
    }
  };

  return (
    <div className="bgg">
      <div className="college-form-wrapper">
        <h2>Schedule Exam</h2>

        <form onSubmit={handleSubmit}>
          {/* Exam Session */}
          <select
            value={form.sessionId}
            onChange={(e) =>
              setForm({ ...form, sessionId: e.target.value, subjectId: "" })
            }
          >
            <option value="">Select Exam Session</option>
            {sessions.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name} - {s.academicYear} (Sem {s.semester})
              </option>
            ))}
          </select>
          <p className="error text-danger">{errors.sessionId}</p>

          {/* Subject */}
          <select
            value={form.subjectId}
            onChange={(e) =>
              setForm({ ...form, subjectId: e.target.value })
            }
            disabled={!form.sessionId}
          >
            <option value="">
              {form.sessionId ? "Select Subject" : "Select session first"}
            </option>
            {availableSubjects.map((sub) => (
              <option key={sub._id} value={sub._id}>
                {sub.subjectCode} - {sub.subjectName}
              </option>
            ))}
          </select>
          <p className="error text-danger">{errors.subjectId}</p>

          {/* Exam Date */}
          <input
            type="date"
            value={form.examDate}
            onChange={(e) =>
              setForm({ ...form, examDate: e.target.value })
            }
          />
          <p className="error text-danger">{errors.examDate}</p>

          {/* Exam Time */}
          <input
            placeholder="Exam Time (e.g. 10:00 AM - 1:00 PM)"
            value={form.examTime}
            onChange={(e) =>
              setForm({ ...form, examTime: e.target.value })
            }
          />
          <p className="error text-danger">{errors.examTime}</p>

          {/* Allowed Colleges (Multi-select like chips) */}
          {/* <div className="multi-select-box">
            <div
              className="selected-area"
              onClick={() => setOpenCollegeDropdown(!openCollegeDropdown)}
            >
              {form.allowedColleges.length === 0 && (
                <span>Select Allowed Colleges</span>
              )}

              {form.allowedColleges.map((colId) => {
                const col = colleges.find((c) => c._id === colId);
                return (
                  <span key={colId} className="chip">
                    {col?.name}
                    <span
                      className="remove-chip"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleCollege(colId);
                      }}
                    >
                      ×
                    </span>
                  </span>
                );
              })}
            </div>

            {openCollegeDropdown && (
              <div className="dropdown">
                {colleges.map((col) => (
                  <div
                    key={col._id}
                    className="dropdown-item"
                    onClick={() => toggleCollege(col._id)}
                  >
                    {col.name}
                  </div>
                ))}
              </div>
            )}
          </div>
          <p className="error text-danger">{errors.allowedColleges}</p> */}
          {/* SEARCHABLE COLLEGE MULTI SELECT */}
<div className="subject-search-box">

  {/* Search Input */}
  <input
    type="text"
    className="subject-search-input"
    placeholder="Search college..."
    value={collegeSearch}
    onChange={(e) => {
      setCollegeSearch(e.target.value.toLowerCase());
      setShowCollegeSuggestions(true);
    }}
    onFocus={() => setShowCollegeSuggestions(true)}
  />

  {/* Selected Colleges */}
  <div className="selected-area">
    {form.allowedColleges.length === 0 && (
      <span className="placeholder">No colleges selected</span>
    )}

    {form.allowedColleges.map((id) => {
      const col = colleges.find((c) => c._id === id);
      return (
        <span className="chip" key={id}>
          {col?.name}
          <span
            className="remove-chip"
            onClick={() =>
              setForm({
                ...form,
                allowedColleges: form.allowedColleges.filter((x) => x !== id),
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
  {showCollegeSuggestions && collegeSearch && (
    <div className="dropdown">
      {colleges
        .filter((c) =>
          c.name.toLowerCase().includes(collegeSearch)
        )
        .slice(0, 8)
        .map((c) => (
          <div
            key={c._id}
            className="dropdown-item"
            onClick={() => {
              if (!form.allowedColleges.includes(c._id)) {
                setForm({
                  ...form,
                  allowedColleges: [...form.allowedColleges, c._id],
                });
              }
              setShowCollegeSuggestions(false);
              setCollegeSearch("");
            }}
          >
            {c.name}
          </div>
        ))}
    </div>
  )}
</div>

<p className="error text-danger">{errors.allowedColleges}</p>


          <button type="submit">Schedule Exam</button>
        </form>
      </div>
    </div>
  );
}

export default ScheduleExam;
