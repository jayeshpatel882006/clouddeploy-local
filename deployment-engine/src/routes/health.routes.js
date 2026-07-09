import { Router } from "express";
import { getSystemHealth } from "../controllers/health.controller.js";

const router = Router();

router.get("/", getSystemHealth);

export default router;
