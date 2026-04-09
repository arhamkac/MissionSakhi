import { Router } from "express";
import { createReport } from "../controllers/report.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router=Router();
router.route("/:type/:id").post(verifyJWT,createReport)

export default router;