import axios from "axios";

const DEPLOYMENT_ENGINE_URL =
  process.env.DEPLOYMENT_ENGINE_URL || "http://localhost:6000";

export const getDeploymentOverview = async (project) => {
  const { data } = await axios.get(
    `${DEPLOYMENT_ENGINE_URL}/deployment-overview/${project}`,
  );

  return data;
};
