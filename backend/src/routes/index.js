import { Router } from "express";

import dashboardRoutes from "./dashboard.routes.js";
import deploymentRoutes from "./deployment.routes.js";

const router = Router();

router.use("/dashboard", dashboardRoutes);
router.use("/deployments", deploymentRoutes);

export default router;
