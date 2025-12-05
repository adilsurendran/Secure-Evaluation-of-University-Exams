import express from 'express'
import { loginUser } from '../Controllers/authController.js';


const authrouter = express.Router()

authrouter.post("/login", loginUser);

export default authrouter