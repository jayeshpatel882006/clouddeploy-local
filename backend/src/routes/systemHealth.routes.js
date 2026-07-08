import { Router } from "express";
import { getSystemHealth } from "../controllers/systemHealth.controller.js";

const router = Router();

router.get("/", getSystemHealth);

export default router;
