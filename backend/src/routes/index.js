// ==========================================
// Route Index — MVP: Only deployment + internal routes active
// ==========================================

import { Router } from "express";

import deploymentRoutes from "./deployment.routes.js";
import internalRoutes from "./internal.routes.js";
import systemHealthRoutes from "./systemHealth.routes.js";
import registryRoutes from "./registry.routes.js";
import deploymentDetailsRoutes from "./deploymentDetails.routes.js";
import deploymentOverviewRoutes from "./deploymentOverview.routes.js";
import manifestRoutes from "./manifest.routes.js";
import kubernetesRoutes from "./kubernetes.routes.js";
import timelineRoutes from "./timeline.routes.js";

// ==========================================
// FUTURE PHASE
// Auth, Dashboard, Registry, Monitoring, Logging, Floci
// ==========================================
// import dashboardRoutes from "./dashboard.routes.js";
// import authRoutes from "./auth.routes.js";
// import registryRoutes from "./registry.routes.js";
// import monitoringRoutes from "./monitoring.routes.js";
// import loggingRoutes from "./logging.routes.js";
// import flociRoutes from "./floci.routes.js";

const router = Router();

// --- MVP Active Routes ---
router.use("/deployments", deploymentRoutes);
router.use("/internal", internalRoutes);
router.use("/system/health", systemHealthRoutes);
router.use("/registry", registryRoutes);
router.use("/deployment-details", deploymentDetailsRoutes);
router.use("/deployment-overview", deploymentOverviewRoutes);
router.use("/manifests", manifestRoutes);
router.use("/kubernetes", kubernetesRoutes);
router.use("/timeline", timelineRoutes);

// --- Future Routes ---
// router.use("/dashboard", dashboardRoutes);
// router.use("/auth", authRoutes);
// router.use("/registry", registryRoutes);
// router.use("/monitoring", monitoringRoutes);
// router.use("/logs", loggingRoutes);
// router.use("/floci", flociRoutes);

export default router;
