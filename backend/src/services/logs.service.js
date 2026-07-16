import axios from "axios";

const DEPLOYMENT_ENGINE_URL =
  process.env.DEPLOYMENT_ENGINE_URL || "http://localhost:6000";

/**
 * Fetch application logs from Deployment Engine.
 */
export const getApplicationLogs = async (project) => {
  const { data } = await axios.get(`${DEPLOYMENT_ENGINE_URL}/logs/${project}`);

  return data;
};
