// import React, { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import api from "../../../api";

// function EditStudent() {
//   const { id } = useParams(); // student ID
//   const navigate = useNavigate();

//   const collegeId = localStorage.getItem("collegeId");

//   const [form, setForm] = useState({
//     collegeId,
//     name: "",
//     admissionNo: "",
//     email: "",
//     phone: "",
//     semester: "",
//     department: "",
//     subjects: [],
//   });

//   const [errors, setErrors] = useState({});
//   const [subjectsList, setSubjectsList] = useState([]);

//   // Searchable subject dropdown
//   const [searchText, setSearchText] = useState("");
//   const [showSuggestions, setShowSuggestions] = useState(false);

//   // -----------------------------------------
//   // LOAD SUBJECTS + STUDENT DETAILS
//   // -----------------------------------------
//   useEffect(() => {
//     const loadInitialData = async () => {
//       try {
//         const [subjectsRes, studentRes] = await Promise.all([
//           api.get("/subjects/all"),
//           api.get(`/student/${id}`),
//         ]);

//         setSubjectsList(subjectsRes.data );
//         console.log("student res", studentRes);
        
        
        

//         const s = studentRes.data;

//         setForm({
//           collegeId,
//           name: s.name,
//           admissionNo: s.admissionNo,
//           email: s.email,
//           phone: s.phone,
//           semester: s.semester,
//           department: s.department,
//           subjects: s.subjects?.map((sub) => sub._id) || [],
//         });
//       } catch (err) {
//         console.log(err);
//       }
//     };

//     loadInitialData();
//   }, [id]);

//   // -----------------------------------------
//   // VALIDATION
//   // -----------------------------------------
//   const validate = () => {
//     const err = {};

//     if (!form.name.trim()) err.name = "Name is required";
//     if (!form.admissionNo.trim()) err.admissionNo = "Admission No required";

//     if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
//       err.email = "Enter valid email";

//     if (!/^\d{10}$/.test(form.phone))
//       err.phone = "Enter valid 10-digit number";

//     if (!form.semester) err.semester = "Select semester";
//     if (!form.department.trim()) err.department = "Enter department";

//     setErrors(err);
//     return Object.keys(err).length === 0;
//   };

//   // -----------------------------------------
//   // SUBMIT UPDATE
//   // -----------------------------------------
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validate()) return alert("Fix validation errors!");

//     try {
//       await api.put(`/student/update/${id}`, form);

//       alert("Student Updated Successfully!");
//       navigate("/college/students");
//     } catch (err) {
//       console.log(err);
//       alert("Error updating student");
//     }
//   };
// console.log(subjectsList);
// console.log(form.subjects);

//   return (
//     <div className="bgg">
//       <div className="college-form-wrapper">
//         <h2>Edit Student</h2>

//         <form onSubmit={handleSubmit}>

//           {/* Name */}
//           <input
//             value={form.name}
//             placeholder="Student Name"
//             onChange={(e) => setForm({ ...form, name: e.target.value })}
//           />
//           <p className="error text-danger">{errors.name}</p>

//           {/* Admission No */}
//           <input
//             value={form.admissionNo}
//             placeholder="Admission Number"
//             onChange={(e) => setForm({ ...form, admissionNo: e.target.value })}
//           />
//           <p className="error text-danger">{errors.admissionNo}</p>

//           {/* Email (cannot update) */}
//           <input value={form.email} disabled />
//           <p className="error text-danger">{errors.email}</p>

//           {/* Phone */}
//           <input
//             value={form.phone}
//             placeholder="Phone Number"
//             onChange={(e) => setForm({ ...form, phone: e.target.value })}
//           />
//           <p className="error text-danger">{errors.phone}</p>

//           {/* NEW PASSWORD (optional) */}
//           {/* <input
//             placeholder="New Password (optional)"
//             type="password"
//             value={form.password}
//             onChange={(e) => setForm({ ...form, password: e.target.value })}
//           />
//           <small className="text-muted">
//             Leave empty to keep old password
//           </small>
//           <br /> */}

//           {/* Semester */}
//           <select
//             value={form.semester}
//             onChange={(e) => setForm({ ...form, semester: e.target.value })}
//           >
//             <option value="">Select Semester</option>
//             <option value="1">Sem 1</option>
//             <option value="2">Sem 2</option>
//             <option value="3">Sem 3</option>
//             <option value="4">Sem 4</option>
//             <option value="5">Sem 5</option>
//             <option value="6">Sem 6</option>
//           </select>
//           <p className="error text-danger">{errors.semester}</p>

//           {/* Department */}
//           <input
//             placeholder="Department"
//             value={form.department}
//             onChange={(e) =>
//               setForm({ ...form, department: e.target.value })
//             }
//           />
//           <p className="error text-danger">{errors.department}</p>

