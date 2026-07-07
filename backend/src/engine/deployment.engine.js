import axios from "axios";

const ENGINE_URL = process.env.DEPLOYMENT_ENGINE_URL || "http://localhost:6000";

export const triggerDeployment = async (deployment) => {
  try {
    const { data } = await axios.post(`${ENGINE_URL}/deploy`, deployment);

    return data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Deployment Engine Error",
    );
  }
};
