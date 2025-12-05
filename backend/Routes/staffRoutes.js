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
} from "../Controllers/staffController.js";

const staffRouter = express.Router();

staffRouter.post("/create", createStaff);
staffRouter.get("/college/:collegeId", getStaffByCollege);
staffRouter.get("/:id", getStaffById);       // <-- REQUIRED for EditStaff.jsx
staffRouter.put("/update/:id", updateStaff);
staffRouter.delete("/delete/:id", deleteStaff);

export default staffRouter;
