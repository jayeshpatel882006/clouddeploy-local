import { systemHealth } from "./health.cache.js";

import { checkMongoDB } from "./health.checker.js";

import { fetchDeploymentEngineHealth } from "../services/systemHealth.service.js";

export const startHealthMonitor = () => {
  const refresh = async () => {
    console.log("🔄 Updating system health...");

    try {
      const deploymentEngine = await fetchDeploymentEngineHealth();

      systemHealth.docker = deploymentEngine.docker;

      systemHealth.kubernetes = deploymentEngine.kubernetes;

      systemHealth.registry = deploymentEngine.registry;
    } catch {
      systemHealth.docker = {
        status: "UNHEALTHY",
        running: false,
        message: "Waiting for first health check....",
      };

      systemHealth.kubernetes = {
        status: "UNHEALTHY",
        running: false,
        message: "Waiting for first health check....",
      };

      systemHealth.registry = {
        status: "UNHEALTHY",
        running: false,
        message: "Waiting for first health check....",
      };
    }

    systemHealth.mongodb = await checkMongoDB();

    systemHealth.lastChecked = new Date().toISOString();
  };

  refresh();

  // setInterval(refresh, 10000);
};
