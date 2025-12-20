import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// const ACCESS_SECRET = "ACCESS_SECRET_KEY";
const ACCESS_SECRET = process.env.ACCESS_SECRET;


const authMiddleware = (req, res, next) => {
  try {
    // 1️⃣ Read Authorization header
    const authHeader = req.headers.authorization;
    // console.log("From frontenddddddddddddddddddddddddddddddddddddddddddddd",authHeader);
    

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ msg: "Access token missing" });
    }

    // 2️⃣ Extract token
    const token = authHeader.split(" ")[1];
    console.log("frontend secrettttttttttttttttttttttttttttttttttttttt",token);
console.log("backend .env secrettttttttttttttttttttttttttttttttttttttt",ACCESS_SECRET);


    // 3️⃣ Verify token
    const decoded = jwt.verify(token, ACCESS_SECRET);

    console.log("decodedddddddddddddddddddddddddddddddddddddddddddd",decoded);
    

    // 4️⃣ Attach decoded payload to request
    req.user = decoded;

    // 5️⃣ Proceed
    next();

  } catch (err) {
    return res.status(401).json({
      msg: "Invalid or expired access token"
    });
  }
};

export default authMiddleware;
