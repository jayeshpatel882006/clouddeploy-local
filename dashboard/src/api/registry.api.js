import apiClient from "./axios.js";

// ==========================================
// Registry API
// ==========================================

/**
 * Fetch all repositories and their images from the registry.
 *
 * @returns {Promise<{success: boolean, repositories: Array}>}
 */
export const getRegistry = async () => {
  const { data } = await apiClient.get("/registry");
  return data;
};

export default {
  getRegistry,
};
