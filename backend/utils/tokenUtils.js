import jwt from "jsonwebtoken";
import crypto from "crypto";



const ACCESS_SECRET = process.env.ACCESS_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;



export const generateAccessToken = (payload) => {
  if (!process.env.ACCESS_SECRET) {
    throw new Error("ACCESS_SECRET is missing in environment variables");
  }

  return jwt.sign(payload, process.env.ACCESS_SECRET, {
    expiresIn: "15m",
  });
};

export const generateRefreshToken = (payload) => {
  if (!process.env.REFRESH_SECRET) {
    throw new Error("REFRESH_SECRET is missing in environment variables");
  }

  return jwt.sign(payload, process.env.REFRESH_SECRET, {
    expiresIn: "7d",
  });
};


export const hashToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

export const verifyAccessToken = (token) => {
  return jwt.verify(token, ACCESS_SECRET);
};
