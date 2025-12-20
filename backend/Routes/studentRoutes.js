// Routes/studentRoutes.js
import express from "express";
import {
  createStudent,
  getStudentsByCollege,
  getStudentById,
  updateStudent,
  deleteStudent,
  getStudentExamSchedule,
  getStudentResults,
  getStudentMarksheet,
  getStudentResultSessions,
  postComplaint,
  getComplaint,
} from "../Controllers/studentController.js";
import { getStudentEvaluatedSheetsForExam, studentAnswerCopyOptions, studentCreateAnswerCopyRequest, studentGetCopyPdf, studentGetMyCopyRequests } from "../Controllers/answerCopyController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

// const studentRouter = express.Router();

// studentRouter.post("/create", createStudent);
// studentRouter.get("/college/:collegeId", getStudentsByCollege);
// studentRouter.get("/:id", getStudentById);
// studentRouter.put("/update/:id", updateStudent);
// studentRouter.delete("/delete/:id", deleteStudent);
// studentRouter.get(
//   "/results/sessions/:studentId",
//   getStudentResultSessions
// );

// studentRouter.get(
//   "/results/marksheet/:studentId/:sessionId",
//   getStudentMarksheet
// );

// studentRouter.get("/exam-schedule/:studentId", getStudentExamSchedule);

// studentRouter.get("/results/:studentId/:sessionId", getStudentResults);

// /* ==== ANSWER COPY REQUESTS (STUDENT) ==== */

// // list options (sessions+exams where answer sheet exists)
// studentRouter.get(
//   "/answer-copy/options/:studentId",
//   studentAnswerCopyOptions
// );

// // create request
// studentRouter.post(
//   "/answer-copy/request",
//   studentCreateAnswerCopyRequest
// );

// // my requests
// studentRouter.get(
//   "/answer-copy/my-requests/:studentId",
//   studentGetMyCopyRequests
// );

// // get signed URL for approved request
// studentRouter.get(
//   "/answer-copy/pdf/:requestId",
//   studentGetCopyPdf
// );

// studentRouter.get("/evaluated-sheets/:studentId/:examId", getStudentEvaluatedSheetsForExam);

// studentRouter.post("/complaints", postComplaint)
// studentRouter.get("/complaints/:id", getComplaint)
// export default studentRouter;



const studentRouter = express.Router();

// 🔐 PROTECT ALL STUDENT ROUTES
studentRouter.use(authMiddleware);
studentRouter.use(roleMiddleware("student"));

studentRouter.post("/create", createStudent);
studentRouter.get("/college/:collegeId", getStudentsByCollege);
studentRouter.get("/:id", getStudentById);
studentRouter.put("/update/:id", updateStudent);
studentRouter.delete("/delete/:id", deleteStudent);

studentRouter.get("/results/sessions/:studentId", getStudentResultSessions);
studentRouter.get("/results/marksheet/:studentId/:sessionId", getStudentMarksheet);
studentRouter.get("/exam-schedule/:studentId", getStudentExamSchedule);
studentRouter.get("/results/:studentId/:sessionId", getStudentResults);

// Answer copy
studentRouter.get("/answer-copy/options/:studentId", studentAnswerCopyOptions);
studentRouter.post("/answer-copy/request", studentCreateAnswerCopyRequest);
studentRouter.get("/answer-copy/my-requests/:studentId", studentGetMyCopyRequests);
studentRouter.get("/answer-copy/pdf/:requestId", studentGetCopyPdf);

studentRouter.get("/evaluated-sheets/:studentId/:examId", getStudentEvaluatedSheetsForExam);

// Complaints
studentRouter.post("/complaints", postComplaint);
studentRouter.get("/complaints/:id", getComplaint);

export default studentRouter;
