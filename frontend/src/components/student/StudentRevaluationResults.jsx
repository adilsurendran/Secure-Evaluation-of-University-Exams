// import React, { useEffect, useState } from "react";
// import api from "../../../api";
// import StudentLayout from "./StudentLayout";

// export default function StudentRevaluationResults() {
//   const studentId = localStorage.getItem("studentId");

//   const [sessions, setSessions] = useState([]);
//   const [selectedSession, setSelectedSession] = useState("");
//   const [loading, setLoading] = useState(false);

//   const [marksheet, setMarksheet] = useState(null);
//   const [error, setError] = useState("");

//   // =========================================
//   // LOAD SESSION LIST (ONLY SESSIONS HE HAS RESULTS IN)
//   // =========================================
//   const loadSessions = async () => {
//     try {
//       const res = await api.get(`/student/results/sessions/${studentId}`);
//       // console.log(res);
      
//       setSessions(res.data);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   useEffect(() => {
//     loadSessions();
//   }, []);

//   // =========================================
//   // LOAD MARKSHEET FOR A SESSION
//   // =========================================
//   const fetchMarksheet = async (sessionId) => {
//     if (!sessionId) return;

//     setLoading(true);
//     setError("");
//     setMarksheet(null);

//     try {
//       const res = await api.get(
//         `/student/results/marksheet/${studentId}/${sessionId}`
//       );
//       setMarksheet(res.data);
//       console.log(res);
      
//     } catch (err) {
//       const msg = err.response?.data?.msg || "Failed to load results";
//       setError(msg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // when user selects session
//   const handleSessionChange = (e) => {
//     const id = e.target.value;
//     setSelectedSession(id);
//     fetchMarksheet(id);
//   };

//   return (
//     <StudentLayout>
//       <div className="student-page">
//         <h2>My Exam Results</h2>

//         {/* SESSION SELECT BOX */}
//         <div style={{ marginBottom: 20 }}>
//           <label>Select Exam Session:</label>
//           <select
//             value={selectedSession}
//             onChange={handleSessionChange}
//             style={{ marginLeft: 10 }}
//           >
//             <option value="">-- choose --</option>
//             {sessions.map((s) => (
//               <option key={s._id} value={s._id}>
//                 {s.name} - {s.academicYear} (Sem {s.semester})
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* ERROR MESSAGE */}
//         {error && <p className="text-danger">{error}</p>}

//         {/* LOADING */}
//         {loading && <p>Loading...</p>}

//         {/* NO SESSION SELECTED */}
//         {!loading && !error && !marksheet && !selectedSession && (
//           <p className="text-muted">Select a session to view results.</p>
//         )}

//         {/* RESULT NOT PUBLISHED */}
//         {!loading && selectedSession && error === "Result not published yet" && (
//           <p className="text-orange">Result not announced yet.</p>
//         )}

//         {/* MARKSHEET DISPLAY */}
//         {marksheet && (
//           <div className="result-card">
//             <h3>
//               {marksheet.session.name} - {marksheet.session.academicYear}
//             </h3>
//             <p>Semester {marksheet.session.semester}</p>

//             <table className="college-table" style={{ marginTop: 20 }}>
//               <thead>
//                 <tr>
//                   <th>#</th>
//                   <th>Subject</th>
//                   <th>Total Mark</th>
//                   <th>Mark</th>
//                   <th>Status</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {marksheet.subjects.map((r, i) => (
//                   <tr key={i}>
//                     <td>{i + 1}</td>

//                     <td>
//                       {r.subjectName}
//                       <div className="small-text">{r.subjectCode}</div>
//                     </td>

//                     <td>{r.totalMark}</td>

//                     <td>
//                       {r.revaluation
//                         ? `${r.original.marks} (ORG) - ${r.revaluation.newMarks} (RV)`
//                         : r.original.marks}
//                     </td>

//                     <td
//                       className={
//                         (r.revaluation
//                           ? r.revaluation.newMarks
//                           : r.original.marks) >=
//                         r.totalMark * 0.4
//                           ? "text-green"
//                           : "text-red"
//                       }
//                     >
//                       {(r.revaluation
//                         ? r.revaluation.newMarks
//                         : r.original.marks) >=
//                       r.totalMark * 0.4
//                         ? "PASS"
//                         : "FAIL"}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </StudentLayout>
//   );
// }


