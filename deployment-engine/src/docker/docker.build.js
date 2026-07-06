import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export const buildDockerImage = async (
  projectPath,
  imageName,
  imageTag = "latest",
) => {
  try {
    const command = `docker build -t ${imageName}:${imageTag} .`;

    const { stdout, stderr } = await execAsync(command, {
      cwd: projectPath,
    });

    return {
      success: true,
      image: `${imageName}:${imageTag}`,
      stdout,
      stderr,
    };
  } catch (error) {
    throw new Error(
      `Docker build failed.(might be the docker is not running)\n${error.message}`,
    );
  }
};
