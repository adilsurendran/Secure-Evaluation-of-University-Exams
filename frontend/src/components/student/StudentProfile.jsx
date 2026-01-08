import React, { useEffect, useState } from "react";
import StudentLayout from "./StudentLayout";
import api from "../../../api";
import "./student.css";

function StudentProfile() {
  const studentId = localStorage.getItem("studentId");
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/student/${studentId}`);
        setStudent(res.data);
      } catch (err) {
        console.error("Error loading profile:", err);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [studentId]);

  if (loading) return (
    <StudentLayout>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <p>Loading profile details...</p>
      </div>
    </StudentLayout>
  );

  if (!student) return (
    <StudentLayout>
      <p>Student profile not found.</p>
    </StudentLayout>
  );

  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : "?";
  };

  return (
    <StudentLayout>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        .profile-container {
          max-width: 900px;
          margin: 0 auto;
          font-family: 'Inter', sans-serif;
        }

        .profile-header-card {
          background: white;
          border-radius: 24px;
          padding: 40px;
          display: flex;
          align-items: center;
          gap: 32px;
          box-shadow: 0 10px 30px rgba(30, 64, 175, 0.08);
          border: 1px solid #e2e8f0;
          margin-bottom: 32px;
          position: relative;
          overflow: hidden;
        }

        .profile-header-card::after {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 200px;
          height: 200px;
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(30, 64, 175, 0.05) 100%);
          border-radius: 0 0 0 100%;
          z-index: 0;
        }

        .avatar-circle {
          width: 120px;
          height: 120px;
          background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 48px;
          font-weight: 800;
          box-shadow: 0 8px 16px rgba(30, 64, 175, 0.2);
          border: 4px solid white;
          z-index: 1;
          flex-shrink: 0;
        }

        .header-info {
          z-index: 1;
        }

        .header-info h2 {
          font-size: 32px;
          font-weight: 800;
          color: #1e293b;
          margin: 0 0 8px 0;
        }

        .header-info .dept-badge {
          display: inline-block;
          padding: 6px 16px;
          background: #eff6ff;
          color: #2563eb;
          border-radius: 99px;
          font-weight: 700;
          font-size: 14px;
          border: 1px solid #dbeafe;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
        }

        .info-card {
          background: white;
          border-radius: 20px;
          padding: 24px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
          transition: transform 0.3s ease;
        }

        .info-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 20px rgba(30, 64, 175, 0.06);
        }

        .info-label {
          display: block;
          font-size: 12px;
          text-transform: uppercase;
          color: #94a3b8;
          font-weight: 700;
          letter-spacing: 0.05em;
          margin-bottom: 8px;
        }

        .info-value {
          font-size: 18px;
          font-weight: 600;
          color: #334155;
        }

        .subjects-section {
          margin-top: 32px;
          background: white;
          border-radius: 24px;
          padding: 32px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
        }

        .subjects-section h3 {
          font-size: 20px;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 20px;
          border-bottom: 2.5px solid #eff6ff;
          padding-bottom: 12px;
        }

        .subject-tag {
          display: inline-block;
          background: #f8fafc;
          border: 1.5px solid #e2e8f0;
          padding: 10px 18px;
          border-radius: 12px;
          margin: 0 12px 12px 0;
          font-size: 14px;
          font-weight: 600;
          color: #475569;
          transition: all 0.2s;
        }

        .subject-tag:hover {
          background: #eff6ff;
          border-color: #3b82f6;
          color: #1e40af;
        }

        @media (max-width: 768px) {
          .profile-header-card { flex-direction: column; text-align: center; padding: 30px; }
          .info-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="profile-container">
        <div className="profile-header-card">
          <div className="avatar-circle">
            {getInitial(student.name)}
          </div>
          <div className="header-info">
            <h2>{student.name}</h2>
            <div className="dept-badge">{student.department}</div>
          </div>
        </div>

        <div className="info-grid">
          <div className="info-card">
            <span className="info-label">Admission Number</span>
            <div className="info-value">{student.admissionNo}</div>
          </div>
          <div className="info-card">
            <span className="info-label">Current Semester</span>
            <div className="info-value">Semester {student.semester}</div>
          </div>
          <div className="info-card">
            <span className="info-label">Email Address</span>
            <div className="info-value">{student.email}</div>
          </div>
          <div className="info-card">
            <span className="info-label">Phone Number</span>
            <div className="info-value">{student.phone || "Not Provided"}</div>
          </div>
        </div>

        {student.subjects && student.subjects.length > 0 && (
          <div className="subjects-section">
            <h3>📖 Enrolled Subjects</h3>
            <div className="subjects-list">
              {student.subjects.map((sub, idx) => (
                <div key={idx} className="subject-tag">
                  {sub.subjectName} <span style={{ color: '#94a3b8', fontSize: '12px' }}>({sub.subjectCode})</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </StudentLayout>
  );
}

export default StudentProfile;
