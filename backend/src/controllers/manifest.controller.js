import { getManifestList, getManifest } from "../services/manifest.service.js";

/**
 * GET /api/manifests/:project
 */
export const manifests = async (req, res) => {
  try {
    const { project } = req.params;

    const response = await getManifestList(project);

    return res.status(200).json(response);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch manifests.",
    });
  }
};

/**
 * GET /api/manifests/:project/:file
 */
export const manifest = async (req, res) => {
  try {
    const { project, file } = req.params;

    const response = await getManifest(project, file);

    return res.status(200).json(response);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch manifest.",
    });
  }
};
