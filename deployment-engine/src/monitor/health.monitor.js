import { systemHealth } from "./health.cache.js";

import {
  checkDocker,
  checkKubernetes,
  checkRegistry,
} from "./health.service.js";

export const startHealthMonitor = () => {
  const refresh = async () => {
    console.log("🔄 Updating Deployment Engine Health...");

    systemHealth.docker = await checkDocker();

    systemHealth.kubernetes = await checkKubernetes();

    systemHealth.registry = await checkRegistry();

    systemHealth.lastChecked = new Date().toISOString();
  };

  refresh();

  //   setInterval(refresh, 10000);
};
