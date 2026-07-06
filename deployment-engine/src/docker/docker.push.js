import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export const pushDockerImage = async (
  imageName,
  imageTag = "latest",
  registry = "localhost:5000",
) => {
  try {
    const registryImage = `${registry}/${imageName}:${imageTag}`;

    await execAsync(`docker tag ${imageName}:${imageTag} ${registryImage}`);

    const { stdout, stderr } = await execAsync(`docker push ${registryImage}`);

    return {
      success: true,
      image: registryImage,
      stdout,
      stderr,
    };
  } catch (error) {
    throw new Error(`Failed to push Docker image.\n${error.message}`);
  }
};
