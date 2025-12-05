
// // ==========================
// // REGISTER COLLEGE

// import College from "../Models/College.js";
// import bcrypt from "bcrypt";
// import LOGIN from "../Models/Login.js";

// export const registerCollege = async (req, res) => {
//   try {
//     const { name, address, contact, email, subjects } = req.body;

//     // Check email uniqueness for college
//     const exists = await College.findOne({ email });
//     if (exists) {
//       return res.status(400).json({ msg: "College already registered" });
//     }

//     // Generate default password (example: college email prefix)
//     const rawPassword = email.split("@")[0] + "123"; // e.g. abc123

//     // Hash password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(rawPassword, salt);

//     // Create login credentials
//     const loginUser = await LOGIN.create({
//       username: email,
//       password: hashedPassword,
//       role: "college",
//     });

//     // Create college record
//     const college = await College.create({
//       name,
//       address,
//       contact,
//       email,
//       subjects,
//     });

//     return res.status(201).json({
//       msg: "College registered successfully",
//       college,
//       loginCredentials: {
//         username: loginUser.username,
//         defaultPassword: rawPassword, // send plain password to admin only
//       },
//     });

//   } catch (err) {
//     return res.status(500).json({
//       msg: "Server error",
//       error: err.message,
//     });
//   }
// };


// // ==========================
// // GET ALL COLLEGES
// // ==========================
// export const getAllColleges = async (req, res) => {
//   try {
//     const colleges = await College.find()
//       .populate("subjects", "subjectName subjectCode")
//       .sort({ createdAt: -1 });

//     return res.json(colleges);
//   } catch (err) {
//     return res.status(500).json({ msg: "Server error", error: err.message });
//   }
// };

// // ==========================
// // DELETE COLLEGE
// // ==========================
// // export const deleteCollege = async (req, res) => {
// //   try {
// //     const college = await College.findByIdAndDelete(req.params.id);

// //     if (!college) {
// //       return res.status(404).json({ msg: "College not found" });
// //     }

// //     return res.json({ msg: "College deleted successfully" });
// //   } catch (err) {
// //     return res.status(500).json({ msg: "Server error", error: err.message });
// //   }
// // };


// export const deleteCollege = async (req, res) => {
//   try {
//     // Find the college
//     const college = await College.findById(req.params.id);

//     if (!college) {
//       return res.status(404).json({ msg: "College not found" });
//     }

//     // Delete corresponding LOGIN entry using email
//     await LOGIN.findOneAndDelete({ username: college.email });

//     // Delete college record
//     await College.findByIdAndDelete(req.params.id);

//     return res.json({ msg: "College deleted successfully (Login removed too)" });
//   } catch (err) {
//     return res.status(500).json({
//       msg: "Server error",
//       error: err.message,
//     });
//   }
// };


// // ==========================
// // GET COLLEGE BY ID
// // ==========================
// export const getCollegeById = async (req, res) => {
//   try {
//     const college = await College.findById(req.params.id).populate(
//       "subjects",
//       "subjectName subjectCode"
//     );

//     if (!college) {
//       return res.status(404).json({ msg: "College not found" });
//     }

//     return res.json(college);
//   } catch (err) {
//     return res.status(500).json({ msg: "Server error", error: err.message });
//   }
// };

// // ==========================
// // UPDATE COLLEGE
// // ==========================
// export const updateCollege = async (req, res) => {
//   try {
//     const updated = await College.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true }
//     ).populate("subjects", "subjectName subjectCode");

//     if (!updated) return res.status(404).json({ msg: "College not found" });

//     return res.json({ msg: "College updated", college: updated });
//   } catch (err) {
//     return res.status(500).json({ msg: "Server error", error: err.message });
//   }
// };


// ==========================
// COLLEGE CONTROLLER (FINAL)
// ==========================

import College from "../Models/College.js";
import LOGIN from "../Models/Login.js";
import bcrypt from "bcryptjs";

// ==========================
// REGISTER COLLEGE
// ==========================
export const registerCollege = async (req, res) => {
  try {
    const { name, address, contact, email, password, subjects } = req.body;

    // Check email uniqueness
    const exists = await LOGIN.findOne({ username:email });
    if (exists) {
      return res.status(400).json({ msg: "College already registered" });
    }

    // Validate password
    if (!password || password.trim().length < 6) {
      return res
        .status(400)
        .json({ msg: "Password must be at least 6 characters long" });
    }

    // Hash password using bcryptjs
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create login entry
    const loginUser = await LOGIN.create({
      username: email,
      password: hashedPassword,
      role: "college",
    });

    // Create college
    const college = await College.create({
      name,
      address,
      contact,
      email,
      subjects,
      commonKey:loginUser._id
    });

    return res.status(201).json({
      msg: "College registered successfully",
      college,
      loginUser,
    });
  } catch (err) {
    return res.status(500).json({
      msg: "Server error",
      error: err.message,
    });
  }
};

// ==========================
// GET ALL COLLEGES
// ==========================
export const getAllColleges = async (req, res) => {
  try {
    const colleges = await College.find()
      .populate("subjects", "subjectName subjectCode")
      .sort({ createdAt: -1 });

    return res.json(colleges);
  } catch (err) {
    return res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// ==========================
// GET COLLEGE BY ID
// ==========================
export const getCollegeById = async (req, res) => {
  try {
    const college = await College.findById(req.params.id).populate(
      "subjects",
      "subjectName subjectCode"
    );

    if (!college) {
      return res.status(404).json({ msg: "College not found" });
    }

    return res.json(college);
  } catch (err) {
    return res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// ==========================
// UPDATE COLLEGE
// ==========================
export const updateCollege = async (req, res) => {
  try {
    const updated = await College.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).populate("subjects", "subjectName subjectCode");

    if (!updated) {
      return res.status(404).json({ msg: "College not found" });
    }

    return res.json({ msg: "College updated", college: updated });
  } catch (err) {
    return res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// ==========================
// DELETE COLLEGE
// ==========================
export const deleteCollege = async (req, res) => {
  try {
    const college = await College.findById(req.params.id);

    if (!college) {
      return res.status(404).json({ msg: "College not found" });
    }

    // Delete login linked to this college email
    await LOGIN.findOneAndDelete({ username: college.email });

    // Delete college
    await College.findByIdAndDelete(req.params.id);

    return res.json({
      msg: "College deleted successfully (login removed too)",
    });
  } catch (err) {
    return res.status(500).json({
      msg: "Server error",
      error: err.message,
    });
  }
};
