// Controllers/answerCopyController.js
import AnswerSheet from "../Models/AnswerSheet.js";
import AnswerCopyRequest from "../Models/AnswerCopyRequest.js";
import ExamSession from "../Models/ExamSession.js";
import Exam from "../Models/Exam.js";
import Subject from "../Models/Subject.js";
import Student from "../Models/Student.js";
import College from "../Models/College.js";

import cloudinary from "../config/cloudinary.js";
import { decrypt } from "../config/encryption.js";
import { generateSignedPdfUrl } from "../utils/signedUrlUtils.js";

/* ==========================================================
   STUDENT: Get all answer sheets for which copy can be requested
   URL: GET /student/answer-copy/options/:studentId
   Returns: array of AnswerSheet (with populated session, exam, subject)
========================================================== */
export const studentAnswerCopyOptions = async (req, res) => {
  try {
    const { studentId } = req.params;

    const sheets = await AnswerSheet.find({
      studentId,
      status: { $in: ["evaluated", "assigned", "uploaded"] }, // usually evaluated, but you can restrict
    })
      .populate("sessionId")
      .populate("examId")
      .populate("subjectId");

    return res.json(sheets);
  } catch (err) {
    console.log("studentAnswerCopyOptions ERROR:", err);
    return res.status(500).json({ msg: "Server error", error: err.message });
  }
};

/* ==========================================================
   STUDENT: Create a new Answer Copy Request
   URL: POST /student/answer-copy/request
   Body: { studentId, sessionId, examId }
   One request per (student + session + exam) only
========================================================== */
export const studentCreateAnswerCopyRequest = async (req, res) => {
  try {
    const { studentId, sessionId, examId } = req.body;

    if (!studentId || !sessionId || !examId) {
      return res.status(400).json({ msg: "Missing fields" });
    }

    // 1) Check if answer sheet exists
    const sheet = await AnswerSheet.findOne({
      studentId,
      sessionId,
      examId,
    })
      .populate("subjectId")
      .populate("studentId");

    if (!sheet) {
      return res
        .status(400)
        .json({ msg: "No answer sheet found for this exam" });
    }

    // 2) Enforce one request per student+session+exam
    const already = await AnswerCopyRequest.findOne({
      studentId,
      sessionId,
      examId,
    });

    if (already) {
      return res
        .status(400)
        .json({ msg: "You have already requested a copy for this exam" });
    }

    // 3) Create request
    const created = await AnswerCopyRequest.create({
      studentId,
      collegeId: sheet.studentId.collegeId,
      sessionId,
      examId,
      subjectId: sheet.subjectId._id,
      answerSheetId: sheet._id,
      status: "pending",
      adminNote: "",
    });

    return res.status(201).json({
      msg: "Answer sheet copy request submitted",
      request: created,
    });
  } catch (err) {
    console.log("studentCreateAnswerCopyRequest ERROR:", err);
    return res.status(500).json({ msg: "Server error", error: err.message });
  }
};

/* ==========================================================
   STUDENT: Get my copy requests
   URL: GET /student/answer-copy/my-requests/:studentId
========================================================== */
export const studentGetMyCopyRequests = async (req, res) => {
  try {
    const { studentId } = req.params;

    const requests = await AnswerCopyRequest.find({ studentId })
      .sort({ createdAt: -1 })
      .populate("sessionId")
      .populate("examId")
      .populate("subjectId");

    return res.json(requests);
  } catch (err) {
    console.log("studentGetMyCopyRequests ERROR:", err);
    return res.status(500).json({ msg: "Server error", error: err.message });
  }
};

/* ==========================================================
   STUDENT: Get signed PDF URL for an APPROVED request
   URL: GET /student/answer-copy/pdf/:requestId
========================================================== */
// export const studentGetCopyPdf = async (req, res) => {
//   try {
//     const { requestId } = req.params;

//     const reqDoc = await AnswerCopyRequest.findById(requestId).populate(
//       "answerSheetId"
//     );

//     if (!reqDoc) {
//       return res.status(404).json({ msg: "Request not found" });
//     }

//     if (reqDoc.status !== "approved") {
//       return res
//         .status(400)
//         .json({ msg: "This request is not approved yet" });
//     }

//     const sheet = reqDoc.answerSheetId;
//     if (!sheet || !sheet.filePublicId) {
//       return res
//         .status(400)
//         .json({ msg: "Original answer sheet file not found" });
//     }

//     // Decrypt Cloudinary public_id
//     const decryptedId = decrypt(sheet.filePublicId); // e.g. "answer_sheets/sheet_....pdf"
//     const publicIdNoExt = decryptedId.replace(".pdf", "");

