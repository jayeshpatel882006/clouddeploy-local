// ==========================================
// FUTURE PHASE
// Registry Module
// ==========================================

// import { Router } from "express";
// import {
//   listImages,
//   getTags,
//   deleteImage,
//   syncImages,
// } from "../controllers/registry.controller.js";
// import { authenticate } from "../middleware/auth.js";

// const router = Router();

// router.get("/", authenticate, listImages);
// router.get("/sync", authenticate, syncImages);
// router.get("/:name/tags", authenticate, getTags);
// router.delete("/:id", authenticate, deleteImage);

// export default router;
import { Router } from "express";
import { getRegistry } from "../controllers/registry.controller.js";

const router = Router();

router.get("/", getRegistry);

export default router;
