import fs from "fs";
import path from "path";

export const detectDockerfile = (projectPath) => {
  const dockerfilePath = path.join(projectPath, "Dockerfile");

  return {
    exists: fs.existsSync(dockerfilePath),
    path: fs.existsSync(dockerfilePath) ? dockerfilePath : null,
  };
};

export const generateDockerfile = (projectPath) => {
  const dockerfilePath = path.join(projectPath, "Dockerfile");

  if (fs.existsSync(dockerfilePath)) {
    return dockerfilePath;
  }

  const dockerfileContent = `FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --omit=dev

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
`;

  fs.writeFileSync(dockerfilePath, dockerfileContent);

  return dockerfilePath;
};
