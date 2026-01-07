// import React, { useEffect, useState } from "react";
// import api from "../../../api";
// import StudentLayout from "./StudentLayout";

// export default function StudentRevaluationRequest() {
//   const studentId = localStorage.getItem("studentId");
//   const [sessions, setSessions] = useState([]);
//   const [selectedSession, setSelectedSession] = useState("");
//   const [exams, setExams] = useState([]);
//   const [selectedExam, setSelectedExam] = useState("");
//   const [evaluatedSheets, setEvaluatedSheets] = useState([]);
//   const [selectedSheet, setSelectedSheet] = useState("");
//   const [fee, setFee] = useState(100);
// //   const [note, setNote] = useState("");
//   const [loading, setLoading] = useState(false);

//   // load sessions
//   useEffect(() => {
//     (async () => {
//       try {
//         const res = await api.get("/exam-sessions/all");
//         setSessions(res.data);
//       } catch (err) {
//         console.log(err);
//       }
//     })();
//   }, []);

//   // when session selected, load exams of that session
//   useEffect(() => {
//     if (!selectedSession) {
//       setExams([]);
//       setSelectedExam("");
//       return;
//     }
//     (async () => {
//       try {
//         const res = await api.get(`/exams/session/${selectedSession}`);
//         setExams(res.data);
//       } catch (err) {
//         console.log(err);
//       }
//     })();
//   }, [selectedSession]);

//   // when exam selected, load student's evaluated sheets for that exam
//   useEffect(() => {
//     if (!selectedExam) {
//       setEvaluatedSheets([]);
//       setSelectedSheet("");
//       return;
//     }
//     (async () => {
//       try {
//         // endpoint: GET /student/evaluated-sheets/:studentId/:examId
//         const res = await api.get(`/student/evaluated-sheets/${studentId}/${selectedExam}`);
//         // res returns list of AnswerSheet objects but WITHOUT file urls
//         setEvaluatedSheets(res.data);
//       } catch (err) {
//         console.log(err);
//       }
//     })();
//   }, [selectedExam]);

//   const submit = async (e) => {
//     e.preventDefault();
//     if (!selectedSheet) return alert("Select evaluated sheet to request revaluation");

//     try {
//       setLoading(true);
//       const payload = {
//         answerSheetId: selectedSheet,
//         feeAmount: fee,
//         // note,
//         studentId
//       };

//       await api.post("/revaluation/student/create", payload);
//       alert("Request created. Complete payment if required.");
//       // redirect or reset
//       setSelectedSession("");
//       setSelectedExam("");
//       setSelectedSheet("");
//     //   setNote("");
//     } catch (err) {
//       console.log(err);
//       alert(err.response?.data?.msg || "Failed to create request");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <StudentLayout>
//       <div className="student-page">
//         <h2>Request Revaluation (per subject)</h2>

//         <form onSubmit={submit} className="form-card">
//           <label>Choose Exam Session</label>
//           <select value={selectedSession} onChange={(e) => setSelectedSession(e.target.value)}>
//             <option value="">-- select session --</option>
//             {sessions.map(s => (
//               <option key={s._id} value={s._id}>
//                 {s.name} - {s.academicYear} (Sem {s.semester})
//               </option>
//             ))}
//           </select>

//           <label>Choose Exam (subject)</label>
//           <select value={selectedExam} onChange={(e) => setSelectedExam(e.target.value)} disabled={!selectedSession}>
//             <option value="">-- select exam --</option>
//             {exams.map(ex => (
//               <option key={ex._id} value={ex._id}>
//                 {ex.subjectId?.subjectName} ({ex.subjectId?.subjectCode}) — {new Date(ex.examDate).toLocaleDateString()}
//               </option>
//             ))}
//           </select>

//           <label>Select your evaluated paper</label>
//           <select value={selectedSheet} onChange={(e) => setSelectedSheet(e.target.value)} disabled={!selectedExam}>
//             <option value="">-- select evaluated sheet --</option>
//             {evaluatedSheets.map(sh => (
//               <option key={sh._id} value={sh._id}>
//                 {sh.subjectId?.subjectName} — Marks: {sh.marks}
//               </option>
//             ))}
//           </select>

//           <label>Fee Amount</label>
//           <input type="number" value={fee} onChange={(e) => setFee(e.target.value)} />

//           {/* <label>Note (optional)</label>
//           <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Explain concerns (optional)" /> */}

