// routes/universityRoutes.js
import express from "express";
import { allocateAnswerSheets, getPendingSheets, getResultStats, getSessionAllocationStats, publishResults } from "../Controllers/universityController.js";
import { adminApproveAnswerCopyRequest, adminListAnswerCopyRequests, adminRejectAnswerCopyRequest } from "../Controllers/answerCopyController.js";

const universityRouter = express.Router();

universityRouter.get("/allocation-stats", getSessionAllocationStats);
universityRouter.post("/allocate/:sessionId", allocateAnswerSheets);

universityRouter.get("/result-stats/:sessionId", getResultStats);
universityRouter.post("/publish/:sessionId", publishResults); 

universityRouter.get("/pending-sheets/:sessionId", getPendingSheets);

/* ==== ANSWER COPY REQUESTS (UNIVERSITY) ==== */

// list requests (optional ?status=pending|approved|rejected)
universityRouter.get(
  "/answer-copy/requests",
  adminListAnswerCopyRequests
);

// approve
universityRouter.put(
  "/answer-copy/:requestId/approve",
  adminApproveAnswerCopyRequest
);

// reject
universityRouter.put(
  "/answer-copy/:requestId/reject",
  adminRejectAnswerCopyRequest
);


export default universityRouter;
