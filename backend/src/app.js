import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import routes from "./routes/index.js";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use("/api", routes);

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "CloudDeploy API is running",
  });
});

export default app;
