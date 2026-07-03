const getDashboardOverview = async () => {
  return {
    applications: 8,
    runningPods: 24,
    clusterStatus: "Healthy",
    cpuUsage: "32%",
    memoryUsage: "46%",
    deployments: [
      {
        id: 1,
        name: "Inventory API",
        status: "Running",
      },
      {
        id: 2,
        name: "Auth Service",
        status: "Running",
      },
      {
        id: 3,
        name: "Payment API",
        status: "Updating",
      },
    ],
  };
};

export { getDashboardOverview };
