import LOGIN from "../Models/Login.js";
import College from "../Models/College.js";
import Staff from "../Models/Staff.js";
import bcrypt from "bcryptjs";
import Student from "../Models/Student.js";

// export const loginUser = async (req, res) => {
//   try {
//     const { username, password } = req.body;

//     // 1️⃣ Check login exists
//     const user = await LOGIN.findOne({ username });
//     if (!user) {
//       return res.status(400).json({ msg: "Invalid email or password" });
//     }

//     // 2️⃣ Check password
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ msg: "Invalid email or password" });
//     }

//     // 3️⃣ Handle ADMIN login separately (Admin has NO profile table)
//     if (user.role === "admin") {
//       return res.json({
//         msg: "Login successful",
//         role: "admin",
//         loginId: user._id,
//         profileId: null, // no profile table for admin
//         name: "Admin",
//       });
//     }

//     // 4️⃣ Fetch Profile for College/Staff/Student
//     let profile;

//     if (user.role === "college") {
//       profile = await College.findOne({ commonKey: user._id });
//     }

//     if (user.role === "staff") {
//       profile = await Staff.findOne({ commonKey: user._id });
//     }

//     if (user.role === "student") {
//       profile = await Student.findOne({ commonKey: user._id });
//     }

//     if (!profile) {
//       return res.status(500).json({
//         msg: "Profile not found for user role: " + user.role,
//       });
//     }

//     // 5️⃣ Send response
//     return res.json({
//       msg: "Login successful",
//       role: user.role,
//       loginId: user._id,
//       profileId: profile._id,
//       name: profile.name,
//     });

//   } catch (err) {
//     return res.status(500).json({
//       msg: "Server error",
//       error: err.message,
//     });
//   }
// };
import {
  generateAccessToken,
  generateRefreshToken,
  hashToken
} from "../utils/tokenUtils.js";
import RefreshToken from "../Models/RefreshToken.js";

export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await LOGIN.findOne({ username });
    if (!user)
      return res.status(400).json({ msg: "Invalid email " });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ msg: "Invalid password" });

    // ==============================
    // FETCH PROFILE (UNCHANGED)
    // ==============================
    let profile = null;

    if (user.role === "college")
      profile = await College.findOne({ commonKey: user._id });

    if (user.role === "staff")
      profile = await Staff.findOne({ commonKey: user._id });

    if (user.role === "student")
      profile = await Student.findOne({ commonKey: user._id });

    // ==============================
    // TOKEN GENERATION (NEW)
    // ==============================
    const accessToken = generateAccessToken({
      loginId: user._id,
      role: user.role,
      profileId: profile?._id || null
    });

    // const refreshToken = generateRefreshToken();
    const refreshToken = generateRefreshToken({
  loginId: user._id,
});

    const refreshTokenHash = hashToken(refreshToken);

    await RefreshToken.create({
      userId: user._id,
      tokenHash: refreshTokenHash,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    });

    // ==============================
    // SET REFRESH TOKEN COOKIE
    // ==============================
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, // true in production
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    // ==============================
    // RESPONSE (FRONTEND SAFE)
    // ==============================
    return res.json({
      msg: "Login successful",
      role: user.role,
      loginId: user._id,
      profileId: profile?._id || null,
      name: profile?.name || "Admin",
      accessToken
    });

  } catch (err) {
    console.log(err);
    
    return res.status(500).json({
      msg: "Server error",
      error: err.message
    });
  }
};



export const refreshAccessToken = async (req, res) => {
  try {
    // 1️⃣ Read refresh token from cookie
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ msg: "Refresh token missing" });
    }

    // 2️⃣ Hash received token
    const refreshTokenHash = hashToken(refreshToken);

    // 3️⃣ Find token in DB
    const storedToken = await RefreshToken.findOne({
      tokenHash: refreshTokenHash
    });

    if (!storedToken) {
      return res.status(401).json({ msg: "Invalid refresh token" });
    }

    // 4️⃣ Check expiry
    if (storedToken.expiresAt < new Date()) {
      await storedToken.deleteOne();
      return res.status(401).json({ msg: "Refresh token expired" });
    }

    // 5️⃣ Fetch user
    const user = await LOGIN.findById(storedToken.userId);
    if (!user) {
      return res.status(401).json({ msg: "User not found" });
    }

    // 6️⃣ Issue new access token
    const newAccessToken = generateAccessToken({
      loginId: user._id,
      role: user.role
    });

    // 7️⃣ Send new access token
    return res.json({
      accessToken: newAccessToken
    });

  } catch (err) {
    return res.status(500).json({
      msg: "Server error",
      error: err.message
    });
  }
};



export const logoutUser = async (req, res) => {
  try {
    // 1️⃣ Read refresh token from cookie
    const refreshToken = req.cookies?.refreshToken;

    if (refreshToken) {
      // 2️⃣ Hash token
      const refreshTokenHash = hashToken(refreshToken);

      // 3️⃣ Delete from DB
      await RefreshToken.deleteOne({
        tokenHash: refreshTokenHash
      });
    }

    // 4️⃣ Clear cookie
    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "strict",
      secure: false // true in production
    });

    return res.json({ msg: "Logged out successfully" });

  } catch (err) {
    return res.status(500).json({
      msg: "Server error",
      error: err.message
    });
  }
};
