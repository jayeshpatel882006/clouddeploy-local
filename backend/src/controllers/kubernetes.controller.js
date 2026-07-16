import { getKubernetesInfo } from "../services/kubernetes.service.js";

/**
 * GET /api/kubernetes/:project
 */
export const kubernetesInfo = async (req, res) => {
  try {
    const { project } = req.params;

    const response = await getKubernetesInfo(project);

    return res.status(200).json(response);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch Kubernetes information.",
    });
  }
};
