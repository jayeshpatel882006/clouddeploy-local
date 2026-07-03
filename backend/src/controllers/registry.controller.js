import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import {
  listRegistryImages,
  getImageTags,
  deleteRegistryImage,
  syncRegistryFromDocker,
} from "../services/registry.service.js";

const listImages = asyncHandler(async (req, res) => {
  const result = await listRegistryImages(req.query);
  return new ApiResponse(200, result, "Registry images retrieved").send(res);
});

const getTags = asyncHandler(async (req, res) => {
  const { name } = req.params;
  const result = await getImageTags(name);
  return new ApiResponse(200, result, "Image tags retrieved").send(res);
});

const deleteImage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await deleteRegistryImage(id);
  return new ApiResponse(200, result, "Image deleted successfully").send(res);
});

const syncImages = asyncHandler(async (req, res) => {
  const result = await syncRegistryFromDocker();
  return new ApiResponse(200, result, "Registry synced from Docker").send(res);
});

export { listImages, getTags, deleteImage, syncImages };
