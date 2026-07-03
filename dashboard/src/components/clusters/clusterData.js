// ──────────────────────────────────────────────
// Cluster Overview — summary KPIs
// ──────────────────────────────────────────────
export const clusterOverview = {
  name: "local-cluster",
  version: "v1.29.2",
  platform: "linux/amd64",
  totalNodes: 3,
  healthyNodes: 3,
  totalPods: 47,
  runningPods: 42,
  totalNamespaces: 6,
  cpuTotal: 12,
  cpuUsed: 4.8,
  memoryTotalGB: 48,
  memoryUsedGB: 22.4,
  uptime: "14d 7h",
  kubeletVersion: "v1.29.2",
  containerRuntime: "containerd://1.7.11",
  networkPlugin: "flannel",
};

// ──────────────────────────────────────────────
// Nodes
// ──────────────────────────────────────────────
export const nodes = [
  { id: 1, name: "control-plane-1", status: "Ready", role: "Control Plane", cpuTotal: 4, cpuUsed: 1.2, memoryTotal: 16, memoryUsed: 6.4, pods: 12, podsCapacity: 110, age: "14d", internalIP: "10.0.0.1", os: "Ubuntu 22.04", kernel: "5.15.0", containerRuntime: "containerd://1.7.11" },
  { id: 2, name: "worker-1", status: "Ready", role: "Worker", cpuTotal: 4, cpuUsed: 2.1, memoryTotal: 16, memoryUsed: 9.6, pods: 18, podsCapacity: 110, age: "14d", internalIP: "10.0.0.2", os: "Ubuntu 22.04", kernel: "5.15.0", containerRuntime: "containerd://1.7.11" },
  { id: 3, name: "worker-2", status: "Ready", role: "Worker", cpuTotal: 4, cpuUsed: 1.5, memoryTotal: 16, memoryUsed: 6.4, pods: 17, podsCapacity: 110, age: "14d", internalIP: "10.0.0.3", os: "Ubuntu 22.04", kernel: "5.15.0", containerRuntime: "containerd://1.7.11" },
];

// ──────────────────────────────────────────────
// Namespaces
// ──────────────────────────────────────────────
export const namespaces = [
  { id: 1, name: "production", status: "Active", pods: 18, age: "14d", labels: { env: "production", team: "platform" } },
  { id: 2, name: "staging", status: "Active", pods: 6, age: "14d", labels: { env: "staging", team: "platform" } },
  { id: 3, name: "default", status: "Active", pods: 12, age: "14d", labels: {} },
  { id: 4, name: "development", status: "Active", pods: 8, age: "12d", labels: { env: "dev" } },
  { id: 5, name: "kube-system", status: "Active", pods: 3, age: "14d", labels: { component: "system" } },
  { id: 6, name: "monitoring", status: "Active", pods: 0, age: "7d", labels: { team: "ops" } },
];

