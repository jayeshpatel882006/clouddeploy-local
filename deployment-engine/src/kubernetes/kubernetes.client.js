import * as k8s from "@kubernetes/client-node";

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

export const appsApi = kc.makeApiClient(k8s.AppsV1Api);

export const coreApi = kc.makeApiClient(k8s.CoreV1Api);

export const networkingApi = kc.makeApiClient(k8s.NetworkingV1Api);

export { kc };
