import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

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
      action: "Start Docker Desktop and wait until Docker Engine starts.",
    };
  }
};