// ──────────────────────────────────────────────
// Pods
// ──────────────────────────────────────────────
export const pods = [
  { id: 1, name: "inventory-api-7d8f9c-6x4k2", namespace: "production", status: "Running", node: "worker-1", ip: "10.1.0.12", cpu: "25m", memory: "64Mi", restarts: 0, age: "2h", containers: 2 },
  { id: 2, name: "inventory-api-7d8f9c-9w3b7", namespace: "production", status: "Running", node: "worker-2", ip: "10.1.1.8", cpu: "25m", memory: "64Mi", restarts: 0, age: "2h", containers: 2 },
  { id: 3, name: "inventory-api-7d8f9c-f2m1p", namespace: "production", status: "Running", node: "worker-1", ip: "10.1.0.15", cpu: "25m", memory: "64Mi", restarts: 0, age: "2h", containers: 2 },
  { id: 4, name: "auth-service-3b4e2d-5h8j1", namespace: "production", status: "Running", node: "worker-2", ip: "10.1.1.12", cpu: "30m", memory: "48Mi", restarts: 0, age: "5h", containers: 1 },
  { id: 5, name: "auth-service-3b4e2d-k9m3n", namespace: "production", status: "Running", node: "worker-1", ip: "10.1.0.22", cpu: "30m", memory: "48Mi", restarts: 0, age: "5h", containers: 1 },
  { id: 6, name: "payment-api-5f6g7h-1a2b3", namespace: "production", status: "Running", node: "worker-1", ip: "10.1.0.31", cpu: "75m", memory: "192Mi", restarts: 1, age: "1d", containers: 2 },
  { id: 7, name: "payment-api-5f6g7h-4c5d6", namespace: "production", status: "Pending", node: "worker-2", ip: "", cpu: "75m", memory: "192Mi", restarts: 0, age: "30m", containers: 2 },
  { id: 8, name: "log-processor-9x8y7z-3f4g5", namespace: "default", status: "CrashLoopBackOff", node: "worker-2", ip: "10.1.1.25", cpu: "10m", memory: "32Mi", restarts: 12, age: "6d", containers: 1 },
  { id: 9, name: "frontend-web-2a3b4c-7h8j9", namespace: "production", status: "Running", node: "worker-1", ip: "10.1.0.41", cpu: "50m", memory: "128Mi", restarts: 0, age: "7d", containers: 2 },
  { id: 10, name: "frontend-web-2a3b4c-1k2l3", namespace: "production", status: "Running", node: "worker-2", ip: "10.1.1.31", cpu: "50m", memory: "128Mi", restarts: 0, age: "7d", containers: 2 },
  { id: 11, name: "frontend-web-2a3b4c-4m5n6", namespace: "production", status: "Running", node: "worker-1", ip: "10.1.0.45", cpu: "50m", memory: "128Mi", restarts: 0, age: "7d", containers: 2 },
  { id: 12, name: "cache-redis-6d7e8f-9p0q1", namespace: "production", status: "Running", node: "worker-2", ip: "10.1.1.38", cpu: "150m", memory: "512Mi", restarts: 0, age: "7d", containers: 1 },
  { id: 13, name: "cache-redis-6d7e8f-2r3s4", namespace: "production", status: "Running", node: "worker-1", ip: "10.1.0.52", cpu: "150m", memory: "512Mi", restarts: 0, age: "7d", containers: 1 },
  { id: 14, name: "ml-inference-1a2b3c-5t6u7", namespace: "development", status: "Pending", node: "worker-1", ip: "", cpu: "1", memory: "2Gi", restarts: 0, age: "30m", containers: 1 },
  { id: 15, name: "api-gateway-8f9g0h-8v9w0", namespace: "production", status: "Running", node: "worker-1", ip: "10.1.0.61", cpu: "50m", memory: "128Mi", restarts: 0, age: "14d", containers: 1 },
  { id: 16, name: "coredns-5d4c3b-1x2y3", namespace: "kube-system", status: "Running", node: "worker-1", ip: "10.1.0.71", cpu: "10m", memory: "24Mi", restarts: 0, age: "14d", containers: 1 },
  { id: 17, name: "coredns-5d4c3b-4a5b6", namespace: "kube-system", status: "Running", node: "worker-2", ip: "10.1.1.45", cpu: "10m", memory: "24Mi", restarts: 0, age: "14d", containers: 1 },
  { id: 18, name: "notification-svc-7c8d9e-7c8d9", namespace: "staging", status: "Running", node: "worker-2", ip: "10.1.1.52", cpu: "20m", memory: "48Mi", restarts: 0, age: "3d", containers: 1 },
];

