import { getApplicationLogs } from "../services/logs.service.js";

export const logs = async (req, res) => {
  try {
    const { project } = req.params;

    const response = await getApplicationLogs(project);

    return res.status(200).json(response);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        "Unable to fetch application logs.",
    });
  }
};
