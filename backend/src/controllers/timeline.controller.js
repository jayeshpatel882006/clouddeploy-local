import { getDeploymentTimeline } from "../services/timeline.service.js";

export const timeline = async (req, res) => {
  try {
    const { project } = req.params;

    const deployment = await getDeploymentTimeline(project);

    const timeline = deployment.timeline
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
      .map((item) => ({
        status: item.status,
        message: item.message,
        timestamp: item.timestamp,
        displayTime: new Date(item.timestamp).toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
      }));

    return res.status(200).json({
      success: true,
      project: deployment.projectName,
      currentStatus: deployment.status,
      timeline,
    });
  } catch (error) {
    console.error(error);

    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};
