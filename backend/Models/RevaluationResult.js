import mongoose from "mongoose";

const revaluationResultSchema = new mongoose.Schema(
  {
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ExamSession",
      required: true,
    },

    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    collegeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",
      required: true,
    },

    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },

    oldMarks: {
      type: Number,
      required: true,
    },

    newMarks: {
      type: Number,
      required: true,
    },

    totalMark: {
      type: Number,
      required: true,
    },

    published: {
      type: Boolean,
      default: false,
    },

    remarks: {
      type: String,
      default: "",
    }
  },
  { timestamps: true }
);

export default mongoose.model("RevaluationResult", revaluationResultSchema);
