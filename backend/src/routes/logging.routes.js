import { Router } from "express";
import { getLogs } from "../controllers/logging.controller.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

router.get("/", authenticate, getLogs);

export default router;
