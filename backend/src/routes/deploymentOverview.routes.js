import express from "express";
import { deploymentOverview } from "../controllers/deploymentOverview.controller.js";

const router = express.Router();

router.get("/:project", deploymentOverview);

export default router;
