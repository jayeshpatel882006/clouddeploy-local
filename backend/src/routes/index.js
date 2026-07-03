import { Router } from "express";

import dashboardRoutes from "./dashboard.routes.js";
import deploymentRoutes from "./deployment.routes.js";
import authRoutes from "./auth.routes.js";
import registryRoutes from "./registry.routes.js";
import monitoringRoutes from "./monitoring.routes.js";
import loggingRoutes from "./logging.routes.js";
import flociRoutes from "./floci.routes.js";

const router = Router();

router.use("/dashboard", dashboardRoutes);
router.use("/deployments", deploymentRoutes);
router.use("/auth", authRoutes);
router.use("/registry", registryRoutes);
router.use("/monitoring", monitoringRoutes);
router.use("/logs", loggingRoutes);
router.use("/floci", flociRoutes);

export default router;
