// import express from "express";
// import {
//   createRequest,
//   getStudentRequests,
//   markRequestPaid,
//   getAllRequests,
//   getRequestById,
//   adminRejectRequest,
//   adminApproveAndAssign,
//   getAssignedRevalsForStaff,
//   staffCompleteEvaluation,
// } from "../Controllers/revaluationController.js";

// const router = express.Router();

// // Student
// router.post("/student/create", createRequest);
// router.get("/student/:studentId", getStudentRequests);
// router.post("/student/paid/:requestId", markRequestPaid);

// // Admin
// router.get("/admin/all", getAllRequests);
// router.get("/admin/:id", getRequestById);
// router.post("/admin/approve/:requestId", adminApproveAndAssign); // body: { staffId? }
// router.post("/admin/reject/:requestId", adminRejectRequest);

// // Staff
// router.get("/staff/assigned/:staffId", getAssignedRevalsForStaff);
// router.put("/staff/complete/:staffId/:requestId", staffCompleteEvaluation);

// export default router;


import express from "express";
import {
  createRevaluationRequest,
  getStudentRequests,
  adminListRequests,
  // adminApproveRequest,
  adminRejectRequest,
  // adminAssignToStaff,
  staffAssignedRequests,
  staffEvaluateRevaluation,
  getEligibleStaffForRevaluation,
  studentMarkPaid,
  getEvaluatedRevaluation,
  publishRevaluationResults,
  autoAssignRevaluations
} from "../Controllers/revaluationController.js";

const router = express.Router();

// STUDENT
router.post("/student/create", createRevaluationRequest);
router.get("/student/requests/:studentId", getStudentRequests);
router.put("/student/mark-paid/:requestId", studentMarkPaid);


// ADMIN
router.get("/admin/all", adminListRequests); // ?status=pending|approved|assigned|completed|rejected
// router.put("/admin/approve/:id", adminApproveRequest);
router.put("/admin/reject/:id", adminRejectRequest);
// router.put("/admin/assign/:id", adminAssignToStaff);
router.post(
  "/admin/auto-assign/:sessionId",
  autoAssignRevaluations
);

router.get("/admin/evaluated/:sessionId", getEvaluatedRevaluation);
router.post("/admin/publish/:sessionId", publishRevaluationResults);


// STAFF
router.get("/staff/assigned/:staffId", staffAssignedRequests);
router.put("/staff/evaluate/:id", staffEvaluateRevaluation);
router.get("/admin/eligible-staff/:requestId", getEligibleStaffForRevaluation);

export default router;
