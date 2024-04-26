import express from "express";
import { login, register, verifyOTP } from "../controllers/auth.js";



const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/verify-otp", verifyOTP);


export default router