import { appsApi } from "./kubernetes.client.js";

export const getDeploymentInfo = async (deploymentName) => {
  try {
    const deployment = await appsApi.readNamespacedDeployment({
      name: deploymentName,
      namespace: "default",
    });

    return {
      name: deployment.metadata.name,
      namespace: deployment.metadata.namespace,

      replicas: deployment.spec.replicas,

      readyReplicas: deployment.status.readyReplicas ?? 0,

      availableReplicas: deployment.status.availableReplicas ?? 0,

      updatedReplicas: deployment.status.updatedReplicas ?? 0,

      observedGeneration: deployment.status.observedGeneration,

      createdAt: deployment.metadata.creationTimestamp,

      strategy: deployment.spec.strategy?.type ?? "RollingUpdate",
    };
  } catch (error) {
    console.error(
      `Error fetching deployment info for ${deploymentName}:`,
      error,
    );

    throw new Error(`Deployment '${deploymentName}' not found.`);
  }
};
