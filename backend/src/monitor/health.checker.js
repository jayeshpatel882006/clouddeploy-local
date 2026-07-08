import { exec } from "child_process";
import { promisify } from "util";
import mongoose from "mongoose";

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

export const checkMongoDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return {
      status: "HEALTHY",
      running: true,
      message: "MongoDB is connected.",
      host: mongoose.connection.host,
      database: mongoose.connection.name,
    };
  }

  return {
    status: "UNHEALTHY",
    running: false,
    message: "MongoDB is not connected.",
    action: "Check MongoDB connection string and restart the backend.",
  };
};
