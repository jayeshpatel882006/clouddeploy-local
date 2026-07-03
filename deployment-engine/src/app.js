import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import deploymentRoutes from "./routes/deployment.routes.js";

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

export default app;
