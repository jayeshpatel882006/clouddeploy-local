import { coreApi } from "../kubernetes/kubernetes.client.js";

const detectLogLevel = (message) => {
  const text = message.toLowerCase();

  if (
    text.includes("error") ||
    text.includes("exception") ||
    text.includes("failed")
  ) {
    return "ERROR";
  }

  if (text.includes("warn") || text.includes("warning")) {
    return "WARN";
  }

  if (text.includes("debug")) {
    return "DEBUG";
  }

  return "INFO";
};

const formatDisplayTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
};

export const getPodLogs = async (podName, namespace = "default") => {
  try {
    const response = await coreApi.readNamespacedPodLog({
      name: podName,
      namespace,
      timestamps: true,
      tailLines: 500,
    });

    let errors = 0;
    let warnings = 0;
    let info = 0;
    let debug = 0;

    const logs = response
      .split("\n")
      .filter((line) => line.trim() !== "")
      .map((line, index) => {
        const firstSpace = line.indexOf(" ");

        const timestamp =
          firstSpace !== -1 ? line.substring(0, firstSpace) : "";

        const message =
          firstSpace !== -1 ? line.substring(firstSpace + 1) : line;

        if (!message.trim()) return null;

        const level = detectLogLevel(message);

        switch (level) {
          case "ERROR":
            errors++;
            break;

          case "WARN":
            warnings++;
            break;

          case "DEBUG":
            debug++;
            break;

          default:
            info++;
        }

        return {
          id: index + 1,

          timestamp,

          displayTime: formatDisplayTime(timestamp),

          level,

          message,
        };
      })
      .filter(Boolean);

    return {
      podName,

      summary: {
        totalLogs: logs.length,
        errors,
        warnings,
        info,
        debug,
      },

      logs,
    };
  } catch (error) {
    console.error("Error fetching pod logs:", error);

    throw new Error(`Unable to fetch logs for pod '${podName}'.`);
  }
};
