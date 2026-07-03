export const generalDefaults = {
  platformName: "CloudDeploy",
  timezone: "UTC",
  language: "en-US",
  autoRefreshInterval: "30",
  telemetryEnabled: true,
};

export const dockerDefaults = {
  socketPath: "/var/run/docker.sock",
  registryMirrors: "https://mirror.gcr.io,https://dockerhub.timeweb.cloud",
  insecureRegistries: "registry.local:5000",
  storageDriver: "overlay2",
  experimentalFeatures: false,
  dataRoot: "/var/lib/docker",
  logDriver: "json-file",
  maxLogSize: "10m",
};

export const kubernetesDefaults = {
  kubeconfigPath: "~/.kube/config",
  defaultNamespace: "default",
  contextName: "minikube",
  clusterEndpoint: "https://127.0.0.1:6443",
  connectionTimeout: "30",
  podLogRetention: "7",
  maxPodsPerNode: "110",
  enableAudit: true,
};

export const registryDefaults = {
  registryUrl: "registry.local:5000",
  authEnabled: true,
  username: "admin",
  password: "••••••••••••",
  storagePath: "/data/registry",
  tlsEnabled: true,
  tlsCertPath: "/etc/registry/certs/cert.pem",
  tlsKeyPath: "/etc/registry/certs/key.pem",
  garbageCollectionInterval: "24h",
  maxImageAge: "90",
  readOnly: false,
};

export const flociDefaults = {
  flociPath: "/usr/local/bin/floci",
  defaultBuildArgs: "--build-arg NODE_ENV=production",
  buildTimeout: "600",
  cacheEnabled: true,
  cachePath: "/tmp/floci-cache",
  outputFormat: "json",
  parallelBuilds: "4",
  pushAfterBuild: true,
  defaultRegistry: "registry.local:5000",
};

export const profileDefaults = {
  name: "Jayesh Patel",
  email: "jayesh@clouddeploy.local",
  avatarUrl: "",
  bio: "Platform engineer & Kubernetes enthusiast",
  sshKeys: [
    {
      id: 1,
      name: "Work Laptop",
      key: "ssh-rsa AAAAB3NzaC1yc2EAAAADAQAB...",
      added: "2 months ago",
    },
    {
      id: 2,
      name: "Home Desktop",
      key: "ssh-rsa AAAAB3NzaC1yc2EAAAADAQAB...",
      added: "1 month ago",
    },
    {
      id: 3,
      name: "CI/CD Runner",
      key: "ssh-rsa AAAAB3NzaC1yc2EAAAADAQAB...",
      added: "3 weeks ago",
    },
  ],
  apiTokens: [
    {
      id: 1,
      name: "deploy-bot",
      token: "cdp_8xR3...mK9j",
      created: "1 month ago",
      lastUsed: "2 hours ago",
    },
    {
      id: 2,
      name: "ci-pipeline",
      token: "cdp_pL5v...wQ2n",
      created: "2 months ago",
      lastUsed: "1 day ago",
    },
    {
      id: 3,
      name: "monitoring",
      token: "cdp_hT8b...xR4m",
      created: "3 months ago",
      lastUsed: "1 week ago",
    },
  ],
};

export const themeDefaults = {
  colorScheme: "dark",
  accentColor: "blue",
  sidebarPosition: "left",
  fontSize: "medium",
  codeFont: "monospace",
  reducedMotion: false,
  compactMode: false,
};

export const notificationDefaults = {
  emailNotifications: true,
  emailAddress: "jayesh@clouddeploy.local",
  webhookUrl: "",
  slackWebhook: "",
  notificationLevels: {
    critical: true,
    warning: true,
    info: true,
    success: false,
  },
  digestFrequency: "daily",
  deploymentAlerts: true,
  systemAlerts: true,
  securityAlerts: true,
};

export const aboutInfo = {
  version: "v2.4.1",
  buildNumber: "2026.06.15-1842",
  lastUpdated: "June 15, 2026",
  license: "MIT License",
  nodeVersion: "v20.14.0",
  npmVersion: "10.8.1",
  os: "Linux x86_64 (WSL2)",
  kernel: "6.8.0-35-generic",
  dockerVersion: "27.0.3",
  kubernetesVersion: "v1.30.2",
};
