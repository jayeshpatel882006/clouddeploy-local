import { coreApi } from "./kubernetes.client.js";

export const getPodInfo = async (appName) => {
  const pods = await coreApi.listNamespacedPod({
    namespace: "default",
    labelSelector: `app=${appName}`,
  });

  return pods.items.map((pod) => ({
    name: pod.metadata.name,
    phase: pod.status.phase,

    node: pod.spec.nodeName,

    podIP: pod.status.podIP,

    startTime: pod.status.startTime,

    restartCount:
      pod.status.containerStatuses?.reduce(
        (sum, container) => sum + container.restartCount,
        0,
      ) || 0,

    ready:
      pod.status.containerStatuses?.every((container) => container.ready) ||
      false,

    containers: pod.spec.containers.map((container) => ({
      name: container.name,
      image: container.image,
    })),
  }));
};
