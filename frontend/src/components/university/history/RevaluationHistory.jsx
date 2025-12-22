import React, { useEffect, useState } from "react";
import HistoryFilters from "./HistoryFilters";
import api from "../../../../api";

export default function RevaluationHistory() {
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({ session: "", subject: "", college: "" });
  const [meta, setMeta] = useState({ sessions: [], subjects: [], colleges: [] });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const res = await api.get("/university/history/revaluation");
    console.log(res);
    
    setData(res.data);

    setMeta({
      sessions: [...new Map(res.data.map(d => [d.answerSheetId?.sessionId?._id, d.answerSheetId?.sessionId])).values()],
      subjects: [...new Map(res.data.map(d => [d.answerSheetId?.subjectId?._id, d.answerSheetId?.subjectId])).values()],
      colleges: [...new Map(res.data.map(d => [d.answerSheetId?.collegeId?._id, d.answerSheetId?.collegeId])).values()],
    });
  };

  const filtered = data.filter(r =>
    (!filters.session || r.answerSheetId?.sessionId?._id === filters.session) &&
    (!filters.subject || r.answerSheetId?.subjectId?._id === filters.subject) &&
    (!filters.college || r.answerSheetId?.collegeId?._id === filters.college)
  );

  return (
    <>
      <HistoryFilters {...meta} filters={filters} setFilters={setFilters} />
<div className="college-table-container">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Student</th>
            <th>college</th>
            <th>Subject</th>
            <th>Original Marks</th>
            <th>Reval Marks</th>
            <th>Staff</th>
            <th>college</th>
            <th>Status</th>
            <th>Payment</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(r => (
            <tr key={r._id}>
              <td>{r.studentId?.name}</td>
              <td>{r.answerSheetId?.collegeId?.name}</td>
              <td>{r.answerSheetId?.subjectId?.subjectName}</td>
              <td>{r.oldMarks}</td>
              <td>{r.newMarks ?? "-"}</td>
              <td>{r.assignedStaff?.name}</td>
              <td>{r.assignedStaff?.collegeId?.name}</td>
              <td>{r.status}</td>
              <td>{r.paymentStatus}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </>
  );
}
