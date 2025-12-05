import mongoose from "mongoose";

const loginSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      required: true,
      enum: ["admin", "staff", "student", "college"]
    }
  },
  { timestamps: true }
);

const LOGIN = mongoose.model("Login", loginSchema);
export default LOGIN;
