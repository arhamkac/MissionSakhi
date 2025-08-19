import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { createRoom, deleteRoom, getRoomById, getRoomMessages, getRooms, joinRoom } from "../controllers/room.controller.js";

const router=Router();
router.route("/messages/:roomId").get(verifyJWT,getRoomMessages)
router.route("/create-room").post(verifyJWT,createRoom)
router.route("/get-rooms").get(getRooms)
router.route("/:roomId").get(getRoomById).delete(verifyJWT,deleteRoom).post(verifyJWT,joinRoom)

export default router;