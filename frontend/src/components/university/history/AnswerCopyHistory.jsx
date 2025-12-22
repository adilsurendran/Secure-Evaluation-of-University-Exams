import React, { useEffect, useState } from "react";
import api from "../../../../api";

export default function AnswerCopyHistory() {
  const [data, setData] = useState([]);

  useEffect(() => {
    api.get("/university/history/answer-copy")
      .then(res => setData(res.data));
  }, []);

  return (
    <div className="college-table-container">
    <table className="admin-table">
      <thead>
        <tr>
          <th>Student</th>
          <th>Subject</th>
          <th>Session</th>
          <th>Status</th>
          <th>Payment</th>
          <th>Requested On</th>
        </tr>
      </thead>
      <tbody>
        {data.map(r => (
          <tr key={r._id}>
            <td>{r.studentId?.name}</td>
            <td>{r.subjectId?.subjectName}</td>
            <td>{r.sessionId?.name}</td>
            <td>{r.status}</td>
            <td>{r.paymentStatus}</td>
            <td>{new Date(r.createdAt).toLocaleDateString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
  );
}
