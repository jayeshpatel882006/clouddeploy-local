import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import deleteRoutes from "./routes/delete.routes.js";
import deploymentRoutes from "./routes/deployment.routes.js";
import registryRoutes from "./routes/registry.routes.js";
import healthRoutes from "./routes/health.routes.js";
import deploymentDetailsRoutes from "./routes/deploymentDetails.routes.js";
import deploymentOverviewRoutes from "./routes/deploymentOverview.routes.js";
import manifestRoutes from "./routes/manifest.routes.js";
import kubernetesRoutes from "./routes/kubernetes.routes.js";

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    service: "Deployment Engine",
    status: "Healthy",
  });
});

app.use("/deploy", deploymentRoutes);
app.use("/delete", deleteRoutes);
app.use("/registry", registryRoutes);
app.use("/system/health", healthRoutes);
app.use("/deployment-details", deploymentDetailsRoutes);
app.use("/deployment-overview", deploymentOverviewRoutes);
app.use("/manifests", manifestRoutes);
app.use("/kubernetes", kubernetesRoutes);

export default app;
