// // routes/universityRoutes.js
// import express from "express";
// import { allnotifications, allocateAnswerSheets, deleteNotification, fetchCounts, getComplaints, getPendingSheets, getResultStats, getSessionAllocationStats, postNotifiaction, publishResults, replayComplaints, studentNotifications } from "../Controllers/universityController.js";
// import { adminApproveAnswerCopyRequest, adminListAnswerCopyRequests, adminRejectAnswerCopyRequest } from "../Controllers/answerCopyController.js";
// import authMiddleware from "../middleware/authMiddleware.js";
// import roleMiddleware from "../middleware/roleMiddleware.js";

// // const universityRouter = express.Router();

// // universityRouter.get("/allocation-stats", getSessionAllocationStats);
// // universityRouter.post("/allocate/:sessionId", allocateAnswerSheets);

// // universityRouter.get("/result-stats/:sessionId", getResultStats);
// // universityRouter.post("/publish/:sessionId", publishResults); 

// // universityRouter.get("/pending-sheets/:sessionId", getPendingSheets);

// // /* ==== ANSWER COPY REQUESTS (UNIVERSITY) ==== */

// // // list requests (optional ?status=pending|approved|rejected)
// // universityRouter.get(
// //   "/answer-copy/requests",
// //   adminListAnswerCopyRequests
// // );

// // // approve
// // universityRouter.put(
// //   "/answer-copy/:requestId/approve",
// //   adminApproveAnswerCopyRequest
// // );

// // // reject
// // universityRouter.put(
// //   "/answer-copy/:requestId/reject",
// //   adminRejectAnswerCopyRequest
// // );

// // universityRouter.post('/sendntification',postNotifiaction)
// // universityRouter.get('/getnotification',allnotifications)
// // universityRouter.delete("/delete/:id",deleteNotification)
// // universityRouter.get("/getnotifications/:id",studentNotifications)

// // universityRouter.get("/complaints", getComplaints)
// // universityRouter.put("/complaints/:complaintId/reply", replayComplaints)

// // universityRouter.get("/dashboard-counts",fetchCounts)
// // export default universityRouter;



// const universityRouter = express.Router();

// // 🔐 PROTECT ALL ADMIN ROUTES
// universityRouter.use(authMiddleware);
// universityRouter.use(roleMiddleware("admin"));

// universityRouter.get("/allocation-stats", getSessionAllocationStats);
// universityRouter.post("/allocate/:sessionId", allocateAnswerSheets);
// universityRouter.get("/result-stats/:sessionId", getResultStats);
// universityRouter.post("/publish/:sessionId", publishResults);
// universityRouter.get("/pending-sheets/:sessionId", getPendingSheets);

// // Answer copy admin
// universityRouter.get("/answer-copy/requests", adminListAnswerCopyRequests);
// universityRouter.put("/answer-copy/:requestId/approve", adminApproveAnswerCopyRequest);
// universityRouter.put("/answer-copy/:requestId/reject", adminRejectAnswerCopyRequest);

// // Notifications
// universityRouter.post("/sendntification", postNotifiaction);
// universityRouter.get("/getnotification", allnotifications);
// universityRouter.delete("/delete/:id", deleteNotification);
// universityRouter.get("/getnotifications/:id", studentNotifications);

// // Complaints
// universityRouter.get("/complaints", getComplaints);
// universityRouter.put("/complaints/:complaintId/reply", replayComplaints);

// // Dashboard
// universityRouter.get("/dashboard-counts", fetchCounts);

// export default universityRouter;


import express from "express";

// -------------------- CONTROLLERS --------------------
import {
  allnotifications,
  allocateAnswerSheets,
  answerCopyHistory,
  deleteNotification,
  fetchCounts,
  getComplaints,
  getPendingSheets,
  getResultStats,
  getSessionAllocationStats,
  postNotifiaction,
  publishResults,
  replayComplaints,
  revaluationHistory,
  staffNotifications,
  studentNotifications,
  valuationHistory
} from "../Controllers/universityController.js";

import {
  adminApproveAnswerCopyRequest,
  adminListAnswerCopyRequests,
  adminRejectAnswerCopyRequest
} from "../Controllers/answerCopyController.js";

// -------------------- MIDDLEWARES --------------------
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const universityRouter = express.Router();

/* =====================================================
   🔐 AUTHENTICATION (ALL ROUTES REQUIRE LOGIN)
===================================================== */
universityRouter.use(authMiddleware);

/* =====================================================
   👑 ADMIN ONLY ROUTES
===================================================== */

// Allocation statistics
universityRouter.get(
  "/allocation-stats",
  roleMiddleware("admin"),
  getSessionAllocationStats
);

// Allocate answer sheets
universityRouter.post(
  "/allocate/:sessionId",
  roleMiddleware("admin"),
  allocateAnswerSheets
);

// Result statistics
universityRouter.get(
  "/result-stats/:sessionId",
  roleMiddleware("admin"),
  getResultStats
);

// Publish results
universityRouter.post(
  "/publish/:sessionId",
  roleMiddleware("admin"),
  publishResults
);

// Pending answer sheets
universityRouter.get(
  "/pending-sheets/:sessionId",
  roleMiddleware("admin"),
  getPendingSheets
);

/* =====================================================
   📄 ANSWER COPY REQUESTS (ADMIN)
===================================================== */

// List requests
universityRouter.get(
  "/answer-copy/requests",
  roleMiddleware("admin"),
  adminListAnswerCopyRequests
);

// Approve request
universityRouter.put(
  "/answer-copy/:requestId/approve",
  roleMiddleware("admin"),
  adminApproveAnswerCopyRequest
);

// Reject request
universityRouter.put(
  "/answer-copy/:requestId/reject",
  roleMiddleware("admin"),
  adminRejectAnswerCopyRequest
);

/* =====================================================
   🔔 NOTIFICATIONS
===================================================== */

// Send notification (ADMIN)
universityRouter.post(
  "/sendntification",
  roleMiddleware("admin"),
  postNotifiaction
);

// Get all notifications (ADMIN + COLLEGE)
universityRouter.get(
  "/getnotification",
  roleMiddleware("admin", "college"),
  allnotifications
);

// Delete notification (ADMIN)
universityRouter.delete(
  "/delete/:id",
  roleMiddleware("admin"),
  deleteNotification
);

// Student-specific notifications (ADMIN + COLLEGE)
universityRouter.get(
  "/getnotifications/:id",
  roleMiddleware("admin", "college", "student"),
  studentNotifications
);

// Staff notifications
universityRouter.get(
  "/staff-notifications",
  roleMiddleware("admin", "college", "staff"),
  staffNotifications
);

/* =====================================================
   📝 COMPLAINTS
===================================================== */

// Get complaints (ADMIN)
universityRouter.get(
  "/complaints",
  roleMiddleware("admin"),
  getComplaints
);

// Reply to complaint (ADMIN)
universityRouter.put(
  "/complaints/:complaintId/reply",
  roleMiddleware("admin"),
  replayComplaints
);

/* =====================================================
   📊 DASHBOARD
===================================================== */

// Dashboard counts (ADMIN)
universityRouter.get(
  "/dashboard-counts",
  roleMiddleware("admin"),
  fetchCounts
);

/* =====================================================
   📝 history
===================================================== */

universityRouter.get("/history/valuation", roleMiddleware("admin"), valuationHistory);
universityRouter.get("/history/revaluation", roleMiddleware("admin"), revaluationHistory);
universityRouter.get("/history/answer-copy", roleMiddleware("admin"), answerCopyHistory);

export default universityRouter;
