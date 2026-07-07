// ==========================================
// FUTURE PHASE
// Registry Service
// ==========================================

// import RegistryImage from "../models/RegistryImage.js";
// import { listImages as dockerListImages } from "../engine/docker.engine.js";
// import ApiError from "../utils/ApiError.js";

// const listRegistryImages = async (query = {}) => {
//   const { search, page = 1, limit = 20 } = query;
//   const filter = {};

//   if (search) {
//     filter.name = { $regex: search, $options: "i" };
//   }

//   const pageNum = Math.max(1, parseInt(page, 10) || 1);
//   const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
//   const skip = (pageNum - 1) * limitNum;

//   const [images, total] = await Promise.all([
//     RegistryImage.find(filter)
//       .sort({ updatedAt: -1 })
//       .skip(skip)
//       .limit(limitNum)
//       .lean(),
//     RegistryImage.countDocuments(filter),
//   ]);

//   return {
//     images,
//     pagination: {
//       page: pageNum,
//       limit: limitNum,
//       total,
//       totalPages: Math.ceil(total / limitNum),
//     },
//   };
// };

// const getImageTags = async (name) => {
//   const tags = await RegistryImage.find({ name })
//     .sort({ updatedAt: -1 })
//     .lean();
//   return tags;
// };

// const deleteRegistryImage = async (id) => {
//   const image = await RegistryImage.findByIdAndDelete(id);
//   if (!image) throw ApiError.notFound(`Image not found with id: ${id}`);
//   return { id, status: "Deleted" };
// };

// const syncRegistryFromDocker = async () => {
//   const result = dockerListImages();
//   if (!result.success) throw ApiError.internal("Failed to list Docker images");

//   for (const img of result.images) {
//     await RegistryImage.findOneAndUpdate(
//       { name: img.repository, tag: img.tag },
//       {
//         name: img.repository,
//         tag: img.tag,
//         digest: img.id,
//         size: img.size,
//         pulledAt: new Date(),
//       },
//       { upsert: true, new: true },
//     );
//   }

//   return { synced: result.images.length };
// };

// export {
//   listRegistryImages,
//   getImageTags,
//   deleteRegistryImage,
//   syncRegistryFromDocker,
// };
