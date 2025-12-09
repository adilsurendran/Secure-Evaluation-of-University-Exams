import express from "express";
import {
  registerCollege,
  getAllColleges,
  getCollegeById,
  updateCollege,
  deleteCollege,
  uploadAnswerSheet,
  getSheetsByCollege,
  deleteSheet,
  getSignedPdfUrl,
} from "../Controllers/collegeController.js";
import upload from "../middleware/upload.js";
import { getStudentsByCollege } from "../Controllers/studentController.js";
import { getAllExamSessions } from "../Controllers/examSessionController.js";

const collegeRouter = express.Router();

collegeRouter.post("/register", registerCollege);
collegeRouter.get("/all", getAllColleges);
collegeRouter.get("/:id", getCollegeById);
collegeRouter.put("/update/:id", updateCollege);
collegeRouter.delete("/delete/:id", deleteCollege);


collegeRouter.post("/upload", upload.single("pdf"), uploadAnswerSheet);

collegeRouter.get("/college/:collegeId", getSheetsByCollege);

collegeRouter.delete("/:id", deleteSheet);

collegeRouter.get("/exam-sessions/all", getAllExamSessions);

// Students
collegeRouter.get("/student/college/:collegeId", getStudentsByCollege);

// Answer Sheets
collegeRouter.get("/answers/college/:collegeId", getSheetsByCollege);

//getSignedPdfUrl
collegeRouter.get("/answers/signed-url/:encrypted", getSignedPdfUrl);

collegeRouter.delete("/answers/:id", deleteSheet);
export default collegeRouter;
