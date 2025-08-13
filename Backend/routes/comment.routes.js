import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { deleteComment, getPostComments, postComment, updateComment } from "../controllers/comment.controller.js";

const router=Router();
router.route("/post/:postId").post(postComment)
router.route("/post/:commentId").patch(verifyJWT,updateComment)
router.route("/delete/:commentId").delete(verifyJWT,deleteComment)
router.route("/getcomments/:postId").get(getPostComments)


export default router