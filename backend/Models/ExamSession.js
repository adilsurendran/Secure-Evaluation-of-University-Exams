import mongoose from "mongoose";

const examSessionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },          // e.g. "Nov-Dec 2024 Regular"
    academicYear: { type: String, required: true },  // e.g. "2024-2025"
    semester: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },

    // Subjects included in this exam session
    subjects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subject",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("ExamSession", examSessionSchema);
