// // Controllers/staffController.js

// import bcrypt from "bcryptjs";
// import Staff from "../Models/Staff.js";
// import LOGIN from "../Models/Login.js";

// /* ======================================================
//     CREATE STAFF (College enters password manually)
// ====================================================== */
// export const createStaff = async (req, res) => {
//   try {
//     const { collegeId, name, qualification, phone, email, password, subjects } =
//       req.body;

//     // Check if staff already exists
//     const exists = await LOGIN.findOne({ username:email });
//     if (exists) {
//       return res.status(400).json({ msg: "Staff already registered" });
//     }

//     // Validate password
//     if (!password || password.trim().length < 6) {
//       return res
//         .status(400)
//         .json({ msg: "Password must be at least 6 characters" });
//     }

//     // Hash password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     // Create LOGIN entry
//     const loginRecord = await LOGIN.create({
//       username: email,
//       password: hashedPassword,
//       role: "staff",
//     });

//     // Create staff record
//     const staff = await Staff.create({
//       collegeId,
//       name,
//       qualification,
//       phone,
//       email,
//       password: hashedPassword,
//       subjects,
//       commonKey:loginRecord._id
//     });

//     return res.status(201).json({
//       msg: "Staff registered successfully",
//       staff,
//       loginCredentials: {
//         username: loginRecord.username,
//       },
//     });
//   } catch (err) {
//     console.log(err);
    
//     return res.status(500).json({
//       msg: "Server error",
//       error: err.message,
//     });
//   }
// };

// /* ======================================================
//     GET STAFF BY COLLEGE
// ====================================================== */
// export const getStaffByCollege = async (req, res) => {
//   try {
//     const staff = await Staff.find({ collegeId: req.params.collegeId }).populate(
//       "subjects",
//       "subjectName subjectCode"
//     );

//     return res.json(staff);
//   } catch (err) {
//     return res.status(500).json({
//       msg: "Server error",
//       error: err.message,
//     });
//   }
// };

// /* ======================================================
//     UPDATE STAFF (Optional password update)
// ====================================================== */
// export const updateStaff = async (req, res) => {
//   try {
//     const { name, qualification, phone, subjects, password } = req.body;

//     const updateData = {
//       name,
//       qualification,
//       phone,
//       subjects,
//     };

//     // If new password is provided, hash it and update login+staff
//     if (password && password.trim().length >= 6) {
//       const salt = await bcrypt.genSalt(10);
//       const hashedPassword = await bcrypt.hash(password, salt);
//       updateData.password = hashedPassword;

//       // Update login table
//       await LOGIN.findOneAndUpdate(
//         { username: req.body.email }, // email cannot be updated
//         { password: hashedPassword }
//       );
//     }

//     const updatedStaff = await Staff.findByIdAndUpdate(
//       req.params.id,
//       updateData,
//       { new: true }
//     );

//     return res.json({ msg: "Staff updated successfully", updatedStaff });
//   } catch (err) {
//     return res.status(500).json({
//       msg: "Server error",
//       error: err.message,
//     });
//   }
// };

// /* ======================================================
//     DELETE STAFF (Removes login entry too)
// ====================================================== */
// export const deleteStaff = async (req, res) => {
//   try {
//     const staff = await Staff.findById(req.params.id);

//     if (!staff) {
//       return res.status(404).json({ msg: "Staff not found" });
//     }

//     // Remove LOGIN entry
//     await LOGIN.findOneAndDelete({ username: staff.email });

//     // Remove staff record
//     await Staff.findByIdAndDelete(req.params.id);

//     return res.json({ msg: "Staff deleted successfully" });
//   } catch (err) {
//     return res.status(500).json({
//       msg: "Server error",
//       error: err.message,
//     });
//   }
// };


// Controllers/staffController.js

import bcrypt from "bcryptjs";
import Staff from "../Models/Staff.js";
import LOGIN from "../Models/Login.js";

/* ======================================================
    CREATE STAFF
====================================================== */
export const createStaff = async (req, res) => {
  try {
    const { collegeId, name, qualification, phone, email, password, subjects } =
      req.body;

    // Check duplicate login
    const exists = await LOGIN.findOne({ username: email });
    if (exists) {
      return res.status(400).json({ msg: "Staff already registered" });
    }

    // Validate password
    if (!password || password.trim().length < 6) {
      return res
        .status(400)
        .json({ msg: "Password must be at least 6 characters" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create login credential
    const loginRecord = await LOGIN.create({
      username: email,
      password: hashedPassword,
      role: "staff",
    });

    // Create staff record
    const staff = await Staff.create({
      collegeId,
      name,
      qualification,
      phone,
      email,
      password: hashedPassword,
      subjects,
      commonKey: loginRecord._id,
    });

    return res.status(201).json({
      msg: "Staff registered successfully",
      staff,
      loginCredentials: {
        username: loginRecord.username,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      msg: "Server error",
      error: err.message,
    });
  }
};

/* ======================================================
    GET STAFF BY COLLEGE
====================================================== */
export const getStaffByCollege = async (req, res) => {
  try {
    const staff = await Staff.find({ collegeId: req.params.collegeId })
      .populate("subjects", "subjectName subjectCode");

    return res.json(staff);
  } catch (err) {
    return res.status(500).json({ msg: "Server error", error: err.message });
  }
};

/* ======================================================
    GET STAFF BY ID  <-- REQUIRED for EDIT STAFF
====================================================== */
export const getStaffById = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id)
      .populate("subjects", "subjectName subjectCode");

    if (!staff)
      return res.status(404).json({ msg: "Staff not found" });

    return res.json(staff);
  } catch (err) {
    return res.status(500).json({
      msg: "Server error",
      error: err.message,
    });
  }
};

/* ======================================================
    UPDATE STAFF
====================================================== */
export const updateStaff = async (req, res) => {
  try {
    const { name, qualification, phone, subjects, password } = req.body;

    const updateData = { name, qualification, phone, subjects };

    // If password updating
    if (password && password.trim().length >= 6) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;

      // Update password in login table
      const staff = await Staff.findById(req.params.id);
      if (staff) {
        await LOGIN.findOneAndUpdate(
          { username: staff.email },
          { password: hashedPassword }
        );
      }
    }

    const updated = await Staff.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    if (!updated)
      return res.status(404).json({ msg: "Staff not found" });

    return res.json({ msg: "Staff updated successfully", updated });
  } catch (err) {
    return res.status(500).json({
      msg: "Server error",
      error: err.message,
    });
  }
};

/* ======================================================
    DELETE STAFF
====================================================== */
export const deleteStaff = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);

    if (!staff)
      return res.status(404).json({ msg: "Staff not found" });

    await LOGIN.findOneAndDelete({ username: staff.email });
    await Staff.findByIdAndDelete(req.params.id);

    return res.json({ msg: "Staff deleted successfully" });
  } catch (err) {
    return res.status(500).json({
      msg: "Server error",
      error: err.message,
    });
  }
};
