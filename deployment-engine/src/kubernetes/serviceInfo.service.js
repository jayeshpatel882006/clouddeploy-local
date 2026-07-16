import { coreApi } from "./kubernetes.client.js";

export const getServiceInfo = async (serviceName, namespace = "default") => {
  const service = await coreApi.readNamespacedService({
    name: serviceName,
    namespace,
  });

  const nodePort = service.spec.ports[0].nodePort;

  return {
    nodePort,
    previewUrl: `http://localhost:${nodePort}`,
  };
};
