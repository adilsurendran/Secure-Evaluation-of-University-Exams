import mongoose from "mongoose";

const resultSchema = new mongoose.Schema(
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

    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },

    marks: { type: Number, required: true },

    totalMark: { type: Number, required: true }, // from subject.total_mark

    published: { type: Boolean, default: false }, // to allow future re-publish
  },
  { timestamps: true }
);

export default mongoose.model("Result", resultSchema);
