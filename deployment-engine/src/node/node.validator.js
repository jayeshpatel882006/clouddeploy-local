export const validatePackageJson = (packageJson) => {
  if (!packageJson) {
    throw new Error("package.json is missing.");
  }

  if (!packageJson.name) {
    throw new Error("Project name is missing in package.json.");
  }

  if (!packageJson.scripts) {
    throw new Error("Scripts section is missing in package.json.");
  }

  if (!packageJson.scripts.start) {
    throw new Error("Start script is missing in package.json.");
  }

  return true;
};
