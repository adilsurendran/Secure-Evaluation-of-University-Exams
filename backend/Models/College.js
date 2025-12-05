import mongoose from "mongoose";

const collegeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    contact: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },

    // Assigned subjects (only by University Admin)
    subjects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subject",
      },
    ],
    commonKey :{type:mongoose.Schema.Types.ObjectId,ref:"Login"}
  },
  
  { timestamps: true }
);

export default mongoose.model("College", collegeSchema);
