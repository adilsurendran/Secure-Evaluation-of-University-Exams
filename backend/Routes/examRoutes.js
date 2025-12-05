// import express from "express";
// import {
//   createExam,
//   getExamsBySession,
//   deleteExam
// } from "../Controllers/examController.js";

// const examrouter = express.Router();

// examrouter.post("/create", createExam);
// examrouter.get("/session/:sessionId", getExamsBySession);
// examrouter.delete("/delete/:id", deleteExam);

// export default examrouter;

import express from "express";
import {
  createExam,
  getAllExams,
  getExamsBySession,
  deleteExam,
} from "../Controllers/examController.js";

const examrouter = express.Router();

// CREATE EXAM
examrouter.post("/create", createExam);

// GET ALL EXAMS
examrouter.get("/all", getAllExams);

// GET EXAMS BY SESSION
examrouter.get("/session/:sessionId", getExamsBySession);

// DELETE EXAM
examrouter.delete("/delete/:id", deleteExam);

export default examrouter;
