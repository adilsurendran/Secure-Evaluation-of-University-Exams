// // src/components/student/StudentRevalStatus.jsx
// import React, { useEffect, useState } from "react";
// import api from "../../../api";

// export default function StudentRevalStatus() {
//   const studentId = localStorage.getItem("studentId");
//   const [list, setList] = useState([]);

//   useEffect(() => {
//     const load = async () => {
//       try {
//         const res = await api.get(`/revaluation/student/${studentId}`);
//         setList(res.data);
//       } catch (err) {
//         console.log(err);
//       }
//     };
//     load();
//   }, []);

//   const openApprovedPdf = async (requestId) => {
//     try {
//       const res = await api.get(`/colleges/answers/student-copy/${requestId}`); // your studentGetCopyPdf controller
//       if (res.data.url) window.open(res.data.url, "_blank");
//       else alert("URL missing");
//     } catch (err) {
//       console.log(err);
//       alert(err.response?.data?.msg || "Failed to get PDF");
//     }
//   };

//   const pay = async (id) => {
//     // simulate pay: call mark paid endpoint
//     try {
//       await api.post(`/revaluation/student/paid/${id}`);
//       alert("Marked paid");
//       const res = await api.get(`/revaluation/student/${studentId}`);
//       setList(res.data);
//     } catch (err) {
//       console.log(err);
//       alert("Payment failed");
//     }
//   };

//   return (
//     <div className="student-page">
//       <h2>Your Revaluation Requests</h2>

//       <table className="college-table">
//         <thead>
//           <tr>
//             <th>#</th>
//             <th>Subject</th>
//             <th>Old Marks</th>
//             <th>Fee</th>
//             <th>Status</th>
//             <th>Action</th>
//           </tr>
//         </thead>
//         <tbody>
//           {list.map((r, i) => (
//             <tr key={r._id}>
//               <td>{i+1}</td>
//               <td>{r.subjectId?.subjectName} ({r.subjectId?.subjectCode})</td>
//               <td>{r.oldMarks}</td>
//               <td>{r.feeAmount} {r.feePaid ? "(Paid)" : ""}</td>
//               <td>{r.status}{r.adminNote ? ` - ${r.adminNote}` : ""}</td>
//               <td>
//                 {r.status === "awaiting_payment" && (
//                   <button onClick={() => pay(r._id)}>Pay</button>
//                 )}
//                 {r.status === "completed" && (
//                   <button onClick={() => openApprovedPdf(r._id)}>View Re-evaluated Copy</button>
//                 )}
//               </td>
//             </tr>
//           ))}
//           {list.length === 0 && (
//             <tr><td colSpan={6}>No requests</td></tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// }


// import React, { useEffect, useState } from "react";
// import api from "../../../api";
// import StudentLayout from "./StudentLayout";

// export default function StudentRevaluationStatus() {
//   const studentId = localStorage.getItem("studentId");
//   const [requests, setRequests] = useState([]);

//   const load = async () => {
//     try {
//       const res = await api.get(`/revaluation/student/requests/${studentId}`);
//       setRequests(res.data);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   useEffect(() => {
//     load();
//   }, []);

//   return (
//     <StudentLayout>
//       <div className="student-page">
//         <h2>My Revaluation Requests</h2>

//         <table className="college-table">
//           <thead>
//             <tr>
//               <th>#</th>
//               <th>Subject</th>
//               <th>Session</th>
//               <th>Submitted</th>
//               <th>Fee</th>
//               <th>Status</th>
//               {/* <th>Admin Note / Staff Remarks</th>
//               <th>Old → New Marks</th> */}
//             </tr>
//           </thead>
//           <tbody>
//             {requests.map((r,i) => (
//               <tr key={r._id}>
//                 <td>{i+1}</td>
//                 <td>{r.subjectId?.subjectName} ({r.subjectId?.subjectCode})</td>
//                 <td>{r.sessionId?.name}</td>
//                 <td>{new Date(r.createdAt).toLocaleString()}</td>
//                 <td>{r.feeAmount} ({r.paymentStatus})</td>
//                 <td>{r.status}</td>
//                 {/* <td>{r.status === "rejected" ? r.adminNote : r.staffRemarks}</td>
//                 <td>{r.oldMarks !== null ? `${r.oldMarks} → ${r.newMarks ?? "-"}` : "-"}</td> */}
//               </tr>
//             ))}

//             {requests.length === 0 && (
//               <tr>
//                 <td colSpan={8} className="text-muted">No requests found</td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </StudentLayout>
//   );
// }


import React, { useEffect, useState } from "react";
import api from "../../../api";
import StudentLayout from "./StudentLayout";

export default function StudentRevaluationStatus() {
  const studentId = localStorage.getItem("studentId");
  const [requests, setRequests] = useState([]);

  const load = async () => {
    try {
      const res = await api.get(`/revaluation/student/requests/${studentId}`);
      setRequests(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // ================================
  // PAYMENT HANDLER
  // ================================
  const handlePayment = async (reqId, amount, status) => {
    if ( status === "rejected"){return alert("Your request is rejected by Univerysity, Contact immeadiatly!!")}
    if (!window.confirm(`Pay ₹${amount} for revaluation?`)) return;

    try {
      // Simulate payment success OR integrate Razorpay later
      await api.put(`/revaluation/student/mark-paid/${reqId}`, {
        paymentStatus: "paid"
      });

      alert("Payment Successful");
      load();
    } catch (err) {
      console.log(err);
      alert("Payment Failed");
    }
  };

  return (
    <StudentLayout>
      <div className="student-page">
        <h2>My Revaluation Requests</h2>

        <table className="college-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Subject</th>
              <th>Session</th>
              <th>Submitted</th>
              <th>Fee</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {requests.map((r, i) => (
              <tr key={r._id}>
                <td>{i + 1}</td>

                <td>
                  {r.subjectId?.subjectName}
                  <div className="small-text">{r.subjectId?.subjectCode}</div>
                </td>

                <td>{r.sessionId?.name}</td>

                <td>{new Date(r.createdAt).toLocaleString()}</td>

                <td>
                  ₹{r.feeAmount} ({r.paymentStatus})
                </td>

                <td className={r.status === "rejected" ? "text-danger" : "text-blue"}>
                  {r.status}
                </td>

                <td>
                  {/* SHOW PAY BUTTON ONLY IF PAYMENT IS PENDING */}
                  {r.paymentStatus === "pending"  ? (
                    <button
                      className="btn-blue"
                      onClick={() => handlePayment(r._id, r.feeAmount, r.status)}
                    >
                      Pay Now
                    </button>
                  ) : (
                    <span className="text-green">Payment Completed</span>
                  )}
                </td>
              </tr>
            ))}

            {requests.length === 0 && (
              <tr>
                <td colSpan={7} className="text-muted text-center">
                  No revaluation requests found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </StudentLayout>
  );
}
