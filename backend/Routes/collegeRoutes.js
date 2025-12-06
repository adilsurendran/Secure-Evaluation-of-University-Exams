import express from "express";
import {
  registerCollege,
  getAllColleges,
  getCollegeById,
  updateCollege,
  deleteCollege,
  uploadAnswerSheet,
  getSheetsByCollege,
  deleteSheet,
} from "../Controllers/collegeController.js";
import upload from "../middleware/upload.js";

const collegeRouter = express.Router();

collegeRouter.post("/register", registerCollege);
collegeRouter.get("/all", getAllColleges);
collegeRouter.get("/:id", getCollegeById);
collegeRouter.put("/update/:id", updateCollege);
collegeRouter.delete("/delete/:id", deleteCollege);


collegeRouter.post("/upload", upload.single("pdf"), uploadAnswerSheet);

collegeRouter.get("/college/:collegeId", getSheetsByCollege);

collegeRouter.delete("/:id", deleteSheet);

export default collegeRouter;
