// import cloudinary from "../config/cloudinary.js";
// import { decrypt } from "../config/encryption.js";

// /**
//  * Generate a signed, time-limited Cloudinary URL
//  * @param {string} encryptedPublicId - encrypted Cloudinary public_id
//  * @param {number} expiresInSeconds - expiry time in seconds
//  * @returns {string} signed Cloudinary URL
//  */
// export const generateSignedPdfUrl = (
//   encryptedPublicId,
//   expiresInSeconds = 5 * 60 // default: 5 minutes
// ) => {
//   // 1️⃣ Decrypt stored public_id
//   const publicId = decrypt(encryptedPublicId);

//   // 2️⃣ Compute expiry (unix timestamp)
//   const expiresAt = Math.floor(Date.now() / 1000) + expiresInSeconds;

//   // 3️⃣ Generate signed Cloudinary URL (same as your controller)
//   const signedUrl = cloudinary.utils.private_download_url(
//     publicId,
//     "pdf",
//     {
//       resource_type: "raw",
//       type: "authenticated",
//       expires_at: expiresAt
//     }
//   );

//   return signedUrl;
// };


import cloudinary from "../config/cloudinary.js";
import { decrypt } from "../config/encryption.js";

/**
 * Generate a signed Cloudinary PDF URL
 * @param {string} encryptedPublicId
 * @param {number} expiresInSeconds
 */
export const generateSignedPdfUrl = (
  encryptedPublicId,
  expiresInSeconds = 5 * 60
) => {
  const publicId = decrypt(encryptedPublicId);

  const expiresAt = Math.floor(Date.now() / 1000) + expiresInSeconds;

  return cloudinary.utils.private_download_url(
    publicId,
    "pdf",
    {
      resource_type: "raw",
      type: "authenticated",
      expires_at: expiresAt
    }
  );
};

/**
 * Bulk helper for AnswerSheet arrays
 */
export const attachSignedUrlsToSheets = (
  sheets,
  expiresInSeconds = 5 * 60
) => {
  return sheets.map((s) => ({
    ...s.toObject(),
    fileUrl: generateSignedPdfUrl(s.filePublicId, expiresInSeconds)
  }));
};
