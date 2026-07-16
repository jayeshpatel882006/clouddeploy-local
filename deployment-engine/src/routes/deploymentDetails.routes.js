import express from "express";
import { getDeploymentDetails } from "../controllers/deploymentDetails.controller.js";

const router = express.Router();

/**
 * GET /deployment-details/:project
 */
router.get("/:project", getDeploymentDetails);

export default router;
