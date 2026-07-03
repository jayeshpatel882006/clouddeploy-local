import { Router } from "express";
import {
  createDeployment,
  getDeployments,
} from "../controllers/deployment.controller.js";

const router = Router();

router.post("/", createDeployment);
router.get("/", getDeployments);

export default router;
