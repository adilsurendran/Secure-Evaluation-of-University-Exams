// import React, { useEffect, useState } from 'react'
// import api from '../../../api'
// import Badge from 'react-bootstrap/Badge';
// import ListGroup from 'react-bootstrap/ListGroup';
// import StudentLayout from './StudentLayout';

// function ViewNotifications() {
//       const studentId = localStorage.getItem("studentId");

//      const [notification, setNotification] = useState([])

//       useEffect(()=>{GetNotification()},[])
    
//       const GetNotification = async()=>{
//     try{
//         const res = await api.get(`/university/getnotifications/${studentId}`)
//         console.log(res);
//         setNotification(res.data.notifications)
        
//     }
//     catch(e){
//         console.log(e);
        
//     }
//   }

//   const formatDateTime = (dateString) => {
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
//     <StudentLayout>
//     <div>
//           <h2 className="mt-5">View Recent Notification</h2>
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
//         {/* <Badge bg="primary" pill>
//           {n.semester}
//         </Badge> */}
//       </ListGroup.Item>
//       )}
//     </ListGroup>

//     </div>
//     </StudentLayout>
//   )
// }

// export default ViewNotifications

import React, { useEffect, useState } from "react";
import api from "../../../api";
import Badge from "react-bootstrap/Badge";
import ListGroup from "react-bootstrap/ListGroup";
import StudentLayout from "./StudentLayout";

function ViewNotifications() {
  const studentId = localStorage.getItem("studentId");
  const [notification, setNotification] = useState([]);

  useEffect(() => {
    getNotification();
  }, []);

  // ---------------- GET NOTIFICATIONS ----------------
  const getNotification = async () => {
    try {
      const res = await api.get(
        `/university/getnotifications/${studentId}`
      );
      setNotification(res.data.notifications || []);
    } catch (e) {
      console.log(e);
    }
  };

  // ---------------- DATE FORMAT ----------------
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
    <StudentLayout>
      <div className="p-3">
        <h2 className="mt-4 mb-3">View Recent Notifications</h2>

        {notification.filter(
          (n) => n.target === "student" || n.target === "both"
        ).length === 0 ? (
          <p className="text-muted">No notifications available</p>
        ) : (
          <ListGroup as="ol" numbered>
            {notification
              .filter(
                (n) => n.target === "student" || n.target === "both"
              )
              .map((n) => (
                <ListGroup.Item
                  key={n._id}
                  as="li"
                  className="d-flex justify-content-between align-items-start"
                >
                  <div className="ms-2 me-auto">
                    <div className="fw-bold">{n.message}</div>
                    <small className="text-muted">
                      {formatDateTime(n.createdAt)}
                    </small>
                  </div>

                </ListGroup.Item>
              ))}
          </ListGroup>
        )}
      </div>
    </StudentLayout>
  );
}

export default ViewNotifications;
