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
  const [searchText, setSearchText] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

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
          email: s.email,
          subjects: s.subjects.map((x) => x._id),
        });

      } catch (err) {
        console.log(err);
      }
    };

    loadData();
  }, [id]);

  const validate = () => {
    const err = {};
    if (!form.name.trim()) err.name = "Name is required";
    if (!form.qualification.trim()) err.qualification = "Qualification required";
    if (!/^\d{10}$/.test(form.phone)) err.phone = "Enter valid 10-digit phone number";
    if (form.subjects.length === 0) err.subjects = "Select at least one subject";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

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

        .form-card input {
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

        .form-card input:disabled {
          background: #e2e8f0;
          cursor: not-allowed;
          opacity: 0.7;
        }

        .text-danger {
          color: #ef4444;
          font-size: 12px;
          margin: -12px 0 0 4px;
          font-weight: 500;
        }

        .form-label {
          font-size: 13px;
          color: #64748b;
          margin: -12px 0 8px 4px;
          font-style: italic;
        }

        .form-actions {
          display: flex;
          gap: 12px;
          margin-top: 16px;
        }

        .submit-btn {
          flex: 1;
          padding: 16px;
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }

        .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
        }

        .cancel-btn {
          flex: 0.4;
          padding: 16px;
          background: #f1f5f9;
          color: #475569;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 650;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .cancel-btn:hover {
          background: #e2e8f0;
          color: #1e293b;
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
          .form-actions { flex-direction: column-reverse; }
        }
      `}</style>

      <div className="admin-page">
        <button className="back-btn" onClick={() => navigate("/college/staff")}>
          ← Back to Staff
        </button>

        <div className="form-card">
          <h2>✏️ Edit Staff Member</h2>

          <form onSubmit={handleSubmit}>
            <input
              value={form.name}
              placeholder="Staff Name"
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <p className="text-danger">{errors.name}</p>

            <input
              value={form.qualification}
              placeholder="Qualification"
              onChange={(e) => setForm({ ...form, qualification: e.target.value })}
            />
            <p className="text-danger">{errors.qualification}</p>

            <input
              value={form.phone}
              placeholder="Phone Number"
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
            <p className="text-danger">{errors.phone}</p>

            <input value={form.email} disabled />
            <p className="form-label">Email address cannot be changed</p>

            <div className="subject-search-box">
              <input
                type="text"
                className="subject-search-input"
                placeholder="Search subjects to add..."
                value={searchText}
                onChange={(e) => {
                  setSearchText(e.target.value.toLowerCase());
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
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
            <p className="text-danger">{errors.subjects}</p>

            <div className="form-actions">
              <button
                type="button"
                className="cancel-btn"
                onClick={() => navigate("/college/staff")}
              >
                Cancel
              </button>
              <button type="submit" className="submit-btn">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default EditStaff;
