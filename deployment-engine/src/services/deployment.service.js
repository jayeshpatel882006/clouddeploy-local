import { v4 as uuid } from "uuid";
import { generateDeploymentManifest } from "../manifests/deployment.manifest.js";
import { generateServiceManifest } from "../manifests/service.manifest.js";

const deploymentService = async (deployment) => {
  console.log("\n==============================");
  console.log("🚀 Deployment Request");
  console.log("==============================");
  const deploymentManifest = generateDeploymentManifest(deployment);

  const serviceManifest = generateServiceManifest(deployment);

  console.table(deployment);
  console.log("\nDeployment Manifest");

  console.dir(deploymentManifest, {
    depth: null,
  });

  console.log("\nService Manifest");

  console.dir(serviceManifest, {
    depth: null,
  });

  return {
    success: true,

    deploymentId: uuid(),

    status: "Pending",

    deploymentManifest,

    serviceManifest,
  };
};

export { deploymentService };
