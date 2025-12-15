import mongoose from "mongoose";

const revaluationSchema = new mongoose.Schema(
  {
    answerSheetId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AnswerSheet",
      required: true,
    },

    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },

    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ExamSession",
      required: true,
    },

    // student provided
    feeAmount: { type: Number, default: 0 },
    paymentStatus: { type: String, enum: ["pending", "paid"], default: "pending" },

    // admin/staff fields
    status: {
      type: String,
      enum: ["pending", "approved", "assigned", "rejected", "completed"],
      default: "pending",
    },

    adminNote: { type: String, default: "" },   // rejection reason or admin message
    assignedStaff: { type: mongoose.Schema.Types.ObjectId, ref: "Staff", default: null },

    // result of re-evaluation
    oldMarks: { type: Number, default: null },
    newMarks: { type: Number, default: null },
    staffRemarks: { type: String, default: "" },

    // audit
    handledByAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "Login", default: null },
  },
  { timestamps: true }
);

export default mongoose.model("RevaluationRequest", revaluationSchema);
