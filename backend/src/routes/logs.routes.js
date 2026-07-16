import express from "express";
import { logs } from "../controllers/logs.controller.js";

const router = express.Router();

/**
 * GET /api/logs/:project
 */
router.get("/:project", logs);

export default router;
