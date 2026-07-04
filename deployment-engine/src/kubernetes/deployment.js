import { appsApi } from "./client.js";

const createDeployment = async (manifest) => {
  return await appsApi.createNamespacedDeployment({
    namespace: manifest.metadata.namespace,

    body: manifest,
  });
};

export { createDeployment };
