// // // src/components/student/StudentRevaluationRequest.jsx
// // import React, { useEffect, useState } from "react";
// // import api from "../../../api";
// // import StudentLayout from "./StudentLayout";

// // export default function StudentRevaluationRequest() {
// //   const studentId = localStorage.getItem("studentId");
// //   const [sheets, setSheets] = useState([]);
// //   const [selected, setSelected] = useState("");
// //   const [fee, setFee] = useState(100); // default fee; adapt or fetch from server

// //   useEffect(() => {
// //     const load = async () => {
// //       try {
// //         // load evaluated answer sheets for student (only evaluated)
// //         const res = await api.get(`/student/evaluated-sheets/${studentId}`);
// //         // res expected to be array of AnswerSheet objects
// //         setSheets(res.data);
// //       } catch (err) {
// //         console.log(err);
// //         alert("Failed to load sheets");
// //       }
// //     };
// //     load();
// //   }, []);

// //   const submit = async (e) => {
// //     e.preventDefault();
// //     if (!selected) return alert("Select a sheet");

// //     try {
// //       const res = await api.post("/revaluation/student/create", {
// //         answerSheetId: selected,
// //         feeAmount: fee
// //       });

// //       alert("Request created. Complete payment to proceed.");
// //       // optionally redirect to payment or requests page
// //     } catch (err) {
// //       console.log(err);
// //       alert(err.response?.data?.msg || "Failed to create request");
// //     }
// //   };

// //   return (
// //     <StudentLayout>
// //     <div className="student-page">
// //       <h2>Request Revaluation (per subject)</h2>

// //       <form onSubmit={submit}>
// //         <label>Select evaluated answer sheet</label>
// //         <select value={selected} onChange={(e) => setSelected(e.target.value)}>
// //           <option value="">-- select sheet --</option>
// //           {sheets.map((sh) => (
// //             <option key={sh._id} value={sh._id}>
// //               {sh.subjectId?.subjectName} ({sh.examId?.examDate ? new Date(sh.examId?.examDate).toLocaleDateString() : ""}) - Marks: {sh.marks}
// //             </option>
// //           ))}
// //         </select>

// //         <label>Fee amount (per subject)</label>
// //         <input type="number" value={fee} onChange={(e) => setFee(e.target.value)} />

// //         <button type="submit">Request Revaluation</button>
// //       </form>
// //     </div>
// //     </StudentLayout> 
// //   );
// // }


// import React, { useEffect, useState } from "react";
// import api from "../../../api";
// import StudentLayout from "./StudentLayout";

// export default function StudentRevaluationRequest() {
//   const studentId = localStorage.getItem("studentId");

//   const [sessions, setSessions] = useState([]);
//   const [subjects, setSubjects] = useState([]);
//   const [sheets, setSheets] = useState([]);

//   const [selectedSession, setSelectedSession] = useState("");
//   const [selectedSubject, setSelectedSubject] = useState("");
//   const [selectedSheet, setSelectedSheet] = useState("");

//   const [fee, setFee] = useState(100);

//   // =======================
//   // Load exam sessions for the student
//   // =======================
//   useEffect(() => {
//     const loadSessions = async () => {
//       try {
//         const res = await api.get(`/student/sessions/${studentId}`);
//         setSessions(res.data);
//       } catch (err) {
//         console.log(err);
//         alert("Failed to load sessions");
//       }
//     };
//     loadSessions();
//   }, []);

//   // =======================
//   // Load subjects in selected session
//   // =======================
//   const loadSubjects = async (sessionId) => {
//     try {
//       const res = await api.get(
//         `/student/evaluated-subjects/${studentId}/${sessionId}`
//       );
//       setSubjects(res.data);
//     } catch (err) {
//       console.log(err);
//       alert("Failed to load subjects");
//     }
//   };

//   // =======================
//   // Load evaluated sheets for subject
//   // =======================
//   const loadSheets = async (subjectId) => {
//     try {
//       const res = await api.get(
//         `/student/evaluated-sheets/${studentId}/${selectedSession}/${subjectId}`
//       );
//       setSheets(res.data);
//     } catch (err) {
//       console.log(err);
//       alert("Failed to load sheets");
//     }
//   };

//   // SESSION CHANGE
//   const handleSessionChange = (id) => {
//     setSelectedSession(id);
//     setSelectedSubject("");
//     setSelectedSheet("");
//     setSubjects([]);
//     setSheets([]);
//     if (id) loadSubjects(id);
//   };

//   // SUBJECT CHANGE
//   const handleSubjectChange = (id) => {
//     setSelectedSubject(id);
//     setSelectedSheet("");
//     setSheets([]);
//     if (id) loadSheets(id);
//   };

//   // =======================
//   // Submit revaluation request
//   // =======================
//   const submit = async (e) => {
//     e.preventDefault();
//     if (!selectedSheet) return alert("Select an answer sheet");

//     try {
//       await api.post("/revaluation/student/create", {
//         answerSheetId: selectedSheet,
//         feeAmount: fee
//       });

//       alert("Revaluation request submitted.");
//     } catch (err) {
//       console.log(err);
//       alert(err.response?.data?.msg || "Failed to create request");
//     }
//   };

//   return (
//     <StudentLayout>
//       <div className="student-page">
//         <h2>Request Revaluation</h2>

//         <form onSubmit={submit}>

