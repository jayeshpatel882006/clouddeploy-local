import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import routes from "./routes/index.js";
import errorHandler from "./middleware/errorHandler.js";
import notFound from "./middleware/notFound.js";
import ApiResponse from "./utils/ApiResponse.js";

const app = express();

/* ─── Middleware ─────────────────────────────── */
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

/* ─── Routes ────────────────────────────────── */
app.get("/health", (req, res) => {
  return new ApiResponse(200, null, "CloudDeploy API is running").send(res);
});

app.use("/api", routes);

/* ─── Error Handling ────────────────────────── */
app.use(notFound);
app.use(errorHandler);

export default app;
