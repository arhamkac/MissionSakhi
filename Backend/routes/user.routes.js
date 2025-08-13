import { Router } from "express";
import { changePassword, loginUser, logOutUser, refreshAccessToken, registerUser, resetPassword, sendOTP, verifyOTP } from "../controllers/user.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router=Router()
router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/logout").post(verifyJWT,logOutUser)
router.route("/refresh-access-token").post(refreshAccessToken)
router.route("/change-password").post(verifyJWT,changePassword)
router.route("/send-otp").post(sendOTP)
router.route("/verify-otp").post(verifyOTP)
router.route("/reset-password").post(resetPassword)

export default router