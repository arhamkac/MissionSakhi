import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { deleteMessage, editMessage } from "../controllers/message.controller.js";

const router=Router()
router.route("/:messageId").patch(verifyJWT,editMessage).delete(verifyJWT,deleteMessage)

export default router;