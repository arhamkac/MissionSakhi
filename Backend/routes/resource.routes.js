import { Router } from "express";
import { verifyAdmin } from "../middleware/auth.middleware.js";
import { addResource, deleteResource, getResources } from "../controllers/resource.controller.js";

const router = Router();


router.route("/").get(getResources);

router.route("/").post(verifyAdmin, addResource);
router.route("/:id").delete(verifyAdmin, deleteResource);

export default router;
