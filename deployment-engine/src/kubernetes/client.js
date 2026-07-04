import * as k8s from "@kubernetes/client-node";

const kubeConfig = new k8s.KubeConfig();

/*
Docker Desktop Kubernetes

Automatically reads

~/.kube/config
*/

kubeConfig.loadFromDefault();

const appsApi = kubeConfig.makeApiClient(k8s.AppsV1Api);

const coreApi = kubeConfig.makeApiClient(k8s.CoreV1Api);

export { appsApi, coreApi };
