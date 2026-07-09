// import { exec } from "child_process";
// import { promisify } from "util";

// const execAsync = promisify(exec);

import axios from "axios";

const DEPLOYMENT_ENGINE_URL =
  process.env.DEPLOYMENT_ENGINE_URL || "http://localhost:6000";

export const fetchDeploymentEngineHealth = async () => {
  const { data } = await axios.get(`${DEPLOYMENT_ENGINE_URL}/system/health`);

  return data.health;
};

// export const getSystemHealth = async () => {
//   const health = {};

//   try {
//     await execAsync("docker info");

//     health.docker = {
//       status: "HEALTHY",
//       running: true,
//       message: "Docker Engine is running.",
//     };
//   } catch (error) {
//     health.docker = {
//       status: "UNHEALTHY",
//       running: false,
//       message: "Docker Engine is not running.",
//       action: "Start Docker Desktop and wait until Docker Engine is running.",
//     };
//   }

// return health;
//};
