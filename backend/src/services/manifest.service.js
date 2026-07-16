import axios from "axios";

const DEPLOYMENT_ENGINE_URL =
  process.env.DEPLOYMENT_ENGINE_URL || "http://localhost:6000";

/**
 * Get all manifest files.
 */
export const getManifestList = async (project) => {
  const { data } = await axios.get(
    `${DEPLOYMENT_ENGINE_URL}/manifests/${project}`,
  );

  return data;
};

/**
 * Get a single manifest.
 */
export const getManifest = async (project, file) => {
  const { data } = await axios.get(
    `${DEPLOYMENT_ENGINE_URL}/manifests/${project}/${file}`,
  );

  return data;
};
