// Routes/studentRoutes.js
import express from "express";
import {
  createStudent,
  getStudentsByCollege,
  getStudentById,
  updateStudent,
  deleteStudent,
  getStudentExamSchedule,
} from "../Controllers/studentController.js";

const studentRouter = express.Router();

studentRouter.post("/create", createStudent);
studentRouter.get("/college/:collegeId", getStudentsByCollege);
studentRouter.get("/:id", getStudentById);
studentRouter.put("/update/:id", updateStudent);
studentRouter.delete("/delete/:id", deleteStudent);

studentRouter.get("/exam-schedule/:studentId", getStudentExamSchedule);

export default studentRouter;
