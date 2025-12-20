// import express from "express";
// import {
//   registerCollege,
//   getAllColleges,
//   getCollegeById,
//   updateCollege,
//   deleteCollege,
//   uploadAnswerSheet,
//   getSheetsByCollege,
//   deleteSheet,
//   getSignedPdfUrl,
//   getCollegeResults,
//   getCollegeRevaluationResults,
//   getDashboardDetails,
// } from "../Controllers/collegeController.js";
// import upload from "../middleware/upload.js";
// import { getStudentsByCollege } from "../Controllers/studentController.js";
// import { getAllExamSessions } from "../Controllers/examSessionController.js";
// import authMiddleware from "../middleware/authMiddleware.js";
// import roleMiddleware from "../middleware/roleMiddleware.js";

// // const collegeRouter = express.Router();

// // collegeRouter.post("/register", registerCollege);
// // collegeRouter.get("/all", getAllColleges);
// // collegeRouter.get("/:id", getCollegeById);
// // collegeRouter.put("/update/:id", updateCollege);
// // collegeRouter.delete("/delete/:id", deleteCollege);


// // collegeRouter.post("/upload", upload.single("pdf"), uploadAnswerSheet);

// // collegeRouter.get("/college/:collegeId", getSheetsByCollege);

// // collegeRouter.delete("/:id", deleteSheet);

// // collegeRouter.get("/exam-sessions/all", getAllExamSessions);

// // // Students
// // collegeRouter.get("/student/college/:collegeId", getStudentsByCollege);

// // // Answer Sheets
// // collegeRouter.get("/answers/college/:collegeId", getSheetsByCollege);

// // //getSignedPdfUrl
// // collegeRouter.get("/answers/signed-url/:encrypted", getSignedPdfUrl);

// // collegeRouter.delete("/answers/:id", deleteSheet);

// // collegeRouter.get("/results/:collegeId", getCollegeResults);
// // collegeRouter.get("/revaluation-results/:collegeId",getCollegeRevaluationResults)
// // collegeRouter.get("/details/:id", getDashboardDetails)
// // export default collegeRouter;

// const collegeRouter = express.Router();

// // 🔐 PROTECT ALL COLLEGE ROUTES
// collegeRouter.use(authMiddleware);
// collegeRouter.use(roleMiddleware("college"));

// collegeRouter.post("/register", registerCollege);
// collegeRouter.get("/all", getAllColleges);
// collegeRouter.get("/:id", getCollegeById);
// collegeRouter.put("/update/:id", updateCollege);
// collegeRouter.delete("/delete/:id", deleteCollege);

// collegeRouter.post("/upload", upload.single("pdf"), uploadAnswerSheet);
// collegeRouter.get("/answers/college/:collegeId", getSheetsByCollege);
// collegeRouter.get("/answers/signed-url/:encrypted", getSignedPdfUrl);
// collegeRouter.delete("/answers/:id", deleteSheet);

// collegeRouter.get("/results/:collegeId", getCollegeResults);
// collegeRouter.get("/revaluation-results/:collegeId", getCollegeRevaluationResults);
// collegeRouter.get("/details/:id", getDashboardDetails);

// export default collegeRouter;


import express from "express";

// -------------------- CONTROLLERS --------------------
import {
  registerCollege,
  getAllColleges,
  getCollegeById,
  updateCollege,
  deleteCollege,
  uploadAnswerSheet,
  getSheetsByCollege,
  deleteSheet,
  getSignedPdfUrl,
  getCollegeResults,
  getCollegeRevaluationResults,
  getDashboardDetails,
} from "../Controllers/collegeController.js";

import { getStudentsByCollege } from "../Controllers/studentController.js";
import { getAllExamSessions } from "../Controllers/examSessionController.js";

// -------------------- MIDDLEWARES --------------------
import upload from "../middleware/upload.js";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const collegeRouter = express.Router();

// ====================================================
// 🔐 AUTHENTICATION (ALL ROUTES REQUIRE LOGIN)
// ====================================================
collegeRouter.use(authMiddleware);

// ====================================================
// 👑 ADMIN ONLY ROUTES (COLLEGE MANAGEMENT)
// ====================================================
collegeRouter.post(
  "/register",
  roleMiddleware("admin"),
  registerCollege
);

collegeRouter.get(
  "/all",
  roleMiddleware("admin"),
  getAllColleges
);

collegeRouter.get(
  "/:id",
  roleMiddleware("admin"),
  getCollegeById
);

collegeRouter.put(
  "/update/:id",
  roleMiddleware("admin"),
  updateCollege
);

collegeRouter.delete(
  "/delete/:id",
  roleMiddleware("admin"),
  deleteCollege
);

// ====================================================
// 🏫 COLLEGE ONLY ROUTES (COLLEGE DASHBOARD & ACTIONS)
// ====================================================
collegeRouter.post(
  "/upload",
  roleMiddleware("college"),
  upload.single("pdf"),
  uploadAnswerSheet
);

collegeRouter.get(
  "/answers/college/:collegeId",
  roleMiddleware("college"),
  getSheetsByCollege
);

collegeRouter.get(
  "/answers/signed-url/:encrypted",
  roleMiddleware("college"),
  getSignedPdfUrl
);

collegeRouter.delete(
  "/answers/:id",
  roleMiddleware("college"),
  deleteSheet
);

collegeRouter.get(
  "/results/:collegeId",
  roleMiddleware("college"),
  getCollegeResults
);

collegeRouter.get(
  "/revaluation-results/:collegeId",
  roleMiddleware("college"),
  getCollegeRevaluationResults
);

collegeRouter.get(
  "/details/:id",
  roleMiddleware("college"),
  getDashboardDetails
);

export default collegeRouter;
