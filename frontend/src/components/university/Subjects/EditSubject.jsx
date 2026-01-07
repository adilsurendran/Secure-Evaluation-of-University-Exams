import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../../api";

function EditSubject() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    subjectCode: "",
    subjectName: "",
    course: "",
    semester: "",
  });

  useEffect(() => {
    api.get(`/subjects/${id}`).then((res) => setForm(res.data));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await api.put(`/subjects/update/${id}`, form);
    alert("Subject updated successfully");
    navigate("/admin/subjects");
  };

  const COURSE_LIST = [
    // UG – Arts & Science
    "BA English",
    "BA Malayalam",
    "BA Economics",
    "BA History",
    "BA Political Science",
    "BSc Mathematics",
    "BSc Physics",
    "BSc Chemistry",
    "BSc Computer Science",
    "BSc Statistics",
    "BSc Psychology",
    "BSc Biotechnology",
    "BSc Zoology",
    "BSc Botany",

    // UG – Commerce & Management
    "BCom Finance",
    "BCom Cooperation",
    "BCom Computer Applications",
    "BBA",
    "BBM",

    // UG – Computer / Tech
    "BCA",
    "BSc IT",
    "BTech Computer Science",
    "BTech Information Technology",
    "BTech Electronics",
    "BTech Mechanical",
    "BTech Civil",

    // PG – Arts & Science
    "MA English",
    "MA Economics",
    "MA History",
    "MSc Mathematics",
    "MSc Physics",
    "MSc Chemistry",
    "MSc Computer Science",
    "MSc Psychology",

    // PG – Commerce / Management
    "MCom Finance",
    "MCom Marketing",
    "MBA",
    "MBA Finance",
    "MBA HR",
    "MBA Marketing",

    // PG – Tech
    "MCA",
    "MTech Computer Science",
    "MTech Electronics",

    // Education & Others
    "BEd",
    "MEd",
    "LLB",
    "LLM",
    "Diploma in Computer Applications",
    "Diploma in Electronics"
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        .admin-page {
          padding: 32px;
          min-height: 100vh;
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 25%, #bfdbfe 50%, #e0f2fe 75%, #f0f9ff 100%);
          font-family: 'Inter', sans-serif;
        }

        .form-card {
          max-width: 700px;
          margin: 0 auto;
          background: white;
          border-radius: 20px;
          padding: 40px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          border: 2px solid #e2e8f0;
        }

        .form-card h2 {
          font-size: 28px;
          font-weight: 700;
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
          gap: 20px;
        }

        .form-card input,
        .form-card select {
          width: 100%;
          padding: 14px 18px;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          font-size: 15px;
          font-family: 'Inter', sans-serif;
          background: #f8fafc;
          transition: all 0.3s ease;
          color: #1e293b;
        }

        .form-card input:disabled {
          background: #e2e8f0;
          cursor: not-allowed;
          opacity: 0.6;
        }

        .form-card input:focus,
        .form-card select:focus {
          outline: none;
          border-color: #3b82f6;
          background: white;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
        }

        .form-card input::placeholder {
          color: #94a3b8;
        }

        .form-card select {
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 12px center;
          background-size: 20px;
          padding-right: 40px;
        }

        .form-card button[type="submit"] {
          width: 100%;
          padding: 14px 24px;
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: 'Inter', sans-serif;
          margin-top: 8px;
          box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
        }

        .form-card button[type="submit"]:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(245, 158, 11, 0.4);
        }

        .form-card button[type="submit"]:active {
          transform: translateY(0);
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

        .form-actions {
          display: flex;
          gap: 12px;
          margin-top: 8px;
        }

        .cancel-btn {
          flex: 0.5;
          padding: 14px 24px;
          background: #f1f5f9;
          color: #475569;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 650;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: 'Inter', sans-serif;
        }

        .cancel-btn:hover {
          background: #e2e8f0;
          color: #1e293b;
        }

        button[type="submit"] {
          flex: 1;
        }

        .form-label {
          font-size: 13px;
          color: #64748b;
          margin-top: -12px;
          font-style: italic;
        }

        @media (max-width: 768px) {
          .admin-page {
            padding: 20px;
          }

          .form-card {
            padding: 28px 20px;
          }

          .form-card h2 {
            font-size: 24px;
          }
        }
      `}</style>

      <div className="admin-page">
        <button className="back-btn" onClick={() => navigate("/admin/subjects")}>
          ← Back to Subjects
        </button>
        <div className="form-card">
          <h2>✏️ Edit Subject</h2>

          <form onSubmit={handleSubmit}>
            <input
              value={form.subjectCode}
              disabled
              placeholder="Subject Code"
            />
            <p className="form-label">Subject code cannot be changed</p>

            <input
              value={form.subjectName}
              onChange={(e) =>
                setForm({ ...form, subjectName: e.target.value })
              }
              placeholder="Subject Name"
            />

            <select
              value={form.course}
              onChange={(e) =>
                setForm({ ...form, course: e.target.value })
              }
              required
            >
              <option value="">Select Course</option>
              {COURSE_LIST.map((course, index) => (
                <option key={index} value={course}>
                  {course}
                </option>
              ))}
            </select>

            <input
              type="number"
              value={form.semester}
              onChange={(e) =>
                setForm({ ...form, semester: e.target.value })
              }
              placeholder="Semester"
            />

            <div className="form-actions">
              <button type="button" className="cancel-btn" onClick={() => navigate("/admin/subjects")}>
                Cancel
              </button>
              <button type="submit">Save Changes</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default EditSubject;

