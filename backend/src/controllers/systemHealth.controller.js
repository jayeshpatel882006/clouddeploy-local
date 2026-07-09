// import { systemHealth } from "../monitor/health.cache.js";

// export const getSystemHealth = (req, res) => {
//   res.json({
//     success: true,
//     health: systemHealth,
//   });
// };
// import { fetchDeploymentEngineHealth } from "../services/systemHealth.service.js";
import { systemHealth } from "../monitor/health.cache.js";
import { startHealthMonitor } from "../monitor/health.monitor.js";

export const getSystemHealth = async (req, res, next) => {
  startHealthMonitor();
  try {
    // const health = await fetchDeploymentEngineHealth();
    const health = systemHealth;

    res.json({
      success: true,
      health,
    });
  } catch (error) {
    next(error);
  }
};
