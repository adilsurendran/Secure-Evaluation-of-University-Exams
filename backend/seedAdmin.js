import mongoose from "mongoose";
import bcrypt from "bcrypt";
import LOGIN from "./Models/Login.js";

const seedAdmin = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/SecureEvaluation");
    console.log("MongoDB connected.");

    // Check if admin exists
    const existingAdmin = await LOGIN.findOne({ username: "admin" });
    if (existingAdmin) {
      console.log("Admin already exists. No action taken.");
      process.exit(0);
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash("123456", 10);

    // Insert admin
    const admin = await LOGIN.create({
      username: "admin",
      password: hashedPassword,
      role: "admin"
    });

    console.log("Admin created successfully:", admin);
    process.exit(0);
  } 
  catch (err) {
    console.error("Error seeding admin:", err);
    process.exit(1);
  }
};

seedAdmin();
