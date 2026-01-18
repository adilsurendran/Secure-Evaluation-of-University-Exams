import React, { useEffect, useState, useMemo } from "react";
import StaffSidebar from "./StaffSidebar";
import api from "../../../api";
import "./staff.css";
import { useNavigate } from "react-router-dom";

export default function StaffRevaluationEvaluate() {
  const staffId = localStorage.getItem("staffId");
  const navigate = useNavigate()

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [marksMap, setMarksMap] = useState({});
  const [remarksMap, setRemarksMap] = useState({});

  const loadRequests = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/revaluation/staff/assigned/${staffId}`);
      setRequests(res.data);
    } catch (err) {
      console.error("Error loading revaluation requests:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, [staffId]);

  // Combined search
  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      const studentName = r.studentId?.name?.toLowerCase() || "";
      const admNo = r.studentId?.admissionNo?.toLowerCase() || "";
      const subjectName = r.subjectId?.subjectName?.toLowerCase() || "";
      return studentName.includes(search) || admNo.includes(search) || subjectName.includes(search);
    });
  }, [requests, search]);

  // const openPdf = async (answerSheet) => {
  //   try {
  //     if (!answerSheet || !answerSheet.filePublicId) {
  //       return alert("Answer sheet file reference missing.");
  //     }
  //     const res = await api.get(`/colleges/answers/signed-url/${answerSheet.filePublicId}`);
  //     if (res.data?.url) {
  //       window.open(res.data.url, "_blank");
  //     } else {
  //       alert("Cannot generate view link.");
  //     }
  //   } catch (err) {
  //     console.error("PDF Open Error:", err);
  //     alert("Cannot open PDF");
  //   }
  // };
// const openPdf = async (answerSheet) => {
//   try {
//     if (!answerSheet || !answerSheet.filePublicId) {
//       return alert("Answer sheet file reference missing.");
//     }

//     const res = await api.get(
//       `/colleges/answers/signed-url/${answerSheet.filePublicId}`,
//       {
//         params: {
//           staffId: staffId
//         }
//       }
//     );

//     if (res.data?.url) {
//       window.open(res.data.url, "_blank");
//     } else {
//       alert("Cannot generate view link.");
//     }
//   } catch (err) {
//     console.error("PDF Open Error:", err);
//     alert("Cannot open PDF");
//   }
// };
const openPdf = async (answerSheet) => {
  try {
    if (!answerSheet || !answerSheet.filePublicId) {
      return alert("Answer sheet file reference missing.");
    }

    const res = await api.get(
      `/colleges/answers/signed-url/${answerSheet.filePublicId}`,
      {
        params: {
          staffId: staffId
        }
      }
    );

    if (res.data?.url) {
      navigate("/staff/secure-pdf-viewer", {
        state: {
          url: res.data.url,
          viewer: "staff"
        }
      });
    } else {
      alert("Unable to load PDF");
    }
  } catch (err) {
    console.error("PDF OPEN ERROR", err);
    alert("Failed to open secure PDF");
  }
};


  const submitEvaluation = async (reqId, maxAllowed) => {
    const newMarks = marksMap[reqId];
    if (newMarks === undefined || newMarks === "" || isNaN(newMarks)) {
      return alert("Please enter valid marks.");
    }

    const numMarks = Number(newMarks);
    if (numMarks < 0) return alert("Marks cannot be negative.");
    if (maxAllowed && numMarks > maxAllowed) {
      return alert(`Marks cannot exceed subject maximum (${maxAllowed}).`);
    }

    try {
      await api.put(`/revaluation/staff/evaluate/${reqId}`, {
        newMarks: numMarks,
        staffRemarks: remarksMap[reqId] || "",
        staffId
      });
      alert("Evaluation submitted successfully!");
      // Refresh list
      loadRequests();
    } catch (err) {
      console.error("Submit error:", err);
      alert("Evaluation submission failed.");
    }
  };

  return (
    <div className="staff-container">
      <StaffSidebar />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        .staff-page {
          min-height: 100vh;
          font-family: 'Inter', sans-serif;
        }

        .staff-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
          padding-bottom: 24px;
          border-bottom: 2px solid rgba(30, 64, 175, 0.1);
        }

        .staff-header h2 {
          font-size: 32px;
          font-weight: 800;
          background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0;
        }

        .filter-bar {
          display: flex;
          gap: 16px;
          background: white;
          padding: 16px;
          border-radius: 16px;
          margin-bottom: 24px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          border: 1px solid #e2e8f0;
        }

        .filter-bar input {
          flex: 1;
          padding: 12px 16px;
          border: 1.5px solid #e2e8f0;
          border-radius: 10px;
          font-size: 14px;
          transition: all 0.3s;
        }

        .filter-bar input:focus {
           outline: none;
           border-color: #3b82f6;
           box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
        }

        .table-container {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
          border: 1px solid #e2e8f0;
        }

        .reval-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 15px;
        }

        .reval-table thead {
          background: #1e40af;
          color: white;
        }

        .reval-table th {
          padding: 18px 16px;
          text-align: left;
          font-weight: 600;
          text-transform: uppercase;
          font-size: 13px;
          letter-spacing: 0.5px;
        }

        .reval-table tr {
          border-bottom: 1px solid #f1f5f9;
        }

        
        .reval-table td {
          padding: 16px;
          vertical-align: middle;
        }

        .student-info {
          display: flex;
          flex-direction: column;
        }

        .student-info .name { font-weight: 700; color: #1e293b; }
        .student-info .id { font-size: 12px; color: #64748b; }

        .marks-input {
          width: 80px;
          padding: 8px 12px;
          border: 1.5px solid #e2e8f0;
          border-radius: 8px;
          font-weight: 700;
          text-align: center;
        }

        .remarks-input {
          width: 180px;
          padding: 8px 12px;
          border: 1.5px solid #e2e8f0;
          border-radius: 8px;
          font-size: 13px;
        }

        .btn-open {
          padding: 6px 12px;
          background: #eff6ff;
          color: #2563eb;
          border: 1px solid #dbeafe;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
        }

        .btn-submit {
          padding: 8px 16px;
          background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 700;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .btn-submit:hover {
          transform: translateY(-1px);
        }

        .old-marks {
          font-weight: 600;
          color: #ef4444;
          background: #fef2f2;
          padding: 4px 10px;
          border-radius: 6px;
        }

        @media (max-width: 1024px) {
           .reval-table { font-size: 13px; }
           .remarks-input { width: 120px; }
        }
      `}</style>

      <div className="staff-main-content staff-page">
        <div className="staff-header">
          <h2>🔄 Revaluation Evaluation</h2>
          <div className="badge-reval">{filteredRequests.length} Pending Requests</div>
        </div>

        <div className="filter-bar">
          <input
            type="text"
            placeholder="Search student, admission number or subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value.toLowerCase())}
          />
        </div>

        <div className="table-container">
          <table className="reval-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Student Details</th>
                <th>Subject</th>
                {/* <th>Old Marks</th> */}
                <th>Answer Sheet</th>
                <th>New Marks</th>
                <th>Staff Remarks</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: "center", padding: "40px" }}>Loading revaluation assignments...</td>
                </tr>
              ) : filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
                    No pending revaluation requests found.
                  </td>
                </tr>
              ) : (
                filteredRequests.map((r, i) => (
                  <tr key={r._id}>
                    <td>{i + 1}</td>
                    <td>
                      <div className="student-info">
                        <span className="name">{r.studentId?.name}</span>
                        <span className="id">{r.studentId?.admissionNo}</span>
                      </div>
                    </td>
                    <td>
                      <div className="student-info">
                        <span className="name">{r.subjectId?.subjectName}</span>
                        <span className="id">Total: {r.subjectId?.total_mark}</span>
                      </div>
                    </td>
                    {/* <td>
                      <span className="old-marks">{r.answerSheetId?.marks}</span>
                    </td> */}
                    <td>
                      <button className="btn-open" onClick={() => openPdf(r.answerSheetId)}>
                        👁️ View PDF
                      </button>
                    </td>
                    <td>
                      <input
                        type="number"
                        className="marks-input"
                        placeholder="0"
                        value={marksMap[r._id] ?? ""}
                        onChange={(e) => setMarksMap({ ...marksMap, [r._id]: e.target.value })}
                      />
                    </td>
                    <td>
                      <input
                        className="remarks-input"
                        placeholder="Add remarks..."
                        value={remarksMap[r._id] ?? ""}
                        onChange={(e) => setRemarksMap({ ...remarksMap, [r._id]: e.target.value })}
                      />
                    </td>
                    <td>
                      <button
                        className="btn-submit"
                        onClick={() => submitEvaluation(r._id, r.subjectId?.total_mark)}
                      >
                        Submit
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
