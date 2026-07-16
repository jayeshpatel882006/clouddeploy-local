import { getDeploymentArtifacts } from "../../manifests/manifestReader.service.js";

export const getDeploymentDetails = async (req, res) => {
  try {
    const { project } = req.params;

    const artifacts = getDeploymentArtifacts(project);

    return res.status(200).json({
      success: true,
      deployment: artifacts,
    });
  } catch (error) {
    console.error(error);

    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};
