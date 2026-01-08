// import mongoose, { Schema } from "mongoose";

// const NotificationSchema = new Schema({
//     semester:{type: [Number], required:true},
//     message:{type:String,required:true}
// }, {timestamps:true})

// const NOTIFICATION = mongoose.model("Notification",NotificationSchema)
// export default NOTIFICATION

import mongoose, { Schema } from "mongoose";

const NotificationSchema = new Schema(
  {
    semester: { type: [Number] },

    message: { type: String, required: true },

    // ✅ NEW
    target: {
      type: String,
      enum: ["college", "student", "staff", "both"],
      required: true,
    },
  },
  { timestamps: true }
);

const NOTIFICATION = mongoose.model("Notification", NotificationSchema);
export default NOTIFICATION;
