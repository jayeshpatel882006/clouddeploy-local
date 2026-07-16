import { getPodInfo } from "../kubernetes/podInfo.service.js";
import { getPodLogs } from "../logs/kubernetesLogs.service.js";

/**
 * Get application logs using project name.
 *
 * Flow:
 * Project Name
 *      ↓
 * Find Running Pod
 *      ↓
 * Read Pod Logs
 */
export const getApplicationLogs = async (
  projectName,
  namespace = "default",
) => {
  // Get all pods for this application
  const pods = await getPodInfo(projectName);

  if (!pods.length) {
    throw new Error(`No pods found for '${projectName}'.`);
  }

  // Prefer a running & ready pod
  const runningPod =
    pods.find((pod) => pod.phase === "Running" && pod.ready) || pods[0];

  const podLogs = await getPodLogs(runningPod.name, namespace);

  return {
    success: true,

    project: projectName,

    pod: {
      name: runningPod.name,
      phase: runningPod.phase,
      ready: runningPod.ready,
      restartCount: runningPod.restartCount,
    },

    summary: podLogs.summary,

    logs: podLogs.logs,
  };
};
