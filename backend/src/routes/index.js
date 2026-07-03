import { Router } from "express";

import dashboardRoutes from "./dashboard.routes.js";

const router = Router();

router.use("/dashboard", dashboardRoutes);

export default router;
