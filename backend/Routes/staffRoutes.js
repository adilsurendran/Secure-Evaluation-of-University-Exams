// import express from "express";
// import {
//   createStaff,
//   getStaffByCollege,
//   updateStaff,
//   deleteStaff,
// } from "../Controllers/staffController.js";

// const staffRouter = express.Router();

// staffRouter.post("/create", createStaff);
// staffRouter.get("/college/:collegeId", getStaffByCollege);
// staffRouter.put("/update/:id", updateStaff);
// staffRouter.delete("/delete/:id", deleteStaff);

// export default staffRouter;


// Routes/staffRoutes.js
import express from "express";
import {
  createStaff,
  getStaffByCollege,
  getStaffById,
  updateStaff,
  deleteStaff,
  getAssignedSheets,
  evaluateSheet,
  updateAvailability,
  EvaluationHistory,
} from "../Controllers/staffController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

// const staffRouter = express.Router();

// staffRouter.post("/create", createStaff);
// staffRouter.get("/college/:collegeId", getStaffByCollege);
// staffRouter.get("/:id", getStaffById);       // <-- REQUIRED for EditStaff.jsx
// staffRouter.put("/update/:id", updateStaff);
// staffRouter.delete("/delete/:id", deleteStaff);
// staffRouter.put("/availability/:id", updateAvailability);
// staffRouter.get("/assigned/:staffId", getAssignedSheets);
// staffRouter.put("/evaluate/:sheetId", evaluateSheet);
// staffRouter.get("/evalhistory/:id",EvaluationHistory)

// export default staffRouter;



const staffRouter = express.Router();

// 🔐 PROTECT ALL STAFF ROUTES
staffRouter.use(authMiddleware);
staffRouter.use(roleMiddleware("staff"));

staffRouter.post("/create", createStaff);
staffRouter.get("/college/:collegeId", getStaffByCollege);
staffRouter.get("/:id", getStaffById);
staffRouter.put("/update/:id", updateStaff);
staffRouter.delete("/delete/:id", deleteStaff);

staffRouter.put("/availability/:id", updateAvailability);
staffRouter.get("/assigned/:staffId", getAssignedSheets);
staffRouter.put("/evaluate/:sheetId", evaluateSheet);
staffRouter.get("/evalhistory/:id", EvaluationHistory);

export default staffRouter;

