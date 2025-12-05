import mongoose from "mongoose";

const examSchema = new mongoose.Schema(
  {
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ExamSession",
      required: true,
    },

    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },

    examDate: { type: Date, required: true },
    examTime: { type: String, required: true }, // "10:00 AM - 1:00 PM"

    // Which colleges can access this exam?
    allowedColleges: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "College",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Exam", examSchema);
