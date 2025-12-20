import express from "express";
import {
  addSubject,
  getAllSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject,
} from "../Controllers/subjectController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const subjectRouter = express.Router();

subjectRouter.use(authMiddleware);
subjectRouter.use(roleMiddleware("admin"));


// Routes
subjectRouter.post("/add", addSubject);
subjectRouter.get("/all", getAllSubjects);
subjectRouter.get("/:id", getSubjectById);
subjectRouter.put("/update/:id", updateSubject);
subjectRouter.delete("/delete/:id", deleteSubject);

export default subjectRouter;
