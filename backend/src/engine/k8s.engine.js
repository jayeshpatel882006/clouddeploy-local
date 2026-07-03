import k8s from "@kubernetes/client-node";

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const coreApi = kc.makeApiClient(k8s.CoreV1Api);
const appsApi = kc.makeApiClient(k8s.AppsV1Api);

/* ─── Pods ─────────────────────────────────── */

const listPods = async (namespace = "default") => {
  try {
    const { body } = await coreApi.listNamespacedPod({ namespace });
    return {
      success: true,
      pods: body.items.map((pod) => ({
        name: pod.metadata.name,
        namespace: pod.metadata.namespace,
        status: pod.status.phase,
        node: pod.spec.nodeName,
        containers: pod.spec.containers.map((c) => c.name),
        createdAt: pod.metadata.creationTimestamp,
      })),
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/* ─── Deployments ──────────────────────────── */

const listDeployments = async (namespace = "default") => {
  try {
    const { body } = await appsApi.listNamespacedDeployment({ namespace });
    return {
      success: true,
      deployments: body.items.map((dep) => ({
        name: dep.metadata.name,
        namespace: dep.metadata.namespace,
        replicas: dep.spec.replicas,
        availableReplicas: dep.status.availableReplicas || 0,
        updatedReplicas: dep.status.updatedReplicas || 0,
        strategy: dep.spec.strategy.type,
        createdAt: dep.metadata.creationTimestamp,
      })),
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/* ─── Services ─────────────────────────────── */

const listServices = async (namespace = "default") => {
  try {
    const { body } = await coreApi.listNamespacedService({ namespace });
    return {
      success: true,
      services: body.items.map((svc) => ({
        name: svc.metadata.name,
        namespace: svc.metadata.namespace,
        type: svc.spec.type,
        clusterIP: svc.spec.clusterIP,
        ports: svc.spec.ports?.map((p) => ({
          port: p.port,
          targetPort: p.targetPort,
          protocol: p.protocol,
        })),
      })),
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/* ─── Create Deployment ────────────────────── */

const createDeployment = async (manifest) => {
  try {
    const { body } = await appsApi.createNamespacedDeployment({
      namespace: manifest.metadata.namespace || "default",
      body: manifest,
    });
    return {
      success: true,
      name: body.metadata.name,
      namespace: body.metadata.namespace,
      status: "Created",
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/* ─── Delete Deployment ────────────────────── */

const deleteDeployment = async (name, namespace = "default") => {
  try {
    await appsApi.deleteNamespacedDeployment({ name, namespace });
    return { success: true, name, namespace, status: "Deleted" };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/* ─── Scale Deployment ─────────────────────── */

const scaleDeployment = async (name, replicas, namespace = "default") => {
  try {
    const { body } = await appsApi.patchNamespacedDeploymentScale({
      name,
      namespace,
      body: { spec: { replicas } },
    });
    return {
      success: true,
      name: body.metadata.name,
      replicas: body.spec.replicas,
      status: "Scaled",
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export {
  listPods,
  listDeployments,
  listServices,
  createDeployment,
  deleteDeployment,
  scaleDeployment,
};
