import * as k8s from "@kubernetes/client-node";

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const coreApi = kc.makeApiClient(k8s.CoreV1Api);

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
