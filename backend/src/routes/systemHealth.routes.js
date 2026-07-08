import { Router } from "express";
import { getSystemHealthController } from "../controllers/systemHealth.controller.js";

const router = Router();

router.get("/", getSystemHealthController);

export default router;
