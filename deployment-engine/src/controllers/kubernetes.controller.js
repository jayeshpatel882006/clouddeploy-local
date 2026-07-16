import { getDeploymentInfo } from "../kubernetes/deploymentInfo.service.js";
import { getServiceInfo } from "../kubernetes/serviceInfo.service.js";
import { getPodInfo } from "../kubernetes/podInfo.service.js";

export const getKubernetesInfo = async (req, res) => {
  try {
    const { project } = req.params;

    const deployment = await getDeploymentInfo(project);

    const service = await getServiceInfo(project);

    const pods = await getPodInfo(project);

    return res.status(200).json({
      success: true,

      deployment,

      service,

      pods,

      summary: {
        healthy: deployment.readyReplicas > 0,

        replicas: `${deployment.readyReplicas}/${deployment.replicas}`,

        podCount: pods.length,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
