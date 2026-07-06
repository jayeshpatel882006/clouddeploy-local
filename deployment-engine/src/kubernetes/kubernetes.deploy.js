import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export const deployManifest = async (manifestPath) => {
  try {
    const { stdout, stderr } = await execAsync(
      `kubectl apply -f "${manifestPath}"`,
    );

    return {
      success: true,
      stdout,
      stderr,
    };
  } catch (error) {
    throw new Error(`Kubernetes deployment failed.\n${error.message}`);
  }
};
