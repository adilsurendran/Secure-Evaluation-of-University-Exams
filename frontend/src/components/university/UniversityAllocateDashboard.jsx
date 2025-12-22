// import React, { useEffect, useState } from "react";
// import api from "../../../api";
// import './admincss.css'

// export default function UniversityAllocateDashboard() {
//   const [sessions, setSessions] = useState([]);

//   const loadStats = async () => {
//     try {
//       const res = await api.get("/university/allocation-stats");
//       setSessions(res.data);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   useEffect(() => {
//     loadStats();
//   }, []);

//   const allocatePapers = async (sessionId) => {
//     if (!window.confirm("Allocate papers for this session?")) return;

//     try {
//      const res = await api.post(`/university/allocate/${sessionId}`);
//      console.log(res);
     
//       alert("Allocation Completed");
//       loadStats();
//     } catch (err) {
//       console.log(err);
//       alert("Allocation failed");
//     }
//   };

//   return (
//     <div className="university-page">
//       <div className="header">
//         <h2>Exam Paper Allocation Dashboard</h2>
//       </div>

//       <div className="table-container">
//         <table className="college-table">
//           <thead>
//             <tr>
//               <th>#</th>
//               <th>Exam Session</th>
//               <th>Academic Year</th>
//               <th>Semester</th>
//               <th>Total Sheets</th>
//               <th>Allocated</th>
//               <th>Pending</th>
//               <th>Action</th>
//             </tr>
//           </thead>

//           <tbody>
//             {sessions.map((item, i) => (
//               <tr key={item.session._id}>
//                 <td>{i + 1}</td>

//                 <td>{item.session.name}</td>
//                 <td>{item.session.academicYear}</td>
//                 <td>Sem {item.session.semester}</td>

//                 <td>{item.totalSheets}</td>

//                 <td className="text-green">{item.allocatedSheets}</td>

//                 <td className="text-orange">{item.pendingSheets}</td>

//                 <td>
//                   {item.pendingSheets === 0 && item.allocatedSheets !== 0 ? (
//                     <button className="btn-green" disabled>
//                       ✔ Allocated
//                     </button>
//                   ) : (
//                     <button
//                       className="btn-blue"
//                       onClick={() => allocatePapers(item.session._id)}
//                     >
//                       Allocate Now
//                     </button>
//                   )}
//                 </td>
//               </tr>
//             ))}

//             {sessions.length === 0 && (
//               <tr>
//                 <td colSpan="8" className="text-center text-muted">
//                   No sessions available
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }


import React, { useEffect, useState } from "react";
import api from "../../../api";
import "./admincss.css";

export default function UniversityAllocateDashboard() {
  const [sessions, setSessions] = useState([]);
  const [loadingSession, setLoadingSession] = useState(null);

  const loadStats = async () => {
    try {
      const res = await api.get("/university/allocation-stats");
      setSessions(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const allocatePapers = async (sessionId) => {
    if (!window.confirm("Allocate papers for this session?")) return;

    try {
      setLoadingSession(sessionId);

      const res = await api.post(`/university/allocate/${sessionId}`);
      const { totalSheets, allocated, failed, failedAllocations } = res.data;

      // 🔔 Allocation feedback
      if (failed === 0) {
        alert(`✅ Allocation completed successfully\nAllocated: ${allocated}`);
      } else if (allocated > 0) {
        let message =
          `⚠️ Partial allocation completed\n\n` +
          `Total: ${totalSheets}\n` +
          `Allocated: ${allocated}\n` +
          `Failed: ${failed}\n\n` +
          `Reasons:\n`;

        failedAllocations.forEach((f, i) => {
          message += `${i + 1}. ${f.subject} → ${f.reason}\n`;
        });

        alert(message);
      } else {
        alert(
          `❌ Allocation failed\n\nNo sheets were allocated.\n` +
          `Reason: No eligible staff available`
        );
      }

      loadStats();
    } catch (err) {
      console.log(err);
      alert("❌ Allocation request failed");
    } finally {
      setLoadingSession(null);
    }
  };

  return (
    <div className="university-page">
      <div className="header">
        <h2>Exam Paper Allocation Dashboard</h2>
      </div>

      <div className="table-container">
        <table className="college-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Exam Session</th>
              <th>Academic Year</th>
              <th>Semester</th>
              <th>Total Sheets</th>
              <th>Allocated</th>
              <th>Pending</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {sessions.map((item, i) => {
              const fullyAllocated =
                item.pendingSheets === 0 && item.allocatedSheets > 0;

              return (
                <tr key={item.session._id}>
                  <td>{i + 1}</td>
                  <td>{item.session.name}</td>
                  <td>{item.session.academicYear}</td>
                  <td>Sem {item.session.semester}</td>

                  <td>{item.totalSheets}</td>
                  <td className="text-green">{item.allocatedSheets}</td>
                  <td className="text-orange">{item.pendingSheets}</td>

                  <td>
                    {fullyAllocated ? (
                      <button className="btn-green" disabled>
                        ✔ Allocated
                      </button>
                    ) : (
                      <button
                        className="btn-blue"
                        disabled={loadingSession === item.session._id}
                        onClick={() => allocatePapers(item.session._id)}
                      >
                        {loadingSession === item.session._id
                          ? "Allocating..."
                          : item.allocatedSheets > 0
                          ? "Retry Allocation"
                          : "Allocate Now"}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}

            {sessions.length === 0 && (
              <tr>
                <td colSpan="8" className="text-center text-muted">
                  No sessions available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
