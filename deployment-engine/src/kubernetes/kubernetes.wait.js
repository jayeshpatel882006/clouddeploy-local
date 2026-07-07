import * as k8s from "@kubernetes/client-node";

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const appsApi = kc.makeApiClient(k8s.AppsV1Api);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const waitForDeployment = async (
  deploymentName,
  namespace = "default",
  timeout = 120000,
) => {
  const start = Date.now();

  while (Date.now() - start < timeout) {
    const response = await appsApi.readNamespacedDeployment({
      name: deploymentName,
      namespace,
    });

    const deployment = response;

    const desired = deployment.spec?.replicas ?? 1;

    const available = deployment.status?.availableReplicas ?? 0;

    if (available >= desired) {
      return {
        success: true,
        deployment: deployment.metadata.name,
        replicas: available,
        desired,
        status: "RUNNING",
      };
    }

    await sleep(3000);
  }

  throw new Error("Deployment timed out while waiting for Ready state.");
};