// ──────────────────────────────────────────────
// Deployments (K8s)
// ──────────────────────────────────────────────
export const clusterDeployments = [
  { id: 1, name: "inventory-api", namespace: "production", replicas: 3, available: 3, upToDate: 3, strategy: "RollingUpdate", status: "Running", age: "14d", images: ["registry.local/inventory-api:v2.3.1"] },
  { id: 2, name: "auth-service", namespace: "production", replicas: 2, available: 2, upToDate: 2, strategy: "RollingUpdate", status: "Running", age: "14d", images: ["registry.local/auth-service:v1.8.0"] },
  { id: 3, name: "payment-api", namespace: "production", replicas: 2, available: 1, upToDate: 2, strategy: "RollingUpdate", status: "Updating", age: "7d", images: ["registry.local/payment-api:v3.0.2"] },
  { id: 4, name: "frontend-web", namespace: "production", replicas: 3, available: 3, upToDate: 3, strategy: "RollingUpdate", status: "Running", age: "7d", images: ["registry.local/frontend-web:v4.2.1"] },
  { id: 5, name: "cache-redis", namespace: "production", replicas: 2, available: 2, upToDate: 2, strategy: "Recreate", status: "Running", age: "7d", images: ["redis:7.2"] },
  { id: 6, name: "notification-svc", namespace: "staging", replicas: 1, available: 1, upToDate: 1, strategy: "RollingUpdate", status: "Running", age: "3d", images: ["registry.local/notification-svc:v1.0.1"] },
  { id: 7, name: "api-gateway", namespace: "production", replicas: 2, available: 2, upToDate: 2, strategy: "RollingUpdate", status: "Running", age: "14d", images: ["registry.local/api-gateway:v2.1.0"] },
];

// ──────────────────────────────────────────────
// ReplicaSets
// ──────────────────────────────────────────────
export const replicaSets = [
  { id: 1, name: "inventory-api-7d8f9c", namespace: "production", desired: 3, current: 3, ready: 3, age: "2h", images: ["registry.local/inventory-api:v2.3.1"] },
  { id: 2, name: "auth-service-3b4e2d", namespace: "production", desired: 2, current: 2, ready: 2, age: "5h", images: ["registry.local/auth-service:v1.8.0"] },
  { id: 3, name: "payment-api-5f6g7h", namespace: "production", desired: 2, current: 1, ready: 1, age: "30m", images: ["registry.local/payment-api:v3.0.2"] },
  { id: 4, name: "payment-api-5f6g7h-old", namespace: "production", desired: 0, current: 0, ready: 0, age: "1d", images: ["registry.local/payment-api:v3.0.1"] },
  { id: 5, name: "frontend-web-2a3b4c", namespace: "production", desired: 3, current: 3, ready: 3, age: "7d", images: ["registry.local/frontend-web:v4.2.1"] },
  { id: 6, name: "cache-redis-6d7e8f", namespace: "production", desired: 2, current: 2, ready: 2, age: "7d", images: ["redis:7.2"] },
  { id: 7, name: "notification-svc-7c8d9e", namespace: "staging", desired: 1, current: 1, ready: 1, age: "3d", images: ["registry.local/notification-svc:v1.0.1"] },
  { id: 8, name: "api-gateway-8f9g0h", namespace: "production", desired: 2, current: 2, ready: 2, age: "14d", images: ["registry.local/api-gateway:v2.1.0"] },
];

// ──────────────────────────────────────────────
// DaemonSets
// ──────────────────────────────────────────────
export const daemonSets = [
  { id: 1, name: "node-exporter", namespace: "monitoring", desired: 3, current: 3, ready: 3, available: 3, age: "14d", labels: { app: "node-exporter" } },
  { id: 2, name: "fluentd", namespace: "kube-system", desired: 3, current: 3, ready: 3, available: 3, age: "14d", labels: { app: "fluentd" } },
  { id: 3, name: "kube-proxy", namespace: "kube-system", desired: 3, current: 3, ready: 3, available: 3, age: "14d", labels: { app: "kube-proxy" } },
  { id: 4, name: "cilium-agent", namespace: "kube-system", desired: 3, current: 2, ready: 2, available: 2, age: "10d", labels: { app: "cilium" } },
];

