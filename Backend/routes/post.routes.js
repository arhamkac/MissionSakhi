import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { deletePost, getPostById, getPosts, updatePost, uploadPost } from "../controllers/post.controller.js";
import {upload} from "../middleware/multer.middleware.js"

const router=Router();
    router.route("/upload-post").post(
    verifyJWT,
    upload.fields([
        {
            name:"image",
            maxCount:1
        }
    ]),
    uploadPost);
    router.route("/update-post/:postId").patch(verifyJWT,updatePost)
    router.route("/delete-post/:postId").delete(verifyJWT,deletePost)
    router.route("/get-post/:postId").get(getPostById)
    router.route("/get-posts").get(getPosts)

export default router