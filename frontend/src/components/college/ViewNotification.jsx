import React, { useEffect, useState } from 'react'
import api from '../../../api'
import Badge from 'react-bootstrap/Badge';
import ListGroup from 'react-bootstrap/ListGroup';

function ViewNotification() {
  const [notification, setNotification] = useState([])

      useEffect(()=>{GetNotification()},[])
    
      const GetNotification = async()=>{
    try{
        const res = await api.get("/university/getnotification")
        console.log(res);
        setNotification(res.data.notifications)
        
    }
    catch(e){
        console.log(e);
        
    }
  }

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
  return (
    <div>
        <h2 className="mt-5">View Recent Notification</h2>
       <ListGroup as="ol" numbered>
        {notification.map((n)=>

      <ListGroup.Item
        as="li"
        className="d-flex justify-content-between align-items-start"
      >
        <div className="ms-2 me-auto">
          <div className="fw-bold">{n.message}</div>
{formatDateTime(n.createdAt)}
        </div>
        <Badge bg="primary" pill>
  {n.semester.join(", ")}
</Badge>

      </ListGroup.Item>
      )}
    </ListGroup>
    </div>
  )
}

export default ViewNotification