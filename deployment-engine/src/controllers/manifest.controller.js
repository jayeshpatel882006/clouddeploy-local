import {
  getManifestList,
  getManifestFile,
} from "../../manifests/manifestReader.service.js";

/**
 * GET /manifests/:project
 */
export const getManifests = async (req, res) => {
  try {
    const { project } = req.params;

    const files = getManifestList(project);

    return res.status(200).json({
      success: true,
      files,
    });
  } catch (error) {
    console.error(error);

    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * GET /manifests/:project/:file
 */
export const getManifest = async (req, res) => {
  try {
    const { project, file } = req.params;
    const ALLOWED_FILES = [
      "Dockerfile",
      "deployment.yaml",
      "service.yaml",
      "metadata.json",
    ];

    if (!ALLOWED_FILES.includes(file)) {
      return res.status(404).json({
        success: false,
        message: "File not found.",
      });
    }

    const manifest = getManifestFile(project, file);

    return res.status(200).json({
      success: true,
      manifest,
    });
  } catch (error) {
    console.error(error);

    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};
