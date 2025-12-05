import express from "express";
import {
  createExamSession,
  getAllExamSessions,
  deleteExamSession,
} from "../Controllers/examSessionController.js";

const ESessionrouter = express.Router();

ESessionrouter.post("/create", createExamSession);
ESessionrouter.get("/all", getAllExamSessions);
ESessionrouter.delete("/delete/:id", deleteExamSession);

export default ESessionrouter;
