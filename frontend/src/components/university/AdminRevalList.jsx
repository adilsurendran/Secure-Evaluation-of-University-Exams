// import React, { useEffect, useState } from "react";
// import api from "../../../api";
// import "./admincss.css";

// export default function AdminRevaluationList() {
//   const [requests, setRequests] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // Selected staff for each request: { reqId: staffId }
//   const [selectedAssign, setSelectedAssign] = useState({});

//   // Eligible staff per request: { reqId: [staffList] }
//   const [staffOptions, setStaffOptions] = useState({});

//   // ================================
//   // LOAD ALL PENDING REQUESTS
//   // ================================
//   const load = async () => {
//     setLoading(true);
//     try {
//       const res = await api.get("/revaluation/admin/all?status=pending");
//       setRequests(res.data);
//     } catch (err) {
//       console.log(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     load();
//   }, []);

//   // ================================
//   // LOAD ELIGIBLE STAFF FOR A REQUEST
//   // ================================
//   const loadEligibleStaff = async (reqId) => {
//     if (staffOptions[reqId]) return; // already loaded

//     try {
//       const res = await api.get(`/revaluation/admin/eligible-staff/${reqId}`);
//       setStaffOptions((prev) => ({ ...prev, [reqId]: res.data }));
//     } catch (err) {
//       console.log(err);
//       alert("Failed to load eligible staff");
//     }
//   };

//   // ================================
//   // APPROVE REQUEST
//   // ================================
//   // const approve = async (id) => {
//   //   if (!window.confirm("Approve this request?")) return;

//   //   try {
//   //     await api.put(`/revaluation/admin/approve/${id}`);
//   //     alert("Request approved");
//   //     load();
//   //   } catch (err) {
//   //     console.log(err);
//   //     alert("Failed to approve");
//   //   }
//   // };

//   // ================================
//   // REJECT REQUEST
//   // ================================
//   const reject = async (id) => {
//     const reason = prompt("Enter rejection reason:");
//     if (reason === null) return;

//     try {
//       await api.put(`/revaluation/admin/reject/${id}`, { reason });
//       alert("Request rejected");
//       load();
//     } catch (err) {
//       console.log(err);
//       alert("Failed to reject");
//     }
//   };

//   // ================================
//   // ASSIGN STAFF
//   // ================================
//   const assign = async (id) => {
//     const staffId = selectedAssign[id];
//     if (!staffId) return alert("Choose staff first");

//     try {
//       await api.put(`/revaluation/admin/assign/${id}`, { staffId });
//       alert("Assigned successfully");
//       load();
//     } catch (err) {
//       console.log(err);
//       alert("Assign failed");
//     }
//   };

//   // ================================
//   // RENDER PAGE
//   // ================================
//   return (
//     <div className="admin-page">
//       <h2>Revaluation Requests (Pending)</h2>

//       {loading ? (
//         <p>Loading...</p>
//       ) : (
//         <table className="college-table">
//           <thead>
//             <tr>
//               <th>#</th>
//               <th>Student</th>
//               <th>Subject</th>
//               <th>Session</th>
//               <th>Fee</th>
//               <th>Student Note</th>
//               <th>Assign / Action</th>
//             </tr>
//           </thead>

//           <tbody>
//             {requests.map((r, i) => (
//               <tr key={r._id}>
//                 <td>{i + 1}</td>

//                 <td>
//                   {r.studentId?.name} ({r.studentId?.admissionNo})
//                 </td>

//                 <td>
//                   {r.subjectId?.subjectName}
//                   <div className="small-text">{r.subjectId?.subjectCode}</div>
//                 </td>

//                 <td>{r.sessionId?.name}</td>

//                 <td>
//                   {r.feeAmount} ({r.paymentStatus})
//                 </td>

//                 <td>{r.note || "—"}</td>

//                 <td>

//                   {/* APPROVE / REJECT BUTTONS */}
//                   {/* <button
//                     className="btn-green"
//                     onClick={() => approve(r._id)}
//                   >
//                     Approve
//                   </button> */}

//                   <button
//                     className="btn-red"
//                     onClick={() => reject(r._id)}
//                     style={{ marginLeft: 6 }}
//                   >
//                     Reject
//                   </button>

//                   {/* ASSIGN STAFF DROPDOWN */}
//                   <div style={{ marginTop: 8 }}>
//                     <select
//                       onFocus={() => loadEligibleStaff(r._id)}
//                       value={selectedAssign[r._id] || ""}
//                       onChange={(e) =>
//                         setSelectedAssign({
//                           ...selectedAssign,
//                           [r._id]: e.target.value,
//                         })
//                       }
//                     >
//                       <option value="">Select staff</option>

