import Deployment from "../models/Deployment.js";

export const updateDeploymentStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const deployment = await Deployment.findByIdAndUpdate(
      id,
      { status },
      { returnDocument: "after" },
    );

    res.json({
      success: true,
      data: deployment,
    });
  } catch (error) {
    next(error);
  }
};
