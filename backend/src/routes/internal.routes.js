import { Router } from "express";
import { updateDeploymentStatus } from "../controllers/internal.controller.js";

const router = Router();

router.patch("/deployment/:id/status", updateDeploymentStatus);

export default router;