//     const signedUrl = cloudinary.utils.private_download_url(
//       publicIdNoExt,
//       "pdf",
//       { resource_type: "raw" }
//     );

//     return res.json({ url: signedUrl });
//   } catch (err) {
//     console.log("studentGetCopyPdf ERROR:", err);
//     return res.status(500).json({ msg: "Server error", error: err.message });
//   }
// };

// export const studentGetCopyPdf = async (req, res) => {
//   try {
//     const { requestId } = req.params;

//     const reqDoc = await AnswerCopyRequest.findById(requestId)
//       .populate("answerSheetId");

//     if (!reqDoc) {
//       return res.status(404).json({ msg: "Request not found" });
//     }

//     if (reqDoc.status !== "approved") {
//       return res.status(400).json({ msg: "This request is not approved yet" });
//     }

//     let publicId = decrypt(reqDoc.answerSheetId.filePublicId);

//     console.log("DECRYPTED BEFORE FIX =", publicId);

//     // FIX: remove .pdf extension if present
//     publicId = publicId.replace(/\.pdf$/i, "");

//     console.log("PUBLIC ID USED FOR SIGNED URL =", publicId);

//     const signedUrl = cloudinary.utils.private_download_url(
//       publicId,
//       "pdf",
//       {
//         resource_type: "raw",
//         type: "authenticated",
//         expires_at: Math.floor(Date.now() / 1000) + 60 * 5, // 5 minutes
//       }
//     );

//     return res.json({ url: signedUrl });

//   } catch (err) {
//     console.log("studentGetCopyPdf ERROR:", err);
//     return res.status(500).json({ msg: err.message });
//   }
// };

// export const studentGetCopyPdf = async (req, res) => {
//   try {
//     const { requestId } = req.params;

//     const reqDoc = await AnswerCopyRequest.findById(requestId)
//       .populate("answerSheetId");

//     if (!reqDoc) {
//       return res.status(404).json({ msg: "Request not found" });
//     }

//     if (reqDoc.status !== "approved") {
//       return res.status(400).json({ msg: "Request is not approved yet" });
//     }

//     const sheet = reqDoc.answerSheetId;

//     let publicId = decrypt(sheet.filePublicId);

//     console.log("DECRYPTED =", publicId);

//     // Try with extension
//     let signedUrl = cloudinary.utils.private_download_url(
//       publicId,
//       "pdf",
//       { resource_type: "raw", type: "authenticated" }
//     );

//     // If resource not found, retry without .pdf
//     // if (publicId.endsWith(".pdf")) {
//     //   const noExt = publicId.replace(".pdf", "");
//     //   console.log("Trying without extension:", noExt);

//     //   signedUrl = cloudinary.utils.private_download_url(
//     //     noExt,
//     //     "pdf",
//     //     { resource_type: "raw", type: "authenticated" }
//     //   );
//     // }

//     console.log("SIGNED URL =", signedUrl);

//     return res.json({ url: signedUrl });

//   } catch (err) {
//     console.log("studentGetCopyPdf ERROR:", err);
//     return res.status(500).json({ msg: "Server error", error: err.message });
//   }
// };

// export const studentGetCopyPdf = async (req, res) => {
//   try {
//     const { requestId } = req.params;

//     const reqDoc = await AnswerCopyRequest.findById(requestId)
//       .populate("answerSheetId");

//     if (!reqDoc) {
//       return res.status(404).json({ msg: "Request not found" });
//     }

//     if (reqDoc.status !== "approved") {
//       return res.status(400).json({ msg: "Request is not approved yet" });
//     }

//     const sheet = reqDoc.answerSheetId;

//     const publicId = decrypt(sheet.filePublicId); // MUST include .pdf
//     console.log("DECRYPTED =", publicId);

//     const signedUrl = cloudinary.utils.private_download_url(
//       publicId,
//       "pdf",
//       {
//         resource_type: "raw",
//         type: "authenticated",
//         expires_at: Math.floor(Date.now() / 1000) + 60 * 5
//       }
//     );

//     console.log("SIGNED URL =", signedUrl);

//     return res.json({ url: signedUrl });

//   } catch (err) {
//     console.log("studentGetCopyPdf ERROR:", err);
//     return res.status(500).json({ msg: "Server error", error: err.message });
//   }
// };

