export const sources = [
  "inventory-api", "auth-service", "payment-api", "api-gateway",
  "frontend-web", "cache-redis", "kube-apiserver", "kube-scheduler",
  "kube-controller-manager", "coredns", "node-exporter", "fluentd",
];

const logTemplates = {
  INFO: [
    "Request processed successfully in {ms}ms — {method} {path}",
    "Health check passed — status 200 OK",
    "Connected to database cluster — pool size: {n}",
    "Cache hit for key: {key} — TTL {ttl}s remaining",
    "Scheduled job completed — processed {n} items",
    "Configuration reloaded successfully from ConfigMap '{name}'",
    "Successfully synced replica set — {n} pods ready",
    "Certificate rotation completed — next rotation in {days}d",
    "DNS record resolved — {host} → 10.96.{a}.{b}",
    "Leader election won — taking over as active controller",
    "Pod {pod} assigned to node {node}",
    "Namespace '{ns}' created successfully",
  ],
  WARN: [
    "High memory pressure on node '{node}' — {pct}% used",
    "Response time degraded — {ms}ms (threshold: 500ms)",
    "Connection pool nearing capacity — {pct}% utilized",
    "Replica count mismatch — expected {n}, got {m}",
    "Disk usage above threshold — {pct}% on volume '{vol}'",
    "Retry attempt {n}/{max} for operation '{op}'",
    "DNS resolution slow — took {ms}ms for {host}",
    "Old replica set '{rs}' is still running with {n} pods",
    "Metric scrape time exceeded — {ms}ms for target '{target}'",
    "Pod {pod} exceeded CPU request — throttling applied",
  ],
  ERROR: [
    "Failed to connect to database — connection refused on 10.96.{a}.{b}:{port}",
    "Unhandled exception in request handler — {err}",
    "Back-off restarting failed container — pod {pod} ({restarts} restarts)",
    "Liveness probe failed — HTTP probe returned 503",
    "PersistentVolume claim '{claim}' is in Pending state — no matching PV",
    "Image pull failed for {image} — manifest not found",
    "Out of memory — OOMKilled container '{container}'",
    "API request failed — {method} {path} returned {status}",
    "Leader election lost — demoting from active controller",
    "TLS handshake failed — certificate expired for {host}",
  ],
  DEBUG: [
    "GC pause duration: {ms}ms — freed {n} MiB",
    "Evicted pod {pod} from node {node} — resource pressure",
    "Scheduling attempt for pod {pod} — available nodes: {n}",
    "Reconciling resource '{resource}' — generation {gen}",
    "Cache TTL refresh triggered for {n} keys",
    "BPF program loaded — prog_id={id}, tag={tag}",
    "Waiting for lock on resource '{resource}' — {n}ms elapsed",
    "Table scan stats: {table} — {rows} rows in {ms}ms",
    "Connection {conn} established to {target}",
    "Request tracing enabled for {path} — trace_id={trace}",
  ],
};

const methods = ["GET", "POST", "PUT", "DELETE", "PATCH"];
const paths = ["/api/inventory", "/api/auth/login", "/api/payments", "/api/users", "/api/orders", "/healthz", "/metrics", "/api/config", "/api/notifications", "/api/search"];
const nodes = ["control-plane-1", "worker-1", "worker-2"];
const pods = ["inventory-api-7d8f9c-6x4k2", "payment-api-5f6g7h-1a2b3", "auth-service-3b4e2d-5h8j1", "frontend-web-2a3b4c-7h8j9", "cache-redis-6d7e8f-9p0q1"];
const claims = ["postgres-db-pvc", "kafka-broker-pvc", "zookeeper-pvc", "elastic-pvc", "ci-cache-pvc"];
const images = ["nginx:1.25", "redis:7.2", "postgres:15.4", "alpine:3.19", "node:20-alpine"];
const resources = ["Deployment/inventory-api", "Deployment/auth-service", "StatefulSet/postgres-db", "DaemonSet/fluentd", "ConfigMap/app-config"];

