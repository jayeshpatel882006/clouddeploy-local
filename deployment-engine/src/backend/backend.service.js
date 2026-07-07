import axios from "axios";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5001/api";

export const updateStatus = async (deploymentId, status) => {
  await axios.patch(
    `${BACKEND_URL}/internal/deployment/${deploymentId}/status`,
    {
      status,
    },
  );
};
