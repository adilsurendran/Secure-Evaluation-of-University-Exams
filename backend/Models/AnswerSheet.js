import mongoose from "mongoose";

const answerSheetSchema = new mongoose.Schema(
  {
    examId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
    },

    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    fileUrl: { type: String }, // uploaded sheet
    uploadedAt: { type: Date, default: Date.now },

    // Evaluation
    marks: { type: Number, default: null },
    evaluatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff",
    },
    evaluatedAt: { type: Date },

    // Revaluation
    revaluationRequested: { type: Boolean, default: false },
    revaluationMarks: { type: Number },
    revaluatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff",
    },
    revaluatedAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model("AnswerSheet", answerSheetSchema);
