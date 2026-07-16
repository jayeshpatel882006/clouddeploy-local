import express from "express";
import { timeline } from "../controllers/timeline.controller.js";

const router = express.Router();

router.get("/:project", timeline);

export default router;
