import { Router } from "express";
import {
  createDeployment,
  getDeployments,
  getDeploymentById,
  updateDeployment,
  deleteDeployment,
} from "../controllers/deployment.controller.js";
import validate from "../middleware/validate.js";

const router = Router();

const createDeploymentRules = {
  applicationName: {
    required: true,
    type: "string",
    minLength: 2,
    maxLength: 100,
    message: "Application name is required (2-100 characters)",
  },
  dockerImage: {
    required: true,
    type: "string",
    minLength: 2,
    message: "Docker image is required",
  },
  containerPort: {
    required: true,
    type: "number",
    min: 1,
    max: 65535,
    message: "Container port must be between 1 and 65535",
  },
  namespace: {
    type: "string",
  },
  imageTag: {
    type: "string",
  },
  replicas: {
    type: "number",
    min: 1,
    max: 100,
  },
  deployedBy: {
    type: "string",
  },
  commitSha: {
    type: "string",
  },
  deploymentMessage: {
    type: "string",
  },
};

const updateDeploymentRules = {
  applicationName: {
    type: "string",
    minLength: 2,
    maxLength: 100,
  },
  dockerImage: {
    type: "string",
    minLength: 2,
  },
  containerPort: {
    type: "number",
    min: 1,
    max: 65535,
  },
  namespace: {
    type: "string",
  },
  imageTag: {
    type: "string",
  },
  replicas: {
    type: "number",
    min: 1,
    max: 100,
  },
  status: {
    type: "string",
    enum: ["Pending", "Running", "Updating", "Failed", "Stopped", "Deleted"],
  },
  deployedBy: {
    type: "string",
  },
  commitSha: {
    type: "string",
  },
  deploymentMessage: {
    type: "string",
  },
};

router.post("/", validate(createDeploymentRules), createDeployment);
router.get("/", getDeployments);
router.get("/:id", getDeploymentById);
router.put("/:id", validate(updateDeploymentRules), updateDeployment);
router.delete("/:id", deleteDeployment);

export default router;
