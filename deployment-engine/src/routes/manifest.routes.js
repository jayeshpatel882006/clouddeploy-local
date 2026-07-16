import express from "express";

import {
  getManifests,
  getManifest,
} from "../controllers/manifest.controller.js";

const router = express.Router();

/**
 * List all manifest files
 */
router.get("/:project", getManifests);

/**
 * Read a single manifest
 */
router.get("/:project/:file", getManifest);

export default router;
