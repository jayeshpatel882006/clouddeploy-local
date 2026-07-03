import mongoose from "mongoose";

const deploymentHistorySchema = new mongoose.Schema(
  {
    applicationName: {
      type: String,
      required: true,
      trim: true,
    },

    namespace: {
      type: String,
      default: "default",
    },

    dockerImage: {
      type: String,
      required: true,
    },

    imageTag: {
      type: String,
      default: "latest",
    },

    replicas: {
      type: Number,
      default: 1,
    },

    containerPort: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Running", "Updating", "Failed", "Stopped", "Deleted"],
      default: "Pending",
    },

    deployedBy: {
      type: String,
      default: "system",
    },

    commitSha: {
      type: String,
      default: "",
    },

    deploymentMessage: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("DeploymentHistory", deploymentHistorySchema);