//           {/* SUBJECT SEARCH MULTI-SELECT */}
//           <div className="subject-search-box">

//             {/* Search Input */}
//             <input
//               type="text"
//               className="subject-search-input"
//               placeholder="Search subjects..."
//               value={searchText}
//               onChange={(e) => {
//                 setSearchText(e.target.value.toLowerCase());
//                 setShowSuggestions(true);
//               }}
//               onFocus={() => setShowSuggestions(true)}
//             />

//             {/* Selected Subjects */}
//             <div className="selected-area">
//               {form.subjects.length === 0 && (
//                 <span className="placeholder">No subjects selected</span>
//               )}

//               {form.subjects.map((id) => {
//                 const sub = subjectsList.find((s) => s._id === id);
//                 return (
//                   <span className="chip" key={id}>
//                     {sub?.subjectName} ({sub?.subjectCode})
//                     <span
//                       className="remove-chip"
//                       onClick={() =>
//                         setForm({
//                           ...form,
//                           subjects: form.subjects.filter((x) => x !== id),
//                         })
//                       }
//                     >
//                       ×
//                     </span>
//                   </span>
//                 );
//               })}
//             </div>

//             {/* Suggestions */}
//             {showSuggestions && searchText && (
//               <div className="dropdown">
//                 {subjectsList
//                   .filter(
//                     (s) =>
//                       s.subjectName.toLowerCase().includes(searchText) ||
//                       s.subjectCode.toLowerCase().includes(searchText)
//                   )
//                   .slice(0, 7)
//                   .map((s) => (
//                     <div
//                       key={s._id}
//                       className="dropdown-item"
//                       onClick={() => {
//                         if (!form.subjects.includes(s._id)) {
//                           setForm({
//                             ...form,
//                             subjects: [...form.subjects, s._id],
//                           });
//                         }
//                         setShowSuggestions(false);
//                         setSearchText("");
//                       }}
//                     >
//                       {s.subjectName} ({s.subjectCode})
//                     </div>
//                   ))}
//               </div>
//             )}
//           </div>

//           <button type="submit">Save Changes</button>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default EditStudent;

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../api";

