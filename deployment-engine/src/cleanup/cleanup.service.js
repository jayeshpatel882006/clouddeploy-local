import fs from "fs/promises";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export const cleanupDeployment = async ({ workspacePath, containerName }) => {
  const result = {};

  if (workspacePath) {
    await fs.rm(workspacePath, {
      recursive: true,
      force: true,
    });

    result.workspace = "Deleted";
  }

  if (containerName) {
    try {
      await execAsync(`docker rm -f ${containerName}`);
      result.container = "Deleted";
    } catch {
      result.container = "Already Removed";
    }
  }

  return result;
};
