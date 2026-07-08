import { getSystemHealth } from "../services/systemHealth.service.js";

export const getSystemHealthController = async (req, res, next) => {
  try {
    const health = await getSystemHealth();

    res.json({
      success: true,
      ...health,
    });
  } catch (error) {
    next(error);
  }
};
