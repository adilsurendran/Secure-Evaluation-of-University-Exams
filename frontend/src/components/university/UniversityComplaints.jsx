import React, { useEffect, useState } from "react";
import { Button, Form, Badge, ListGroup, Modal } from "react-bootstrap";
import api from "../../../api";

function UniversityComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [statusFilter, setStatusFilter] = useState("pending");

  const [showModal, setShowModal] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [reply, setReply] = useState("");

  // ============================
  // LOAD COMPLAINTS BY STATUS
  // ============================
  const getComplaints = async () => {
    try {
      const res = await api.get(
        `/university/complaints?status=${statusFilter}`
      );
      setComplaints(res.data.complaints || []);
    } catch (e) {
      console.log(e);
      alert("Failed to load complaints");
    }
  };

  useEffect(() => {
    getComplaints();
  }, [statusFilter]);

  // ============================
  // OPEN REPLY MODAL
  // ============================
  const openReplyModal = (complaint) => {
    setSelectedComplaint(complaint);
    setReply(complaint.reply || "");
    setShowModal(true);
  };

  // ============================
  // SEND REPLY
  // ============================
  const submitReply = async () => {
    if (!reply.trim()) {
      alert("Reply and status are required");
      return;
    }

    try {
      await api.put(`/university/complaints/${selectedComplaint._id}/reply`, {
        reply,
        status:"resolved",
      });

      alert("Complaint updated successfully");
      setShowModal(false);
      getComplaints();
    } catch (e) {
      console.log(e);
      alert("Failed to update complaint");
    }
  };

  // ============================
  // DATE FORMATTER
  // ============================
  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // ============================
  // STATUS BADGE
  // ============================
  const getStatusBadge = (status) => {
    if (status === "resolved") return <Badge bg="success">Resolved</Badge>;
    if (status === "rejected") return <Badge bg="danger">Rejected</Badge>;
    return <Badge bg="warning" text="dark">Pending</Badge>;
  };

  return (
    <div>
      <h3 className="mb-3">Complaint Management</h3>

      {/* STATUS FILTER */}
      <Form.Select
        className="w-25 mb-4"
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
      >
        <option value="pending">Pending</option>
        <option value="resolved">Resolved</option>
      </Form.Select>

      {/* COMPLAINT LIST */}
      <ListGroup as="ol" numbered>
        {complaints.length === 0 && (
          <p style={{ color: "#666" }}>No complaints found.</p>
        )}

        {complaints.map((c) => (
          <ListGroup.Item
            key={c._id}
            as="li"
            className="d-flex justify-content-between align-items-start"
          >
            <div className="ms-2 me-auto">
              <div className="fw-bold">{c.complaint}</div>
              <small>
                Student: {c.studentId?.name || "N/A"} <br />
                College: {c.collegeId?.name || "N/A"} <br />
                {formatDateTime(c.createdAt)} <br />
                <b>Replay: {c.reply ? c.reply:"Not replied yet"}</b>
              </small>
            </div>

            <div className="d-flex align-items-center">
              {getStatusBadge(c.status)}
              <Button
                variant="dark"
                size="sm"
                className="ms-2"
                onClick={() => openReplyModal(c)}
              >
                Reply
              </Button>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>

      {/* REPLY MODAL */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Reply to Complaint</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Reply</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={reply}
              onChange={(e) => setReply(e.target.value)}
            />
          </Form.Group>

        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="dark" onClick={submitReply}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default UniversityComplaints;
