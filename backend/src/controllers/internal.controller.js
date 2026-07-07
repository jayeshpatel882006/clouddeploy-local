import Deployment from "../models/Deployment.js";

export const updateDeploymentStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    console.log(
      `Updating deployment status to: ${status} for deployment ID: ${id}`,
    );
    const deployment = await Deployment.findByIdAndUpdate(
      id,
      { status },
      { returnDocument: "after" },
    );

    console.log(`Deployment : ${deployment}`);
    res.json({
      success: true,
      data: deployment,
    });
  } catch (error) {
    next(error);
  }
};
