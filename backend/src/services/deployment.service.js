// import DeploymentHistory from "../models/DeploymentHistory.js";
// import { deployApplication } from "../engine/deployment.engine.js";
// import ApiError from "../utils/ApiError.js";

// const createDeploymentService = async (deploymentData) => {
//   const { applicationName, dockerImage, containerPort } = deploymentData;

//   if (!applicationName || !dockerImage || !containerPort) {
//     throw ApiError.badRequest("Required fields are missing.");
//   }

//   const deployment = await DeploymentHistory.create({
//     ...deploymentData,
//     status: "Pending",
//   });

//   const engineResponse = await deployApplication(deployment);

//   return {
//     deploymentId: deployment._id,
//     engine: engineResponse,
//   };
// };

// const getDeploymentsService = async (query = {}) => {
//   const {
//     status,
//     namespace,
//     search,
//     page = 1,
//     limit = 10,
//     sortBy = "createdAt",
//     sortOrder = "desc",
//   } = query;

//   const filter = {};

//   if (status) {
//     filter.status = status;
//   }

//   if (namespace) {
//     filter.namespace = namespace;
//   }

//   if (search) {
//     filter.applicationName = { $regex: search, $options: "i" };
//   }

//   const pageNum = Math.max(1, parseInt(page, 10) || 1);
//   const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));
//   const skip = (pageNum - 1) * limitNum;

//   const sortDirection = sortOrder === "asc" ? 1 : -1;

//   const [deployments, total] = await Promise.all([
//     DeploymentHistory.find(filter)
//       .sort({ [sortBy]: sortDirection })
//       .skip(skip)
//       .limit(limitNum)
//       .lean(),
//     DeploymentHistory.countDocuments(filter),
//   ]);

//   return {
//     deployments,
//     pagination: {
//       page: pageNum,
//       limit: limitNum,
//       total,
//       totalPages: Math.ceil(total / limitNum),
//       hasNextPage: pageNum * limitNum < total,
//       hasPrevPage: pageNum > 1,
//     },
//   };
// };

// const getDeploymentByIdService = async (id) => {
//   const deployment = await DeploymentHistory.findById(id).lean();

//   if (!deployment) {
//     throw ApiError.notFound(`Deployment not found with id: ${id}`);
//   }

//   return deployment;
// };

// const updateDeploymentService = async (id, updateData) => {
//   const deployment = await DeploymentHistory.findByIdAndUpdate(
//     id,
//     { $set: updateData },
//     { new: true, runValidators: true },
//   ).lean();

//   if (!deployment) {
//     throw ApiError.notFound(`Deployment not found with id: ${id}`);
//   }

//   return deployment;
// };

// const deleteDeploymentService = async (id) => {
//   const deployment = await DeploymentHistory.findByIdAndDelete(id).lean();

//   if (!deployment) {
//     throw ApiError.notFound(`Deployment not found with id: ${id}`);
//   }

//   return { id, status: "Deleted" };
// };

// export {
//   createDeploymentService,
//   getDeploymentsService,
//   getDeploymentByIdService,
//   updateDeploymentService,
//   deleteDeploymentService,
// };
import Deployment from "../models/Deployment.js";
import DeploymentHistory from "../models/DeploymentHistory.js";
import {
  triggerDeployment,
  deleteDeploymentEngine,
} from "../engine/deployment.engine.js";
import ApiError from "../utils/ApiError.js";

export const registerRepository = async (repositoryUrl, branch = "main") => {
  const githubRegex = /^https:\/\/github\.com\/[\w.-]+\/[\w.-]+(\.git)?$/;

  if (!githubRegex.test(repositoryUrl)) {
    throw new Error("Invalid GitHub repository URL");
  }

  const deployment = await Deployment.create({
    repositoryUrl,
    branch,
    status: "REGISTERED",
  });

  // Process deployment in the background
  setImmediate(() => {
    processDeployment(deployment);
  });

  return {
    deployment,
  };
};

export const processDeployment = async (deployment) => {
  try {
    // ==========================================
    // CLONING
    // ==========================================
    deployment.status = "CLONING";
    await deployment.save();

    const result = await triggerDeployment({
      repositoryUrl: deployment.repositoryUrl,
      branch: deployment.branch,
      _id: deployment._id,
    });

    // ==========================================
    // DEPLOYMENT COMPLETED
    // ==========================================
    deployment.projectName = result.project.projectName;
    deployment.image = result.registry.image;
    deployment.deploymentName = result.deploymentMetadata.appName;
    deployment.serviceName = result.deploymentMetadata.appName;
    deployment.previewUrl = result.previewUrl;
    deployment.status = "RUNNING";

    await deployment.save();

    // ==========================================
    // SAVE DEPLOYMENT HISTORY
    // ==========================================
    await saveDeploymentHistory({
      repositoryUrl: deployment.repositoryUrl,
      projectName: result.project.projectName,
      image: result.registry.image,
      deploymentName: result.project.projectName,
      serviceName: result.project.projectName,
      previewUrl: result.previewUrl,
      status: "RUNNING",
    });
  } catch (error) {
    deployment.status = "FAILED";
    deployment.error = error.message;

    await deployment.save();
  }
};

export const saveDeploymentHistory = async (deployment) => {
  return await DeploymentHistory.create(deployment);
};

// ==========================================
// List & Get Deployments
// ==========================================

export const getDeploymentsService = async () => {
  const deployments = await Deployment.find({}).sort({ createdAt: -1 }).lean();

  return deployments;
};

export const getDeploymentByIdService = async (id) => {
  const deployment = await Deployment.findById(id).lean();
  if (!deployment) {
    throw ApiError.notFound(`Deployment not found with id: ${id}`);
  }
  return deployment;
};

export const deleteDeploymentService = async (id) => {
  const deployment = await Deployment.findById(id);

  if (!deployment) {
    throw new Error("Deployment not found");
  }

  // Only delete Kubernetes resources if they were actually deployed
  if (["DEPLOYING", "RUNNING"].includes(deployment.status)) {
    try {
      await deleteDeploymentEngine(deployment);
    } catch (error) {
      console.warn("Deployment Engine cleanup failed:", error.message);
    }
  }

  await DeploymentHistory.create({
    ...deployment.toObject(),
    status: "DELETED",
  });

  await Deployment.findByIdAndDelete(id);

  return {
    success: true,
    message: "Deployment deleted successfully",
  };
};
