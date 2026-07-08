import { systemHealth } from "./health.cache.js";
import { checkDocker } from "./health.checker.js";

export const startHealthMonitor = () => {
  const refresh = async () => {
    console.log("🔄 Updating system health...");

    systemHealth.docker = await checkDocker();
    systemHealth.lastChecked = new Date().toISOString();
  };

  refresh();

  setInterval(refresh, 10000);
};
