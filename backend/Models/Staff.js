import mongoose from "mongoose";

const staffSchema = new mongoose.Schema(
  {
    collegeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",
      required: true
    },

    name: { type: String, required: true },
    qualification: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true, unique: true },

    subjects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subject",
      },
    ],

    password: { type: String, required: true },
    commonKey :{type:mongoose.Schema.Types.ObjectId,ref:"Login"}
  },
  { timestamps: true }
);

export default mongoose.model("Staff", staffSchema);
