import { coreApi } from "./client.js";

const createService = async (manifest) => {
  return await coreApi.createNamespacedService({
    namespace: manifest.metadata.namespace,

    body: manifest,
  });
};

export { createService };
