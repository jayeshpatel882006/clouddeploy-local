// ==========================================
// FUTURE PHASE
// RegistryImage Model
// ==========================================

// import mongoose from "mongoose";

// const registryImageSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     tag: {
//       type: String,
//       default: "latest",
//     },
//     digest: {
//       type: String,
//       default: "",
//     },
//     size: {
//       type: String,
//       default: "",
//     },
//     registry: {
//       type: String,
//       default: "localhost:5000",
//     },
//     pulledAt: {
//       type: Date,
//       default: Date.now,
//     },
//   },
//   {
//     timestamps: true,
//   },
// );

// registryImageSchema.index({ name: 1, tag: 1 }, { unique: true });

// export default mongoose.model("RegistryImage", registryImageSchema);
