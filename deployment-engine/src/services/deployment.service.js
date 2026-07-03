import { v4 as uuid } from "uuid";

const deploymentService = async (deployment) => {
  console.log("\n==============================");
  console.log("🚀 Deployment Request");
  console.log("==============================");

  console.table(deployment);

  return {
    success: true,
    deploymentId: uuid(),
    status: "Pending",
    message: "Deployment request accepted.",
  };
};

export { deploymentService };
