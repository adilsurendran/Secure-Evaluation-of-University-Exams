// // src/components/staff/StaffAssigned.jsx
// import React, { useEffect, useState } from "react";
// import StaffSidebar from "./StaffSidebar";
// import api from "../../../api";
// import "./staff.css";

// function StaffAssigned() {
//   const staffId = localStorage.getItem("staffId");
//   const [sheets, setSheets] = useState([]);

//   // Modal States
//   const [showModal, setShowModal] = useState(false);
//   const [selectedSheetId, setSelectedSheetId] = useState(null);
//   const [marks, setMarks] = useState("");

//   // Load assigned sheets
//   const fetchSheets = async () => {
//     try {
//       const res = await api.get(`/staff/assigned/${staffId}`);
//       setSheets(res.data);
//     } catch (err) {
//       console.log(err);
//       alert("Failed to load assigned sheets");
//     }
//   };

//   useEffect(() => {
//     fetchSheets();
//   }, []);

//   // =============================
//   // OPEN PDF USING SIGNED URL
//   // =============================
//   const openPdf = async (encryptedPublicId) => {
//     try {
//       const res = await api.get(`/colleges/answers/signed-url/${encryptedPublicId}`);

//       if (res.data.url) {
//         window.open(res.data.url, "_blank");
//       } else {
//         alert("Unable to load PDF");
//       }
//     } catch (err) {
//       alert("Failed to open secure PDF");
//     }
//   };

//   // =============================
//   // OPEN MODAL
//   // =============================
//   const openMarkModal = (sheetId) => {
//     setSelectedSheetId(sheetId);
//     setMarks("");
//     setShowModal(true);
//   };

//   // =============================
//   // SUBMIT MARKS
//   // =============================
//   const submitMarks = async () => {
//     if (!marks || isNaN(marks) || marks < 0) {
//       return alert("Enter valid marks!");
//     }

//     try {
//       await api.put(`/staff/evaluate/${selectedSheetId}`, {
//         marks,
//         status: "evaluated",
//       });

//       // Remove evaluated paper from list
//       setSheets((prev) => prev.filter((s) => s._id !== selectedSheetId));

//       setShowModal(false);
//       alert("Evaluation completed!");
//     } catch (err) {
//       console.log(err);
//       alert("Failed to submit marks");
//     }
//   };

//   return (
//     <div className="staff-container">
//       <StaffSidebar />

//       <div className="staff-main">
//         <h1>Assigned Answer Sheets</h1>
//         <p className="sub-text">Evaluate papers assigned to you.</p>

//         <div className="assigned-table-wrapper">
//           <table className="assigned-table">
//             <thead>
//               <tr>
//                 <th>#</th>
//                 <th>Reg Number</th>
//                 <th>Subject</th>
//                 <th>Exam Date</th>
//                 <th>PDF</th>
//                 <th>Action</th>
//               </tr>
//             </thead>

//             <tbody>
//               {sheets.map((s, i) => (
//                 <tr key={s._id}>
//                   <td>{i + 1}</td>

//                   {/* Student */}
//                   <td>
//                     <b>{s.studentId?.admissionNo}</b>
//                     {/* <div className="small-text">{s.studentId?.admissionNo}</div> */}
//                   </td>

//                   {/* Subject */}
//                   <td>
//                     {s.subjectId?.subjectName}
//                     <div className="small-text">{s.subjectId?.subjectCode}</div>
//                   </td>

//                   {/* Exam Date */}
//                   <td>{new Date(s.examId?.examDate).toLocaleDateString()}</td>

//                   {/* VIEW PDF */}
//                   <td>
//                     <button
//                       className="view-btn"
//                       onClick={() => openPdf(s.filePublicId)}
//                     >
//                       View PDF
//                     </button>
//                   </td>

//                   {/* ACTION */}
//                   <td>
//                     <button
//                       className="complete-btn"
//                       onClick={() => openMarkModal(s._id)}
//                     >
//                       Mark Completed
//                     </button>
//                   </td>
//                 </tr>
//               ))}

//               {sheets.length === 0 && (
//                 <tr>
//                   <td colSpan={6} className="no-data">
//                     No assigned sheets
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* ======================== MODAL ======================== */}
//       {showModal && (
//         <div className="modal-overlay">
//           <div className="modal-box">
//             <h3>Enter Evaluation Marks</h3>

//             <input
//               type="number"
//               className="modal-input"
//               placeholder="Enter marks"
//               value={marks}
//               onChange={(e) => setMarks(e.target.value)}
//             />

//             <div className="modal-buttons">
//               <button className="modal-submit" onClick={submitMarks}>
//                 Submit
//               </button>

