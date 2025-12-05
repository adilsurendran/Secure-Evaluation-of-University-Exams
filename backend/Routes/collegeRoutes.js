import express from "express";
import {
  registerCollege,
  getAllColleges,
  getCollegeById,
  updateCollege,
  deleteCollege,
} from "../Controllers/collegeController.js";

const collegeRouter = express.Router();

collegeRouter.post("/register", registerCollege);
collegeRouter.get("/all", getAllColleges);
collegeRouter.get("/:id", getCollegeById);
collegeRouter.put("/update/:id", updateCollege);
collegeRouter.delete("/delete/:id", deleteCollege);

export default collegeRouter;
