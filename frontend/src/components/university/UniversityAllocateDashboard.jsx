import React, { useEffect, useState } from "react";
import api from "../../../api";
import './admincss.css'

export default function UniversityAllocateDashboard() {
  const [sessions, setSessions] = useState([]);

  const loadStats = async () => {
    try {
      const res = await api.get("/university/allocation-stats");
      setSessions(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const allocatePapers = async (sessionId) => {
    if (!window.confirm("Allocate papers for this session?")) return;

    try {
      await api.post(`/university/allocate/${sessionId}`);
      alert("Allocation Completed");
      loadStats();
    } catch (err) {
      console.log(err);
      alert("Allocation failed");
    }
  };

  return (
    <div className="university-page">
      <div className="header">
        <h2>Exam Paper Allocation Dashboard</h2>
      </div>

      <div className="table-container">
        <table className="college-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Exam Session</th>
              <th>Academic Year</th>
              <th>Semester</th>
              <th>Total Sheets</th>
              <th>Allocated</th>
              <th>Pending</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {sessions.map((item, i) => (
              <tr key={item.session._id}>
                <td>{i + 1}</td>

                <td>{item.session.name}</td>
                <td>{item.session.academicYear}</td>
                <td>Sem {item.session.semester}</td>

                <td>{item.totalSheets}</td>

                <td className="text-green">{item.allocatedSheets}</td>

                <td className="text-orange">{item.pendingSheets}</td>

                <td>
                  {item.pendingSheets === 0 && item.allocatedSheets !== 0 ? (
                    <button className="btn-green" disabled>
                      ✔ Allocated
                    </button>
                  ) : (
                    <button
                      className="btn-blue"
                      onClick={() => allocatePapers(item.session._id)}
                    >
                      Allocate Now
                    </button>
                  )}
                </td>
              </tr>
            ))}

            {sessions.length === 0 && (
              <tr>
                <td colSpan="8" className="text-center text-muted">
                  No sessions available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
