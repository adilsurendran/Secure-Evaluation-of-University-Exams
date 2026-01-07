import React, { useState, useEffect } from "react";
import api from "../../../api";
import { useNavigate } from "react-router-dom";

function AddStaff() {
  const navigate = useNavigate();
  const collegeId = localStorage.getItem("collegeId");

  const [form, setForm] = useState({
    collegeId: collegeId,
    name: "",
    qualification: "",
    phone: "",
    email: "",
    password: "",
    subjects: [],
  });

  const [errors, setErrors] = useState({});
  const [subjectsList, setSubjectsList] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

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

  const validate = () => {
    const err = {};
    if (!form.name.trim()) err.name = "Name is required";
    if (!form.qualification.trim()) err.qualification = "Qualification required";
    if (!/^\d{10}$/.test(form.phone)) err.phone = "Enter valid 10-digit phone number";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) err.email = "Enter valid email";
    if (!form.password.trim() || form.password.length < 6) err.password = "Password must be at least 6 characters";
    if (form.subjects.length === 0) err.subjects = "Select at least one subject";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return alert("Please correct the errors!");

    try {
      await api.post("/staff/create", form);
      alert("Staff Registered Successfully!");
      navigate("/college/staff");
    } catch (err) {
      console.log(err);
      alert("Error registering staff");
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
        .form-card select {
          width: 100%;
          padding: 14px 18px;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          font-size: 15px;
          background: #f8fafc;
          transition: all 0.3s ease;
          color: #1e293b;
        }

        .form-card input:focus {
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

        .placeholder { color: #94a3b8; font-size: 14px; font-style: italic; }

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
        <button className="back-btn" onClick={() => navigate("/college/staff")}>
          ← Back to Staff
        </button>

        <div className="form-card">
          <h2>👥 Register New Staff</h2>

          <form onSubmit={handleSubmit}>
            <input
              placeholder="Staff Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <p className="text-danger">{errors.name}</p>

            <input
              placeholder="Qualification (e.g., MCA, M.Tech, PhD)"
              value={form.qualification}
              onChange={(e) => setForm({ ...form, qualification: e.target.value })}
            />
            <p className="text-danger">{errors.qualification}</p>

            <input
              placeholder="Phone Number"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
            <p className="text-danger">{errors.phone}</p>

            <input
              placeholder="Email Address"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <p className="text-danger">{errors.email}</p>

            <input
              placeholder="Password"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <p className="text-danger">{errors.password}</p>

            <div className="subject-search-box">
              <input
                type="text"
                className="subject-search-input"
                placeholder="Search subjects by name or code..."
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
            <p className="text-danger">{errors.subjects}</p>

            <button type="submit" className="submit-btn">Register Staff member</button>
          </form>
        </div>
      </div>
    </>
  );
}

export default AddStaff;
