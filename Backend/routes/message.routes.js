import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { createMessage, deleteMessage, editMessage } from "../controllers/message.controller.js";

const router=Router()
router.route("/create/:roomId").post(verifyJWT,createMessage)
router.route("/:messageId").patch(verifyJWT,editMessage).delete(verifyJWT,deleteMessage)

export default router;