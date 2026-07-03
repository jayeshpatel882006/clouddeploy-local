import { Router } from "express";
import {
  getMetricsHandler,
  getSummary,
} from "../controllers/monitoring.controller.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

router.get("/", authenticate, getMetricsHandler);
router.get("/summary", authenticate, getSummary);

export default router;
