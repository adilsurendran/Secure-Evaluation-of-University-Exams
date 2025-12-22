// // import express from "express";
// // import {
// //   createStaff,
// //   getStaffByCollege,
// //   updateStaff,
// //   deleteStaff,
// // } from "../Controllers/staffController.js";

// // const staffRouter = express.Router();

// // staffRouter.post("/create", createStaff);
// // staffRouter.get("/college/:collegeId", getStaffByCollege);
// // staffRouter.put("/update/:id", updateStaff);
// // staffRouter.delete("/delete/:id", deleteStaff);

// // export default staffRouter;


// // Routes/staffRoutes.js
// import express from "express";
// import {
//   createStaff,
//   getStaffByCollege,
//   getStaffById,
//   updateStaff,
//   deleteStaff,
//   getAssignedSheets,
//   evaluateSheet,
//   updateAvailability,
//   EvaluationHistory,
// } from "../Controllers/staffController.js";
// import authMiddleware from "../middleware/authMiddleware.js";
// import roleMiddleware from "../middleware/roleMiddleware.js";

// // const staffRouter = express.Router();

// // staffRouter.post("/create", createStaff);
// // staffRouter.get("/college/:collegeId", getStaffByCollege);
// // staffRouter.get("/:id", getStaffById);       // <-- REQUIRED for EditStaff.jsx
// // staffRouter.put("/update/:id", updateStaff);
// // staffRouter.delete("/delete/:id", deleteStaff);
// // staffRouter.put("/availability/:id", updateAvailability);
// // staffRouter.get("/assigned/:staffId", getAssignedSheets);
// // staffRouter.put("/evaluate/:sheetId", evaluateSheet);
// // staffRouter.get("/evalhistory/:id",EvaluationHistory)

// // export default staffRouter;



// const staffRouter = express.Router();

// // 🔐 PROTECT ALL STAFF ROUTES
// staffRouter.use(authMiddleware);
// staffRouter.use(roleMiddleware("staff"));

// // college 
// staffRouter.post("/create", createStaff);
// staffRouter.get("/college/:collegeId", getStaffByCollege);
// staffRouter.get("/:id", getStaffById);
// staffRouter.put("/update/:id", updateStaff);
// staffRouter.delete("/delete/:id", deleteStaff);
// staffRouter.put("/availability/:id", updateAvailability);

// // staff 
// staffRouter.get("/assigned/:staffId", getAssignedSheets);
// staffRouter.put("/evaluate/:sheetId", evaluateSheet);
// staffRouter.get("/evalhistory/:id", EvaluationHistory);

// export default staffRouter;


import express from "express";
import {
  createStaff,
  getStaffByCollege,
  getStaffById,
  updateStaff,
  deleteStaff,
  updateAvailability,
  getAssignedSheets,
  evaluateSheet,
  EvaluationHistory
} from "../Controllers/staffController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const staffRouter = express.Router();

/* =====================================================
   🔐 GLOBAL AUTH (ALL ROUTES)
===================================================== */
staffRouter.use(authMiddleware);

/* =====================================================
   🏫 COLLEGE ROUTES (MANAGE STAFF)
   Role: college
===================================================== */

// Create staff
staffRouter.post(
  "/create",
  roleMiddleware("college"),
  createStaff
);

// Get staff by college
staffRouter.get(
  "/college/:collegeId",
  roleMiddleware("college"),
  getStaffByCollege
);

// Get staff by id
staffRouter.get(
  "/:id",
  roleMiddleware("college"),
  getStaffById
);

// Update staff
staffRouter.put(
  "/update/:id",
  roleMiddleware("college"),
  updateStaff
);

// Delete staff
staffRouter.delete(
  "/delete/:id",
  roleMiddleware("college"),
  deleteStaff
);

// Update staff availability
staffRouter.put(
  "/availability/:id",
  roleMiddleware("college"),
  updateAvailability
);

/* =====================================================
   👨‍🏫 STAFF ROUTES (STAFF ACTIONS ONLY)
   Role: staff
===================================================== */

// Assigned answer sheets
staffRouter.get(
  "/assigned/:staffId",
  roleMiddleware("staff"),
  getAssignedSheets
);

// Evaluate sheet
staffRouter.put(
  "/evaluate/:sheetId",
  roleMiddleware("staff"),
  evaluateSheet
);

// Evaluation history
staffRouter.get(
  "/evalhistory/:id",
  roleMiddleware("staff"),
  EvaluationHistory
);

export default staffRouter;
