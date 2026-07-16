import axios from "axios";

const DEPLOYMENT_ENGINE_URL =
  process.env.DEPLOYMENT_ENGINE_URL || "http://localhost:6000";

/**
 * Get Kubernetes information for a deployment.
 */
export const getKubernetesInfo = async (project) => {
  const { data } = await axios.get(
    `${DEPLOYMENT_ENGINE_URL}/kubernetes/${project}`,
  );

  return data;
};
