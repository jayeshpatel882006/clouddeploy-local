import crypto from "crypto";

export const createDeploymentMetadata = ({ appName, image, repository }) => {
  const deploymentId = crypto.randomUUID();

  return {
    deploymentId,

    appName,

    image,

    repository,

    status: "READY_FOR_DEPLOYMENT",

    createdAt: new Date().toISOString(),
  };
};
