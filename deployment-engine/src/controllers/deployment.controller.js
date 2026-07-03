import { deploymentService } from "../services/deployment.service.js";

const deployApplication = async (req, res) => {
  try {
    const result = await deploymentService(req.body);

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export { deployApplication };
