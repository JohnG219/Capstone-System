import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { createError } from "../utils/error.js";
import jwt from "jsonwebtoken";
import { sendOtp } from "../utils/sendOtp.js";


export const register = async (req, res, next) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    const newUser = new User({
      ...req.body,
      password: hash,
    });

    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpExpiration = new Date(Date.now() + 15 * 60 * 1000); 

    newUser.otp = otp;
    newUser.otpExpiration = otpExpiration;

    await newUser.save();
    const recipientEmail = newUser.email;
    await sendOtp(recipientEmail, otp);

    res.status(200).send("User has been created. OTP sent for verification.");
  } catch (err) {
    next(err);
  }
};


export const verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return next(createError(404, "User not found"));
    }

    if (user.otp !== otp || user.otpExpiration <= new Date()) {
      return next(createError(400, "Incorrect OTP or OTP expired"));
    }

    user.otp = null;
    user.otpExpiration = null;
    await user.save();
    
    res.status(200).json({ message: "OTP verified successfully.", details: user });
  } catch (err) {
    next(err);
  }
};


export const sendOTP = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return next(createError(400, "Email is required."));
    }

    const user = await User.findOne({ email });

    if (!user) {
      return next(createError(404, "User not found"));
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpExpiration = new Date(Date.now() + 15 * 60 * 1000); 

    // Corrected variable name from `newUser` to `user`
    user.otp = otp;
    user.otpExpiration = otpExpiration;

    await user.save();
    const recipientEmail = user.email; 
    await sendOtp(recipientEmail, otp);

    res.status(200).json({ message: "OTP sent successfully." });
  } catch (err) {
    console.error(err); 
    next(err);
  }
};




export const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return next(createError(404, "Invalid Credentials"));

    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!isPasswordCorrect) {
      return next(createError(400, "Invalid Password!"));
    }

    if (!user.otp || user.otpExpiration <= new Date()) {
      const otp = Math.floor(100000 + Math.random() * 900000);
      const otpExpiration = new Date(Date.now() + 15 * 60 * 1000); 

      const recipientEmail = user.email;
      await sendOtp(recipientEmail, otp);

      user.otp = otp;
      user.otpExpiration = otpExpiration;
      await user.save();
      res.status(200).json({ message: "OTP sent for verification.", otpVerified: false });
    } else {
      res.status(200).json({ message: "OTP verified successfully.", otpVerified: true, details: user });
    }
  } catch (err) {
    next(err);
  }
};
