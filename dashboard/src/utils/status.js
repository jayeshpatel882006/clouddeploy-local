// ==========================================
// Deployment Status Utility
// Maps backend statuses to UI display config
// ==========================================

const STATUS_CONFIG = {
  REGISTERED: {
    label: "Registered",
    color: "blue",
    icon: "clock",
    order: 0,
  },
  CLONING: {
    label: "Cloning",
    color: "blue",
    icon: "refresh-cw",
    order: 1,
  },
  BUILDING: {
    label: "Building",
    color: "yellow",
    icon: "hard-drive",
    order: 2,
  },
  PUSHING: {
    label: "Pushing",
    color: "yellow",
    icon: "upload",
    order: 3,
  },
  DEPLOYING: {
    label: "Deploying",
    color: "purple",
    icon: "rocket",
    order: 4,
  },
  RUNNING: {
    label: "Running",
    color: "green",
    icon: "check-circle",
    order: 5,
  },
  FAILED: {
    label: "Failed",
    color: "red",
    icon: "alert-circle",
    order: 6,
  },
};

// ==========================================
// Helpers
// ==========================================

export const getStatusConfig = (status) => {
  return STATUS_CONFIG[status] || STATUS_CONFIG.FAILED;
};

export const isTerminalStatus = (status) => {
  return status === "RUNNING" || status === "FAILED";
};

export const isActiveStatus = (status) => {
  return !isTerminalStatus(status) && status !== "REGISTERED";
};

export const getStatusLabel = (status) => {
  return getStatusConfig(status).label;
};

export const STATUSES = Object.keys(STATUS_CONFIG);

export default STATUS_CONFIG;
