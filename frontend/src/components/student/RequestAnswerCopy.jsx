// import React, { useEffect, useState } from "react";
// import api from "../../../api";
// import "./student.css"; // optional styling file

// function RequestAnswerCopy() {
//   const studentId = localStorage.getItem("studentId");

//   const [sessions, setSessions] = useState([]);
//   const [subjects, setSubjects] = useState([]);
//   const [requests, setRequests] = useState([]);

//   const [form, setForm] = useState({
//     sessionId: "",
//     subjectId: ""
//   });

//   const [loadingSessions, setLoadingSessions] = useState(true);
//   const [loadingRequests, setLoadingRequests] = useState(true);

//   // ======================================================
//   // LOAD SESSIONS (ONLY WHERE STUDENT HAS ATTENDED EXAMS)
//   // ======================================================
//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         const res = await api.get(`/student/sessions/${studentId}`);
//         setSessions(res.data);
//         setLoadingSessions(false);
//       } catch (err) {
//         console.log(err);
//         setLoadingSessions(false);
//       }
//     };

//     loadData();
//   }, []);

//   // ======================================================
//   // LOAD SUBJECTS FOR SELECTED SESSION
//   // ======================================================
//   const loadSubjects = async (sessionId) => {
//     setSubjects([]);
//     if (!sessionId) return;

//     try {
//       const res = await api.get(`/student/session-subjects/${studentId}/${sessionId}`);
//       setSubjects(res.data);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   // ======================================================
//   // LOAD REQUEST HISTORY
//   // ======================================================
//   const loadRequests = async () => {
//     setLoadingRequests(true);

//     try {
//       const res = await api.get(`/student/copy-requests/${studentId}`);
//       setRequests(res.data);
//     } catch (err) {
//       console.log(err);
//     }

//     setLoadingRequests(false);
//   };

//   useEffect(() => {
//     loadRequests();
//   }, []);

//   // ======================================================
//   // SUBMIT REQUEST
//   // ======================================================
//   const submitRequest = async () => {
//     if (!form.sessionId || !form.subjectId) {
//       return alert("Please select session and subject");
//     }

//     try {
//       await api.post("/student/request-answer-copy", {
//         studentId,
//         sessionId: form.sessionId,
//         subjectId: form.subjectId
//       });

//       alert("Request submitted successfully!");
//       setForm({ sessionId: "", subjectId: "" });

//       loadRequests();
//     } catch (err) {
//       console.log(err);
//       alert(err.response?.data?.msg || "Failed to submit request");
//     }
//   };

//   // ======================================================
//   // OPEN APPROVED SIGNED URL
//   // ======================================================
//   const viewApprovedCopy = async (request) => {
//     try {
//       const res = await api.get(
//         `/student/answer-copy-url/${request.sessionId}/${request.subjectId}/${studentId}`
//       );

//       if (res.data.url) window.open(res.data.url, "_blank");
//       else alert("Unable to load answer sheet");
//     } catch (err) {
//       console.log(err);
//       alert("Error opening answer sheet");
//     }
//   };

//   return (
//     <div className="student-page">
//       <h2>Request Answer Sheet Copy</h2>

//       {/* ======================= CREATE REQUEST ======================= */}
//       <div className="form-box">
//         <h3>New Request</h3>

//         <select
//           value={form.sessionId}
//           onChange={(e) => {
//             setForm({ sessionId: e.target.value, subjectId: "" });
//             loadSubjects(e.target.value);
//           }}
//         >
//           <option value="">Select Exam Session</option>
//           {sessions.map((s) => (
//             <option key={s._id} value={s._id}>
//               {s.name} - {s.academicYear} (Sem {s.semester})
//             </option>
//           ))}
//         </select>

//         <select
//           value={form.subjectId}
//           onChange={(e) => setForm({ ...form, subjectId: e.target.value })}
//           disabled={!form.sessionId}
//         >
//           <option value="">
//             {form.sessionId ? "Select Subject" : "Select session first"}
//           </option>

//           {subjects.map((sub) => (
//             <option key={sub._id} value={sub._id}>
//               {sub.subjectCode} - {sub.subjectName}
//             </option>
//           ))}
//         </select>

//         <button onClick={submitRequest}>Submit Request</button>
//       </div>

//       {/* ======================= REQUEST HISTORY ======================= */}
//       <div className="history-box">
//         <h3>Your Requests</h3>

//         {loadingRequests ? (
//           <p>Loading...</p>
//         ) : requests.length === 0 ? (
//           <p>No requests found.</p>
//         ) : (
//           <table className="student-table">
//             <thead>
//               <tr>
//                 <th>Session</th>
//                 <th>Subject</th>
//                 <th>Status</th>
//                 <th>Note</th>
//                 <th>View</th>
//               </tr>
//             </thead>

//             <tbody>
//               {requests.map((r) => (
//                 <tr key={r._id}>
//                   <td>{r.sessionId?.name}</td>

//                   <td>
//                     {r.subjectId?.subjectName}
//                     <div className="small-text">{r.subjectId?.subjectCode}</div>
//                   </td>

//                   <td
//                     className={
//                       r.status === "approved"
//                         ? "text-green"
//                         : r.status === "rejected"
//                         ? "text-red"
//                         : "text-orange"
//                     }
//                   >
//                     {r.status.toUpperCase()}
//                   </td>

//                   <td>{r.rejectNote || "-"}</td>

//                   <td>
//                     {r.status === "approved" ? (
//                       <button
//                         className="btn-blue"
//                         onClick={() => viewApprovedCopy(r)}
//                       >
//                         View Copy
//                       </button>
//                     ) : (
//                       "-"
//                     )}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>
//     </div>
//   );
// }

// export default RequestAnswerCopy;
