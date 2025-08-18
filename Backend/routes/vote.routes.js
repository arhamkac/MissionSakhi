import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { toggleUpvoteComment, toggleUpvotePost } from "../controllers/vote.controller.js";

const router=Router();
router.route("/toggle-post-vote/:postId").post(verifyJWT,toggleUpvotePost)
router.route("/toggle-comment-vote/:commentId").post(verifyJWT,toggleUpvoteComment)

export default router