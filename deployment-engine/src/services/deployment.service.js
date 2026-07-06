// import { v4 as uuid } from "uuid";
// import { generateDeploymentManifest } from "../manifests/deployment.manifest.js";
// import { generateServiceManifest } from "../manifests/service.manifest.js";
// import { createDeployment } from "../kubernetes/deployment.js";
// import { createService } from "../kubernetes/service.js";
// const deploymentService = async (deployment) => {
//   console.log("\n==============================");
//   console.log("🚀 Deployment Request");
//   console.log("==============================");
//   const deploymentManifest = generateDeploymentManifest(deployment);

//   const serviceManifest = generateServiceManifest(deployment);

//   //   console.table(deployment);
//   //   console.log("\nDeployment Manifest");

//   //   console.dir(deploymentManifest, {
//   //     depth: null,
//   //   });

//   //   console.log("\nService Manifest");

//   //   console.dir(serviceManifest, {
//   //     depth: null,
//   //   });
//   await createDeployment(deploymentManifest);

//   await createService(serviceManifest);

//   return {
//     success: true,

//     deploymentId: uuid(),

//     status: "Pending",

//     deploymentManifest,

//     serviceManifest,
//   };
// };

// export { deploymentService };

import { cloneRepository } from "../git/git.service.js";
import { detectNodeProject } from "../node/node.service.js";
import fs from "fs/promises";
import { installDependencies } from "../node/npm.service.js";
import { buildDockerImage } from "../docker/docker.build.js";
import { runDockerContainer } from "../docker/docker.run.js";
import { checkHealth } from "../health/health.service.js";
import { pushDockerImage } from "../docker/docker.push.js";
import {
  detectDockerfile,
  generateDockerfile,
} from "../docker/docker.service.js";

export const deploymentService = async (deployment) => {
  const clonedRepository = await cloneRepository(
    deployment.repositoryUrl,
    deployment.branch,
  );
  try {
    const project = detectNodeProject(clonedRepository.path);
    // const npmResult = await installDependencies(clonedRepository.path);
    let dockerInfo = detectDockerfile(clonedRepository.path);

    if (!dockerInfo.exists) {
      const dockerfilePath = generateDockerfile(clonedRepository.path);

      dockerInfo = {
        exists: true,
        generated: true,
        path: dockerfilePath,
      };
    }

    const imageName = project.projectName.toLowerCase();

    const dockerBuild = await buildDockerImage(
      clonedRepository.path,
      imageName,
    );

    //Running it now make no sense bcz we know that our app can run
    // const container = await runDockerContainer(imageName, "latest", 3000);

    // const health = await checkHealth(3000); Paused for now because we are not have /helth endpoint in the project, we can add it later if needed
    const pushedImage = await pushDockerImage(imageName, "latest");
    return {
      success: true,
      project,
      status: "Project Ready",
      repository: clonedRepository,
      // install: npmResult,
      docker: dockerInfo,
      image: dockerBuild,
      // container,
      // health, Paused for now because we are not have /helth endpoint in the project, we can add it later if needed
      registry: pushedImage,
    };
  } catch (error) {
    // delete cloned folder
    await fs.rm(clonedRepository.path, {
      recursive: true,
      force: true,
    });

    throw error;
  }

  return {
    success: true,
    status: "Dependencies Installed",
    repository: clonedRepository,
    project: project,
    // install: npmResult,
  };
};
