import express from "express";
import {
  addContact,
  getContacts,
  deleteContact,
} from "../controllers/emergencyContact.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", verifyJWT, addContact);

router.get("/", verifyJWT, getContacts);

router.delete("/:id", verifyJWT, deleteContact);

export default router;