import apiClient from "./axios.js";

// ==========================================
// Deployment Details API
// All endpoints use project name, not MongoDB ID
// ==========================================

/**
 * Fetch deployment overview for a project.
 * GET /api/deployment-overview/:project
 */
export const getDeploymentOverview = async (project) => {
  const { data } = await apiClient.get(`/deployment-overview/${project}`);
  return data;
};

/**
 * Fetch detailed deployment info for a project.
 * GET /api/deployment-details/:project
 */
export const getDeploymentDetails = async (project) => {
  const { data } = await apiClient.get(`/deployment-details/${project}`);
  return data;
};

/**
 * Fetch Kubernetes info for a deployment.
 * GET /api/kubernetes/:project
 */
export const getKubernetesInfo = async (project) => {
  const { data } = await apiClient.get(`/kubernetes/${project}`);
  return data;
};

/**
 * Fetch list of manifest files for a project.
 * GET /api/manifests/:project
 */
export const getManifestFiles = async (project) => {
  const { data } = await apiClient.get(`/manifests/${project}`);
  return data;
};

/**
 * Fetch a single manifest file content.
 * GET /api/manifests/:project/:file
 */
export const getManifestContent = async (project, file) => {
  const { data } = await apiClient.get(`/manifests/${project}/${file}`);
  return data;
};

/**
 * Fetch deployment timeline.
 * GET /api/timeline/:project
 */
export const getTimeline = async (project) => {
  const { data } = await apiClient.get(`/timeline/${project}`);
  return data;
};

/**
 * Fetch application logs for a deployment.
 * GET /api/logs/:project
 */
export const getApplicationLogs = async (project) => {
  const { data } = await apiClient.get(`/logs/${project}`);
  return data;
};
