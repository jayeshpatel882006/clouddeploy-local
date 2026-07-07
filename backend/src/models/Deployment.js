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
      enum: [
        "REGISTERED",
        "CLONING",
        "BUILDING",
        "PUSHING",
        "DEPLOYING",
        "RUNNING",
        "FAILED",
      ],
      default: "REGISTERED",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Deployment", deploymentSchema);
