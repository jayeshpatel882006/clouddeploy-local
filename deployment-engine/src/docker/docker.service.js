import fs from "fs";
import path from "path";

export const detectDockerfile = (projectPath) => {
  const dockerfilePath = path.join(projectPath, "Dockerfile");

  if (fs.existsSync(dockerfilePath)) {
    return {
      exists: true,
      path: dockerfilePath,
    };
  }

  return {
    exists: false,
    path: null,
  };
};
