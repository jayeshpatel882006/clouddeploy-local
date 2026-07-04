import fs from "fs";
import path from "path";
import { validatePackageJson } from "./node.validator.js";

export const detectNodeProject = (repositoryPath) => {
  const packageJsonPath = path.join(repositoryPath, "package.json");

  if (!fs.existsSync(packageJsonPath)) {
    throw new Error("package.json not found. This is not a Node.js project.");
  }

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
  validatePackageJson(packageJson);

  return {
    projectName: packageJson.name,
    version: packageJson.version,
    hasStartScript: !!packageJson.scripts?.start,
    hasBuildScript: !!packageJson.scripts?.build,
    packageManager: "npm",
  };
};
