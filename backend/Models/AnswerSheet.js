// import mongoose from "mongoose";

// const answerSheetSchema = new mongoose.Schema(
//   {
//     sessionId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "ExamSession",
//       required: true,
//     },

//     examId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Exam",
//       required: true,
//     },

//     studentId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Student",
//       required: true,
//     },

//     subjectId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Subject",
//       required: true,
//     },

//     collegeId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "College",
//       required: true,
//     },

//     fileUrl: { type: String, required: true },

//     status: {
//       type: String,
//       enum: ["uploaded", "evaluated"],
//       default: "uploaded",
//     },

//     marks: { type: Number, default: null },
//   },
//   { timestamps: true }
// );

// export default mongoose.model("AnswerSheet", answerSheetSchema);

import mongoose from "mongoose";

const answerSheetSchema = new mongoose.Schema(
  {
    sessionId: { type: mongoose.Schema.Types.ObjectId, ref: "ExamSession", required: true },
    examId: { type: mongoose.Schema.Types.ObjectId, ref: "Exam", required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
    collegeId: { type: mongoose.Schema.Types.ObjectId, ref: "College", required: true },
    assignedStaff: { type: mongoose.Schema.Types.ObjectId, ref: "Staff", default: null},

    filePublicId: { type: String, required: true },  // encrypted public_id
    status: { type: String, enum: ["uploaded", "assigned", "evaluated"], default: "uploaded" },
    marks: { type: Number, default: null }
  },
  { timestamps: true }
);

export default mongoose.model("AnswerSheet", answerSheetSchema);
