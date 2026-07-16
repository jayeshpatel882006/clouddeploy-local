import express from "express";
import { deploymentDetails } from "../controllers/deploymentDetails.controller.js";

const router = express.Router();

router.get("/:project", deploymentDetails);

export default router;
