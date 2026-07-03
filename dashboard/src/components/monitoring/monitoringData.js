// Generate smooth-ish time-series data
const seed = (base, variance, points = 24) =>
  Array.from({ length: points }, (_, i) =>
    Math.round((base + (Math.sin(i * 0.5) * variance + (Math.random() - 0.5) * variance * 0.5)) * 10) / 10
  );

const hours = Array.from({ length: 24 }, (_, i) =>
  `${String(i).padStart(2, "0")}:00`
);

// ────────────────────────────────────────
// CPU — % utilization over 24h
// ────────────────────────────────────────
const cpuUser = seed(45, 20);
const cpuSystem = seed(25, 10);
const cpuIowait = seed(5, 4);
export const cpuData = {
  labels: hours,
  series: [
    { name: "User", data: cpuUser, color: "blue" },
    { name: "System", data: cpuSystem, color: "purple" },
    { name: "I/O Wait", data: cpuIowait, color: "yellow" },
  ],
  total: 8, // cores
  currentAvg: 68, // percent
  peak: 92,
};

// ────────────────────────────────────────
// Memory — GB over 24h
// ────────────────────────────────────────
const memUsed = seed(18, 4);
const memCached = seed(6, 2);
export const memoryData = {
  labels: hours,
  series: [
    { name: "Used", data: memUsed, color: "green" },
    { name: "Cached", data: memCached, color: "cyan" },
  ],
  total: 32, // GB
  currentUsed: 22.4,
  peak: 27.8,
};

// ────────────────────────────────────────
// Network — Mbps over 24h
// ────────────────────────────────────────
const netIn = seed(180, 80);
const netOut = seed(120, 60);
export const networkData = {
  labels: hours,
  series: [
    { name: "Inbound", data: netIn, color: "cyan" },
    { name: "Outbound", data: netOut, color: "blue" },
  ],
  currentIn: 245,
  currentOut: 158,
  totalIn: 2.1, // GB today
  totalOut: 1.4, // GB today
};

// ────────────────────────────────────────
// Disk — IOPS over 24h
// ────────────────────────────────────────
const diskRead = seed(1200, 600);
const diskWrite = seed(800, 400);
export const diskData = {
  labels: hours,
  series: [
    { name: "Read", data: diskRead, color: "blue" },
    { name: "Write", data: diskWrite, color: "green" },
  ],
  total: 500, // GB
  used: 245,
  readLatency: "4.2ms",
  writeLatency: "6.8ms",
};

// ────────────────────────────────────────
// Node Usage
// ────────────────────────────────────────
export const nodeUsage = [
  { name: "control-plane-1", cpu: 32, cpuReq: 24, memory: 40, memoryReq: 32, pods: 12, podsCap: 110, status: "Ready" },
  { name: "worker-1", cpu: 52, cpuReq: 40, memory: 60, memoryReq: 48, pods: 18, podsCap: 110, status: "Ready" },
  { name: "worker-2", cpu: 38, cpuReq: 32, memory: 45, memoryReq: 36, pods: 17, podsCap: 110, status: "Ready" },
];

// ────────────────────────────────────────
// Container Usage (top containers by resource)
// ────────────────────────────────────────
export const containerUsage = [
  { name: "cache-redis-6d7e8f-9p0q1", pod: "cache-redis", cpu: "150m", cpuPercent: 18, memory: "512Mi", memoryPercent: 32, namespace: "production", uptime: "7d" },
  { name: "db-postgres", pod: "postgres-db-0", cpu: "500m", cpuPercent: 12, memory: "2Gi", memoryPercent: 25, namespace: "production", uptime: "14d" },
  { name: "payment-api", pod: "payment-api-5f6g7h-1a2b3", cpu: "75m", cpuPercent: 9, memory: "384Mi", memoryPercent: 24, namespace: "production", uptime: "1d" },
  { name: "frontend-web", pod: "frontend-web-2a3b4c-7h8j9", cpu: "50m", cpuPercent: 6, memory: "128Mi", memoryPercent: 8, namespace: "production", uptime: "7d" },
  { name: "message-queue", pod: "kafka-broker-0", cpu: "180m", cpuPercent: 22, memory: "768Mi", memoryPercent: 48, namespace: "production", uptime: "10d" },
  { name: "ml-inference", pod: "ml-inference-1a2b3c-5t6u7", cpu: "1", cpuPercent: 25, memory: "4Gi", memoryPercent: 50, namespace: "development", uptime: "30m" },
  { name: "log-processor", pod: "log-processor-9x8y7z-3f4g5", cpu: "0m", cpuPercent: 0, memory: "0Mi", memoryPercent: 0, namespace: "default", uptime: "6d" },
];

// ────────────────────────────────────────
// Pod Health
// ────────────────────────────────────────
const podStatuses = ["Running", "Running", "Running", "Running", "Running", "Pending", "CrashLoopBackOff", "Running", "Running", "Running", "Running", "Running", "Running", "Pending", "Running", "Running", "Running", "Running"];
export const podHealthSummary = {
  total: 18,
  running: 14,
  pending: 2,
  failed: 1,
  crashed: 1,
  healthy: 14,
  degraded: 4,
};

export const podHealth = [
  { namespace: "production", running: 12, total: 14, healthy: 12 },
  { namespace: "staging", running: 1, total: 1, healthy: 1 },
  { namespace: "default", running: 0, total: 1, healthy: 0 },
  { namespace: "development", running: 0, total: 1, healthy: 0 },
  { namespace: "kube-system", running: 2, total: 2, healthy: 2 },
];

// ────────────────────────────────────────
// Alerts
// ────────────────────────────────────────
export const alerts = [
  { id: 1, severity: "critical", title: "Payment API — CrashLoopBackOff", message: "Pod payment-api-5f6g7h-4c5d6 has restarted 5 times in the last hour", time: "5 min ago", acknowledged: false },
  { id: 2, severity: "warning", title: "Memory Pressure — worker-2", message: "Memory usage at 85% on node worker-2 (13.6/16 GB)", time: "15 min ago", acknowledged: false },
  { id: 3, severity: "warning", title: "Node Disk Pressure — worker-1", message: "Disk usage at 78% on /var/lib/docker", time: "1 hour ago", acknowledged: false },
  { id: 4, severity: "info", title: "Certificate Expiry", message: "TLS certificate clouddeploy-tls expires in 14 days", time: "3 hours ago", acknowledged: false },
  { id: 5, severity: "warning", title: "High CPU — ml-inference", message: "Container ml-inference using 1 CPU core (25% of request)", time: "4 hours ago", acknowledged: false },
  { id: 6, severity: "critical", title: "Log Processor — OOMKilled", message: "Pod log-processor-9x8y7z-3f4g5 killed due to out of memory (12 restarts)", time: "10 min ago", acknowledged: false },
  { id: 7, severity: "info", title: "Image Pull BackOff — cilium-agent", message: "Failed to pull image cilium/cilium:v1.14.0 on worker-2", time: "5 days ago", acknowledged: true },
];