let counter = 0;

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const fillTemplate = (template) => {
  return template
    .replace(/\{ms\}/g, rand(1, 5000))
    .replace(/\{method\}/g, pick(methods))
    .replace(/\{path\}/g, pick(paths))
    .replace(/\{n\}/g, rand(1, 20))
    .replace(/\{m\}/g, rand(0, 5))
    .replace(/\{max\}/g, rand(3, 5))
    .replace(/\{pct\}/g, rand(50, 99))
    .replace(/\{name\}/g, pick(["app-config", "logging-config", "nginx-config", "fluentd-config", "kube-proxy-config"]))
    .replace(/\{key\}/g, pick(["user:1234:session", "cache:inventory:list", "config:app:v2", "rate:limiter:api", "metrics:pod:cpu"]))
    .replace(/\{ttl\}/g, rand(10, 3600))
    .replace(/\{days\}/g, rand(3, 90))
    .replace(/\{host\}/g, pick(["api.clouddeploy.local", "app.clouddeploy.local", "monitor.clouddeploy.local", "db.clouddeploy.local", "kafka.clouddeploy.local"]))
    .replace(/\{a\}/g, rand(1, 255))
    .replace(/\{b\}/g, rand(1, 255))
    .replace(/\{pod\}/g, pick(pods))
    .replace(/\{node\}/g, pick(nodes))
    .replace(/\{ns\}/g, pick(["production", "staging", "default", "development", "kube-system"]))
    .replace(/\{vol\}/g, pick(["pv-postgres-data", "pv-kafka-data", "var-lib-docker", "var-log", "etcd-data"]))
    .replace(/\{op\}/g, pick(["CREATE", "UPDATE", "DELETE", "PATCH", "SCALE"]))
    .replace(/\{rs\}/g, pick(["inventory-api-7d8f9c-old", "payment-api-5f6g7h-old", "auth-service-3b4e2d-old"]))
    .replace(/\{target\}/g, pick(["kubelet", "cadvisor", "kube-state-metrics", "node-exporter", "coredns"]))
    .replace(/\{port\}/g, rand(3000, 3100))
    .replace(/\{err\}/g, pick(["TypeError: Cannot read property 'data' of undefined", "ECONNREFUSED", "TimeoutError: Request timed out after 30s", "RangeError: Maximum call stack size exceeded", "Error: ENOSPC: no space left on device"]))
    .replace(/\{restarts\}/g, rand(2, 15))
    .replace(/\{claim\}/g, pick(claims))
    .replace(/\{image\}/g, pick(images))
    .replace(/\{container\}/g, pick(["payment-api", "log-processor", "inventory-api", "ml-inference", "search-indexer"]))
    .replace(/\{status\}/g, rand(400, 503))
    .replace(/\{resource\}/g, pick(resources))
    .replace(/\{gen\}/g, rand(1, 50))
    .replace(/\{id\}/g, rand(100, 9999))
    .replace(/\{tag\}/g, () => Math.random().toString(16).slice(2, 10))
    .replace(/\{table\}/g, pick(["inventory_items", "users", "orders", "payments", "audit_logs"]))
    .replace(/\{rows\}/g, rand(10, 100000))
    .replace(/\{conn\}/g, rand(1000, 9999))
    .replace(/\{trace\}/g, () => Math.random().toString(16).slice(2, 34))
    .replace(/\{minutes\}/g, rand(1, 59));
};

const pad = (n) => String(n).padStart(2, "0");

export const generateLogEntry = (overrides = {}) => {
  counter++;
  const levels = ["INFO", "INFO", "INFO", "WARN", "WARN", "ERROR", "DEBUG", "DEBUG"];
  const level = overrides.level || pick(levels);
  const source = overrides.source || pick(sources);
  const template = pick(logTemplates[level]);
  const message = fillTemplate(template);

  const now = new Date();
  now.setSeconds(now.getSeconds() - rand(0, 3600));
  const time = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

  return {
    id: overrides.id || counter,
    timestamp: overrides.timestamp || time,
    level,
    source,
    message,
  };
};

export const generateInitialLogs = (count = 200) => {
  const logs = [];
  const now = new Date();
  for (let i = count; i > 0; i--) {
    const ts = new Date(now.getTime() - i * rand(2, 15) * 1000);
    const time = `${pad(ts.getHours())}:${pad(ts.getMinutes())}:${pad(ts.getSeconds())}`;
    logs.push(generateLogEntry({ id: i, timestamp: time }));
  }
  return logs;
};
