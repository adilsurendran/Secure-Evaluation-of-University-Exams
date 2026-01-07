import React, { useState, useEffect } from "react";
import api from "../../../api";
import { useNavigate } from "react-router-dom";

function AddStudent() {
  const navigate = useNavigate();

  const collegeId = localStorage.getItem("collegeId");

  const [form, setForm] = useState({
    collegeId,
    name: "",
    admissionNo: "",
    email: "",
    phone: "",
    password: "",
    semester: "",
    department: "", // ✅ auto-filled from course
    subjects: [],
  });

  const [errors, setErrors] = useState({});
  const [subjectsList, setSubjectsList] = useState([]);

  // ✅ single course
  const [selectedCourse, setSelectedCourse] = useState("");

  // subject search
  const [searchText, setSearchText] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  // ================= COURSE LIST =================
  const COURSE_LIST = [
    "BA English","BA Malayalam","BA Economics","BA History","BA Political Science",
    "BSc Mathematics","BSc Physics","BSc Chemistry","BSc Computer Science",
    "BSc Statistics","BSc Psychology","BSc Biotechnology","BSc Zoology","BSc Botany",
    "BCom Finance","BCom Cooperation","BCom Computer Applications","BBA","BBM",
    "BCA","BSc IT","BTech Computer Science","BTech Information Technology",
    "BTech Electronics","BTech Mechanical","BTech Civil",
    "MA English","MA Economics","MA History","MSc Mathematics","MSc Physics",
    "MSc Chemistry","MSc Computer Science","MSc Psychology",
    "MCom Finance","MCom Marketing","MBA","MBA Finance","MBA HR","MBA Marketing",
    "MCA","MTech Computer Science","MTech Electronics",
    "BEd","MEd","LLB","LLM","Diploma in Computer Applications","Diploma in Electronics"
  ];

  // ================= LOAD SUBJECTS =================
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

  // ================= VALIDATION =================
  const validate = () => {
    const err = {};

    if (!form.name.trim()) err.name = "Name is required";
    if (!form.admissionNo.trim()) err.admissionNo = "Admission No required";

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      err.email = "Invalid email";

    if (!/^\d{10}$/.test(form.phone))
      err.phone = "Enter valid 10-digit phone number";

    if (!form.password || form.password.length < 6)
      err.password = "Password must be at least 6 characters";

    if (!form.semester) err.semester = "Select semester";
    if (!selectedCourse) err.course = "Select course";

    if (form.subjects.length === 0)
      err.subjects = "Select at least one subject";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return alert("Fix validation errors");

    try {
      await api.post("/student/create", form);
      alert("Student Registered Successfully");
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
          {/* NAME */}
          <input
            placeholder="Student Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <p className="text-danger">{errors.name}</p>

          {/* ADMISSION NO */}
          <input
            placeholder="Admission Number"
            value={form.admissionNo}
            onChange={(e) =>
              setForm({ ...form, admissionNo: e.target.value })
            }
          />
          <p className="text-danger">{errors.admissionNo}</p>

          {/* EMAIL */}
          <input
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <p className="text-danger">{errors.email}</p>

          {/* PHONE */}
          <input
            placeholder="Phone Number"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <p className="text-danger">{errors.phone}</p>

          {/* PASSWORD */}
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <p className="text-danger">{errors.password}</p>

          {/* SEMESTER */}
          <select
            value={form.semester}
            onChange={(e) => {
              setForm({
                ...form,
                semester: e.target.value,
                subjects: [],
                department: "",
              });
              setSelectedCourse("");
            }}
          >
            <option value="">Select Semester</option>
            {[1,2,3,4,5,6,7,8].map((s) => (
              <option key={s} value={s}>Sem {s}</option>
            ))}
          </select>
          <p className="text-danger">{errors.semester}</p>

          {/* COURSE */}
          <select
            disabled={!form.semester}
            value={selectedCourse}
            onChange={(e) => {
              const course = e.target.value;
              if (!course) return;

              setSelectedCourse(course);

              const courseSubjectIds = subjectsList
                .filter(
                  (s) =>
                    s.course === course &&
                    s.semester === Number(form.semester)
                )
                .map((s) => s._id);

              setForm((prev) => ({
                ...prev,
                department: course, // ✅ auto map
                subjects: courseSubjectIds,
              }));
            }}
          >
            <option value="">Select Course</option>
            {COURSE_LIST.map((c, i) => (
              <option key={i} value={c}>{c}</option>
            ))}
          </select>
          <p className="text-danger">{errors.course}</p>

          {/* SELECTED COURSE CHIP */}
          {selectedCourse && (
            <div className="selected-area">
              <span className="chip course-chip">
                {selectedCourse}
                <span
                  className="remove-chip"
                  onClick={() => {
                    setSelectedCourse("");
                    setForm((prev) => ({
                      ...prev,
                      department: "",
                      subjects: [],
                    }));
                  }}
                >
                  ×
                </span>
              </span>
            </div>
          )}

          {/* SUBJECT SEARCH */}
          <div className="subject-search-box">
            <input
              className="subject-search-input"
              placeholder="Search subjects..."
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value.toLowerCase());
                setShowSuggestions(true);
              }}
            />

            <div className="selected-area">
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
                      s.semester === Number(form.semester) &&
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
                        setSearchText("");
                        setShowSuggestions(false);
                      }}
                    >
                      {s.subjectName} ({s.subjectCode})
                    </div>
                  ))}
              </div>
            )}
          </div>

          <p className="text-danger">{errors.subjects}</p>

          <button type="submit">Register Student</button>
        </form>
      </div>
    </div>
  );
}

export default AddStudent;
