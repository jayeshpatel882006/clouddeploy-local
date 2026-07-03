import { getDashboardOverview } from "../services/dashboard.service.js";

const getDashboard = async (req, res) => {
  try {
    const data = await getDashboardOverview();

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export { getDashboard };