//                       {(staffOptions[r._id] || []).length === 0 && (
//                         <option disabled>No eligible staff</option>
//                       )}

//                       {(staffOptions[r._id] || []).map((s) => (
//                         <option key={s._id} value={s._id}>
//                           {s.name} ({s.collegeId?.name})
//                         </option>
//                       ))}
//                     </select>

//                     <button
//                       className="btn-blue"
//                       style={{ marginLeft: 6 }}
//                       onClick={() => assign(r._id)}
//                     >
//                       Assign
//                     </button>
//                   </div>

//                 </td>
//               </tr>
//             ))}

//             {requests.length === 0 && (
//               <tr>
//                 <td colSpan={7} className="text-muted text-center">
//                   No pending revaluation requests
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import api from "../../../api";
import "./admincss.css";

export default function AdminRevaluationList() {
  const [sessions, setSessions] = useState([]);
  const [sessionId, setSessionId] = useState("");
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [assigning, setAssigning] = useState(false);

  // ===============================
  // LOAD SESSIONS
  // ===============================
  useEffect(() => {
    const loadSessions = async () => {
      try {
        const res = await api.get("/exam-sessions/all");
        setSessions(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    loadSessions();
  }, []);

  // ===============================
  // LOAD REQUESTS FOR SESSION
  // ===============================
  const loadRequests = async (id) => {
    if (!id) return setRequests([]);

    setLoading(true);
    try {
      const res = await api.get(
        `/revaluation/admin/all?status=pending&sessionId=${id}`
      );
      setRequests(res.data);
    } catch (err) {
      console.log(err);
      alert("Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  const handleSessionChange = (e) => {
    const id = e.target.value;
    setSessionId(id);
    loadRequests(id);
  };

  // ===============================
  // AUTO ASSIGN
  // ===============================
  const autoAssign = async () => {
    if (!sessionId) return;

    if (!window.confirm("Auto assign all paid revaluation requests?")) return;

    setAssigning(true);
    try {
      const res = await api.post(
        `/revaluation/admin/auto-assign/${sessionId}`
      );
      alert(
        `${res.data.assigned} assigned, ${res.data.rejected} rejected`
      );
      loadRequests(sessionId);
    } catch (err) {
      console.log(err);
      alert("Auto assign failed");
    } finally {
      setAssigning(false);
    }
  };

  // ===============================
  // REJECT SINGLE REQUEST
  // ===============================
  const reject = async (id) => {
    const reason = prompt("Enter rejection reason:");
    if (reason === null) return;

    try {
      await api.put(`/revaluation/admin/reject/${id}`, { reason });
      loadRequests(sessionId);
    } catch (err) {
      console.log(err);
      alert("Reject failed");
    }
  };

  return (
    <div className="admin-page">
      <h2>Revaluation Requests</h2>

      {/* SESSION SELECT */}
      <div className="filter-row">
        <label>Select Exam Session:</label>
        <select
          className="filter-select"
          value={sessionId}
          onChange={handleSessionChange}
        >
          <option value="">-- Select --</option>
          {sessions.map(s => (
            <option key={s._id} value={s._id}>
              {s.name} | AY {s.academicYear} | Sem {s.semester}
            </option>
          ))}
        </select>

        {sessionId && (
          <button
            className="btn-blue"
            style={{ marginLeft: 15 }}
            disabled={assigning}
            onClick={autoAssign}
          >
            {assigning ? "Assigning..." : "Auto Assign"}
          </button>
        )}
      </div>

      {loading && <p>Loading...</p>}

      {!loading && (
        <table className="college-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Student</th>
              <th>College</th>
              <th>Subject</th>
              <th>Fee</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((r, i) => (
              <tr key={r._id}>
                <td>{i + 1}</td>
                <td>{r.studentId?.name}</td>
                <td>{r.studentId?.collegeId?.name}</td>
                <td>
                  {r.subjectId?.subjectName}
                  <div className="small-text">
                    {r.subjectId?.subjectCode}
                  </div>
                </td>
                <td>{r.feeAmount} ({r.paymentStatus})</td>
                <td>
                  <button
                    className="btn-red"
                    onClick={() => reject(r._id)}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}

            {requests.length === 0 && (
              <tr>
                <td colSpan="6" className="text-muted text-center">
                  No pending revaluation requests
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
