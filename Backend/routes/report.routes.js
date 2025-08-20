import { Router } from "express";
import { createReport } from "../controllers/report.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router=Router();
router.route("/:postId").post(verifyJWT,createReport)
router.route("/:commentId").post(verifyJWT,createReport)
router.route("/:messageId").post(verifyJWT,createReport)
router.route("/:userId").post(verifyJWT,createReport)
router.route("/:roomId").post(verifyJWT,createReport)

export default router;