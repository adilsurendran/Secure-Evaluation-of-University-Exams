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
