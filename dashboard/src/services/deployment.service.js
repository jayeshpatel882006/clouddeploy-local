// ==========================================
// Deployment Service
// Transforms backend API data → UI component props
// ==========================================

const getRepoName = (repositoryUrl) => {
  try {
    return repositoryUrl.split("/").pop().replace(".git", "");
  } catch {
    return "unknown";
  }
};

const formatDate = (dateString) => {
  if (!dateString) return "—";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "—";
  }
};

const formatRelativeTime = (dateString) => {
  if (!dateString) return "—";

  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffSec < 60) return `${diffSec}s ago`;
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return date.toLocaleDateString();
};

// ==========================================
// Transform a backend deployment → UI deployment object
// ==========================================

export const transformDeployment = (dep) => {
  const name = dep.projectName || getRepoName(dep.repositoryUrl);

  return {
    id: dep._id,
    _id: dep._id,
    name,
    image: dep.image || dep.repositoryUrl || "—",
    repositoryUrl: dep.repositoryUrl || "",
    branch: dep.branch || "main",
    namespace: dep.namespace || "default",
    status: dep.status || "REGISTERED",
    replicas: dep.replicas || 1,
    readyReplicas: dep.readyReplicas ?? (dep.status === "RUNNING" ? 1 : 0),
    cpu: dep.cpu || "—",
    memory: dep.memory || "—",
    previewUrl: dep.previewUrl || null,
    projectName: dep.projectName || null,
    created: formatRelativeTime(dep.createdAt),
    createdAtFormatted: formatDate(dep.createdAt),
    updatedAtFormatted: formatDate(dep.updatedAt),
    sortDate: dep.createdAt ? new Date(dep.createdAt).getTime() : Date.now(),
    updated: formatRelativeTime(dep.updatedAt),
    port: dep.containerPort || 3000,
    env: dep.envCount || 0,
    labels: dep.labels || {},
    createdAt: dep.createdAt,
    updatedAt: dep.updatedAt,
  };
};

// ==========================================
// Transform an array of backend deployments
// ==========================================

export const transformDeployments = (deployments = []) => {
  return deployments.map(transformDeployment);
};

// ==========================================
// Calculate dashboard stats from deployments
// ==========================================

export const calculateStats = (deployments = []) => {
  const total = deployments.length;
  const running = deployments.filter((d) => d.status === "RUNNING").length;
  const failed = deployments.filter((d) => d.status === "FAILED").length;
  const building = deployments.filter(
    (d) => d.status === "BUILDING" || d.status === "PUSHING" || d.status === "DEPLOYING" || d.status === "CLONING",
  ).length;
  const pending = deployments.filter((d) => d.status === "REGISTERED").length;

  return { total, running, failed, building, pending };
};
