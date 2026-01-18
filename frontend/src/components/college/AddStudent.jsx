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
      alert(err.response.data.msg||"Error registering student");
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        .admin-page {
          padding: 40px;
          min-height: 100vh;
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 25%, #bfdbfe 50%, #e0f2fe 75%, #f0f9ff 100%);
          font-family: 'Inter', sans-serif;
        }

        .back-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: white;
          color: #1e40af;
          border: 2px solid #e0f2fe;
          border-radius: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-bottom: 24px;
          width: fit-content;
          box-shadow: 0 2px 8px rgba(30, 64, 175, 0.05);
        }

        .back-btn:hover {
          background: #f0f9ff;
          border-color: #3b82f6;
          transform: translateX(-4px);
        }

        .form-card {
          max-width: 800px;
          margin: 0 auto;
          background: white;
          border-radius: 24px;
          padding: 40px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          border: 2px solid #e2e8f0;
        }

        .form-card h2 {
          font-size: 32px;
          font-weight: 800;
          background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0 0 32px 0;
          text-align: center;
        }

        .form-card form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .form-card input,
        .form-card select,
        .form-card textarea {
          width: 100%;
          padding: 14px 18px;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          font-size: 15px;
          background: #f8fafc;
          transition: all 0.3s ease;
          color: #1e293b;
        }

        .form-card input:focus,
        .form-card select:focus {
          outline: none;
          border-color: #3b82f6;
          background: white;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
        }

        .text-danger {
          color: #ef4444;
          font-size: 12px;
          margin: -12px 0 0 4px;
          font-weight: 500;
        }

        .submit-btn {
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 16px;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        }

        .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
        }

        .subject-search-box { position: relative; margin-top: 8px; }
        
        .selected-area {
          min-height: 50px;
          padding: 12px;
          background: #f8fafc;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 12px;
        }

        .chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          color: white;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 600;
        }

        .course-chip { background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); }

        .remove-chip { cursor: pointer; font-size: 16px; font-weight: bold; }

        .dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: white;
          border: 2px solid #3b82f6;
          border-radius: 12px;
          z-index: 1000;
          box-shadow: 0 8px 24px rgba(0,0,0,0.15);
          max-height: 200px;
          overflow-y: auto;
        }

        .dropdown-item {
          padding: 12px 16px;
          cursor: pointer;
          border-bottom: 1px solid #e2e8f0;
        }

        .dropdown-item:hover { background: #eff6ff; color: #1e40af; }

        @media (max-width: 768px) {
          .admin-page { padding: 20px; }
          .form-card { padding: 24px; }
        }
      `}</style>

      <div className="admin-page">
        <button className="back-btn" onClick={() => navigate("/college/students")}>
          ← Back to Students
        </button>

        <div className="form-card">
          <h2>🎓 Register New Student</h2>

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
              {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
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

            <button type="submit" className="submit-btn">Register Student</button>
          </form>
        </div>
      </div>
    </>
  );
}

export default AddStudent;