//           {/* SELECT SESSION */}
//           <label>Select Exam Session</label>
//           <select
//             value={selectedSession}
//             onChange={(e) => handleSessionChange(e.target.value)}
//           >
//             <option value="">-- Select Session --</option>
//             {sessions.map((s) => (
//               <option key={s._id} value={s._id}>
//                 {s.name} (AY {s.academicYear}) - Sem {s.semester}
//               </option>
//             ))}
//           </select>

//           {/* SELECT SUBJECT */}
//           <label>Select Subject</label>
//           <select
//             value={selectedSubject}
//             onChange={(e) => handleSubjectChange(e.target.value)}
//             disabled={!selectedSession}
//           >
//             <option value="">
//               {selectedSession ? "-- Select Subject --" : "Select session first"}
//             </option>

//             {subjects.map((sub) => (
//               <option key={sub._id} value={sub._id}>
//                 {sub.subjectName} ({sub.subjectCode})
//               </option>
//             ))}
//           </select>

//           {/* SELECT SHEET */}
//           <label>Select Evaluated Answer Sheet</label>
//           <select
//             value={selectedSheet}
//             onChange={(e) => setSelectedSheet(e.target.value)}
//             disabled={!selectedSubject}
//           >
//             <option value="">
//               {selectedSubject ? "-- Select Sheet --" : "Select subject first"}
//             </option>

//             {sheets.map((sh) => (
//               <option key={sh._id} value={sh._id}>
//                 {new Date(sh.examId?.examDate).toLocaleDateString()} - Marks:{" "}
//                 {sh.marks}
//               </option>
//             ))}
//           </select>

//           {/* FEE INPUT */}
//           <label>Revaluation Fee (per subject)</label>
//           <input
//             type="number"
//             value={fee}
//             onChange={(e) => setFee(e.target.value)}
//           />

//           <button type="submit">Submit Request</button>
//         </form>
//       </div>
//     </StudentLayout>
//   );
// }


import React, { useEffect, useState } from "react";
import api from "../../../api";
import StudentLayout from "./StudentLayout";

export default function StudentRevaluationRequest() {
  const studentId = localStorage.getItem("studentId");
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState("");
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState("");
  const [evaluatedSheets, setEvaluatedSheets] = useState([]);
  const [selectedSheet, setSelectedSheet] = useState("");
  const [fee, setFee] = useState(100);
//   const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  // load sessions
  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/exam-sessions/all");
        setSessions(res.data);
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  // when session selected, load exams of that session
  useEffect(() => {
    if (!selectedSession) {
      setExams([]);
      setSelectedExam("");
      return;
    }
    (async () => {
      try {
        const res = await api.get(`/exams/session/${selectedSession}`);
        setExams(res.data);
      } catch (err) {
        console.log(err);
      }
    })();
  }, [selectedSession]);

  // when exam selected, load student's evaluated sheets for that exam
  useEffect(() => {
    if (!selectedExam) {
      setEvaluatedSheets([]);
      setSelectedSheet("");
      return;
    }
    (async () => {
      try {
        // endpoint: GET /student/evaluated-sheets/:studentId/:examId
        const res = await api.get(`/student/evaluated-sheets/${studentId}/${selectedExam}`);
        // res returns list of AnswerSheet objects but WITHOUT file urls
        setEvaluatedSheets(res.data);
      } catch (err) {
        console.log(err);
      }
    })();
  }, [selectedExam]);

  const submit = async (e) => {
    e.preventDefault();
    if (!selectedSheet) return alert("Select evaluated sheet to request revaluation");

    try {
      setLoading(true);
      const payload = {
        answerSheetId: selectedSheet,
        feeAmount: fee,
        // note,
        studentId
      };

      await api.post("/revaluation/student/create", payload);
      alert("Request created. Complete payment if required.");
      // redirect or reset
      setSelectedSession("");
      setSelectedExam("");
      setSelectedSheet("");
    //   setNote("");
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.msg || "Failed to create request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <StudentLayout>
      <div className="student-page">
        <h2>Request Revaluation (per subject)</h2>

        <form onSubmit={submit} className="form-card">
          <label>Choose Exam Session</label>
          <select value={selectedSession} onChange={(e) => setSelectedSession(e.target.value)}>
            <option value="">-- select session --</option>
            {sessions.map(s => (
              <option key={s._id} value={s._id}>
                {s.name} - {s.academicYear} (Sem {s.semester})
              </option>
            ))}
          </select>

          <label>Choose Exam (subject)</label>
          <select value={selectedExam} onChange={(e) => setSelectedExam(e.target.value)} disabled={!selectedSession}>
            <option value="">-- select exam --</option>
            {exams.map(ex => (
              <option key={ex._id} value={ex._id}>
                {ex.subjectId?.subjectName} ({ex.subjectId?.subjectCode}) — {new Date(ex.examDate).toLocaleDateString()}
              </option>
            ))}
          </select>

          <label>Select your evaluated paper</label>
          <select value={selectedSheet} onChange={(e) => setSelectedSheet(e.target.value)} disabled={!selectedExam}>
            <option value="">-- select evaluated sheet --</option>
            {evaluatedSheets.map(sh => (
              <option key={sh._id} value={sh._id}>
                {sh.subjectId?.subjectName} — Marks: {sh.marks}
              </option>
            ))}
          </select>

          <label>Fee Amount</label>
          <input type="number" value={fee} onChange={(e) => setFee(e.target.value)} />

          {/* <label>Note (optional)</label>
          <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Explain concerns (optional)" /> */}

          <div style={{ marginTop: 12 }}>
            <button type="submit" disabled={loading}>{loading ? "Submitting..." : "Request Revaluation"}</button>
          </div>
        </form>
      </div>
    </StudentLayout>
  );
}
