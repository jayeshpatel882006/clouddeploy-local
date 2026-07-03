import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import {
  createDeploymentService,
  getDeploymentsService,
  getDeploymentByIdService,
  updateDeploymentService,
  deleteDeploymentService,
} from "../services/deployment.service.js";

const createDeployment = asyncHandler(async (req, res) => {
  const result = await createDeploymentService(req.body);

  return new ApiResponse(201, result, "Deployment created successfully").send(res);
});

const getDeployments = asyncHandler(async (req, res) => {
  const result = await getDeploymentsService(req.query);

  return new ApiResponse(200, result, "Deployments retrieved").send(res);
});

const getDeploymentById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await getDeploymentByIdService(id);

  return new ApiResponse(200, result, "Deployment retrieved").send(res);
});

const updateDeployment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await updateDeploymentService(id, req.body);

  return new ApiResponse(200, result, "Deployment updated successfully").send(res);
});

const deleteDeployment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await deleteDeploymentService(id);

  return new ApiResponse(200, result, "Deployment deleted successfully").send(res);
});

export {
  createDeployment,
  getDeployments,
  getDeploymentById,
  updateDeployment,
  deleteDeployment,
};
