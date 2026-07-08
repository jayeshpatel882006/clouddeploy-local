import { systemHealth } from "../monitor/health.cache.js";

export const getSystemHealth = (req, res) => {
  res.json({
    success: true,
    health: systemHealth,
  });
};
