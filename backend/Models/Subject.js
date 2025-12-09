import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema(
  {
    subjectCode: { type: String, required: true, unique: true, uppercase: true },
    subjectName: { type: String, required: true },
    course: { type: String, required: true },
    semester: { type: Number, required: true, min: 1, max: 12 },
    total_mark:{type:Number, required:true}
  },
  { timestamps: true }
);

const Subject = mongoose.model("Subject", subjectSchema);
export default Subject;
