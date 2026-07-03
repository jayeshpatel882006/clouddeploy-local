import { Router } from "express";
import { deployApplication } from "../controllers/deployment.controller.js";

const router = Router();

router.post("/", deployApplication);

export default router;
