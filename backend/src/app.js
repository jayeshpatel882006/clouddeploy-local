import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";

import routes from "./routes/index.js";
import errorHandler from "./middleware/errorHandler.js";
import notFound from "./middleware/notFound.js";
import { apiLimiter } from "./middleware/rateLimiter.js";
import ApiResponse from "./utils/ApiResponse.js";

const app = express();

/* ─── Middleware ─────────────────────────────── */
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(morgan("combined"));
app.use("/api", apiLimiter);

/* ─── Routes ────────────────────────────────── */
app.get("/health", (req, res) => {
  return new ApiResponse(200, null, "CloudDeploy API is running").send(res);
});

app.get("/ready", async (req, res) => {
  try {
    const mongoose = (await import("mongoose")).default;
    const dbState = mongoose.connection.readyState;
    const isReady = dbState === 1;

    return res.status(isReady ? 200 : 503).json({
      success: isReady,
      message: isReady ? "API is ready" : "Database not connected",
      data: { database: dbState },
    });
  } catch {
    return res.status(503).json({ success: false, message: "Not ready" });
  }
});

app.use("/api", routes);

/* ─── Error Handling ────────────────────────── */
app.use(notFound);
app.use(errorHandler);

export default app;
