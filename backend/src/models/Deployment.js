import mongoose from "mongoose";

const deploymentSchema = new mongoose.Schema(
  {
    repositoryUrl: {
      type: String,
      required: true,
      trim: true,
    },
    branch: {
      type: String,
      default: "main",
    },
    status: {
      type: String,
      default: "REGISTERED",
      enum: [
        "REGISTERED",
        "CLONED",
        "BUILDING",
        "DEPLOYING",
        "RUNNING",
        "FAILED",
      ],
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Deployment", deploymentSchema);
