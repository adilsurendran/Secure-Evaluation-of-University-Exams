import express from 'express'
import { loginUser, logoutUser, refreshAccessToken } from '../Controllers/authController.js';


const authrouter = express.Router()

authrouter.post("/login", loginUser);
authrouter.post("/refresh", refreshAccessToken);
authrouter.post("/logout", logoutUser);

export default authrouter

