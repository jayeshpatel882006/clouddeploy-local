export const systemHealth = {
  lastChecked: null,

  docker: {
    status: "UNKNOWN",
    running: false,
    message: "Waiting for first health check...",
  },

  kubernetes: {
    status: "UNKNOWN",
    running: false,
    message: "Waiting for first health check...",
  },

  registry: {
    status: "UNKNOWN",
    running: false,
    message: "Waiting for first health check...",
  },
};
