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
    console.log(err);

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


export const updateAvailability = async (req, res) => {
  try {
    const staffId = req.params.id;
    const { available } = req.body; // true or false

    const staff = await Staff.findByIdAndUpdate(
      staffId,
      { available },
      { new: true }
    );

    if (!staff) {
      return res.status(404).json({ msg: "Staff not found" });
    }

    return res.json({ msg: "Availability updated", staff });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
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


import cloudinary from "../config/cloudinary.js";
import { decrypt } from "../config/encryption.js";
import AnswerSheet from "../Models/AnswerSheet.js";
import RevaluationRequest from "../Models/RevaluationRequest.js";
import { attachSignedUrlsToSheets } from "../utils/signedUrlUtils.js";

// export const getAssignedSheets = async (req, res) => {

//   console.log(req.params.staffId,"gettttttttttttttttttttttttttttttttttttttttttt");

//   try {
//     const sheets = await AnswerSheet.find({
//       assignedStaff: req.params.staffId,
//       status: { $in: ["assigned", "uploaded"] }
//     })
//       .populate("studentId", "name admissionNo")
//       .populate("subjectId", "subjectName subjectCode total_mark")
//       .populate("examId")
//       .populate("sessionId");

//     // 🔥 Build response with secure URLs
//     const finalSheets = sheets.map((s) => {
//       const decryptedId = decrypt(s.filePublicId);       // real public_id
//       const publicIdNoExt = decryptedId.replace(".pdf", "");

//       // Generate new signed temporary URL
//       const signedUrl = cloudinary.utils.private_download_url(
//         publicIdNoExt,
//         "pdf",
//         { resource_type: "raw" }
//       );
//       console.log(signedUrl);

//       return {
//         ...s.toObject(),
//         fileUrl: signedUrl,  // ← FRONTEND CAN USE DIRECTLY
//       };
//     });

//     res.json(finalSheets);

//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ msg: "Server error", error: err.message });
//   }
// };

// export const getAssignedSheets = async (req, res) => {
//   try {
//     const sheets = await AnswerSheet.find({
//       assignedStaff: req.params.staffId,
//       status: { $in: ["assigned", "uploaded"] }
//     })
//       .populate("studentId", "name admissionNo")
//       .populate("subjectId", "subjectName subjectCode total_mark")
//       .populate("examId")
//       .populate("sessionId");

//     // Staff should have shorter-lived access
//     const finalSheets = attachSignedUrlsToSheets(sheets, 10 * 60); // 10 min

//     res.json(finalSheets);

//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ msg: "Server error", error: err.message });
//   }
// };

export const getAssignedSheets = async (req, res) => {
  try {
    const staffId = req.params.staffId;

    const sheets = await AnswerSheet.find({
      assignedStaff: staffId,
      status: { $in: ["assigned", "uploaded"] }
    })
      .populate("studentId", "name admissionNo")
      .populate("subjectId", "subjectName subjectCode total_mark")
      .populate("examId")
      .populate("sessionId");

    // Return metadata only (NO signed URLs)
    const response = sheets.map(s => {
      const sheet = s.toObject();
      delete sheet.fileUrl;
      delete sheet.filePublicUrl;
      return sheet;
    });

    return res.json(response);

  } catch (err) {
    console.error("GET ASSIGNED SHEETS ERROR:", err);
    return res.status(500).json({
      msg: "Server error",
      error: err.message
    });
  }
};


export const evaluateSheet = async (req, res) => {
  try {
    const { marks, status } = req.body;
    const { sheetId } = req.params;

    // 1. Validate marks
    if (marks === undefined || marks === null || isNaN(marks)) {
      return res.status(400).json({ msg: "Marks are required and must be a number" });
    }

    if (marks < 0) {
      return res.status(400).json({ msg: "Marks cannot be negative" });
    }

    // 2. Fetch sheet
    const sheet = await AnswerSheet.findById(sheetId);
    if (!sheet) {
      return res.status(404).json({ msg: "Sheet not found" });
    }

    // 3. Prevent double evaluation
    if (sheet.status === "evaluated") {
      return res.status(400).json({ msg: "This sheet is already evaluated" });
    }

    // 4. Update marks + status
    sheet.marks = marks;
    sheet.status = status || "evaluated";
    await sheet.save();

    res.json({
      msg: "Evaluation completed",
      updatedSheet: sheet
    });

  } catch (err) {
    console.log("EVALUATION ERROR:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

export const EvaluationHistory = async (req, res) => {
  try {
    // console.log(req);

    const { id } = req.params
    const { selected } = req.query
    console.log(id, selected);

    if (selected === "valuation") {
      const history = await AnswerSheet.find({ assignedStaff: id }).populate("sessionId", "name").populate("subjectId", "subjectCode subjectName")
      return res.status(200).json({ message: "Fetched evaltion history Successfull", history })

    }
    if (selected === "revaluation") {
      const history = await RevaluationRequest.find({ assignedStaff: id }).populate("sessionId", "name").populate("subjectId", "subjectCode subjectName")

      return res.status(200).json({ message: "Fetched revaluation history Successfully", history })
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

export const getStaffStats = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Current Valuation Stats (Answer Sheets assigned to this staff)
    const totalValuation = await AnswerSheet.countDocuments({ assignedStaff: id });
    const pendingValuation = await AnswerSheet.countDocuments({
      assignedStaff: id,
      status: { $in: ["assigned", "uploaded"] }
    });
    const completedValuation = await AnswerSheet.countDocuments({
      assignedStaff: id,
      status: "evaluated"
    });

    // 2. Revaluation Stats (Revaluation requests assigned to this staff)
    const totalRevaluation = await RevaluationRequest.countDocuments({ assignedStaff: id });
    const pendingRevaluation = await RevaluationRequest.countDocuments({
      assignedStaff: id,
      status: "assigned"
    });
    const completedRevaluation = await RevaluationRequest.countDocuments({
      assignedStaff: id,
      status: "completed"
    });

    return res.status(200).json({
      valuation: {
        total: totalValuation,
        pending: pendingValuation,
        completed: completedValuation
      },
      revaluation: {
        total: totalRevaluation,
        pending: pendingRevaluation,
        completed: completedRevaluation
      }
    });

  } catch (error) {
    console.error("STAFF STATS ERROR:", error);
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
};