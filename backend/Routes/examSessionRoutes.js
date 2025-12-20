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
ESessionrouter.use(roleMiddleware("admin"));


ESessionrouter.post("/create", createExamSession);
ESessionrouter.get("/all", getAllExamSessions);
ESessionrouter.delete("/delete/:id", deleteExamSession);

export default ESessionrouter;
