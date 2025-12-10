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

// ⚪⚪⚪Upload Answer Sheet to Cloud and Manage Section
import AnswerSheet from "../Models/AnswerSheet.js";
import cloudinary from "../config/cloudinary.js";
import { decrypt, encrypt } from "../config/encryption.js";


export const uploadAnswerSheet = async (req, res) => {
  try {
    const { sessionId, examId, studentId, subjectId, collegeId } = req.body;

    if (!req.file)
      return res.status(400).json({ msg: "PDF is required" });

    // Prevent duplicate upload
    const exists = await AnswerSheet.findOne({ examId, studentId });
    if (exists)
      return res.status(400).json({ msg: "Sheet already uploaded" });

    // Upload to Cloudinary using streaming
    const uploadStream = () => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "answer_sheets",
            resource_type: "raw",
            // use_filename: true,
            // unique_filename: false,
            public_id: `sheet_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`, 
            type: "authenticated",
            format: "pdf"
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });
    };

    const uploaded = await uploadStream();
    // console.log(uploaded);
    

    // Encrypt Cloudinary public_id
    const encryptedPublicId = encrypt(uploaded.public_id);

    // Save entry
    const sheet = await AnswerSheet.create({
      sessionId,
      examId,
      studentId,
      subjectId,
      collegeId,
      filePublicId: encryptedPublicId
    });

    res.status(201).json({ msg: "Uploaded", sheet });

  } catch (err) {
    console.log("UPLOAD ERROR:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};


export const getSheetsByCollege = async (req, res) => {
  try {
    const sheets = await AnswerSheet.find({ collegeId: req.params.collegeId })
      .populate("studentId", "name admissionNo")
      .populate("subjectId", "subjectName subjectCode")
      .populate("examId")
      .populate("sessionId");

    const finalSheets = sheets.map((s) => {
      const realPublicId = decrypt(s.filePublicId);
      // console.log(s.filePublicId);
      // console.log(realPublicId);
      
      

      const signedUrl = cloudinary.utils.private_download_url(
        realPublicId,
        "pdf",
        {
          type: "authenticated",
          expires_at: Math.floor(Date.now() / 1000) + 3600 // 1 hour
        }
      );

      return { ...s.toObject(), fileUrl: signedUrl };
    });

    res.json(finalSheets);

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};


export const getSignedPdfUrl = async (req, res) => {
  try {
    const encryptedPath = req.params.encrypted;
    const publicId = decrypt(encryptedPath);
    console.log("decrypted public",publicId);
    

    // FIXED: use private_download_url instead of signed_url
    const signedUrl = cloudinary.utils.private_download_url(
      publicId,
      "pdf",      // file format
      {
        resource_type: "raw",
        type: "authenticated",
        expires_at: Math.floor(Date.now() / 1000) + 60 * 5 // 5 minutes
      }
    );

    console.log("SIGNED:", signedUrl);

    return res.json({ url: signedUrl });

  } catch (err) {
    console.log("SIGNED URL ERROR:", err);
    return res.status(500).json({ msg: err.message });
  }
};
 

export const deleteSheet = async (req, res) => {
  try {
    const sheet = await AnswerSheet.findById(req.params.id);
    if (!sheet) return res.status(404).json({ msg: "Sheet not found" });

    const realPublicId = decrypt(sheet.filePublicId);

    console.log("Deleting:", realPublicId);

    // Authenticated RAW resources must use api.delete_resources
    const deleted = await cloudinary.api.delete_resources(
      [realPublicId],
      {
        resource_type: "raw",
        type: "authenticated",
      }
    );

    console.log("Cloudinary delete response:", deleted);

    await AnswerSheet.findByIdAndDelete(sheet._id);

    res.json({ msg: "Deleted successfully", deleted });

  } catch (err) {
    console.log("DELETE ERROR:", err);
    res.status(500).json({ msg: err.message });
  }
};


import Result from "../Models/Result.js";

export const getCollegeResults = async (req, res) => {
  try {
    const { collegeId } = req.params;
    const { sessionId, subjectId } = req.query;

    let filter = { collegeId, published: true };

    if (sessionId) filter.sessionId = sessionId;
    if (subjectId) filter.subjectId = subjectId;

    const results = await Result.find(filter)
      .populate("studentId", "name admissionNo")
      .populate("subjectId", "subjectCode subjectName total_mark")
      .populate("sessionId", "name academicYear semester");

    return res.json(results);

  } catch (err) {
    console.log("COLLEGE RESULTS ERROR:", err);
    return res.status(500).json({ msg: "Server error" });
  }
};
