// // src/components/student/StudentAnswerCopyRequest.jsx
// import React, { useEffect, useState } from "react";
// import StudentLayout from "./StudentLayout";
// import api from "../../../api";

// function StudentAnswerCopyRequest() {
//   const studentId = localStorage.getItem("studentId");
//   const [exams, setExams] = useState([]);

//   useEffect(() => {
//     const loadExams = async () => {
//       const res = await api.get(`/student/exams-written/${studentId}`);
//       setExams(res.data);
//     };
//     loadExams();
//   }, []);

//   const requestCopy = async (examId) => {
//     await api.post("/answercopy/request", { studentId, examId });
//     alert("Answer Copy Requested Successfully!");
//   };

//   return (
//     <StudentLayout>
//       <h2>Answer Sheet Copy Request</h2>

//       <table className="college-table">
//         <thead>
//           <tr>
//             <th>Subject</th>
//             <th>Exam Date</th>
//             <th>Action</th>
//           </tr>
//         </thead>

//         <tbody>
//           {exams.map((e) => (
//             <tr key={e._id}>
//               <td>{e.subjectId.subjectName}</td>
//               <td>{e.examDate}</td>
//               <td>
//                 <button onClick={() => requestCopy(e._id)}>Request Copy</button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </StudentLayout>
//   );
// }

// export default StudentAnswerCopyRequest;

// src/components/student/StudentAnswerCopyRequest.jsx
import React, { useEffect, useMemo, useState } from "react";
import api from "../../../api";
import StudentLayout from "./StudentLayout"; // Assuming you already have this layout

