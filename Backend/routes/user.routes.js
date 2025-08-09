import { Router } from "express";
import { changePassword, loginUser, logOutUser, refreshAccessToken, registerUser } from "../controllers/user.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router=Router()
router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/logout").post(verifyJWT,logOutUser)
router.route("/refresh-access-token").post(refreshAccessToken)
router.route("/change-password").post(verifyJWT,changePassword)

export default router