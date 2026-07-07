import apiClient from "./axios.js";

// ==========================================
// Deployment API
// ==========================================

export const getDeployments = async (params = {}) => {
  const { data } = await apiClient.get("/deployments", { params });
  return data;
};

export const getDeployment = async (id) => {
  const { data } = await apiClient.get(`/deployments/${id}`);
  return data;
};

export const createDeployment = async (payload) => {
  const { data } = await apiClient.post("/deployments", payload);
  return data;
};

// ==========================================
// FUTURE PHASE: Delete / Redeploy
// ==========================================

// export const deleteDeployment = async (id) => {
//   const { data } = await apiClient.delete(`/deployments/${id}`);
//   return data;
// };

// export const redeployDeployment = async (id) => {
//   const { data } = await apiClient.post(`/deployments/${id}/redeploy`);
//   return data;
// };