//           <div style={{ marginTop: 12 }}>
//             <button type="submit" disabled={loading}>{loading ? "Submitting..." : "Request Revaluation"}</button>
//           </div>
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
  const [loading, setLoading] = useState(false);

  // 🔒 NEW STATES
  const [allowed, setAllowed] = useState(false);
  const [checking, setChecking] = useState(false);
  const [blockMessage, setBlockMessage] = useState("");

  // ===============================
  // LOAD EXAM SESSIONS
  // ===============================
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

  // ===============================
  // LOAD EXAMS FOR SESSION
  // ===============================
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

  // ===============================
  // LOAD EVALUATED SHEETS
  // ===============================
  useEffect(() => {
    if (!selectedExam) {
      setEvaluatedSheets([]);
      setSelectedSheet("");
      return;
    }

    (async () => {
      try {
        const res = await api.get(
          `/student/evaluated-sheets/${studentId}/${selectedExam}`
        );
        setEvaluatedSheets(res.data);
      } catch (err) {
        console.log(err);
      }
    })();
  }, [selectedExam]);

  // ===============================
  // 🔒 CHECK IF REVALUATION ALLOWED
  // ===============================
  useEffect(() => {
    if (!selectedSheet || !selectedSession) {
      setAllowed(false);
      setBlockMessage("");
      return;
    }

    (async () => {
      try {
        setChecking(true);
        const res = await api.get(
          `/revaluation/check/${studentId}/${selectedSession}/${selectedSheet}`
        );
console.log(res);

        setAllowed(res.data.allowed);
        setBlockMessage(res.data.message || "");
      } catch (err) {
        setAllowed(false);
        setBlockMessage("Unable to verify revaluation status");
      } finally {
        setChecking(false);
      }
    })();
  }, [selectedSheet, selectedSession, studentId]);

  // ===============================
  // SUBMIT REQUEST
  // ===============================
  const submit = async (e) => {
    e.preventDefault();

    if (!selectedSheet)
      return alert("Select evaluated sheet to request revaluation");

    if (!allowed)
      return alert("Revaluation already requested for this subject");

    try {
      setLoading(true);

      const payload = {
        answerSheetId: selectedSheet,
        feeAmount: fee,
        studentId
      };

      await api.post("/revaluation/student/create", payload);

      alert("Revaluation request submitted successfully");

      // reset
      setSelectedSession("");
      setSelectedExam("");
      setSelectedSheet("");
      setAllowed(false);
      setBlockMessage("");
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
          <select
            value={selectedSession}
            onChange={(e) => setSelectedSession(e.target.value)}
          >
            <option value="">-- select session --</option>
            {sessions.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name} - {s.academicYear} (Sem {s.semester})
              </option>
            ))}
          </select>

          <label>Choose Exam (subject)</label>
          <select
            value={selectedExam}
            onChange={(e) => setSelectedExam(e.target.value)}
            disabled={!selectedSession}
          >
            <option value="">-- select exam --</option>
            {exams.map((ex) => (
              <option key={ex._id} value={ex._id}>
                {ex.subjectId?.subjectName} ({ex.subjectId?.subjectCode})
              </option>
            ))}
          </select>

          <label>Select your evaluated paper</label>
          <select
            value={selectedSheet}
            onChange={(e) => setSelectedSheet(e.target.value)}
            disabled={!selectedExam}
          >
            <option value="">-- select evaluated sheet --</option>
            {evaluatedSheets.map((sh) => (
              <option key={sh._id} value={sh._id}>
                {sh.subjectId?.subjectName} — Marks: {sh.marks}
              </option>
            ))}
          </select>

          {/* 🔒 STATUS MESSAGE */}
          {checking && (
            <p style={{ color: "gray" }}>Checking revaluation eligibility…</p>
          )}

          {!checking && blockMessage && !allowed && (
            <p style={{ color: "green", fontWeight: 500 }}>
              {blockMessage}
            </p>
          )}

          <label>Fee Amount</label>
          <input
            type="number"
            value={fee}
            onChange={(e) => setFee(e.target.value)}
          />

          <div style={{ marginTop: 12 }}>
            <button
              type="submit"
              disabled={loading || checking || !allowed}
            >
              {loading
                ? "Submitting..."
                : allowed
                ? "Request Revaluation"
                : "Already Applied"}
            </button>
          </div>
        </form>
      </div>
    </StudentLayout>
  );
}
