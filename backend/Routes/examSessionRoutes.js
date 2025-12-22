import express from "express";
import {
  createExamSession,
  getAllExamSessions,
  deleteExamSession,
} from "../Controllers/examSessionController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const ESessionrouter = express.Router();

ESessionrouter.use(authMiddleware);
// ESessionrouter.use(roleMiddleware("admin"));


ESessionrouter.post("/create",roleMiddleware("admin"), createExamSession);
ESessionrouter.get("/all",roleMiddleware("admin", "college","student"), getAllExamSessions);
ESessionrouter.delete("/delete/:id",roleMiddleware("admin"), deleteExamSession);

export default ESessionrouter;
