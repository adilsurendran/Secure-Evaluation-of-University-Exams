// // import express from "express";
// // import {
// //   createRequest,
// //   getStudentRequests,
// //   markRequestPaid,
// //   getAllRequests,
// //   getRequestById,
// //   adminRejectRequest,
// //   adminApproveAndAssign,
// //   getAssignedRevalsForStaff,
// //   staffCompleteEvaluation,
// // } from "../Controllers/revaluationController.js";

// // const router = express.Router();

// // // Student
// // router.post("/student/create", createRequest);
// // router.get("/student/:studentId", getStudentRequests);
// // router.post("/student/paid/:requestId", markRequestPaid);

// // // Admin
// // router.get("/admin/all", getAllRequests);
// // router.get("/admin/:id", getRequestById);
// // router.post("/admin/approve/:requestId", adminApproveAndAssign); // body: { staffId? }
// // router.post("/admin/reject/:requestId", adminRejectRequest);

// // // Staff
// // router.get("/staff/assigned/:staffId", getAssignedRevalsForStaff);
// // router.put("/staff/complete/:staffId/:requestId", staffCompleteEvaluation);

// // export default router;


// import express from "express";
// import {
//   createRevaluationRequest,
//   getStudentRequests,
//   adminListRequests,
//   // adminApproveRequest,
//   adminRejectRequest,
//   // adminAssignToStaff,
//   staffAssignedRequests,
//   staffEvaluateRevaluation,
//   getEligibleStaffForRevaluation,
//   studentMarkPaid,
//   getEvaluatedRevaluation,
//   publishRevaluationResults,
//   autoAssignRevaluations
// } from "../Controllers/revaluationController.js";

// const router = express.Router();

// // STUDENT
// router.post("/student/create", createRevaluationRequest);
// router.get("/student/requests/:studentId", getStudentRequests);
// router.put("/student/mark-paid/:requestId", studentMarkPaid);


// // ADMIN
// router.get("/admin/all", adminListRequests); // ?status=pending|approved|assigned|completed|rejected
// // router.put("/admin/approve/:id", adminApproveRequest);
// router.put("/admin/reject/:id", adminRejectRequest);
// // router.put("/admin/assign/:id", adminAssignToStaff);
// router.post(
//   "/admin/auto-assign/:sessionId",
//   autoAssignRevaluations
// );

// router.get("/admin/evaluated/:sessionId", getEvaluatedRevaluation);
// router.post("/admin/publish/:sessionId", publishRevaluationResults);


// // STAFF
// router.get("/staff/assigned/:staffId", staffAssignedRequests);
// router.put("/staff/evaluate/:id", staffEvaluateRevaluation);
// router.get("/admin/eligible-staff/:requestId", getEligibleStaffForRevaluation);

// export default router;


import express from "express";
import {
  createRevaluationRequest,
  getStudentRequests,
  studentMarkPaid,

  adminListRequests,
  adminRejectRequest,
  autoAssignRevaluations,
  getEvaluatedRevaluation,
  publishRevaluationResults,
  getEligibleStaffForRevaluation,

  staffAssignedRequests,
  staffEvaluateRevaluation,
  checkRevaluationAllowed
} from "../Controllers/revaluationController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";



const router = express.Router();

/* =====================================================
   🔐 GLOBAL AUTHENTICATION (ALL ROUTES PROTECTED)
===================================================== */
router.use(authMiddleware);

/* =====================================================
   🎓 STUDENT ROUTES
   Role: student
===================================================== */

// Create revaluation request
router.post(
  "/student/create",
  roleMiddleware("student"),
  createRevaluationRequest
);

// View my revaluation requests
router.get(
  "/student/requests/:studentId",
  roleMiddleware("student"),
  getStudentRequests
);

// Mark payment done
router.put(
  "/student/mark-paid/:requestId",
  roleMiddleware("student"),
  studentMarkPaid
);

router.get("/check/:studentId/:sessionId/:answerSheetId",checkRevaluationAllowed)

/* =====================================================
   🏛️ ADMIN (UNIVERSITY) ROUTES
   Role: admin
===================================================== */

// List all revaluation requests
router.get(
  "/admin/all",
  roleMiddleware("admin"),
  adminListRequests
);

// Reject a request
router.put(
  "/admin/reject/:id",
  roleMiddleware("admin"),
  adminRejectRequest
);

// Auto-assign revaluations to staff
router.post(
  "/admin/auto-assign/:sessionId",
  roleMiddleware("admin"),
  autoAssignRevaluations
);

// Get evaluated revaluations for a session
router.get(
  "/admin/evaluated/:sessionId",
  roleMiddleware("admin"),
  getEvaluatedRevaluation
);

// Publish revaluation results
router.post(
  "/admin/publish/:sessionId",
  roleMiddleware("admin"),
  publishRevaluationResults
);

// Get eligible staff for a request
router.get(
  "/admin/eligible-staff/:requestId",
  roleMiddleware("admin"),
  getEligibleStaffForRevaluation
);

/* =====================================================
   👨‍🏫 STAFF ROUTES
   Role: staff
===================================================== */

// Get assigned revaluation requests
router.get(
  "/staff/assigned/:staffId",
  roleMiddleware("staff"),
  staffAssignedRequests
);

// Submit revaluation evaluation
router.put(
  "/staff/evaluate/:id",
  roleMiddleware("staff"),
  staffEvaluateRevaluation
);

export default router;