// src/components/student/StudentRevaluationResults.jsx

import React, { useEffect, useState } from "react";
import api from "../../../api";
import StudentLayout from "./StudentLayout";

export default function StudentRevaluationResults() {
  const studentId = localStorage.getItem("studentId");

  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState("");
  const [marksheet, setMarksheet] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =====================================================
  // LOAD SESSIONS WHERE STUDENT HAS ANY RESULT ENTRY
  // =====================================================
  const loadSessions = async () => {
    try {
      const res = await api.get(`/student/results/sessions/${studentId}`);
      setSessions(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadSessions();
  }, []);

  // =====================================================
  // LOAD MARKSHEET FOR SELECTED SESSION
  // =====================================================
  const fetchMarksheet = async (sessionId) => {
    if (!sessionId) return;

    setLoading(true);
    setError("");
    setMarksheet(null);

    try {
      const res = await api.get(
        `/student/results/marksheet/${studentId}/${sessionId}`
      );
      setMarksheet(res.data);
      console.log(res.data);
      
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to load results");
    } finally {
      setLoading(false);
    }
  };

  const handleSessionChange = (e) => {
    const id = e.target.value;
    setSelectedSession(id);
    fetchMarksheet(id);
  };

  // =====================================================
  // CHECK IF ANY REVALUATION EXISTS
  // =====================================================
  const hasRevaluation =
    marksheet &&
    marksheet.subjects &&
    marksheet.subjects.some((s) => s.revaluation);

  return (
    <StudentLayout>
      <div className="student-page">
        <h2>Revaluation Results</h2>

        {/* ================= SESSION SELECT ================= */}
        <div style={{ marginBottom: 20 }}>
          <label>Select Exam Session:</label>
          <select
            value={selectedSession}
            onChange={handleSessionChange}
            style={{ marginLeft: 10 }}
          >
            <option value="">-- Choose --</option>
            {sessions.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name} - {s.academicYear} (Sem {s.semester})
              </option>
            ))}
          </select>
        </div>

        {/* ================= LOADING ================= */}
        {loading && <p>Loading...</p>}

        {/* ================= ERROR ================= */}
        {error && <p className="text-danger">{error}</p>}

        {/* ================= NO SESSION ================= */}
        {!loading && !selectedSession && (
          <p className="text-muted">Select a session to view revaluation results.</p>
        )}

        {/* ================= RESULT NOT PUBLISHED ================= */}
        {!loading &&
          selectedSession &&
          error === "Results not announced yet" && (
            <p className="text-orange">
              Revaluation results not announced yet.
            </p>
          )}

        {/* ================= NO REVALUATION ================= */}
        {marksheet && !hasRevaluation && (
          <p className="text-muted">
            No revaluation results found for this session.
          </p>
        )}

        {/* ================= REVALUATION TABLE ================= */}
        {marksheet && hasRevaluation && (
          <div className="result-card">
            <h3>
              {marksheet.session.name} - {marksheet.session.academicYear}
            </h3>
            <p>Semester {marksheet.session.semester}</p>

            <table className="college-table" style={{ marginTop: 20 }}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Subject</th>
                  <th>Total Mark</th>
                  {/* <th>Old Mark</th> */}
                  <th>New Mark</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {marksheet.subjects
                  .filter((r) => r.revaluation) // 🔥 ONLY REVALUATED
                  .map((r, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>

                      <td>
                        {r.subjectName}
                        <div className="small-text">
                          {r.subjectCode}
                        </div>
                      </td>

                      <td>{r.totalMark}</td>

                      {/* <td className="text-muted">
                        {r.revaluation.oldMarks}
                      </td> */}

                      <td className="text-blue">
                        <b>{r.revaluation.newMarks}</b>
                      </td>

                      <td
                        className={
                          r.revaluation.newMarks >= r.totalMark * 0.4
                            ? "text-green"
                            : "text-red"
                        }
                      >
                        {r.revaluation.newMarks >= r.totalMark * 0.4
                          ? "PASS"
                          : "FAIL"}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </StudentLayout>
  );
}

