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
// subjectRouter.use(roleMiddleware("admin"));


// Routes
subjectRouter.post("/add",roleMiddleware("admin"), addSubject);
subjectRouter.get("/all",roleMiddleware("admin", "college"), getAllSubjects);
subjectRouter.get("/:id",roleMiddleware("admin", "college"), getSubjectById);
subjectRouter.put("/update/:id",roleMiddleware("admin"), updateSubject);
subjectRouter.delete("/delete/:id",roleMiddleware("admin"), deleteSubject);

export default subjectRouter;
