import { getApplicationLogs } from "../services/logs.service.js";

/**
 * GET /logs/:project
 */
export const getLogs = async (req, res) => {
  try {
    const { project } = req.params;

    const logs = await getApplicationLogs(project);

    return res.status(200).json(logs);
  } catch (error) {
    console.error("Error fetching application logs:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
