import React, { useEffect, useState } from "react";
import api from "../../../api";
import "./admincss.css"; // same file you used for UniversityAllocateDashboard

function PublishResults() {
  const [sessions, setSessions] = useState([]);
  const [selectedSessionId, setSelectedSessionId] = useState("");

  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const [publishing, setPublishing] = useState(false);

  const [pendingList, setPendingList] = useState([]);
const [showPendingModal, setShowPendingModal] = useState(false);
const [loadingPending, setLoadingPending] = useState(false);


  const [error, setError] = useState("");

  // ==========================
  // 1. LOAD ALL EXAM SESSIONS
  // ==========================
  useEffect(() => {
    const loadSessions = async () => {
      try {
        const res = await api.get("/exam-sessions/all");
        setSessions(res.data);
      } catch (err) {
        console.log(err);
        setError("Failed to load exam sessions");
      }
    };

    loadSessions();
  }, []);

  // ==========================
  // 2. LOAD RESULT STATS FOR A SESSION
  // ==========================
  const fetchStats = async (sessionId) => {
    if (!sessionId) {
      setStats(null);
      return;
    }

    setLoadingStats(true);
    setError("");

    try {
      const res = await api.get(`/university/result-stats/${sessionId}`);
      setStats(res.data);
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.msg || "Failed to load result stats");
      setStats(null);
    } finally {
      setLoadingStats(false);
    }
  };

  const handleSessionChange = (e) => {
    const id = e.target.value;
    setSelectedSessionId(id);
    fetchStats(id);
  };

  // ==========================
  // 3. PUBLISH RESULTS
  // ==========================
  const publishResults = async () => {
    if (!selectedSessionId) return;

    if (!stats || stats.pendingSheets > 0) {
      return alert("Some papers are still pending. Cannot publish yet.");
    }

    if (!window.confirm("Are you sure you want to publish results for this session?")) {
      return;
    }

    setPublishing(true);
    setError("");

    try {
      const res = await api.post(`/university/publish/${selectedSessionId}`);
      alert(res.data?.msg || "Results published successfully!");

      // Refresh stats (in case you want to show a 'Published' flag later)
      fetchStats(selectedSessionId);
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.msg || "Failed to publish results");
    } finally {
      setPublishing(false);
    }
  };

  const canPublish =
    stats &&
    stats.totalSheets > 0 &&
    stats.pendingSheets === 0;


    const loadPendingSheets = async () => {
  if (!selectedSessionId) return;

  setLoadingPending(true);

  try {
    const res = await api.get(`/university/pending-sheets/${selectedSessionId}`);
    console.log(res);
    
    setPendingList(res.data);
    setShowPendingModal(true);
  } catch (err) {
    console.log(err);
    alert("Failed to load pending sheets");
  } finally {
    setLoadingPending(false);
  }
};


  return (
    <div className="university-page">
      {/* HEADER */}
      <div className="header">
        <h2>Publish Exam Results</h2>
        <p className="subtitle">
          Select an exam session, verify all answer sheets are evaluated, then publish results.
        </p>
      </div>

      {/* SESSION SELECT */}
      <div className="filter-row" style={{ marginBottom: "20px" }}>
        <label style={{ marginRight: "10px", fontWeight: "500" }}>
          Select Exam Session:
        </label>
        <select
          value={selectedSessionId}
          onChange={handleSessionChange}
          className="filter-select"
        >
          <option value="">-- Choose Session --</option>
          {sessions.map((s) => (
            <option key={s._id} value={s._id}>
              {s.name} - {s.academicYear} (Sem {s.semester})
            </option>
          ))}
        </select>
      </div>

      {/* ERROR MESSAGE */}
      {error && <p className="text-danger" style={{ marginBottom: "10px" }}>{error}</p>}

      {/* STATS / SUMMARY */}
      {loadingStats && <p>Loading stats...</p>}

      {!loadingStats && stats && (
        <>
          <div className="cards-row">
            <div className="card small-card">
              <h4>Session</h4>
              <p>
                <b>{stats.session?.name}</b>
              </p>
              <p className="muted">
                AY: {stats.session?.academicYear} | Sem {stats.session?.semester}
              </p>
            </div>

            <div className="card small-card">
              <h4>Total Answer Sheets</h4>
              <p>{stats.totalSheets}</p>
            </div>

            <div className="card small-card">
              <h4>Evaluated Sheets</h4>
              <p className="text-green">{stats.evaluatedSheets}</p>
            </div>

            {/* <div className="card small-card">
              <h4>Pending Evaluation</h4>
              <p className={stats.pendingSheets === 0 ? "text-green" : "text-orange"}>
                {stats.pendingSheets}
              </p>
            </div> */}

            <div
  className="card small-card"
  style={{ cursor: "pointer" }}
  onClick={() => loadPendingSheets()}
>
  <h4>Pending Evaluation</h4>
  <p className={stats.pendingSheets === 0 ? "text-green" : "text-orange"}>
    {stats.pendingSheets}
  </p>
  <h6>Click to view Pending details !!</h6>
</div>

          </div>

          {/* PUBLISH BUTTON */}
          <div style={{ marginTop: "25px" }}>
            {stats.totalSheets === 0 && (
              <p className="text-muted">
                No answer sheets found for this session. Nothing to publish.
              </p>
            )}

            {stats.totalSheets > 0 && stats.pendingSheets > 0 && (
              <p className="text-orange">
                Some papers are still not evaluated. Publishing is disabled.
              </p>
            )}

            <button
              className={canPublish ? "btn-blue" : "btn-disabled"}
              onClick={publishResults}
              disabled={!canPublish || publishing}
            >
              {publishing ? "Publishing..." : "Publish Results"}
            </button>
          </div>
        </>
      )}

      {/* When no session selected */}
      {!loadingStats && !stats && !selectedSessionId && (
        <p className="text-muted" style={{ marginTop: "10px" }}>
          Please select an exam session to view result status.
        </p>
      )}

      {showPendingModal && (
  <div className="modal-overlay">
    <div className="modal-box">
      <h3>Pending Evaluations</h3>

      {loadingPending && <p>Loading...</p>}

      {!loadingPending && pendingList.length === 0 && (
        <p>No pending evaluations found.</p>
      )}

      {!loadingPending && pendingList.length > 0 && (
        <table className="pending-table">
          <thead>
            <tr>
              <th>Admission No</th>
              <th>Student College</th>
              <th>Subject</th>
              <th>Staff Assigned</th>
              <th>Staff College</th>
              <th>Staff Phone</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {pendingList.map((p) => (
              <tr key={p._id}>
                <td>{p.studentId?.admissionNo}</td>
                <td>{p.studentId?.collegeId?.name}</td>
                <td>{p.subjectId?.subjectName}</td>
                <td>{p.assignedStaff ? p.assignedStaff.name : "Not Assigned"}</td>
                <td>{p.assignedStaff?.collegeId?.name || "-"}</td>
                <td>{p.assignedStaff?.phone}</td>
                <td className="text-orange">{p.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <button
        className="btn-blue"
        style={{ marginTop: "20px" }}
        onClick={() => setShowPendingModal(false)}
      >
        Close
      </button>
    </div>
  </div>
)}
    </div>
  );
}

export default PublishResults;
