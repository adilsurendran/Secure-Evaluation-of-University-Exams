import React, { useEffect, useState } from "react";
import api from "../../../api";
import { useNavigate } from "react-router-dom";
import "./collegecss.css";

function CreateExamSession() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    academicYear: "",
    semester: "",
    startDate: "",
    endDate: "",
    subjects: [],
    allowedColleges: [],
  });

  const [subjectsList, setSubjectsList] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [courseSubjectMap, setCourseSubjectMap] = useState({});
  const [subjectSearch, setSubjectSearch] = useState("");
  const [showSubjectSuggestions, setShowSubjectSuggestions] = useState(false);
  const [collegeSearch, setCollegeSearch] = useState("");
  const [showCollegeSuggestions, setShowCollegeSuggestions] = useState(false);

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
    "BEd", "MEd", "LLB", "LLM", "Diploma in Computer Applications", "Diploma in Electronics"
  ];

  useEffect(() => {
    const fetchData = async () => {
      const [subRes, colRes] = await Promise.all([
        api.get("/subjects/all"),
        api.get("/colleges/all"),
      ]);
      setSubjectsList(subRes.data);
      setColleges(colRes.data);
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.academicYear || !form.semester || !form.startDate ||
      !form.endDate || form.subjects.length === 0 || form.allowedColleges.length === 0) {
      return alert("All fields including subjects and colleges are required");
    }

    await api.post("/exam-sessions/create", form);
    alert("Exam Session Created Successfully");
    navigate("/admin/exams");
  };

  const selectAllColleges = () => {
    const allCollegeIds = colleges.map((c) => c._id);
    setForm((prev) => ({ ...prev, allowedColleges: allCollegeIds }));
  };

  return (
    <div className="bgg">
      <div className="college-form-wrapper">
        <h2>📅 Create Exam Session</h2>

        <form onSubmit={handleSubmit}>
          <input placeholder="Session Name (e.g., Final Exam 2024)"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })} />

          <input placeholder="Academic Year (e.g., 2024-2025)"
            value={form.academicYear}
            onChange={(e) => setForm({ ...form, academicYear: e.target.value })} />

          <select
            value={form.semester}
            onChange={(e) => setForm({ ...form, semester: e.target.value, subjects: [] })}
          >
            <option value="">Select Semester</option>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
              <option key={s} value={s}>Semester {s}</option>
            ))}
          </select>

          <label>Start Date</label>
          <input
            type="date"
            min={new Date().toISOString().split("T")[0]}
            value={form.startDate}
            onChange={(e) => setForm({ ...form, startDate: e.target.value })}
          />

          <label>End Date</label>
          <input
            type="date"
            min={form.startDate || new Date().toISOString().split("T")[0]}
            disabled={!form.startDate}
            value={form.endDate}
            onChange={(e) => setForm({ ...form, endDate: e.target.value })}
          />

          <h4>Select Course (Optional)</h4>
          <select
            onChange={(e) => {
              const course = e.target.value;
              if (!course || selectedCourses.includes(course)) return;

              const courseSubjectIds = subjectsList
                .filter((s) => s.course === course && s.semester === Number(form.semester))
                .map((s) => s._id);

              setSelectedCourses((prev) => [...prev, course]);
              setCourseSubjectMap((prev) => ({ ...prev, [course]: courseSubjectIds }));
              setForm((prev) => ({
                ...prev,
                subjects: Array.from(new Set([...prev.subjects, ...courseSubjectIds])),
              }));
            }}
            disabled={!form.semester}
          >
            <option value="">Select Course</option>
            {COURSE_LIST.map((c, i) => (
              <option key={i} value={c}>{c}</option>
            ))}
          </select>

          <div className="selected-area">
            {selectedCourses.map((course) => (
              <span key={course} className="chip course-chip">
                {course}
                <span
                  className="remove-chip"
                  onClick={() => {
                    setSelectedCourses((prev) => prev.filter((c) => c !== course));
                    const subjectsToRemove = courseSubjectMap[course] || [];
                    setForm((prev) => ({
                      ...prev,
                      subjects: prev.subjects.filter((id) => !subjectsToRemove.includes(id)),
                    }));
                  }}
                >
                  ×
                </span>
              </span>
            ))}
          </div>

          <h4>Subjects</h4>
          {!form.semester && <p className="error">Select semester first</p>}

          {form.semester && (
            <div className="subject-search-box">
              <input
                type="text"
                className="subject-search-input"
                placeholder="Search subject..."
                value={subjectSearch}
                onChange={(e) => {
                  setSubjectSearch(e.target.value.toLowerCase());
                  setShowSubjectSuggestions(true);
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

              {showSubjectSuggestions && subjectSearch && (
                <div className="dropdown">
                  {subjectsList
                    .filter((s) =>
                      s.semester === Number(form.semester) &&
                      (s.subjectName.toLowerCase().includes(subjectSearch) ||
                        s.subjectCode.toLowerCase().includes(subjectSearch))
                    )
                    .slice(0, 8)
                    .map((s) => (
                      <div
                        key={s._id}
                        className="dropdown-item"
                        onClick={() => {
                          if (!form.subjects.includes(s._id)) {
                            setForm({ ...form, subjects: [...form.subjects, s._id] });
                          }
                          setSubjectSearch("");
                          setShowSubjectSuggestions(false);
                        }}
                      >
                        {s.subjectName} ({s.subjectCode})
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          <h4>Allowed Colleges (Session-wide)</h4>
          <button type="button" onClick={selectAllColleges} style={{ marginBottom: '10px' }}>
            Select All Colleges
          </button>

          <div className="subject-search-box">
            <input
              type="text"
              placeholder="Search college..."
              value={collegeSearch}
              onChange={(e) => {
                setCollegeSearch(e.target.value.toLowerCase());
                setShowCollegeSuggestions(true);
              }}
            />

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

            {showCollegeSuggestions && collegeSearch && (
              <div className="dropdown">
                {colleges
                  .filter((c) => c.name.toLowerCase().includes(collegeSearch))
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
                        setCollegeSearch("");
                        setShowCollegeSuggestions(false);
                      }}
                    >
                      {c.name}
                    </div>
                  ))}
              </div>
            )}
          </div>

          <button type="submit">Create Session</button>
        </form>
      </div>
    </div>
  );
}

export default CreateExamSession;
