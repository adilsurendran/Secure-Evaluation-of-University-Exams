import express from "express";
import {
  addSubject,
  getAllSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject,
} from "../Controllers/subjectController.js";

const subjectRouter = express.Router();

// Routes
subjectRouter.post("/add", addSubject);
subjectRouter.get("/all", getAllSubjects);
subjectRouter.get("/:id", getSubjectById);
subjectRouter.put("/update/:id", updateSubject);
subjectRouter.delete("/delete/:id", deleteSubject);

export default subjectRouter;
