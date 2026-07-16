import { getDeploymentOverview } from "../deployment/deploymentOverview.service.js";

export const deploymentOverview = async (req, res) => {
  try {
    const { project } = req.params;

    const overview = getDeploymentOverview(project);

    return res.status(200).json({
      success: true,
      ...overview,
    });
  } catch (error) {
    console.error(error);

    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};
