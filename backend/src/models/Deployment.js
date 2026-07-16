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

    projectName: {
      type: String,
      default: null,
    },

    image: {
      type: String,
      default: null,
    },

    deploymentName: {
      type: String,
      default: null,
    },

    serviceName: {
      type: String,
      default: null,
    },

    namespace: {
      type: String,
      default: "default",
    },

    previewUrl: {
      type: String,
      default: null,
    },

    error: {
      type: String,
      default: null,
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
    timeline: [
      {
        status: {
          type: String,
          required: true,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
        message: {
          type: String,
          default: "",
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Deployment", deploymentSchema);
