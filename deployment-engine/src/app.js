import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import deleteRoutes from "./routes/delete.routes.js";
import deploymentRoutes from "./routes/deployment.routes.js";
import registryRoutes from "./routes/registry.routes.js";
import healthRoutes from "./routes/health.routes.js";

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

export default app;
