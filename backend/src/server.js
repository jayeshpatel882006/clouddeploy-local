import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/database.js";
import logger from "./utils/logger.js";

dotenv.config();

/* ─── Environment Validation ─────────────────── */

const REQUIRED_ENV_VARS = ["MONGODB_URI", "JWT_SECRET"];

const validateEnvironment = () => {
  const missing = REQUIRED_ENV_VARS.filter((v) => !process.env[v]);

  if (missing.length > 0) {
    logger.warn(
      `Missing required environment variables: ${missing.join(", ")}`,
    );

    if (process.env.NODE_ENV === "production") {
      process.exit(1);
    } else {
      logger.warn("Running in development mode with defaults");
    }
  }
};

/* ─── Server Start ───────────────────────────── */

const PORT = process.env.PORT || 5001;
let server;

const startServer = async () => {
  validateEnvironment();

  await connectDB();

  server = app.listen(PORT, () => {
    logger.info(`🚀 CloudDeploy API running on port ${PORT}`);
    logger.info(`📚 API Docs: http://localhost:${PORT}/api/docs`);
  });
};

/* ─── Graceful Shutdown ──────────────────────── */

const shutdown = async (signal) => {
  logger.info(`${signal} received. Shutting down gracefully...`);

  server.close(() => {
    logger.info("HTTP server closed");
    process.exit(0);
  });

  // Force shutdown after 10s
  setTimeout(() => {
    logger.error("Forced shutdown after timeout");
    process.exit(1);
  }, 10000);
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

process.on("uncaughtException", (err) => {
  logger.error("Uncaught exception", {
    message: err.message,
    stack: err.stack,
  });
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled rejection", { reason });
  process.exit(1);
});

startServer();