// ──────────────────────────────────────────────
// StatefulSets
// ──────────────────────────────────────────────
export const statefulSets = [
  { id: 1, name: "postgres-db", namespace: "production", replicas: 1, ready: 1, service: "postgres-db", storage: "50Gi", status: "Running", age: "14d", images: ["postgres:15.4"] },
  { id: 2, name: "kafka-broker", namespace: "production", replicas: 3, ready: 2, service: "kafka-broker", storage: "100Gi", status: "Degraded", age: "10d", images: ["confluentinc/cp-kafka:7.5.0"] },
  { id: 3, name: "zookeeper", namespace: "production", replicas: 3, ready: 3, service: "zookeeper", storage: "20Gi", status: "Running", age: "10d", images: ["confluentinc/cp-zookeeper:7.5.0"] },
];

// ──────────────────────────────────────────────
// Services
// ──────────────────────────────────────────────
export const services = [
  { id: 1, name: "inventory-api", namespace: "production", type: "ClusterIP", clusterIP: "10.96.1.10", externalIP: "-", ports: "3000/TCP", selector: "app=inventory", age: "14d" },
  { id: 2, name: "auth-service", namespace: "production", type: "ClusterIP", clusterIP: "10.96.1.11", externalIP: "-", ports: "3001/TCP", selector: "app=auth", age: "14d" },
  { id: 3, name: "payment-api", namespace: "production", type: "ClusterIP", clusterIP: "10.96.1.12", externalIP: "-", ports: "3002/TCP", selector: "app=payment", age: "7d" },
  { id: 4, name: "frontend-web", namespace: "production", type: "LoadBalancer", clusterIP: "10.96.1.13", externalIP: "192.168.1.100", ports: "80:30080/TCP,443:30443/TCP", selector: "app=frontend", age: "7d" },
  { id: 5, name: "cache-redis", namespace: "production", type: "ClusterIP", clusterIP: "10.96.1.14", externalIP: "-", ports: "6379/TCP", selector: "app=cache-redis", age: "7d" },
  { id: 6, name: "postgres-db", namespace: "production", type: "ClusterIP", clusterIP: "10.96.1.15", externalIP: "-", ports: "5432/TCP", selector: "app=postgres", age: "14d" },
  { id: 7, name: "api-gateway", namespace: "production", type: "LoadBalancer", clusterIP: "10.96.1.16", externalIP: "192.168.1.101", ports: "8080:30080/TCP", selector: "app=gateway", age: "14d" },
  { id: 8, name: "kafka-broker", namespace: "production", type: "ClusterIP", clusterIP: "10.96.1.17", externalIP: "-", ports: "9092/TCP", selector: "app=kafka", age: "10d" },
  { id: 9, name: "notification-svc", namespace: "staging", type: "ClusterIP", clusterIP: "10.96.2.10", externalIP: "-", ports: "3003/TCP", selector: "app=notification", age: "3d" },
  { id: 10, name: "kubernetes", namespace: "default", type: "ClusterIP", clusterIP: "10.96.0.1", externalIP: "-", ports: "443/TCP", selector: "-", age: "14d" },
];

// ──────────────────────────────────────────────
// Ingress
// ──────────────────────────────────────────────
export const ingresses = [
  { id: 1, name: "api-gateway-ingress", namespace: "production", hosts: "api.clouddeploy.local", addresses: "192.168.1.101", ports: "80, 443", tls: "clouddeploy-tls", age: "14d" },
  { id: 2, name: "frontend-ingress", namespace: "production", hosts: "app.clouddeploy.local", addresses: "192.168.1.100", ports: "80, 443", tls: "clouddeploy-tls", age: "7d" },
  { id: 3, name: "monitoring-ingress", namespace: "monitoring", hosts: "monitor.clouddeploy.local", addresses: "192.168.1.102", ports: "80", tls: "-", age: "7d" },
];

