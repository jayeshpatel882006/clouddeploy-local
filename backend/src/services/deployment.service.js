import DeploymentHistory from "../models/DeploymentHistory.js";
import { deployApplication } from "../engine/deployment.engine.js";

const createDeploymentService = async (deploymentData) => {
  const { applicationName, dockerImage, containerPort } = deploymentData;

  if (!applicationName || !dockerImage || !containerPort) {
    throw new Error("Required fields are missing.");
  }

  const deployment = await DeploymentHistory.create({
    ...deploymentData,
    status: "Pending",
  });

  const engineResponse = await deployApplication(deployment);

  return {
    deploymentId: deployment._id,
    engine: engineResponse,
  };
};

const getDeploymentsService = async (query = {}) => {
  const filter = {};

  if (query.status) {
    filter.status = query.status;
  }

  if (query.namespace) {
    filter.namespace = query.namespace;
  }

  const deployments = await DeploymentHistory.find(filter)
    .sort({ createdAt: -1 })
    .lean();

  return deployments;
};

export { createDeploymentService, getDeploymentsService };