function EditStudent() {
  const { id } = useParams();
  const navigate = useNavigate();

  const collegeId = localStorage.getItem("collegeId");

  const [form, setForm] = useState({
    collegeId,
    name: "",
    admissionNo: "",
    email: "",
    phone: "",
    semester: "",
    department: "", // ✅ auto from course
    subjects: [],
  });

  const [subjectsList, setSubjectsList] = useState([]);
  const [errors, setErrors] = useState({});

  // ✅ single course
  const [selectedCourse, setSelectedCourse] = useState("");

  // subject search
  const [searchText, setSearchText] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  // ================= COURSE LIST =================
  const COURSE_LIST = [
    "BA English","BA Malayalam","BA Economics","BA History","BA Political Science",
    "BSc Mathematics","BSc Physics","BSc Chemistry","BSc Computer Science",
    "BSc Statistics","BSc Psychology","BSc Biotechnology","BSc Zoology","BSc Botany",
    "BCom Finance","BCom Cooperation","BCom Computer Applications","BBA","BBM",
    "BCA","BSc IT","BTech Computer Science","BTech Information Technology",
    "BTech Electronics","BTech Mechanical","BTech Civil",
    "MA English","MA Economics","MA History","MSc Mathematics","MSc Physics",
    "MSc Chemistry","MSc Computer Science","MSc Psychology",
    "MCom Finance","MCom Marketing","MBA","MBA Finance","MBA HR","MBA Marketing",
    "MCA","MTech Computer Science","MTech Electronics",
    "BEd","MEd","LLB","LLM","Diploma in Computer Applications","Diploma in Electronics"
  ];

  // ================= LOAD SUBJECTS + STUDENT =================
  useEffect(() => {
    const loadData = async () => {
      try {
        const [subRes, stuRes] = await Promise.all([
          api.get("/subjects/all"),
          api.get(`/student/${id}`),
        ]);

        const s = stuRes.data;

        setSubjectsList(subRes.data);

        setForm({
          collegeId,
          name: s.name,
          admissionNo: s.admissionNo,
          email: s.email,
          phone: s.phone,
          semester: s.semester,
          department: s.department,
          subjects: s.subjects?.map((sub) => sub._id) || [],
        });

        // 🔥 IMPORTANT: restore selected course
        setSelectedCourse(s.department || "");
      } catch (err) {
        console.log(err);
      }
    };

    loadData();
  }, [id]);

  // ================= VALIDATION =================
  const validate = () => {
    const err = {};

    if (!form.name.trim()) err.name = "Name is required";
    if (!form.admissionNo.trim()) err.admissionNo = "Admission No required";

    if (!/^\d{10}$/.test(form.phone))
      err.phone = "Enter valid 10-digit phone number";

    if (!form.semester) err.semester = "Select semester";
    if (!selectedCourse) err.course = "Select course";

    if (form.subjects.length === 0)
      err.subjects = "Select at least one subject";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return alert("Fix validation errors");

    try {
      await api.put(`/student/update/${id}`, form);
      alert("Student Updated Successfully");
      navigate("/college/students");
    } catch (err) {
      console.log(err);
      alert("Error updating student");
    }
  };

  return (
    <div className="bgg">
      <div className="college-form-wrapper">
        <h2>Edit Student</h2>

        <form onSubmit={handleSubmit}>
          {/* NAME */}
          <input
            placeholder="Student Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <p className="text-danger">{errors.name}</p>

          {/* ADMISSION NO */}
          <input
            placeholder="Admission Number"
            value={form.admissionNo}
            onChange={(e) =>
              setForm({ ...form, admissionNo: e.target.value })
            }
          />
          <p className="text-danger">{errors.admissionNo}</p>

          {/* EMAIL */}
          <input value={form.email} disabled />

          {/* PHONE */}
          <input
            placeholder="Phone Number"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <p className="text-danger">{errors.phone}</p>

          {/* SEMESTER */}
          <select
            value={form.semester}
            onChange={(e) => {
              setForm({
                ...form,
                semester: e.target.value,
                subjects: [],
                department: "",
              });
              setSelectedCourse("");
            }}
          >
            <option value="">Select Semester</option>
            {[1,2,3,4,5,6,7,8].map((s) => (
              <option key={s} value={s}>Sem {s}</option>
            ))}
          </select>
          <p className="text-danger">{errors.semester}</p>

          {/* COURSE */}
          <select
            disabled={!form.semester}
            value={selectedCourse}
            onChange={(e) => {
              const course = e.target.value;
              if (!course) return;

              setSelectedCourse(course);

              const courseSubjectIds = subjectsList
                .filter(
                  (s) =>
                    s.course === course &&
                    s.semester === Number(form.semester)
                )
                .map((s) => s._id);

              setForm((prev) => ({
                ...prev,
                department: course,
                subjects: courseSubjectIds,
              }));
            }}
          >
            <option value="">Select Course</option>
            {COURSE_LIST.map((c, i) => (
              <option key={i} value={c}>{c}</option>
            ))}
          </select>
          <p className="text-danger">{errors.course}</p>

          {/* COURSE CHIP */}
          {selectedCourse && (
            <div className="selected-area">
              <span className="chip course-chip">
                {selectedCourse}
                <span
                  className="remove-chip"
                  onClick={() => {
                    setSelectedCourse("");
                    setForm((prev) => ({
                      ...prev,
                      department: "",
                      subjects: [],
                    }));
                  }}
                >
                  ×
                </span>
              </span>
            </div>
          )}

          {/* SUBJECT SEARCH */}
          <div className="subject-search-box">
            <input
              className="subject-search-input"
              placeholder="Search subjects..."
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value.toLowerCase());
                setShowSuggestions(true);
              }}
            />

            <div className="selected-area">
              {form.subjects.map((id) => {
                const sub = subjectsList.find((s) => s._id === id);
                return (
                  <span key={id} className="chip">
                    {sub?.subjectName} ({sub?.subjectCode})
                    <span
                      className="remove-chip"
                      onClick={() =>
                        setForm({
                          ...form,
                          subjects: form.subjects.filter((x) => x !== id),
                        })
                      }
                    >
                      ×
                    </span>
                  </span>
                );
              })}
            </div>

            {showSuggestions && searchText && (
              <div className="dropdown">
                {subjectsList
                  .filter(
                    (s) =>
                      s.semester === Number(form.semester) &&
                      (s.subjectName.toLowerCase().includes(searchText) ||
                        s.subjectCode.toLowerCase().includes(searchText))
                  )
                  .slice(0, 7)
                  .map((s) => (
                    <div
                      key={s._id}
                      className="dropdown-item"
                      onClick={() => {
                        if (!form.subjects.includes(s._id)) {
                          setForm({
                            ...form,
                            subjects: [...form.subjects, s._id],
                          });
                        }
                        setSearchText("");
                        setShowSuggestions(false);
                      }}
                    >
                      {s.subjectName} ({s.subjectCode})
                    </div>
                  ))}
              </div>
            )}
          </div>

          <p className="text-danger">{errors.subjects}</p>

          <button type="submit">Save Changes</button>
        </form>
      </div>
    </div>
  );
}

export default EditStudent;
