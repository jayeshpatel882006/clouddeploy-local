import { createDeploymentService } from "../services/deployment.service.js";

const createDeployment = async (req, res) => {
  try {
    const result = await createDeploymentService(req.body);

    return res.status(201).json({
      success: true,
      message: "Deployment created successfully.",
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export { createDeployment };
