import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import RegisterCollege from './components/university/RegisterCollege';
import RegisterStaff from './components/staff/RegisterStaff';
import RegisterStudent from './components/student/RegisterStudent';
import AdminHome from './components/university/AdminHome';
import Dashboard from './components/university/Dashboard';
import ManageColleges from './components/university/ManageColleges';
import Exams from './components/university/Exams';
import PublishResults from './components/university/PublishResults';
import Auditing from './components/university/Auditing';
import Revaluation from './components/university/Revaluation';
import SubjectList from './components/university/Subjects/SubjectList';
import AddSubject from './components/university/Subjects/AddSubject';
import EditSubject from './components/university/Subjects/EditSubject';
import EditCollege from './components/university/EditCollege';
import ManageExamSessions from './components/university/Subjects/ManageExamSessions';
import CreateExamSession from './components/university/CreateExamSession';
import ScheduleExam from './components/university/ScheduleExam';
import ManageExams from './components/university/ManageExams';
import CollegeLayout from './components/college/CollegeLayout';
import CollegeDashboard from './components/college/CollegeDashboard';
import ManageStaff from './components/college/ManageStaff';
import AddStaff from './components/college/AddStaff';
import EditStaff from './components/college/EditStaff';
import ManageStudents from './components/college/ManageStudents';
import AddStudent from './components/college/AddStudent';
import EditStudent from './components/college/EditStudent';
import StaffHome from './components/staff/StaffHome';
import StudentProfile from './components/student/StudentProfile';
import StudentExamSchedule from './components/student/StudentExamSchedule';
import StudentResults from './components/student/StudentResults';
import StudentRevaluation from './components/student/StudentRevaluation';
import StudentAnswerCopyRequest from './components/student/StudentAnswerCopyRequest';
import StudentDashboard from './components/student/StudentDashboard';
import UploadAnswerSheet from './components/college/UploadAnswerSheet';


function App() {

  return (
    <>
    <Routes>
      <Route path='/' element={<Login/>}></Route>
      {/* <Route path="/register-college" element={<RegisterCollege />} /> */}
        <Route path="/register-staff" element={<RegisterStaff />} />
        <Route path="/register-student" element={<RegisterStudent />} />

        <Route path="/admin" element={<AdminHome />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="manage-colleges" element={<ManageColleges />} />
          <Route path="exams" element={<ManageExamSessions />} />
          <Route path="exams/add-session" element={<CreateExamSession />} />
          <Route path="publish-results" element={<PublishResults />} />
          <Route path="auditing" element={<Auditing />} />
          <Route path="revaluation" element={<Revaluation />} />
          <Route path="register-college" element={<RegisterCollege />} />
          <Route path="subjects" element={<SubjectList />} />
          <Route path="subjects/add" element={<AddSubject />} />
          <Route path="subjects/edit/:id" element={<EditSubject />} />
          <Route path="/admin/college/edit/:id" element={<EditCollege />} />
          <Route path="/admin/exams/schedule" element={<ScheduleExam />} />
          <Route path="/admin/exams/manage" element={<ManageExams />} />
        </Route>

        {/* college home page path should be /college/dashboard */}
        <Route path="/college" element={<CollegeLayout />}>
          <Route path="dashboard" element={<CollegeDashboard />} />
          <Route path="students" element={<ManageStudents/>} />
          <Route path="students/add" element={<AddStudent/>} />
          <Route path="students/edit/:id" element={<EditStudent/>} />
          <Route path="staff" element={<ManageStaff/>} />
          <Route path="staff/add" element={<AddStaff/>} />
          <Route path="staff/edit/:id" element={<EditStaff/>} />
          <Route path="upload-answer" element={<UploadAnswerSheet/>} />
          <Route path="results" element={<div>View Results</div>} />
          <Route path="revaluation" element={<div>Revaluation Requests</div>} />
        </Route>

        
<Route path="/staff/home" element={<StaffHome />} />
{/* <Route path="/staff/evaluate" element={<EvaluateAnswerSheets />} /> */}
{/* <Route path="/staff/history" element={<EvaluationHistory />} /> */}

{/* NEW: Revaluation */}
{/* <Route path="/staff/revaluation" element={<RevaluationList />} /> */}
{/* <Route path="/staff/revaluation/:id" element={<RevaluationEvaluate />} /> */}


{/* STUDENT MODULE ROUTES */}
<Route path="/student/home" element={<StudentDashboard/>} />
<Route path="/student/profile" element={<StudentProfile />} />
<Route path="/student/exam-schedule" element={<StudentExamSchedule />} />
<Route path="/student/results" element={<StudentResults />} />
<Route path="/student/revaluation" element={<StudentRevaluation />} />
<Route path="/student/answer-copy" element={<StudentAnswerCopyRequest />} />



    </Routes>
    </>
  )
}

export default App
