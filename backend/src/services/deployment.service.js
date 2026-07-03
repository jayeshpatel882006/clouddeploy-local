import DeploymentHistory from "../models/DeploymentHistory.js";
import { deployApplication } from "../engine/deployment.engine.js";
import ApiError from "../utils/ApiError.js";

const createDeploymentService = async (deploymentData) => {
  const { applicationName, dockerImage, containerPort } = deploymentData;

  if (!applicationName || !dockerImage || !containerPort) {
    throw ApiError.badRequest("Required fields are missing.");
  }

  const deployment = await DeploymentHistory.create({
    ...deploymentData,
    status: "Pending",
  });

  const engineResponse = await deployApplication(deployment);

  return {
    deploymentId: deployment._id,
    engine: engineResponse,
  };
};

const getDeploymentsService = async (query = {}) => {
  const {
    status,
    namespace,
    search,
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = query;

  const filter = {};

  if (status) {
    filter.status = status;
  }

  if (namespace) {
    filter.namespace = namespace;
  }

  if (search) {
    filter.applicationName = { $regex: search, $options: "i" };
  }

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));
  const skip = (pageNum - 1) * limitNum;

  const sortDirection = sortOrder === "asc" ? 1 : -1;

  const [deployments, total] = await Promise.all([
    DeploymentHistory.find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(limitNum)
      .lean(),
    DeploymentHistory.countDocuments(filter),
  ]);

  return {
    deployments,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum),
      hasNextPage: pageNum * limitNum < total,
      hasPrevPage: pageNum > 1,
    },
  };
};

const getDeploymentByIdService = async (id) => {
  const deployment = await DeploymentHistory.findById(id).lean();

  if (!deployment) {
    throw ApiError.notFound(`Deployment not found with id: ${id}`);
  }

  return deployment;
};

const updateDeploymentService = async (id, updateData) => {
  const deployment = await DeploymentHistory.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true, runValidators: true },
  ).lean();

  if (!deployment) {
    throw ApiError.notFound(`Deployment not found with id: ${id}`);
  }

  return deployment;
};

const deleteDeploymentService = async (id) => {
  const deployment = await DeploymentHistory.findByIdAndDelete(id).lean();

  if (!deployment) {
    throw ApiError.notFound(`Deployment not found with id: ${id}`);
  }

  return { id, status: "Deleted" };
};

export {
  createDeploymentService,
  getDeploymentsService,
  getDeploymentByIdService,
  updateDeploymentService,
  deleteDeploymentService,
};
