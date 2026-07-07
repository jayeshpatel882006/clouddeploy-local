// import asyncHandler from "../utils/asyncHandler.js";
// import ApiResponse from "../utils/ApiResponse.js";
// import {
//   createDeploymentService,
//   getDeploymentsService,
//   getDeploymentByIdService,
//   updateDeploymentService,
//   deleteDeploymentService,
// } from "../services/deployment.service.js";

// const createDeployment = asyncHandler(async (req, res) => {
//   const result = await createDeploymentService(req.body);

//   return new ApiResponse(201, result, "Deployment created successfully").send(res);
// });

// const getDeployments = asyncHandler(async (req, res) => {
//   const result = await getDeploymentsService(req.query);

//   return new ApiResponse(200, result, "Deployments retrieved").send(res);
// });

// const getDeploymentById = asyncHandler(async (req, res) => {
//   const { id } = req.params;
//   const result = await getDeploymentByIdService(id);

//   return new ApiResponse(200, result, "Deployment retrieved").send(res);
// });

// const updateDeployment = asyncHandler(async (req, res) => {
//   const { id } = req.params;
//   const result = await updateDeploymentService(id, req.body);

//   return new ApiResponse(200, result, "Deployment updated successfully").send(res);
// });

// const deleteDeployment = asyncHandler(async (req, res) => {
//   const { id } = req.params;
//   const result = await deleteDeploymentService(id);

//   return new ApiResponse(200, result, "Deployment deleted successfully").send(res);
// });

// export {
//   createDeployment,
//   getDeployments,
//   getDeploymentById,
//   updateDeployment,
//   deleteDeployment,
// };
import {
  registerRepository,
  getDeploymentsService,
  getDeploymentByIdService,
  deleteDeploymentService,
} from "../services/deployment.service.js";

// ==========================================
// Create Deployment
// ==========================================

export const createDeployment = async (req, res, next) => {
  try {
    const { repositoryUrl, branch } = req.body;

    const deployment = await registerRepository(repositoryUrl, branch);

    res.status(202).json({
      success: true,
      message: "Deployment queued successfully.",
      data: deployment,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// List Deployments
// ==========================================

export const getDeployments = async (req, res, next) => {
  try {
    const deployments = await getDeploymentsService();

    res.json({
      success: true,
      count: deployments.length,
      data: { deployments },
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// Get Deployment by ID
// ==========================================

export const getDeploymentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deployment = await getDeploymentByIdService(id);

    res.json({
      success: true,
      message: "Deployment retrieved",
      data: deployment,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteDeployment = async (req, res, next) => {
  try {
    const result = await deleteDeploymentService(req.params.id);

    res.json(result);
  } catch (error) {
    next(error);
  }
};