export const studentGetCopyPdf = async (req, res) => {
  try {
    const { requestId } = req.params;

    const reqDoc = await AnswerCopyRequest.findById(requestId)
      .populate("answerSheetId");

    if (!reqDoc) {
      return res.status(404).json({ msg: "Request not found" });
    }

    if (reqDoc.status !== "approved") {
      return res.status(400).json({ msg: "Request is not approved yet" });
    }

    const sheet = reqDoc.answerSheetId;

    // ✅ SIGNED URL GENERATION MOVED TO UTILITY
    const signedUrl = generateSignedPdfUrl(
      sheet.filePublicId,
      5 * 60 // 5 minutes
    );

    return res.json({ url: signedUrl });

  } catch (err) {
    console.log("studentGetCopyPdf ERROR:", err);
    return res.status(500).json({
      msg: "Server error",
      error: err.message
    });
  }
};



/* ==========================================================
   ADMIN / UNIVERSITY: List all requests (with optional ?status=)
   URL: GET /university/answer-copy/requests
========================================================== */
export const adminListAnswerCopyRequests = async (req, res) => {
  try {
    const { status } = req.query;

    const filter = {};
    if (status && ["pending", "approved", "rejected"].includes(status)) {
      filter.status = status;
    }

    const requests = await AnswerCopyRequest.find(filter)
      .sort({ createdAt: -1 })
      .populate({
        path: "studentId",
        populate: { path: "collegeId" },
      })
      .populate("collegeId")
      .populate("sessionId")
      .populate("subjectId")
      .populate("examId");

    return res.json(requests);
  } catch (err) {
    console.log("adminListAnswerCopyRequests ERROR:", err);
    return res.status(500).json({ msg: "Server error", error: err.message });
  }
};

/* ==========================================================
   ADMIN / UNIVERSITY: Approve a request
   URL: PUT /university/answer-copy/:requestId/approve
========================================================== */
// export const adminApproveAnswerCopyRequest = async (req, res) => {
//   try {
//     const { requestId } = req.params;

//     const reqDoc = await AnswerCopyRequest.findById(requestId);
//     if (!reqDoc) return res.status(404).json({ msg: "Request not found" });

//     if (reqDoc.status === "approved") {
//       return res.status(400).json({ msg: "Already approved" });
//     }

//     reqDoc.status = "approved";
//     reqDoc.adminNote = reqDoc.adminNote || "";
//     await reqDoc.save();

//     return res.json({ msg: "Request approved", request: reqDoc });
//   } catch (err) {
//     console.log("adminApproveAnswerCopyRequest ERROR:", err);
//     return res.status(500).json({ msg: "Server error", error: err.message });
//   }
// };

export const adminApproveAnswerCopyRequest = async (req, res) => {
  try {
    const { requestId } = req.params;

    const reqDoc = await AnswerCopyRequest.findById(requestId);
    if (!reqDoc) {
      return res.status(404).json({ msg: "Request not found" });
    }

    // 🚫 Block if payment not completed
    if (reqDoc.paymentStatus !== "completed") {
      return res.status(400).json({
        msg: "Payment not completed. Approval not allowed."
      });
    }

    if (reqDoc.status === "approved") {
      return res.status(400).json({ msg: "Already approved" });
    }

    reqDoc.status = "approved";
    reqDoc.adminNote = reqDoc.adminNote || "";
    await reqDoc.save();

    return res.json({
      msg: "Request approved",
      request: reqDoc
    });

  } catch (err) {
    console.log("adminApproveAnswerCopyRequest ERROR:", err);
    return res.status(500).json({
      msg: "Server error",
      error: err.message
    });
  }
};


/* ==========================================================
   ADMIN / UNIVERSITY: Reject a request
   URL: PUT /university/answer-copy/:requestId/reject
   Body: { adminNote }
========================================================== */
export const adminRejectAnswerCopyRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { adminNote } = req.body;

    const reqDoc = await AnswerCopyRequest.findById(requestId);
    if (!reqDoc) return res.status(404).json({ msg: "Request not found" });

    if (reqDoc.status === "rejected") {
      return res.status(400).json({ msg: "Already rejected" });
    }

    reqDoc.status = "rejected";
    reqDoc.adminNote = adminNote || "";
    await reqDoc.save();

    return res.json({ msg: "Request rejected", request: reqDoc });
  } catch (err) {
    console.log("adminRejectAnswerCopyRequest ERROR:", err);
    return res.status(500).json({ msg: "Server error", error: err.message });
  }
};


export const getStudentEvaluatedSheetsForExam = async (req,res) => {
  const { studentId, examId } = req.params;
  const sheets = await AnswerSheet.find({ studentId, examId, status: "evaluated" })
    .populate("subjectId", "subjectName subjectCode total_mark")
    .populate("examId", "examDate");
  return res.json(sheets);
};
