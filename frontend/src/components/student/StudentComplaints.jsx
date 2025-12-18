import React, { useEffect, useState } from "react";
import api from "../../../api";
import StudentSidebar from "./StudentSidebar";
import "./student.css";

export default function StudentComplaints() {
  const studentId = localStorage.getItem("studentId");
  // console.log(studentId);
  

  const [complaintText, setComplaintText] = useState("");
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // ============================
  // LOAD STUDENT COMPLAINTS
  // ============================
  const loadComplaints = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/student/complaints/${studentId}`);
      setComplaints(res.data.complaints || []);
    } catch (err) {
      console.log(err);
      alert("Failed to load complaints");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComplaints();
  }, []);

  // ============================
  // SUBMIT COMPLAINT
  // ============================
  const submitComplaint = async (e) => {
    e.preventDefault();

    if (!complaintText.trim()) {
      alert("Please enter your complaint");
      return;
    }

    try {
      setSubmitting(true);

      await api.post("/student/complaints", {
        studentId,
        complaint: complaintText,
      });

      alert("Complaint submitted successfully");
      setComplaintText("");
      loadComplaints();
    } catch (err) {
      console.log(err);
      alert("Failed to submit complaint");
    } finally {
      setSubmitting(false);
    }
  };

  // ============================
  // STATUS BADGE COLOR
  // ============================
  const getStatusClass = (status) => {
    if (status === "resolved") return "status-resolved";
    if (status === "rejected") return "status-rejected";
    return "status-pending";
  };

  return (
    <div className="d-flex">
      <StudentSidebar />

      <div className="student-container">
        <div className="student-main" style={{ padding: "20px" }}>
          <h1>Complaints</h1>

          {/* ============================
              CREATE COMPLAINT
          ============================ */}
          <div className=" mt-3 p-3">
            <h3>Submit a Complaint</h3>

            <form onSubmit={submitComplaint}>
              <textarea
                className="form-control"
                rows="4"
                placeholder="Enter your complaint here..."
                value={complaintText}
                onChange={(e) => setComplaintText(e.target.value)}
              />

              <button
                type="submit"
                className="btn btn-primary mt-3"
                disabled={submitting}
              >
                {submitting ? "Submitting..." : "Submit Complaint"}
              </button>
            </form>
          </div>

          {/* ============================
              VIEW COMPLAINTS
          ============================ */}
          <div className="mt-4 p-3">
            <h3>Your Complaints</h3>

            {loading && <p>Loading complaints...</p>}

            {!loading && complaints.length === 0 && (
              <p style={{ color: "#666" }}>No complaints submitted yet.</p>
            )}

            {!loading && complaints.length > 0 && (
              <table className="table mt-3">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Complaint</th>
                    <th>Status</th>
                    <th>Reply</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {complaints.map((c, i) => (
                    <tr key={c._id}>
                      <td>{i + 1}</td>
                      <td>{c.complaint}</td>
                      <td>
                        <span className={`status-badge ${getStatusClass(c.status)}`}>
                          {c.status}
                        </span>
                      </td>
                      <td>
                        {c.reply ? c.reply : <span style={{ color: "#888" }}>—</span>}
                      </td>
                      <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
