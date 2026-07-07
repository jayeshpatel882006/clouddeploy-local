// ==========================================
// Settings Service
// Handles persistence of user settings via localStorage.
// Architecture allows swapping to backend persistence later
// without changing UI components.
// ==========================================

const STORAGE_KEY = "clouddeploy_settings";

// ─── Defaults ──────────────────────────────
export const DEFAULT_SETTINGS = {
  // General
  theme: "system",
  language: "en-US",
  timezone: "Asia/Kolkata",

  // Theme / Appearance
  colorScheme: "dark",
  accentColor: "blue",
  sidebarPosition: "left",
  fontSize: "medium",
  codeFont: "monospace",
  reducedMotion: false,
  compactMode: false,

  // General extras
  platformName: "CloudDeploy",
  autoRefreshInterval: "30",
  telemetryEnabled: true,

  // Docker
  docker: {
    socketPath: "/var/run/docker.sock",
    registryMirrors: "https://mirror.gcr.io,https://dockerhub.timeweb.cloud",
    insecureRegistries: "registry.local:5000",
    storageDriver: "overlay2",
    experimentalFeatures: false,
    dataRoot: "/var/lib/docker",
    logDriver: "json-file",
    maxLogSize: "10m",
  },

  // Kubernetes
  kubernetes: {
    kubeconfigPath: "~/.kube/config",
    defaultNamespace: "default",
    contextName: "minikube",
    clusterEndpoint: "https://127.0.0.1:6443",
    connectionTimeout: "30",
    podLogRetention: "7",
    maxPodsPerNode: "110",
    enableAudit: true,
  },

  // Registry
  registry: {
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
  },

  // Floci
  floci: {
    flociPath: "/usr/local/bin/floci",
    defaultBuildArgs: "--build-arg NODE_ENV=production",
    buildTimeout: "600",
    cacheEnabled: true,
    cachePath: "/tmp/floci-cache",
    outputFormat: "json",
    parallelBuilds: "4",
    pushAfterBuild: true,
    defaultRegistry: "registry.local:5000",
  },

  // Profile
  profile: {
    name: "Jayesh Patel",
    email: "jayesh@clouddeploy.local",
    avatarUrl: "",
    bio: "Platform engineer & Kubernetes enthusiast",
    sshKeys: [
      { id: 1, name: "Work Laptop", key: "ssh-rsa AAAAB3NzaC1yc2EAAAADAQAB...", added: "2 months ago" },
      { id: 2, name: "Home Desktop", key: "ssh-rsa AAAAB3NzaC1yc2EAAAADAQAB...", added: "1 month ago" },
      { id: 3, name: "CI/CD Runner", key: "ssh-rsa AAAAB3NzaC1yc2EAAAADAQAB...", added: "3 weeks ago" },
    ],
    apiTokens: [
      { id: 1, name: "deploy-bot", token: "cdp_8xR3...mK9j", created: "1 month ago", lastUsed: "2 hours ago" },
      { id: 2, name: "ci-pipeline", token: "cdp_pL5v...wQ2n", created: "2 months ago", lastUsed: "1 day ago" },
      { id: 3, name: "monitoring", token: "cdp_hT8b...xR4m", created: "3 months ago", lastUsed: "1 week ago" },
    ],
  },

  // Notifications
  notifications: {
    emailNotifications: true,
    emailAddress: "jayesh@clouddeploy.local",
    webhookUrl: "",
    slackWebhook: "",
    notificationLevels: { critical: true, warning: true, info: true, success: false },
    digestFrequency: "daily",
    deploymentAlerts: true,
    systemAlerts: true,
    securityAlerts: true,
  },
};

// ─── Helpers ───────────────────────────────

const isBrowser = typeof window !== "undefined";

const safeJsonParse = (str, fallback) => {
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
};

const deepMerge = (target, source) => {
  const result = { ...target };
  for (const key of Object.keys(source)) {
    if (source[key] && typeof source[key] === "object" && !Array.isArray(source[key])) {
      result[key] = deepMerge(result[key] || {}, source[key]);
    } else {
      result[key] = source[key] !== undefined ? source[key] : result[key];
    }
  }
  return result;
};

// ─── API ───────────────────────────────────

export const loadSettings = () => {
  if (!isBrowser) return { ...DEFAULT_SETTINGS };

  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return { ...DEFAULT_SETTINGS };

  const parsed = safeJsonParse(raw, {});
  return deepMerge({ ...DEFAULT_SETTINGS }, parsed);
};

export const saveSettings = (settings) => {
  if (!isBrowser) return;

  const toStore = { ...settings };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
};

export const resetSettings = () => {
  if (!isBrowser) return;

  localStorage.removeItem(STORAGE_KEY);
  return { ...DEFAULT_SETTINGS };
};

export const getSystemTheme = () => {
  if (!isBrowser) return "dark";
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
};

export default {
  loadSettings,
  saveSettings,
  resetSettings,
  DEFAULT_SETTINGS,
  getSystemTheme,
};
