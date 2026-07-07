import mongoose from "mongoose";

const deploymentHistorySchema = new mongoose.Schema(
  {
    repositoryUrl: String,

    projectName: String,

    image: String,

    deploymentName: String,

    serviceName: String,

    namespace: {
      type: String,
      default: "default",
    },

    previewUrl: String,

    status: {
      type: String,
      default: "RUNNING",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("DeploymentHistory", deploymentHistorySchema);