//               <button
//                 className="modal-cancel"
//                 onClick={() => setShowModal(false)}
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//       {/* ====================== END MODAL ====================== */}
//     </div>
//   );
// }

// export default StaffAssigned;


// src/components/staff/StaffAssigned.jsx
import React, { useEffect, useState } from "react";
import StaffSidebar from "./StaffSidebar";
import api from "../../../api";
import "./staff.css";

function StaffAssigned() {
  const staffId = localStorage.getItem("staffId");
  const [sheets, setSheets] = useState([]);

  // Modal States
  const [showModal, setShowModal] = useState(false);
  const [selectedSheetId, setSelectedSheetId] = useState(null);
  const [marks, setMarks] = useState("");
  const [maxMark, setMaxMark] = useState(null); // ← NEW

  // Load assigned sheets
  const fetchSheets = async () => {
    try {
      const res = await api.get(`/staff/assigned/${staffId}`);
      setSheets(res.data);
    } catch (err) {
      console.log(err);
      alert("Failed to load assigned sheets");
    }
  };

  useEffect(() => {
    fetchSheets();
  }, []);

  // =============================
  // OPEN PDF USING SIGNED URL
  // =============================
  const openPdf = async (encryptedPublicId) => {
    try {
      const res = await api.get(`/colleges/answers/signed-url/${encryptedPublicId}`);

      if (res.data.url) {
        window.open(res.data.url, "_blank");
      } else {
        alert("Unable to load PDF");
      }
    } catch (err) {
      alert("Failed to open secure PDF");
    }
  };

  // =============================
  // OPEN MARK ENTRY MODAL
  // =============================
  const openMarkModal = (sheetId) => {
    const sheet = sheets.find((s) => s._id === sheetId);
    setMaxMark(sheet.subjectId?.total_mark || 0); // ← SET MAX MARK

    setSelectedSheetId(sheetId);
    setMarks("");
    setShowModal(true);
  };

  // =============================
  // SUBMIT MARKS
  // =============================
  const submitMarks = async () => {
    const num = Number(marks);

    if (isNaN(num) || num < 0) {
      return alert("Marks cannot be negative");
    }

    if (num > maxMark) {
      return alert(`Maximum allowed mark is ${maxMark}`);
    }

    try {
      await api.put(`/staff/evaluate/${selectedSheetId}`, {
        marks: num,
        status: "evaluated",
      });

      // Remove evaluated paper from list
      setSheets((prev) => prev.filter((s) => s._id !== selectedSheetId));

      setShowModal(false);
      alert("Evaluation completed!");
    } catch (err) {
      console.log(err);
      alert("Failed to submit marks");
    }
  };

  return (
    <div className="staff-container">
      <StaffSidebar />

      <div className="staff-main">
        <h1>Assigned Answer Sheets</h1>
        <p className="sub-text">Evaluate papers assigned to you.</p>

        <div className="assigned-table-wrapper">
          <table className="assigned-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Reg Number</th>
                <th>Subject</th>
                <th>Exam Date</th>
                <th>PDF</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {sheets.map((s, i) => (
                <tr key={s._id}>
                  <td>{i + 1}</td>

                  <td>
                    <b>{s.studentId?.admissionNo}</b>
                  </td>

                  <td>
                    {s.subjectId?.subjectName}
                    <div className="small-text">{s.subjectId?.subjectCode}</div>
                  </td>

                  <td>{new Date(s.examId?.examDate).toLocaleDateString()}</td>

                  <td>
                    <button
                      className="view-btn"
                      onClick={() => openPdf(s.filePublicId)}
                    >
                      View PDF
                    </button>
                  </td>

                  <td>
                    <button
                      className="complete-btn"
                      onClick={() => openMarkModal(s._id)}
                    >
                      Mark Completed
                    </button>
                  </td>
                </tr>
              ))}

              {sheets.length === 0 && (
                <tr>
                  <td colSpan={6} className="no-data">No assigned sheets</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ======================== MODAL ======================== */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Enter Evaluation Marks</h3>

            <p className="total-mark-text">
              <b>Total Mark:</b> {maxMark}
            </p>

            <input
              type="number"
              className="modal-input"
              placeholder={`Enter marks (0 - ${maxMark})`}
              value={marks}
              onChange={(e) => setMarks(e.target.value)}
              min="0"
              max={maxMark}
            />

            <div className="modal-buttons">
              <button className="modal-submit" onClick={submitMarks}>
                Submit
              </button>

              <button className="modal-cancel" onClick={() => setShowModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ====================== END MODAL ====================== */}
    </div>
  );
}

export default StaffAssigned;
