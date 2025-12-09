import React, { useEffect, useState } from "react";
import api from "../../../api";
import "./admincss.css"; // same file you used for UniversityAllocateDashboard

function PublishResults() {
  const [sessions, setSessions] = useState([]);
  const [selectedSessionId, setSelectedSessionId] = useState("");

  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const [publishing, setPublishing] = useState(false);

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

            <div className="card small-card">
              <h4>Pending Evaluation</h4>
              <p className={stats.pendingSheets === 0 ? "text-green" : "text-orange"}>
                {stats.pendingSheets}
              </p>
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
    </div>
  );
}

export default PublishResults;
