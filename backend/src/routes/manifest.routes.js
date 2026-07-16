import express from "express";

import { manifests, manifest } from "../controllers/manifest.controller.js";

const router = express.Router();

/**
 * List manifest files.
 */
router.get("/:project", manifests);

/**
 * Read one manifest.
 */
router.get("/:project/:file", manifest);

export default router;
