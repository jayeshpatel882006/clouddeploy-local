import { getDeploymentDetails } from "../services/deploymentDetails.service.js";

export const deploymentDetails = async (req, res) => {
  try {
    const { project } = req.params;

    const details = await getDeploymentDetails(project);

    return res.status(200).json(details);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch deployment details.",
    });
  }
};
