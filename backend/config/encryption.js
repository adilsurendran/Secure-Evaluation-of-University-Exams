// import crypto from "crypto";

// const SECRET_KEY = process.env.ENCRYPT_KEY; // 32 chars
// const IV = process.env.ENCRYPT_IV; // 16 chars

// export function encrypt(text) {
//   const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(SECRET_KEY), Buffer.from(IV));
//   let encrypted = cipher.update(text, "utf8", "hex");
//   encrypted += cipher.final("hex");
//   return encrypted;
// }

// export function decrypt(hash) {
//   const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(SECRET_KEY), Buffer.from(IV));
//   let decrypted = decipher.update(hash, "hex", "utf8");
//   decrypted += decipher.final("utf8");
//   return decrypted;
// }
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const KEY = Buffer.from(process.env.FILE_ENCRYPT_KEY, "hex");   // 32 bytes
const IV = Buffer.from(process.env.FILE_ENCRYPT_IV, "hex");     // 16 bytes

export function encrypt(text) {
  const cipher = crypto.createCipheriv("aes-256-cbc", KEY, IV);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
}

export function decrypt(encryptedText) {
  const decipher = crypto.createDecipheriv("aes-256-cbc", KEY, IV);
  let decrypted = decipher.update(encryptedText, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}
