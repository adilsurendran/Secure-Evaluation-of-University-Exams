// // src/components/staff/StaffRevaluationAssigned.jsx
// import React, { useEffect, useState } from "react";
// import api from "../../../api";
// import StaffSidebar from "./StaffSidebar";

// export default function StaffRevaluationAssigned() {
//   const staffId = localStorage.getItem("staffId");
//   const [list, setList] = useState([]);
//   const [marksInput, setMarksInput] = useState({});

//   useEffect(() => {
//     const load = async () => {
//       try {
//         const res = await api.get(`/revaluation/staff/assigned/${staffId}`);
//         setList(res.data);
//       } catch (err) {
//         console.log(err);
//       }
//     };
//     load();
//   }, [staffId]);

//   const openPdf = async (answerSheet) => {
//     // use student answer sheet signed URL generator (you already have controller)
//     try {
//       const res = await api.get(`/colleges/answers/signed-url/${answerSheet.filePublicId}`);
//       if (res.data.url) window.open(res.data.url, "_blank");
//     } catch (err) {
//       alert("Failed to open PDF");
//     }
//   };

//   const submit = async (reqId, subjectTotal) => {
//     const nm = marksInput[reqId];
//     if (nm === undefined || nm === "" || isNaN(nm) || nm < 0) return alert("Enter valid marks");
//     if (subjectTotal && Number(nm) > subjectTotal) return alert("Marks cannot exceed total");

//     try {
//       await api.put(`/revaluation/staff/complete/${staffId}/${reqId}`, { newMarks: Number(nm) });
//       alert("Submitted");
//       setList(list.filter(l => l._id !== reqId));
//     } catch (err) {
//       console.log(err);
//       alert("Failed");
//     }
//   };

//   return (
//     <div className="staff-container">
//       <StaffSidebar />
//       <div className="staff-main">
//         <h1>Assigned Revaluation Requests</h1>
//         <table className="college-table">
//           <thead>
//             <tr><th>#</th><th>Student</th><th>Subject</th><th>Old</th><th>View</th><th>New Marks</th><th>Action</th></tr>
//           </thead>
//           <tbody>
//             {list.map((r,i) => (
//               <tr key={r._id}>
//                 <td>{i+1}</td>
//                 <td>{r.studentId?.name} ({r.studentId?.admissionNo})</td>
//                 <td>{r.subjectId?.subjectName} ({r.subjectId?.total_mark})</td>
//                 <td>{r.oldMarks}</td>
//                 <td><button onClick={() => openPdf(r.answerSheetId)}>View PDF</button></td>
//                 <td>
//                   <input type="number" value={marksInput[r._id] || ""} onChange={(e)=>setMarksInput({...marksInput, [r._id]: e.target.value})} />
//                 </td>
//                 <td><button onClick={()=>submit(r._id, r.subjectId?.total_mark)}>Submit</button></td>
//               </tr>
//             ))}
//             {list.length===0 && <tr><td colSpan={7}>No assigned re-evaluations</td></tr>}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }


import React, { useEffect, useState } from "react";
import StaffSidebar from "./StaffSidebar";
import api from "../../../api";

export default function StaffRevaluationEvaluate() {
  const staffId = localStorage.getItem("staffId");
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [marksMap, setMarksMap] = useState({});
  const [remarksMap, setRemarksMap] = useState({});

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/revaluation/staff/assigned/${staffId}`);
      setRequests(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openPdf = async (answerSheet) => {
    // Use your existing signed-url endpoint: you store encrypted public id at sheet.filePublicId
    try {
      const enc = answerSheet.filePublicId;
      const res = await api.get(`/colleges/answers/signed-url/${enc}`);
      if (res.data?.url) window.open(res.data.url, "_blank");
    } catch (err) {
      console.log(err);
      alert("Cannot open PDF");
    }
  };

  const submit = async (reqId) => {
    const newMarks = marksMap[reqId];
    if (newMarks === undefined || newMarks === "" || isNaN(newMarks)) return alert("Enter marks");
    try {
      await api.put(`/revaluation/staff/evaluate/${reqId}`, {
        newMarks,
        staffRemarks: remarksMap[reqId] || "",
        staffId
      });
      alert("Submitted");
      load();
    } catch (err) {
      console.log(err);
      alert("Submit failed");
    }
  };

  return (
    <div className="staff-container">
      <StaffSidebar />
      <div className="staff-main">
        <h2>Assigned Revaluation Requests</h2>
        {loading ? <p>Loading...</p> :
          <table className="college-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Student</th>
                <th>Subject</th>
                <th>Old Marks</th>
                <th>Open PDF</th>
                <th>New Marks</th>
                <th>Remarks</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r,i) => (
                <tr key={r._id}>
                  <td>{i+1}</td>
                  <td>{r.studentId?.name} ({r.studentId?.admissionNo})</td>
                  <td>{r.subjectId?.subjectName}</td>
                  <td>{r.answerSheetId?.marks}</td>
                  <td><button onClick={() => openPdf(r.answerSheetId)}>View PDF</button></td>
                  <td>
                    <input type="number" min="0" value={marksMap[r._id] ?? ""} onChange={(e) => setMarksMap({...marksMap, [r._id]: e.target.value})} />
                  </td>
                  <td>
                    <input value={remarksMap[r._id] ?? ""} onChange={(e) => setRemarksMap({...remarksMap, [r._id]: e.target.value})} />
                  </td>
                  <td>
                    <button onClick={() => submit(r._id)}>Submit</button>
                  </td>
                </tr>
              ))}

              {requests.length === 0 && (
                <tr><td colSpan={8} className="text-muted">No assigned revaluation requests</td></tr>
              )}
            </tbody>
          </table>
        }
      </div>
    </div>
  );
}
