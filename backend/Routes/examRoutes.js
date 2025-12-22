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
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const examrouter = express.Router();

examrouter.use(authMiddleware);
// examrouter.use(roleMiddleware("admin"));

// CREATE EXAM
examrouter.post("/create",roleMiddleware("admin"), createExam);

// GET ALL EXAMS
examrouter.get("/all",roleMiddleware("admin", "college"), getAllExams);

// GET EXAMS BY SESSION
examrouter.get("/session/:sessionId",roleMiddleware("admin", "college","student"), getExamsBySession);

// DELETE EXAM
examrouter.delete("/delete/:id",roleMiddleware("admin"), deleteExam);

export default examrouter;
