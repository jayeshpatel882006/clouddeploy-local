import express from "express";
import { getKubernetesInfo } from "../controllers/kubernetes.controller.js";

const router = express.Router();

router.get("/:project", getKubernetesInfo);

export default router;
