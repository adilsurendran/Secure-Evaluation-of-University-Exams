import React, { useEffect, useState } from "react";
import HistoryFilters from "./HistoryFilters";
import api from "../../../../api";

export default function ValuationHistory() {
  const [data, setData] = useState([]);
  const [meta, setMeta] = useState({ sessions: [], subjects: [], colleges: [] });
  const [filters, setFilters] = useState({
    session: "",
    subject: "",
    college: ""
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const res = await api.get("/university/history/valuation");
    // console.log(res);
    
    setData(res.data);

    // derive filters
    setMeta({
      sessions: [...new Map(res.data.map(d => [d.sessionId?._id, d.sessionId])).values()],
      subjects: [...new Map(res.data.map(d => [d.subjectId?._id, d.subjectId])).values()],
      colleges: [...new Map(res.data.map(d => [d.collegeId?._id, d.collegeId])).values()],
    });
  };

  const filtered = data.filter(d =>
    (!filters.session || d.sessionId?._id === filters.session) &&
    (!filters.subject || d.subjectId?._id === filters.subject) &&
    (!filters.college || d.collegeId?._id === filters.college)
  );

  return (
    <>
      <HistoryFilters {...meta} filters={filters} setFilters={setFilters} />
<div className="college-table-container">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Student</th>
            <th>Session</th>
            <th>Subject</th>
            <th>College</th>
            <th>Staff</th>
            <th>Staff College</th>
            <th>Marks</th>
            <th>Evaluated On</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(row => (
            <tr key={row._id}>
              <td>{row.studentId?.name}</td>
              <td>{row.sessionId?.name}</td>
              <td>{row.subjectId?.subjectName}</td>
              <td>{row.collegeId?.name}</td>
              <td>{row.assignedStaff?.name}</td>
              <td>{row.assignedStaff?.collegeId?.name}</td>
              <td>{row.marks}</td>
              <td>{new Date(row.updatedAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </>
  );
}