// ──────────────────────────────────────────────
// Persistent Volumes
// ──────────────────────────────────────────────
export const persistentVolumes = [
  { id: 1, name: "pv-postgres-data", capacity: "50Gi", accessModes: "RWO", reclaim: "Retain", status: "Bound", storageClass: "standard", claim: "production/postgres-db-pvc", age: "14d" },
  { id: 2, name: "pv-kafka-data", capacity: "100Gi", accessModes: "RWO", reclaim: "Retain", status: "Bound", storageClass: "fast-ssd", claim: "production/kafka-broker-pvc", age: "10d" },
  { id: 3, name: "pv-zookeeper-data", capacity: "20Gi", accessModes: "RWO", reclaim: "Retain", status: "Bound", storageClass: "standard", claim: "production/zookeeper-pvc", age: "10d" },
  { id: 4, name: "pv-backup-storage", capacity: "500Gi", accessModes: "RWX", reclaim: "Retain", status: "Available", storageClass: "slow-hdd", claim: "-", age: "14d" },
  { id: 5, name: "pv-ci-cache", capacity: "100Gi", accessModes: "RWO", reclaim: "Delete", status: "Released", storageClass: "standard", claim: "default/ci-cache-pvc", age: "5d" },
  { id: 6, name: "pv-elastic-data", capacity: "200Gi", accessModes: "RWO", reclaim: "Retain", status: "Bound", storageClass: "fast-ssd", claim: "logging/elastic-pvc", age: "7d" },
];

// ──────────────────────────────────────────────
// Persistent Volume Claims
// ──────────────────────────────────────────────
export const persistentVolumeClaims = [
  { id: 1, name: "postgres-db-pvc", namespace: "production", status: "Bound", volume: "pv-postgres-data", capacity: "50Gi", accessModes: "RWO", storageClass: "standard", age: "14d" },
  { id: 2, name: "kafka-broker-pvc", namespace: "production", status: "Bound", volume: "pv-kafka-data", capacity: "100Gi", accessModes: "RWO", storageClass: "fast-ssd", age: "10d" },
  { id: 3, name: "zookeeper-pvc", namespace: "production", status: "Bound", volume: "pv-zookeeper-data", capacity: "20Gi", accessModes: "RWO", storageClass: "standard", age: "10d" },
  { id: 4, name: "ci-cache-pvc", namespace: "default", status: "Lost", volume: "pv-ci-cache", capacity: "100Gi", accessModes: "RWO", storageClass: "standard", age: "5d" },
  { id: 5, name: "elastic-pvc", namespace: "logging", status: "Bound", volume: "pv-elastic-data", capacity: "200Gi", accessModes: "RWO", storageClass: "fast-ssd", age: "7d" },
  { id: 6, name: "temp-storage-pvc", namespace: "staging", status: "Pending", volume: "-", capacity: "10Gi", accessModes: "RWO", storageClass: "standard", age: "1h" },
];

// ──────────────────────────────────────────────
// ConfigMaps
// ──────────────────────────────────────────────
export const configMaps = [
  { id: 1, name: "app-config", namespace: "production", data: 8, age: "14d" },
  { id: 2, name: "logging-config", namespace: "production", data: 3, age: "7d" },
  { id: 3, name: "nginx-config", namespace: "production", data: 2, age: "7d" },
  { id: 4, name: "fluentd-config", namespace: "kube-system", data: 5, age: "14d" },
  { id: 5, name: "kube-proxy-config", namespace: "kube-system", data: 1, age: "14d" },
  { id: 6, name: "staging-app-config", namespace: "staging", data: 6, age: "3d" },
];

