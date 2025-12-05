// Models/Student.js
import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    collegeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",
      required: true,
    },

    name: { type: String, required: true },
    admissionNo: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    semester: { type: Number, required: true },
    department: { type: String, required: true },

    // ✅ IMPORTANT — list of subjects the student is taking
    subjects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subject",
        required: true,
      },
    ],

    commonKey: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Login",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Student", studentSchema);
