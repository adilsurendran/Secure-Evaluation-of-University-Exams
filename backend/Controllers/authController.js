import LOGIN from "../Models/Login.js";
import College from "../Models/College.js";
import Staff from "../Models/Staff.js";
import bcrypt from "bcryptjs";
import Student from "../Models/Student.js";

export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // 1️⃣ Check login exists
    const user = await LOGIN.findOne({ username });
    if (!user) {
      return res.status(400).json({ msg: "Invalid email or password" });
    }

    // 2️⃣ Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid email or password" });
    }

    // 3️⃣ Handle ADMIN login separately (Admin has NO profile table)
    if (user.role === "admin") {
      return res.json({
        msg: "Login successful",
        role: "admin",
        loginId: user._id,
        profileId: null, // no profile table for admin
        name: "Admin",
      });
    }

    // 4️⃣ Fetch Profile for College/Staff/Student
    let profile;

    if (user.role === "college") {
      profile = await College.findOne({ commonKey: user._id });
    }

    if (user.role === "staff") {
      profile = await Staff.findOne({ commonKey: user._id });
    }

    if (user.role === "student") {
      profile = await Student.findOne({ commonKey: user._id });
    }

    if (!profile) {
      return res.status(500).json({
        msg: "Profile not found for user role: " + user.role,
      });
    }

    // 5️⃣ Send response
    return res.json({
      msg: "Login successful",
      role: user.role,
      loginId: user._id,
      profileId: profile._id,
      name: profile.name,
    });

  } catch (err) {
    return res.status(500).json({
      msg: "Server error",
      error: err.message,
    });
  }
};
