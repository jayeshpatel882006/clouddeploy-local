import { Router } from "express";
import { getRegistry } from "../controllers/registry.controller.js";

const router = Router();

router.get("/", getRegistry);

export default router;
