// routes/universityRoutes.js
import express from "express";
import { allocateAnswerSheets, getResultStats, getSessionAllocationStats, publishResults } from "../Controllers/universityController.js";

const universityRouter = express.Router();

universityRouter.get("/allocation-stats", getSessionAllocationStats);
universityRouter.post("/allocate/:sessionId", allocateAnswerSheets);

universityRouter.get("/result-stats/:sessionId", getResultStats);
universityRouter.post("/publish/:sessionId", publishResults);

export default universityRouter;
