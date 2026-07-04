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

export const deploymentService = async (deployment) => {
  const clonedRepository = await cloneRepository(
    deployment.repositoryUrl,
    deployment.branch,
  );
  try {
    const project = detectNodeProject(clonedRepository.path);

    return {
      success: true,
      project,
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
    status: "Node Project Detected",
    repository: clonedRepository,
    project: projectInfo,
  };
};
