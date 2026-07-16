import * as k8s from "@kubernetes/client-node";

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const appsApi = kc.makeApiClient(k8s.AppsV1Api);
const coreApi = kc.makeApiClient(k8s.CoreV1Api);

export const deleteDeployment = async (appName, namespace = "default") => {
  console.log("Deleting Deployment");
  console.log("appName:", appName);
  console.log("namespace:", namespace);
  await appsApi.deleteNamespacedDeployment({
    name: appName,
    namespace,
  });

  return {
    success: true,
    message: "Deployment deleted",
  };
};

export const deleteService = async (appName, namespace = "default") => {
  await coreApi.deleteNamespacedService({
    name: appName,
    namespace,
  });

  return {
    success: true,
    message: "Service deleted",
  };
};
