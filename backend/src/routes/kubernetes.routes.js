import express from "express";
import { kubernetesInfo } from "../controllers/kubernetes.controller.js";

const router = express.Router();

/**
 * GET /api/kubernetes/:project
 */
router.get("/:project", kubernetesInfo);

export default router;
