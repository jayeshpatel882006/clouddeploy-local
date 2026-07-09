import fs from "fs";
import path from "path";

export const getManifestDirectory = (projectName) => {
  const manifestRoot = path.join(process.cwd(), "manifests");

  if (!fs.existsSync(manifestRoot)) {
    fs.mkdirSync(manifestRoot);
  }

  const projectFolder = path.join(manifestRoot, projectName);

  if (!fs.existsSync(projectFolder)) {
    fs.mkdirSync(projectFolder);
  }

  return projectFolder;
};
