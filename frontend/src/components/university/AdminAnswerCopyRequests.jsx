// src/components/admin/AdminAnswerCopyRequests.jsx
import React, { useEffect, useState } from "react";
import api from "../../../api";
import "./admincss.css"; // reuse your admin styles

function AdminAnswerCopyRequests() {
  const [requests, setRequests] = useState([]);
  const [statusFilter, setStatusFilter] = useState("pending");

  const [loading, setLoading] = useState(true);

  // Reject modal
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectNote, setRejectNote] = useState("");
  const [activeRequestId, setActiveRequestId] = useState(null);

  const loadRequests = async (status = "pending") => {
    setLoading(true);
    try {
      const res = await api.get(
        `/university/answer-copy/requests?status=${status}`
      );
      setRequests(res.data || []);
    } catch (err) {
      console.log(err);
      alert("Failed to load answer copy requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests(statusFilter);
  }, [statusFilter]);

  const approveRequest = async (id) => {
    if (!window.confirm("Approve this answer sheet copy request?")) return;

    try {
      const res = await api.put(
        `/university/answer-copy/${id}/approve`
      );
      alert(res.data?.msg || "Request approved");

      // reload
      loadRequests(statusFilter);
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.msg || "Failed to approve request");
    }
  };

  const openRejectModal = (id) => {
    setActiveRequestId(id);
    setRejectNote("");
    setShowRejectModal(true);
  };

  const submitReject = async () => {
    if (!rejectNote.trim()) {
      return alert("Please enter a reject note");
    }

    try {
      const res = await api.put(
        `/university/answer-copy/${activeRequestId}/reject`,
        { adminNote: rejectNote }
      );
      alert(res.data?.msg || "Request rejected");

      setShowRejectModal(false);
      setActiveRequestId(null);
      setRejectNote("");

      loadRequests(statusFilter);
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.msg || "Failed to reject request");
    }
  };

  return (
    <div className="university-page">
      <div className="header">
        <h2>Answer Sheet Copy Requests</h2>
        <p className="subtitle">
          Review and approve/reject student requests to view scanned answer
          sheets.
        </p>
      </div>

      {/* Filter */}
      <div className="filter-row">
        <label>Status:</label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="filter-select"
        >
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="">All</option>
        </select>
      </div>

      {/* Table */}
      <div className="table-container">
        {loading ? (
          <p>Loading requests...</p>
        ) : requests.length === 0 ? (
          <p className="text-muted">No requests found.</p>
        ) : (
          <table className="college-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Student</th>
                <th>College</th>
                <th>Session</th>
                <th>Subject</th>
                <th>Exam Date</th>
                <th>Status</th>
                <th>Note / Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r, i) => (
                <tr key={r._id}>
                  <td>{i + 1}</td>
                  <td>
                    {r.studentId?.name} ({r.studentId?.admissionNo})
                  </td>
                  <td>{r.collegeId?.name}</td>
                  <td>
                    {r.sessionId?.name} - {r.sessionId?.academicYear} (Sem{" "}
                    {r.sessionId?.semester})
                  </td>
                  <td>
                    {r.subjectId?.subjectName} (
                    {r.subjectId?.subjectCode})
                  </td>
                  <td>
                    {r.examId?.examDate
                      ? new Date(
                          r.examId.examDate
                        ).toLocaleDateString()
                      : "-"}
                  </td>
                  <td>
                    <span
                      className={
                        r.status === "approved"
                          ? "status-green"
                          : r.status === "rejected"
                          ? "status-red"
                          : "status-orange"
                      }
                    >
                      {r.status.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    {r.status === "pending" && (
                      <>
                        <button
                          className="btn-green"
                          onClick={() => approveRequest(r._id)}
                          style={{ marginRight: "8px" }}
                        >
                          Approve
                        </button>
                        <button
                          className="btn-red"
                          onClick={() => openRejectModal(r._id)}
                        >
                          Reject
                        </button>
                      </>
                    )}

                    {r.status === "approved" && (
                      <span className="text-green">
                        Approved (student can view)
                      </span>
                    )}

                    {r.status === "rejected" && (
                      <span className="text-danger">
                        {r.adminNote || "Rejected"}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Reject Request</h3>
            <p>Provide reason for rejection (visible to student):</p>

            <textarea
              rows="3"
              className="modal-textarea"
              value={rejectNote}
              onChange={(e) => setRejectNote(e.target.value)}
            />

            <div className="modal-buttons">
              <button className="modal-submit" onClick={submitReject}>
                Submit
              </button>
              <button
                className="modal-cancel"
                onClick={() => setShowRejectModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminAnswerCopyRequests;
