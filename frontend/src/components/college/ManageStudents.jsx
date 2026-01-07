// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../../../api";

// function ManageStudents() {
//   const navigate = useNavigate();

//   const collegeId = localStorage.getItem("collegeId");
//   const [students, setStudents] = useState([]);

//   // Load all students under this college
//   useEffect(() => {
//     const fetchStudents = async () => {
//       try {
//         const res = await api.get(`/student/college/${collegeId}`);
//         setStudents(res.data);
//       } catch (err) {
//         console.log(err);
//       }
//     };

//     fetchStudents();
//   }, []);

//   // Delete student
//   const deleteStudent = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this student?")) return;

//     try {
//       await api.delete(`/student/delete/${id}`);
//       setStudents(students.filter((s) => s._id !== id));
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   return (
//     <div className="college-page">
//       {/* Header */}
//       <div className="college-header">
//         <h2>Manage Students</h2>

//         <button
//           className="add-college-btn"
//           onClick={() => navigate("/college/students/add")}
//         >
//           + Add Student
//         </button>
//       </div>

//       {/* Table */}
//       <div className="college-table-container">
//         <table className="college-table">
//           <thead>
//             <tr>
//               <th>#</th>
//               <th>Name</th>
//               <th>Admission No</th>
//               <th>Email</th>
//               <th>Phone</th>
//               <th>Semester</th>
//               <th>Department</th>
//               <th>Actions</th>
//             </tr>
//           </thead>

//           <tbody>
//             {students.map((stu, index) => (
//               <tr key={stu._id}>
//                 <td>{index + 1}</td>
//                 <td>{stu.name}</td>
//                 <td>{stu.admissionNo}</td>
//                 <td>{stu.email}</td>
//                 <td>{stu.phone}</td>
//                 <td>{stu.semester}</td>
//                 <td>{stu.department}</td>

//                 <td>
//                   <button
//                     onClick={() =>
//                       navigate(`/college/students/edit/${stu._id}`)
//                     }
//                     className="delete-btn"
//                   >
//                     Edit
//                   </button>

//                   <button
//                     className="delete-btn"
//                     onClick={() => deleteStudent(stu._id)}
//                   >
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         {students.length === 0 && (
//           <p className="text-center mt-3">No students found</p>
//         )}
//       </div>
//     </div>
//   );
// }

// export default ManageStudents;

import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api";

function ManageStudents() {
  const navigate = useNavigate();
  const collegeId = localStorage.getItem("collegeId");

  const [students, setStudents] = useState([]);

  // 🔍 search + filters
  const [search, setSearch] = useState("");
  const [semesterFilter, setSemesterFilter] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");

  // ================= LOAD STUDENTS =================
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await api.get(`/student/college/${collegeId}`);
        setStudents(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchStudents();
  }, [collegeId]);

  // ================= DELETE =================
  const deleteStudent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;

    try {
      await api.delete(`/student/delete/${id}`);
      setStudents((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  // ================= DERIVED FILTERED DATA =================
  const filteredStudents = useMemo(() => {
    return students.filter((stu) => {
      const searchMatch =
        stu.name.toLowerCase().includes(search) ||
        stu.admissionNo.toLowerCase().includes(search);

      const semesterMatch =
        !semesterFilter || String(stu.semester) === semesterFilter;

      const departmentMatch =
        !departmentFilter || stu.department === departmentFilter;

      return searchMatch && semesterMatch && departmentMatch;
    });
  }, [students, search, semesterFilter, departmentFilter]);

  // Unique departments for filter dropdown
  const departments = useMemo(() => {
    return [...new Set(students.map((s) => s.department).filter(Boolean))];
  }, [students]);

  return (
    <div className="college-page">
      {/* ================= HEADER ================= */}
      <div className="college-header">
        <h2>Manage Students</h2>

        <button
          className="add-college-btn"
          onClick={() => navigate("/college/students/add")}
        >
          + Add Student
        </button>
      </div>

      {/* ================= FILTER BAR ================= */}
      <div className="college-filter-bar">
        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search by name or admission number..."
          value={search}
          onChange={(e) => setSearch(e.target.value.toLowerCase())}
        />

        {/* SEMESTER FILTER */}
        <select
          value={semesterFilter}
          onChange={(e) => setSemesterFilter(e.target.value)}
        >
          <option value="">All Semesters</option>
          {[1,2,3,4,5,6,7,8].map((s) => (
            <option key={s} value={s}>Sem {s}</option>
          ))}
        </select>

        {/* DEPARTMENT FILTER */}
        <select
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
        >
          <option value="">All Courses</option>
          {departments.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>

        {/* CLEAR */}
        <button
          className="clear-btn"
          onClick={() => {
            setSearch("");
            setSemesterFilter("");
            setDepartmentFilter("");
          }}
        >
          Clear
        </button>
      </div>

      {/* ================= TABLE ================= */}
      <div className="college-table-container">
        <table className="college-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Admission No</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Semester</th>
              <th>Course</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredStudents.map((stu, index) => (
              <tr key={stu._id}>
                <td>{index + 1}</td>
                <td>{stu.name}</td>
                <td>{stu.admissionNo}</td>
                <td>{stu.email}</td>
                <td>{stu.phone}</td>
                <td>Sem {stu.semester}</td>
                <td>{stu.department}</td>

                <td>
                  <button
                    onClick={() =>
                      navigate(`/college/students/edit/${stu._id}`)
                    }
                    className="edit-btn"
                  >
                    Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => deleteStudent(stu._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredStudents.length === 0 && (
          <p className="text-center mt-3">No matching students found</p>
        )}
      </div>
    </div>
  );
}

export default ManageStudents;
