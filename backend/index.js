import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import authrouter from "./Routes/authRoutes.js";
import subjectRouter from "./Routes/subjectRoutes.js";
import collegeRouter from "./Routes/collegeRoutes.js";
import ESessionrouter from "./Routes/examSessionRoutes.js";
import examrouter from "./Routes/examRoutes.js";
import staffRouter from "./Routes/staffRoutes.js";
import studentRouter from "./Routes/studentRoutes.js";
import universityRouter from "./Routes/universityRoutes.js";



mongoose.connect("mongodb://localhost:27017/SecureEvaluation").then(() => console.log("Connected to MongoDB successfully")).catch((error) => console.error("Error connecting to MongoDB", error));
const server = express();

server.listen(8000, () => console.log("Server started on port 8000"));

server.use(cors({origin:"*"}));

server.use(express.json());

server.use('/api/auth',authrouter)
server.use("/api/subjects", subjectRouter);
server.use("/api/colleges", collegeRouter);
server.use("/api/exam-sessions", ESessionrouter);
server.use("/api/exams", examrouter);
server.use("/api/staff", staffRouter);
server.use("/api/student", studentRouter);
server.use("/api/university", universityRouter);

