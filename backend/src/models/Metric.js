import mongoose from "mongoose";

const metricSchema = new mongoose.Schema(
  {
    source: {
      type: String,
      enum: ["prometheus", "grafana", "node_exporter", "cadvisor"],
      required: true,
    },
    metricName: {
      type: String,
      required: true,
    },
    value: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    labels: {
      type: Map,
      of: String,
      default: {},
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

metricSchema.index({ source: 1, metricName: 1, timestamp: -1 });

export default mongoose.model("Metric", metricSchema);