function StudentAnswerCopyRequest() {
  const studentId = localStorage.getItem("studentId");

  const [sheets, setSheets] = useState([]);
  const [myRequests, setMyRequests] = useState([]);

  const [selectedSessionId, setSelectedSessionId] = useState("");
  const [selectedExamId, setSelectedExamId] = useState("");

  const [loading, setLoading] = useState(true);
  const [loadingRequests, setLoadingRequests] = useState(true);
  // console.log(myRequests);
  

  // ===========================
  // LOAD AVAILABLE OPTIONS
  // ===========================
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const res = await api.get(
          `/student/answer-copy/options/${studentId}`
        );
        setSheets(res.data || []);
      } catch (err) {
        console.log(err);
        alert("Failed to load answer sheet options");
      } finally {
        setLoading(false);
      }
    };

    const fetchMyRequests = async () => {
      try {
        const res = await api.get(
          `/student/answer-copy/my-requests/${studentId}`
        );
        setMyRequests(res.data || []);
      } catch (err) {
        console.log(err);
      } finally {
        setLoadingRequests(false);
      }
    };

    fetchOptions();
    fetchMyRequests();
  }, [studentId]);

  // ===========================
  // DERIVED SESSION OPTIONS
  // ===========================
  const sessionOptions = useMemo(() => {
    const map = new Map();
    sheets.forEach((s) => {
      if (s.sessionId) {
        map.set(s.sessionId._id, s.sessionId);
      }
    });
    return Array.from(map.values());
  }, [sheets]);

  // Exams for selected session
  const examOptions = useMemo(() => {
    if (!selectedSessionId) return [];
    return sheets
      .filter((s) => s.sessionId?._id === selectedSessionId)
      .map((s) => ({
        examId: s.examId?._id,
        subjectName: s.subjectId?.subjectName,
        subjectCode: s.subjectId?.subjectCode,
        examDate: s.examId?.examDate,
      }))
      .filter((item, index, self) => {
        // Unique by examId
        return index === self.findIndex((x) => x.examId === item.examId);
      });
  }, [sheets, selectedSessionId]);

  // ===========================
  // HANDLE SUBMIT REQUEST
  // ===========================
  const handleSubmitRequest = async (e) => {
    e.preventDefault();

    if (!selectedSessionId || !selectedExamId) {
      return alert("Please select session and exam");
    }

    try {
      const res = await api.post("/student/answer-copy/request", {
        studentId,
        sessionId: selectedSessionId,
        examId: selectedExamId,
      });

      alert(res.data?.msg || "Request submitted");

      // Refresh my requests
      const r2 = await api.get(
        `/student/answer-copy/my-requests/${studentId}`
      );
      setMyRequests(r2.data || []);
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.msg || "Failed to submit request");
    }
  };

  // ===========================
  // VIEW APPROVED PDF
  // ===========================
  const viewApprovedPdf = async (requestId) => {
    console.log(requestId);
    
    try {
      const res = await api.get(
        `/student/answer-copy/pdf/${requestId}`
      );
      console.log(res);
      
      if (res.data?.url) {
        window.open(res.data.url, "_blank");
      } else {
        alert("Unable to load PDF");
      }
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.msg || "Failed to open PDF");
    }
  };

  return (
    <StudentLayout>
      <div className="student-page">
        <h2>Request Answer Sheet Copy</h2>

        {/* REQUEST FORM */}
        <div className="student-card">
          <h4>New Request</h4>

          {loading ? (
            <p>Loading exams...</p>
          ) : sessionOptions.length === 0 ? (
            <p className="text-muted">
              No completed exams found. You can request copies only for exams
              with uploaded answer sheets.
            </p>
          ) : (
            <form onSubmit={handleSubmitRequest}>
              {/* Session */}
              <div className="form-group">
                <label>Exam Session</label>
                <select
                  value={selectedSessionId}
                  onChange={(e) => {
                    setSelectedSessionId(e.target.value);
                    setSelectedExamId("");
                  }}
                >
                  <option value="">Select Session</option>
                  {sessionOptions.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name} - {s.academicYear} (Sem {s.semester})
                    </option>
                  ))}
                </select>
              </div>

              {/* Exam */}
              <div className="form-group">
                <label>Exam / Subject</label>
                <select
                  value={selectedExamId}
                  onChange={(e) => setSelectedExamId(e.target.value)}
                  disabled={!selectedSessionId}
                >
                  <option value="">
                    {selectedSessionId
                      ? "Select Exam"
                      : "Select session first"}
                  </option>
                  {examOptions.map((e) => (
                    <option key={e.examId} value={e.examId}>
                      {e.subjectName} ({e.subjectCode}) -{" "}
                      {e.examDate
                        ? new Date(e.examDate).toLocaleDateString()
                        : ""}
                    </option>
                  ))}
                </select>
              </div>

              <button type="submit" className="btn-blue">
                Submit Request
              </button>
            </form>
          )}
        </div>

        {/* MY REQUESTS */}
        <div className="student-card" style={{ marginTop: "25px" }}>
          <h4>My Answer Sheet Copy Requests</h4>

          {loadingRequests ? (
            <p>Loading requests...</p>
          ) : myRequests.length === 0 ? (
            <p className="text-muted">No requests submitted yet.</p>
          ) : (
            <table className="student-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Session</th>
                  <th>Subject</th>
                  <th>Exam Date</th>
                  <th>Status</th>
                  <th>Note / Action</th>
                </tr>
              </thead>
              <tbody>
                {myRequests.map((r, i) => (
                  <tr key={r._id}>
                    <td>{i + 1}</td>
                    <td>
                      {r.sessionId?.name} - {r.sessionId?.academicYear} (Sem{" "}
                      {r.sessionId?.semester})
                    </td>
                    <td>
                      {r.subjectId?.subjectName} (
                      {r.subjectId?.subjectCode})
                    </td>
                    <td>
                      {r.examId?.examDate
                        ? new Date(
                            r.examId.examDate
                          ).toLocaleDateString()
                        : "-"}
                    </td>
                    <td>
                      <span
                        className={
                          r.status === "approved"
                            ? "status-green"
                            : r.status === "rejected"
                            ? "status-red"
                            : "status-orange"
                        }
                      >
                        {r.status.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      {r.status === "approved" && (
                        <button
                          className="view-btn"
                          onClick={() => viewApprovedPdf(r._id)}
                        >
                          View PDF
                        </button>
                      )}

                      {r.status === "rejected" && (
                        <span className="text-danger">
                          {r.adminNote || "Request rejected"}
                        </span>
                      )}

                      {r.status === "pending" && (
                        <span className="text-muted">Pending review</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </StudentLayout>
  );
}

export default StudentAnswerCopyRequest;
