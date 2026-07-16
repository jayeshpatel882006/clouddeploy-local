import { getDeploymentArtifacts } from "../../manifests/manifestReader.service.js";

export const getDeploymentOverview = (project) => {
  const artifacts = getDeploymentArtifacts(project);

  const metadata = artifacts.metadata;

  if (!metadata) {
    throw new Error("Deployment metadata not found.");
  }

  const imageParts = metadata.image.split(":");

  return {
    overview: {
      projectName: metadata.projectName,
      status: "RUNNING",
      previewUrl: metadata.previewUrl,
      deployedAt: metadata.deployedAt,
    },

    repository: {
      url: metadata.repositoryUrl,
      branch: metadata.branch,
    },

    image: {
      repository: imageParts[0],
      tag: metadata.imageTag,
      fullImage: metadata.image,
    },

    network: {
      containerPort: metadata.containerPort,
      servicePort: metadata.servicePort,
    },
  };
};
