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
import StudentAnswerCopyRequest from './components/student/StudentAnswerCopyRequest';
import StudentDashboard from './components/student/StudentDashboard';
import UploadAnswerSheet from './components/college/UploadAnswerSheet';
import ViewUploadedSheets from './components/college/ViewUploadedSheets';
import UniversityAllocateDashboard from './components/university/UniversityAllocateDashboard';
import StaffAssigned from './components/staff/StaffAssigned';
import CollegeResultsDashboard from './components/college/CollegeResultsDashboard';
import AdminAnswerCopyRequests from './components/university/AdminAnswerCopyRequests';
import StudentRevaluationRequest from './components/student/StudentRevaluationRequest';
import StudentRevaluationStatus from './components/student/StudentRevalStatus';
import AdminRevaluationList from './components/university/AdminRevalList';
import StaffRevaluationEvaluate from './components/staff/StaffRevaluationAssigned';
import StudentRevaluationResults from './components/student/StudentRevaluationResults';
import AdminPublishRevaluation from './components/university/AdminPublishRevaluation';
import StaffHistory from './components/staff/StaffHistory';
import CollegeViewRevaluationResult from './components/college/CollegeViewRevaluationResult';
import Notification from './components/university/Notification';
import ViewNotification from './components/college/ViewNotification';
import ViewNotifications from './components/student/ViewNotification';
import StudentComplaints from './components/student/StudentComplaints';
import UniversityComplaints from './components/university/UniversityComplaints';


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
          <Route path='notification' element={<Notification/>}></Route>
          <Route path='complaints' element={<UniversityComplaints/>}></Route>
          <Route path="exams" element={<ManageExamSessions />} />
          <Route path="exams/add-session" element={<CreateExamSession />} />
          <Route path="publish-results" element={<PublishResults />} />
          <Route path="revaluation" element={<AdminRevaluationList />} />
          <Route path="revaluation/result" element={<AdminPublishRevaluation />} />
          <Route path="register-college" element={<RegisterCollege />} />
          <Route path="subjects" element={<SubjectList />} />
          <Route path="answersheetRequest" element={<AdminAnswerCopyRequests />} />
          <Route path="subjects/add" element={<AddSubject />} />
          <Route path="subjects/edit/:id" element={<EditSubject />} />
          <Route path="/admin/college/edit/:id" element={<EditCollege />} />
          <Route path="/admin/exams/schedule" element={<ScheduleExam />} />
          <Route path="/admin/exams/manage" element={<ManageExams />} />
          <Route path="/admin/assign/staff" element={<UniversityAllocateDashboard/>} />
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
          <Route path="manage-answer" element={<ViewUploadedSheets/>} />
          <Route path="results" element={<CollegeResultsDashboard/>} />
          <Route path="revaluation" element={<CollegeViewRevaluationResult/>} />
          <Route path="notification" element={<ViewNotification/>} />
        </Route>

        
<Route path="/staff/home" element={<StaffHome />} />
<Route path="/staff/evaluate" element={<StaffAssigned />} />
<Route path="/staff/history" element={<StaffHistory />} />

{/* NEW: Revaluation */}
<Route path="/staff/revaluation" element={<StaffRevaluationEvaluate />} />
{/* <Route path="/staff/revaluation/:id" element={<RevaluationEvaluate />} /> */}


{/* STUDENT MODULE ROUTES */}
<Route path="/student/home" element={<StudentDashboard/>} />
<Route path="/student/profile" element={<StudentProfile />} />
<Route path="/student/exam-schedule" element={<StudentExamSchedule />} />
<Route path="/student/results" element={<StudentResults/>} />
<Route path="/student/results/revaluation" element={<StudentRevaluationResults/>} />
<Route path="/student/revaluation" element={<StudentRevaluationRequest />} />
<Route path="/student/revaluation-view" element={<StudentRevaluationStatus />} />
<Route path="/student/answer-copy" element={<StudentAnswerCopyRequest />} />
<Route path="/student/notification" element={<ViewNotifications />} />
<Route path="/student/complaint" element={<StudentComplaints />} />



    </Routes>
    </>
  )
}

export default App