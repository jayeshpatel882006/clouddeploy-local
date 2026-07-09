import dotenv from "dotenv";
import app from "./app.js";
import { startHealthMonitor } from "./monitor/health.monitor.js";

dotenv.config();

const PORT = process.env.PORT || 6000;
startHealthMonitor();

app.listen(PORT, () => {
  console.log(`
=========================================
🚀 Deployment Engine Started

Port : ${PORT}

Status : Running
=========================================
`);
});
