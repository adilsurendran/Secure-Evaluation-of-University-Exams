// routes/universityRoutes.js
import express from "express";
import { allnotifications, allocateAnswerSheets, deleteNotification, fetchCounts, getComplaints, getPendingSheets, getResultStats, getSessionAllocationStats, postNotifiaction, publishResults, replayComplaints, studentNotifications } from "../Controllers/universityController.js";
import { adminApproveAnswerCopyRequest, adminListAnswerCopyRequests, adminRejectAnswerCopyRequest } from "../Controllers/answerCopyController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

// const universityRouter = express.Router();

// universityRouter.get("/allocation-stats", getSessionAllocationStats);
// universityRouter.post("/allocate/:sessionId", allocateAnswerSheets);

// universityRouter.get("/result-stats/:sessionId", getResultStats);
// universityRouter.post("/publish/:sessionId", publishResults); 

// universityRouter.get("/pending-sheets/:sessionId", getPendingSheets);

// /* ==== ANSWER COPY REQUESTS (UNIVERSITY) ==== */

// // list requests (optional ?status=pending|approved|rejected)
// universityRouter.get(
//   "/answer-copy/requests",
//   adminListAnswerCopyRequests
// );

// // approve
// universityRouter.put(
//   "/answer-copy/:requestId/approve",
//   adminApproveAnswerCopyRequest
// );

// // reject
// universityRouter.put(
//   "/answer-copy/:requestId/reject",
//   adminRejectAnswerCopyRequest
// );

// universityRouter.post('/sendntification',postNotifiaction)
// universityRouter.get('/getnotification',allnotifications)
// universityRouter.delete("/delete/:id",deleteNotification)
// universityRouter.get("/getnotifications/:id",studentNotifications)

// universityRouter.get("/complaints", getComplaints)
// universityRouter.put("/complaints/:complaintId/reply", replayComplaints)

// universityRouter.get("/dashboard-counts",fetchCounts)
// export default universityRouter;



const universityRouter = express.Router();

// 🔐 PROTECT ALL ADMIN ROUTES
universityRouter.use(authMiddleware);
universityRouter.use(roleMiddleware("admin"));

universityRouter.get("/allocation-stats", getSessionAllocationStats);
universityRouter.post("/allocate/:sessionId", allocateAnswerSheets);
universityRouter.get("/result-stats/:sessionId", getResultStats);
universityRouter.post("/publish/:sessionId", publishResults);
universityRouter.get("/pending-sheets/:sessionId", getPendingSheets);

// Answer copy admin
universityRouter.get("/answer-copy/requests", adminListAnswerCopyRequests);
universityRouter.put("/answer-copy/:requestId/approve", adminApproveAnswerCopyRequest);
universityRouter.put("/answer-copy/:requestId/reject", adminRejectAnswerCopyRequest);

// Notifications
universityRouter.post("/sendntification", postNotifiaction);
universityRouter.get("/getnotification", allnotifications);
universityRouter.delete("/delete/:id", deleteNotification);
universityRouter.get("/getnotifications/:id", studentNotifications);

// Complaints
universityRouter.get("/complaints", getComplaints);
universityRouter.put("/complaints/:complaintId/reply", replayComplaints);

// Dashboard
universityRouter.get("/dashboard-counts", fetchCounts);

export default universityRouter;
