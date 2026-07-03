import Metric from "../models/Metric.js";

const listLogs = async (query = {}) => {
  const {
    source,
    search,
    level,
    since,
    until,
    page = 1,
    limit = 50,
  } = query;
  const filter = { source: "loki" };

  if (level) filter["labels.level"] = level;
  if (search) filter.metricName = { $regex: search, $options: "i" };
  if (since || until) {
    filter.timestamp = {};
    if (since) filter.timestamp.$gte = new Date(since);
    if (until) filter.timestamp.$lte = new Date(until);
  }

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(200, Math.max(1, parseInt(limit, 10) || 50));
  const skip = (pageNum - 1) * limitNum;

  const [logs, total] = await Promise.all([
    Metric.find(filter)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean(),
    Metric.countDocuments(filter),
  ]);

  return {
    logs,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum),
    },
  };
};

export { listLogs };
