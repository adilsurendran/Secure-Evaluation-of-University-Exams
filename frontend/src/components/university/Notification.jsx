// import React, { useState } from "react";
// import { Button, Form } from "react-bootstrap";
// import Badge from 'react-bootstrap/Badge';
// import ListGroup from 'react-bootstrap/ListGroup';
// import api from "../../../api";
// import { useEffect } from "react";

// function Notification() {
//   const [message, setMessage] = useState("");
//   const [semester, setSemester] = useState("");
//   const [notification, setNotification] = useState([])
//   useEffect(()=>{GetNotification()},[])

//   const sendNotification = async () => {
//     try {
//       const res = await api.post("/university/sendntification", {
//         message,
//         semester,
//       });

//       alert(res.data.message || "Sent successfully");

//       // ✅ CLEAR FORM AFTER SUCCESS
//       setMessage("");
//       setSemester("");

//     } catch (e) {
//       console.log(e);
//       alert("Failed to send notification");
//     }
//   };
//   const GetNotification = async()=>{
//     try{
//         const res = await api.get("/university/getnotification")
//         // console.log(res);
//         setNotification(res.data.notifications)
        
//     }
//     catch(e){
//         console.log(e);
        
//     }
//   }
// const deleteNotification = async(id)=>{
// // console.log(id);
// try{
// const res = await api.delete(`/university/delete/${id}`)
// console.log(res);
// alert(res.data.message || "Deleted Successfullyy")
// GetNotification();
// }
// catch(e){
//     console.log(e); 
// }
// }
// const formatDateTime = (dateString) => {
//   return new Date(dateString).toLocaleString("en-IN", {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//     hour: "2-digit",
//     minute: "2-digit",
//     hour12: true,
//   });
// };

//   return (
//     <div >
//       <h4 className="mb-3">Send Notification</h4>

//       {/* SEMESTER SELECT */}
//       <Form.Select
//         className="mb-3"
//         value={semester}
//         onChange={(e) => setSemester(e.target.value)}
//       >
//         <option value="">Select Semester</option>
//         <option value="1">1</option>
//         <option value="2">2</option>
//         <option value="3">3</option>
//         <option value="4">4</option>
//         <option value="5">5</option>
//         <option value="6">6</option>
//         <option value="7">7</option>
//         <option value="8">8</option>
//       </Form.Select>

//       {/* MESSAGE */}
//       <Form.Group className="mb-3">
//         <Form.Label>Message</Form.Label>
//         <Form.Control
//           as="textarea"
//           rows={3}
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//         />
//       </Form.Group>

//       <Button variant="dark" onClick={sendNotification}>
//         Send
//       </Button>
//       <h2 className="mt-5">View Recent Notification</h2>
//        <ListGroup as="ol" numbered>
//         {notification.map((n)=>

//       <ListGroup.Item
//         as="li"
//         className="d-flex justify-content-between align-items-start"
//       >
//         <div className="ms-2 me-auto">
//           <div className="fw-bold">{n.message}</div>
// {formatDateTime(n.createdAt)}
//         </div>
//         <Badge bg="primary" pill>
//           {n.semester}
//         </Badge>
//         <Button variant="danger" className="ms-2" onClick={()=>deleteNotification(n._id)}>Delete</Button>
//       </ListGroup.Item>
//       )}
//     </ListGroup>
//     </div>
//   );
// }

// export default Notification;

import React, { useState, useEffect } from "react";
import { Button, Form, Row, Col } from "react-bootstrap";
import Badge from "react-bootstrap/Badge";
import ListGroup from "react-bootstrap/ListGroup";
import api from "../../../api";

const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];

function Notification() {
  const [message, setMessage] = useState("");
  const [semester, setSemester] = useState([]);
  const [notification, setNotification] = useState([]);

  useEffect(() => {
    GetNotification();
  }, []);

  // ---------------- TOGGLE SEMESTER ----------------
  const toggleSemester = (sem) => {
    setSemester((prev) =>
      prev.includes(sem)
        ? prev.filter((s) => s !== sem)
        : [...prev, sem]
    );
  };

  // ---------------- SEND ----------------
  const sendNotification = async () => {
    if (!message || semester.length === 0) {
      alert("Select at least one semester and enter message");
      return;
    }

    try {
      const res = await api.post("/university/sendntification", {
        message,
        semester,
      });

      alert(res.data.message || "Sent successfully");
      setMessage("");
      setSemester([]);
      GetNotification();
    } catch (e) {
      console.log(e);
      alert("Failed to send notification");
    }
  };

  // ---------------- GET ----------------
  const GetNotification = async () => {
    try {
      const res = await api.get("/university/getnotification");
      setNotification(res.data.notifications);
    } catch (e) {
      console.log(e);
    }
  };

  // ---------------- DELETE ----------------
  const deleteNotification = async (id) => {
    if (!window.confirm("Delete this notification?")) return;

    try {
      const res = await api.delete(`/university/delete/${id}`);
      alert(res.data.message || "Deleted");
      GetNotification();
    } catch (e) {
      console.log(e);
    }
  };

  const formatDateTime = (dateString) =>
    new Date(dateString).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

  return (
    <div className="p-3">

      {/* ================= SEND SECTION ================= */}
      <h4 className="mb-3">Send Notification</h4>

      <Form.Group className="mb-3">
        <Form.Label className="fw-semibold">
          Select Semester(s)
        </Form.Label>

        <Row>
          {SEMESTERS.map((s) => (
            <Col xs={6} md={3} key={s} className="mb-2">
              <Form.Check
                type="checkbox"
                label={`Semester ${s}`}
                checked={semester.includes(s)}
                onChange={() => toggleSemester(s)}
              />
            </Col>
          ))}
        </Row>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label className="fw-semibold">Message</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          placeholder="Enter notification message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </Form.Group>

      <Button variant="dark" onClick={sendNotification}>
        Send Notification
      </Button>

      {/* ================= DIVIDER ================= */}
      <hr className="my-4" />

      {/* ================= LIST SECTION ================= */}
      <h4 className="mb-3">Recent Notifications</h4>

      {notification.length === 0 ? (
        <p className="text-muted">No notifications found</p>
      ) : (
        <ListGroup as="ol" numbered>
          {notification.map((n) => (
            <ListGroup.Item
              key={n._id}
              as="li"
              className="d-flex justify-content-between align-items-start"
            >
              <div className="me-auto">
                <div className="fw-bold">{n.message}</div>
                <small className="text-muted">
                  {formatDateTime(n.createdAt)}
                </small>
              </div>

              <div className="d-flex flex-wrap gap-1 align-items-center">
                {n.semester.map((s) => (
                  <Badge key={s} bg="primary">
                    Sem {s}
                  </Badge>
                ))}

                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => deleteNotification(n._id)}
                >
                  Delete
                </Button>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </div>
  );
}

export default Notification;
