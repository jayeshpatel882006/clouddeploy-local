import { Router } from "express";
import { createDeployment } from "../controllers/deployment.controller.js";

const router = Router();

router.post("/", createDeployment);

export default router;
