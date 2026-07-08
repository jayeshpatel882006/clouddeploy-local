import apiClient from "./axios.js";

// ==========================================
// System Health API
// ==========================================

/**
 * Fetch system health from the backend.
 * Returns the full health response including all service statuses.
 *
 * Future-proofed: backend may return kubernetes, registry, mongodb, etc.
 *
 * @returns {Promise<{success: boolean, docker: Object, ...rest}>}
 */
export const getSystemHealth = async () => {
  const { data } = await apiClient.get("/system/health");
  return data;
};

export default {
  getSystemHealth,
};
