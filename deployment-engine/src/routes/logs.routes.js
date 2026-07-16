import express from "express";
import { getLogs } from "../controllers/logs.controller.js";

const router = express.Router();

/**
 * GET /logs/:project
 */
router.get("/:project", getLogs);

export default router;
