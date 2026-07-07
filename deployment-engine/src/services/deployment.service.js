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
import fs from "fs/promises";
import { cloneRepository } from "../git/git.service.js";
import { detectNodeProject } from "../node/node.service.js";
import { installDependencies } from "../node/npm.service.js";
import {
  detectDockerfile,
  generateDockerfile,
} from "../docker/docker.service.js";
import { buildDockerImage } from "../docker/docker.build.js";
import { runDockerContainer } from "../docker/docker.run.js";
import { pushDockerImage } from "../docker/docker.push.js";
import { checkHealth } from "../health/health.service.js";
import { generateDeploymentManifest } from "../kubernetes/manifest.service.js";
import { generateImageTag } from "../utils/imageTag.js";
import { createDeploymentMetadata } from "../deployment/deploymentMetadata.service.js";
import { generateServiceManifest } from "../kubernetes/serviceManifest.service.js";
import { deployManifest } from "../kubernetes/kubernetes.deploy.js";
import { waitForDeployment } from "../kubernetes/kubernetes.wait.js";
import { cleanupDeployment } from "../cleanup/cleanup.service.js";

export const deploymentService = async (deployment) => {
  // ==========================================================
  // STEP 1 : Clone Repository
  // ==========================================================
  const clonedRepository = await cloneRepository(
    deployment.repositoryUrl,
    deployment.branch,
  );

  try {
    // ==========================================================
    // STEP 2 : Detect Node.js Project
    // ==========================================================
    const project = detectNodeProject(clonedRepository.path);

    // ==========================================================
    // STEP 3 : Install Dependencies (Paused)
    // ==========================================================
    // const npmResult = await installDependencies(clonedRepository.path);

    // ==========================================================
    // STEP 4 : Detect / Generate Dockerfile
    // ==========================================================
    let dockerInfo = detectDockerfile(clonedRepository.path);

    if (!dockerInfo.exists) {
      const dockerfilePath = generateDockerfile(clonedRepository.path);

      dockerInfo = {
        exists: true,
        generated: true,
        path: dockerfilePath,
      };
    }

    // ==========================================================
    // STEP 5 : Generate Image Tag
    // ==========================================================
    const imageName = project.projectName.toLowerCase();
    const imageTag = generateImageTag();

    // ==========================================================
    // STEP 6 : Build Docker Image
    // ==========================================================
    const dockerBuild = await buildDockerImage(
      clonedRepository.path,
      imageName,
      imageTag,
    );

    // ==========================================================
    // STEP 7 : Run Docker Container (Paused)
    // ==========================================================
    // Running it now makes no sense because
    // Docker build already verifies the image.
    // We'll enable it before Kubernetes deployment.

    // const container = await runDockerContainer(
    //   imageName,
    //   imageTag,
    //   3000
    // );

    // ==========================================================
    // STEP 8 : Health Check (Paused)
    // ==========================================================
    // We'll enable this once every supported application
    // exposes a standard /health endpoint.

    // const health = await checkHealth(3000);

    // ==========================================================
    // STEP 9 : Push Image to Local Registry
    // ==========================================================
    const pushedImage = await pushDockerImage(imageName, imageTag);

    // ==========================================================
    // STEP 10 : Generate Kubernetes Deployment Manifest
    // ==========================================================
    const deploymentManifest = generateDeploymentManifest({
      appName: imageName,
      image: pushedImage.image,
      containerPort: 3000,
      replicas: 1,
    });
    const kubernetesDeployment = await deployManifest(deploymentManifest);
    const deploymentMetadata = createDeploymentMetadata({
      appName: imageName,
      image: pushedImage.image,
      repository: deployment.repositoryUrl,
    });
    const serviceManifest = generateServiceManifest({
      appName: imageName,
      containerPort: 3000,
      servicePort: 80,
    });
    const kubernetesService = await deployManifest(serviceManifest);

    const deploymentStatus = await waitForDeployment(imageName);

    const cleanup = await cleanupDeployment({
      workspacePath: clonedRepository.path,

      // Uncomment when validation container is enabled again
      // containerName: container.containerName,
    });

    // ==========================================================
    // SUCCESS RESPONSE
    // ==========================================================
    return {
      success: true,
      status: deploymentStatus.status,
      deploymentStatus,

      project,
      repository: clonedRepository,

      // install: npmResult,

      docker: dockerInfo,
      image: dockerBuild,

      // container,
      // health,

      registry: pushedImage,
      deploymentManifest,
      deployment: deploymentMetadata,
      serviceManifest,
      service: kubernetesService,
      deployment: kubernetesDeployment,
      cleanup,
    };
  } catch (error) {
    // ==========================================================
    // CLEANUP
    // ==========================================================
    // Delete cloned repository if any step fails.

    await fs.rm(clonedRepository.path, {
      recursive: true,
      force: true,
    });

    throw error;
  }
};
