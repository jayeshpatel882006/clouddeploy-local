import Deployment from "../models/Deployment.js";

export const updateDeploymentStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, message = "" } = req.body;

    console.log(
      `Updating deployment status to: ${status} for deployment ID: ${id}`,
    );

    const deployment = await Deployment.findById(id);

    if (!deployment) {
      return res.status(404).json({
        success: false,
        message: "Deployment not found.",
      });
    }

    deployment.status = status;

    const lastEntry = deployment.timeline[deployment.timeline.length - 1];

    if (!lastEntry || lastEntry.status !== status) {
      deployment.timeline.push({
        status,
        message,
        timestamp: new Date(),
      });
    }

    await deployment.save();

    res.json({
      success: true,
      data: deployment,
    });
  } catch (error) {
    next(error);
  }
};
