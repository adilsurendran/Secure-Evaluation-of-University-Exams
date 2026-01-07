// import React, { useEffect, useState } from "react";
// import api from "../../../api";
// import { useNavigate } from "react-router-dom";

// function ScheduleExam() {
//   const [form, setForm] = useState({
//     sessionId: "",
//     subjectId: "",
//     examDate: "",
//     examTime: "",
//     allowedColleges: [],
//   });

//   const [sessions, setSessions] = useState([]);
//   const [colleges, setColleges] = useState([]);
//   const [errors, setErrors] = useState({});

//   const [collegeSearch, setCollegeSearch] = useState("");
//   const [showCollegeSuggestions, setShowCollegeSuggestions] = useState(false);
//   const navigate = useNavigate()
//   // ============================================
//   // LOAD SESSIONS + COLLEGES
//   // ============================================
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [sessionRes, collegeRes] = await Promise.all([
//           api.get("/exam-sessions/all"),
//           api.get("/colleges/all"),
//         ]);

//         setSessions(sessionRes.data);
//         setColleges(collegeRes.data);

//       } catch (err) {
//         console.log(err);
//       }
//     };

//     fetchData();
//   }, []);

//   // ============================================
//   // GET SUBJECTS FROM SELECTED SESSION
//   // ============================================
//   const selectedSession = sessions.find((s) => s._id === form.sessionId);
//   const availableSubjects = selectedSession?.subjects || [];

//   // ============================================
//   // FILTER COLLEGES BASED ON SELECTED SUBJECT
//   // ============================================
//   const filteredColleges = form.subjectId
//     ? colleges.filter((college) =>
//         college.subjects?.some((sub) => {
//           const realId = sub._id || sub; // handle object or string
//           return String(realId) === String(form.subjectId);
//         })
//       )
//     : [];

//   // ============================================
//   // VALIDATION
//   // ============================================
//   const validate = () => {
//     let err = {};

//     if (!form.sessionId) err.sessionId = "Select an exam session";
//     if (!form.subjectId) err.subjectId = "Select a subject";
//     if (!form.examDate) err.examDate = "Select exam date";
//     if (!form.examTime.trim()) err.examTime = "Enter exam time";

//     if (form.allowedColleges.length === 0)
//       err.allowedColleges = "Select at least one college";

//     setErrors(err);
//     return Object.keys(err).length === 0;
//   };

//   // ============================================
//   // SUBMIT EXAM
//   // ============================================
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!validate()) return alert("Fix validation errors");

//     try {
//       await api.post("/exams/create", form);
//       alert("Exam scheduled successfully!");

//       // RESET FORM
//       setForm({
//         sessionId: "",
//         subjectId: "",
//         examDate: "",
//         examTime: "",
//         allowedColleges: [],
//       });

//       setCollegeSearch("");
//       setShowCollegeSuggestions(false);
//       setErrors({});
//       navigate("/admin/exams/manage")
//     } catch (err) {
//       console.log(err);
//       alert("Error scheduling exam");
//     }
//   };

//   // ============================================
//   // TOGGLE COLLEGE SELECTION
//   // ============================================
//   const toggleCollege = (id) => {
//     setForm((prev) => ({
//       ...prev,
//       allowedColleges: prev.allowedColleges.includes(id)
//         ? prev.allowedColleges.filter((x) => x !== id)
//         : [...prev.allowedColleges, id],
//     }));
//   };

//   return (
//     <div className="bgg">
//       <div className="college-form-wrapper">
//         <h2>Schedule Exam</h2>

//         <form onSubmit={handleSubmit}>
//           {/* SESSION SELECT */}
//           <select
//             value={form.sessionId}
//             onChange={(e) =>
//               setForm({
//                 ...form,
//                 sessionId: e.target.value,
//                 subjectId: "",
//                 allowedColleges: [],
//               })
//             }
//           >
//             <option value="">Select Exam Session</option>
//             {sessions.map((s) => (
//               <option key={s._id} value={s._id}>
//                 {s.name} - {s.academicYear} (Sem {s.semester})
//               </option>
//             ))}
//           </select>
//           <p className="error text-danger">{errors.sessionId}</p>

//           {/* SUBJECT SELECT */}
//           <select
//             value={form.subjectId}
//             onChange={(e) =>
//               setForm({ ...form, subjectId: e.target.value, allowedColleges: [] })
//             }
//             disabled={!form.sessionId}
//           >
//             <option value="">
//               {form.sessionId ? "Select Subject" : "Select session first"}
//             </option>

//             {availableSubjects.map((sub) => (
//               <option key={sub._id} value={sub._id}>
//                 {sub.subjectCode} - {sub.subjectName}
//               </option>
//             ))}
//           </select>
//           <p className="error text-danger">{errors.subjectId}</p>

//           {/* EXAM DATE */}
//           {/* <input
//             type="date"
//             value={form.examDate}
//             onChange={(e) => setForm({ ...form, examDate: e.target.value })}
//           />
//           <p className="error text-danger">{errors.examDate}</p> */}
//           {/* EXAM DATE */}
// <input
//   type="date"
//   min={selectedSession ? selectedSession.startDate.split("T")[0] : ""}
//   max={selectedSession ? selectedSession.endDate.split("T")[0] : ""}
//   value={form.examDate}
//   onChange={(e) => setForm({ ...form, examDate: e.target.value })}
// />
// <p className="error text-danger">{errors.examDate}</p>


//           {/* EXAM TIME */}
//           <input
//             placeholder="Exam Time (e.g. 10 AM - 1 PM)"
//             value={form.examTime}
//             onChange={(e) => setForm({ ...form, examTime: e.target.value })}
//           />
//           <p className="error text-danger">{errors.examTime}</p>

//           {/* COLLEGE SEARCH + MULTI SELECT */}
//           <div className="subject-search-box">
//             <input
//               type="text"
//               className="subject-search-input"
//               placeholder={
//                 form.subjectId ? "Search college..." : "Select subject first"
//               }
//               value={collegeSearch}
//               disabled={!form.subjectId}
//               onChange={(e) => {
//                 setCollegeSearch(e.target.value.toLowerCase());
//                 setShowCollegeSuggestions(true);
//               }}
//               onFocus={() => setShowCollegeSuggestions(true)}
//             />

//             {/* SELECTED COLLEGES (chips) */}
//             <div className="selected-area">
//               {form.allowedColleges.length === 0 && (
//                 <span className="placeholder">No colleges selected</span>
//               )}

//               {form.allowedColleges.map((id) => {
//                 const col = colleges.find((c) => c._id === id);
//                 return (
//                   <span className="chip" key={id}>
//                     {col?.name}
//                     <span
//                       className="remove-chip"
//                       onClick={() => toggleCollege(id)}
//                     >
//                       ×
//                     </span>
//                   </span>
//                 );
//               })}
//             </div>

//             {/* FILTERED SUGGESTIONS */}
//             {showCollegeSuggestions &&
//               collegeSearch &&
//               form.subjectId && (
//                 <div className="dropdown">
//                   {filteredColleges
//                     .filter((c) =>
//                       c.name.toLowerCase().includes(collegeSearch)
//                     )
//                     .slice(0, 8)
//                     .map((c) => (
//                       <div
//                         key={c._id}
//                         className="dropdown-item"
//                         onClick={() => {
//                           toggleCollege(c._id);
//                           setCollegeSearch("");
//                           setShowCollegeSuggestions(false);
//                         }}
//                       >
//                         {c.name}
//                       </div>
//                     ))}
//                 </div>
//               )}
//           </div>

//           <p className="error text-danger">{errors.allowedColleges}</p>

//           <button type="submit">Schedule Exam</button>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default ScheduleExam;

import React, { useEffect, useState } from "react";
import api from "../../../api";
import { useNavigate } from "react-router-dom";

function ScheduleExam() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    sessionId: "",
    subjectId: "",
    examDate: "",
    examTime: "",
  });

  const [sessions, setSessions] = useState([]);
  const [errors, setErrors] = useState({});

  // ============================================
  // LOAD EXAM SESSIONS
  // ============================================
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await api.get("/exam-sessions/all");
        setSessions(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchSessions();
  }, []);

  // ============================================
  // SELECTED SESSION + SUBJECTS
  // ============================================
  const selectedSession = sessions.find(
    (s) => s._id === form.sessionId
  );

  const availableSubjects = selectedSession?.subjects || [];

  // ============================================
  // VALIDATION
  // ============================================
  const validate = () => {
    let err = {};

    if (!form.sessionId) err.sessionId = "Select an exam session";
    if (!form.subjectId) err.subjectId = "Select a subject";
    if (!form.examDate) err.examDate = "Select exam date";
    if (!form.examTime.trim()) err.examTime = "Enter exam time";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  // ============================================
  // SUBMIT EXAM
  // ============================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return alert("Fix validation errors");

    try {
      await api.post("/exams/create", form);
      alert("Exam scheduled successfully");

      setForm({
        sessionId: "",
        subjectId: "",
        examDate: "",
        examTime: "",
      });

      setErrors({});
      navigate("/admin/exams/manage");
    } catch (err) {
      console.log(err);
      alert("Error scheduling exam");
    }
  };

  return (
    <div className="bgg">
      <div className="college-form-wrapper">
        <h2>Schedule Exam</h2>

        <form onSubmit={handleSubmit}>
          {/* ================= SESSION ================= */}
          <select
            value={form.sessionId}
            onChange={(e) =>
              setForm({
                ...form,
                sessionId: e.target.value,
                subjectId: "",
              })
            }
          >
            <option value="">Select Exam Session</option>
            {sessions.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name} - {s.academicYear} (Sem {s.semester})
              </option>
            ))}
          </select>
          <p className="error text-danger">{errors.sessionId}</p>

          {/* ================= SUBJECT ================= */}
          <select
            value={form.subjectId}
            onChange={(e) =>
              setForm({ ...form, subjectId: e.target.value })
            }
            disabled={!form.sessionId}
          >
            <option value="">
              {form.sessionId
                ? "Select Subject"
                : "Select session first"}
            </option>

            {availableSubjects.map((sub) => (
              <option key={sub._id} value={sub._id}>
                {sub.subjectCode} - {sub.subjectName}
              </option>
            ))}
          </select>
          <p className="error text-danger">{errors.subjectId}</p>

          {/* ================= EXAM DATE ================= */}
          <input
            type="date"
            min={
              selectedSession
                ? selectedSession.startDate.split("T")[0]
                : ""
            }
            max={
              selectedSession
                ? selectedSession.endDate.split("T")[0]
                : ""
            }
            value={form.examDate}
            onChange={(e) =>
              setForm({ ...form, examDate: e.target.value })
            }
          />
          <p className="error text-danger">{errors.examDate}</p>

          {/* ================= EXAM TIME ================= */}
          <input
            placeholder="Exam Time (e.g. 10 AM - 1 PM)"
            value={form.examTime}
            onChange={(e) =>
              setForm({ ...form, examTime: e.target.value })
            }
          />
          <p className="error text-danger">{errors.examTime}</p>

          {/* INFO NOTE */}
          <p className="text-muted">
            Allowed colleges are automatically applied from the exam session.
          </p>

          <button type="submit">Schedule Exam</button>
        </form>
      </div>
    </div>
  );
}

export default ScheduleExam;
