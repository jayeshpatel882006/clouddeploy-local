import { exec } from "child_process";
import { promisify } from "util";
import axios from "axios";
import * as k8s from "@kubernetes/client-node";

const execAsync = promisify(exec);

const kubeConfig = new k8s.KubeConfig();
kubeConfig.loadFromDefault();

const versionApi = kubeConfig.makeApiClient(k8s.VersionApi);
const coreApi = kubeConfig.makeApiClient(k8s.CoreV1Api);

const REGISTRY_URL = process.env.REGISTRY_URL || "http://localhost:5000";

// Docker
export const checkDocker = async () => {
  try {
    await execAsync("docker info");

    return {
      status: "HEALTHY",
      running: true,
      message: "Docker Engine is running.",
    };
  } catch {
    return {
      status: "UNHEALTHY",
      running: false,
      message: "Docker Engine is not running.",
      action: "Start Docker Desktop.",
    };
  }
};

// Kubernetes
export const checkKubernetes = async () => {
  try {
    const version = await versionApi.getCode();

    const nodes = await coreApi.listNode();

    const readyNodes = nodes.items.filter((node) =>
      node.status.conditions?.some(
        (condition) =>
          condition.type === "Ready" && condition.status === "True",
      ),
    ).length;

    return {
      status: "HEALTHY",
      running: true,
      message: "Kubernetes cluster is reachable.",
      version: version.gitVersion,
      nodes: nodes.items.length,
      readyNodes,
    };
  } catch {
    return {
      status: "UNHEALTHY",
      running: false,
      message: "Unable to connect to Kubernetes.",
      action: "Enable Kubernetes in Docker Desktop.",
    };
  }
};

// Registry
export const checkRegistry = async () => {
  try {
    await axios.get(`${REGISTRY_URL}/v2/`);

    return {
      status: "HEALTHY",
      running: true,
      message: "Container Registry is running.",
    };
  } catch {
    return {
      status: "UNHEALTHY",
      running: false,
      message: "Container Registry is unavailable.",
      action: "Start Docker Registry.",
    };
  }
};