// ──────────────────────────────────────────────
// Secrets
// ──────────────────────────────────────────────
export const secrets = [
  { id: 1, name: "db-credentials", namespace: "production", type: "Opaque", data: 4, age: "14d" },
  { id: 2, name: "jwt-secret", namespace: "production", type: "Opaque", data: 1, age: "14d" },
  { id: 3, name: "clouddeploy-tls", namespace: "production", type: "kubernetes.io/tls", data: 2, age: "14d" },
  { id: 4, name: "api-keys", namespace: "production", type: "Opaque", data: 6, age: "7d" },
  { id: 5, name: "docker-registry", namespace: "default", type: "kubernetes.io/dockerconfigjson", data: 1, age: "14d" },
  { id: 6, name: "staging-db-cred", namespace: "staging", type: "Opaque", data: 4, age: "3d" },
  { id: 7, name: "monitoring-token", namespace: "monitoring", type: "Opaque", data: 2, age: "7d" },
];

// ──────────────────────────────────────────────
// Events
// ──────────────────────────────────────────────
export const events = [
  { id: 1, namespace: "production", type: "Normal", reason: "ScalingReplicaSet", source: "deployment-controller", message: "Scaled up replica set inventory-api-7d8f9c to 3", count: 1, firstSeen: "2h", lastSeen: "2h" },
  { id: 2, namespace: "production", type: "Normal", reason: "SuccessfulCreate", source: "replicaset-controller", message: "Created pod inventory-api-7d8f9c-6x4k2", count: 1, firstSeen: "2h", lastSeen: "2h" },
  { id: 3, namespace: "production", type: "Normal", reason: "SuccessfulCreate", source: "replicaset-controller", message: "Created pod inventory-api-7d8f9c-9w3b7", count: 1, firstSeen: "2h", lastSeen: "2h" },
  { id: 4, namespace: "production", type: "Normal", reason: "SuccessfulCreate", source: "replicaset-controller", message: "Created pod inventory-api-7d8f9c-f2m1p", count: 1, firstSeen: "2h", lastSeen: "2h" },
  { id: 5, namespace: "production", type: "Normal", reason: "ScalingReplicaSet", source: "deployment-controller", message: "Scaled up replica set payment-api-5f6g7h to 2", count: 1, firstSeen: "30m", lastSeen: "30m" },
  { id: 6, namespace: "production", type: "Warning", reason: "BackOff", source: "kubelet", message: "Back-off restarting failed container payment-api in pod payment-api-5f6g7h-4c5d6", count: 5, firstSeen: "30m", lastSeen: "5m" },
  { id: 7, namespace: "default", type: "Warning", reason: "CrashLoopBackOff", source: "kubelet", message: "Pod log-processor-9x8y7z-3f4g5 is in CrashLoopBackOff (12 restarts)", count: 12, firstSeen: "6d", lastSeen: "10m" },
  { id: 8, namespace: "production", type: "Normal", reason: "Pulling", source: "kubelet", message: "Pulling image registry.local/inventory-api:v2.3.1", count: 1, firstSeen: "2h", lastSeen: "2h" },
  { id: 9, namespace: "production", type: "Normal", reason: "Pulled", source: "kubelet", message: "Successfully pulled image registry.local/inventory-api:v2.3.1", count: 1, firstSeen: "2h", lastSeen: "2h" },
  { id: 10, namespace: "development", type: "Normal", reason: "Scheduled", source: "default-scheduler", message: "Successfully assigned ml-inference-1a2b3c-5t6u7 to worker-1", count: 1, firstSeen: "30m", lastSeen: "30m" },
  { id: 11, namespace: "production", type: "Warning", reason: "Unhealthy", source: "kubelet", message: "Liveness probe failed: HTTP probe failed with statuscode 500", count: 3, firstSeen: "1h", lastSeen: "30m" },
  { id: 12, namespace: "kube-system", type: "Normal", reason: "NodeReady", source: "kubelet", message: "Node control-plane-1 status is now Ready", count: 1, firstSeen: "14d", lastSeen: "14d" },
  { id: 13, namespace: "kube-system", type: "Warning", reason: "ImagePullBackOff", source: "kubelet", message: "Failed to pull image cilium/cilium:v1.14.0 on node worker-2", count: 8, firstSeen: "10d", lastSeen: "5m" },
];
