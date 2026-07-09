import { systemHealth } from "../monitor/health.cache.js";

export const getSystemHealth = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      health: systemHealth,
    });
  } catch (error) {
    next(error);
  }
};
