import Deployment from "../models/Deployment.js";

export const getDeploymentTimeline = async (projectName) => {
  const deployment = await Deployment.findOne({
    projectName,
  }).select("projectName status timeline");

  if (!deployment) {
    throw new Error("Deployment not found.");
  }

  return deployment;
};
