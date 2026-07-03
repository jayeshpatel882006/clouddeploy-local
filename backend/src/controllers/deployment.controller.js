import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import {
  createDeploymentService,
  getDeploymentsService,
} from "../services/deployment.service.js";

const createDeployment = asyncHandler(async (req, res) => {
  const result = await createDeploymentService(req.body);

  return new ApiResponse(201, result, "Deployment created successfully").send(res);
});

const getDeployments = asyncHandler(async (req, res) => {
  const result = await getDeploymentsService(req.query);

  return new ApiResponse(200, result, "Deployments retrieved").send(res);
});

export { createDeployment, getDeployments };
