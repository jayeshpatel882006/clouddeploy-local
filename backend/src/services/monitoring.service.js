import Metric from "../models/Metric.js";

const getMetrics = async (query = {}) => {
  const { source, metricName, since, until, page = 1, limit = 50 } = query;
  const filter = {};

  if (source) filter.source = source;
  if (metricName) filter.metricName = metricName;
  if (since || until) {
    filter.timestamp = {};
    if (since) filter.timestamp.$gte = new Date(since);
    if (until) filter.timestamp.$lte = new Date(until);
  }

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(200, Math.max(1, parseInt(limit, 10) || 50));
  const skip = (pageNum - 1) * limitNum;

  const [metrics, total] = await Promise.all([
    Metric.find(filter)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean(),
    Metric.countDocuments(filter),
  ]);

  return {
    metrics,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum),
    },
  };
};

const getMetricSummary = async () => {
  const sources = await Metric.distinct("source");
  const summary = {};

  for (const source of sources) {
    const count = await Metric.countDocuments({ source });
    const latest = await Metric.findOne({ source })
      .sort({ timestamp: -1 })
      .lean();
    summary[source] = { count, latestTimestamp: latest?.timestamp };
  }

  return summary;
};

export { getMetrics, getMetricSummary };
