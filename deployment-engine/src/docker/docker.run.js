import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export const runDockerContainer = async (
  imageName,
  imageTag = "latest",
  containerPort = 3000,
) => {
  try {
    const containerName = `${imageName}-${Date.now()}`;

    const command = `docker run -d --name ${containerName} -p ${containerPort}:${containerPort} ${imageName}:${imageTag}`;

    const { stdout } = await execAsync(command);

    return {
      success: true,
      containerId: stdout.trim(),
      containerName,
      image: `${imageName}:${imageTag}`,
      port: containerPort,
    };
  } catch (error) {
    throw new Error(`Failed to run Docker container.\n${error.message}`);
  }
};
