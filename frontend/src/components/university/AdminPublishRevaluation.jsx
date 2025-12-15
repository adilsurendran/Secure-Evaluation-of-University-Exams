import React, { useEffect, useState } from "react";
import api from "../../../api";
import "./admincss.css";

export default function AdminPublishRevaluation() {
  const [sessions, setSessions] = useState([]);
  const [sessionId, setSessionId] = useState("");

  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [publishing, setPublishing] = useState(false);

  // Load sessions
  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/exam-sessions/all");
        setSessions(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    load();
  }, []);

  // Load evaluated revaluation requests
  const loadEvaluated = async (id) => {
    if (!id) return setList([]);

    setLoading(true);
    try {
      const res = await api.get(`/revaluation/admin/evaluated/${id}`);
      // console.log(res,id);
      
      setList(res.data);
    } catch (err) {
      console.log(err);
      alert("Error loading data");
    } finally {
      setLoading(false);
    }
  };

  const handleSessionChange = (e) => {
    const id = e.target.value;
    setSessionId(id);
    loadEvaluated(id);
  };

  // Publish final revaluation results
  const publish = async () => {
    if (!sessionId) return;

    if (!window.confirm("Publish revaluation results for this session?"))
      return;

    setPublishing(true);
    try {
      const res = await api.post(`/revaluation/admin/publish/${sessionId}`);
      alert(res.data.msg || "Revaluation results published");

      loadEvaluated(sessionId);
    } catch (err) {
      console.log(err);
      alert("Failed to publish");
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="admin-page">
      <h2>Publish Revaluation Results</h2>

      {/* SESSION SELECTOR */}
      <div className="filter-row">
        <label>Select Exam Session:</label>
        <select
          className="filter-select"
          value={sessionId}
          onChange={handleSessionChange}
        >
          <option value="">-- Select Session --</option>
          {sessions.map((s) => (
            <option key={s._id} value={s._id}>
              {s.name} | AY {s.academicYear} | Sem {s.semester}
            </option>
          ))}
        </select>
      </div>

      {loading && <p>Loading revaluation results…</p>}

      {!loading && sessionId && (
        <>
          <table className="college-table" style={{ marginTop: 20 }}>
            <thead>
              <tr>
                <th>#</th>
                <th>Student</th>
                <th>College</th>
                <th>Subject</th>
                <th>Old Mark</th>
                <th>New Mark</th>
                <th>Staff</th>
                <th>Fee Status</th>
              </tr>
            </thead>

            <tbody>
              {list.map((r, i) => (
                <tr key={r._id}>
                  <td>{i + 1}</td>

                  <td>
                    {r.studentId?.name}
                    <div className="small-text">
                      {r.studentId?.admissionNo}
                    </div>
                  </td>

                  <td>{r.studentId?.collegeId?.name}</td>

                  <td>
                    {r.subjectId?.subjectName}
                    <div className="small-text">
                      {r.subjectId?.subjectCode}
                    </div>
                  </td>

                  <td className="text-muted">{r.oldMarks}</td>

                  <td className="text-green"><b>{r.newMarks}</b></td>

                  <td>
                    {r.assignedStaff?.name}
                    <div className="small-text">
                      {r.assignedStaff?.collegeId?.name}
                    </div>
                    <div className="small-text">
                      {r.assignedStaff?.phone}
                    </div>
                  </td>

                  <td>{r.paymentStatus}</td>
                </tr>
              ))}

              {list.length === 0 && (
                <tr>
                  <td colSpan="10" className="text-muted text-center">
                    No evaluated revaluation requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {list.length > 0 && (
            <div style={{ marginTop: 25 }}>
              <button
                className="btn-blue"
                disabled={publishing}
                onClick={publish}
              >
                {publishing ? "Publishing…" : "Publish Revaluation Results"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
