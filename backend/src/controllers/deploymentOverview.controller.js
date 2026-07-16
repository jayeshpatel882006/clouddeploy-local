import { getDeploymentOverview } from "../services/deploymentOverview.service.js";

export const deploymentOverview = async (req, res) => {
  try {
    const { project } = req.params;

    const overview = await getDeploymentOverview(project);

    return res.status(200).json(overview);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch deployment overview.",
    });
  }
};
