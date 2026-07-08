import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export const inspectImage = async (repository, tag) => {
  try {
    const imageName = `localhost:5000/${repository}:${tag}`;

    const { stdout } = await execAsync(`docker image inspect ${imageName}`);

    const image = JSON.parse(stdout)[0];

    return {
      image: imageName,
      imageId: image.Id,
      created: image.Created,
      size: image.Size,
    };
  } catch {
    return {
      image: `localhost:5000/${repository}:${tag}`,
      imageId: null,
      created: null,
      size: null,
    };
  }
};
