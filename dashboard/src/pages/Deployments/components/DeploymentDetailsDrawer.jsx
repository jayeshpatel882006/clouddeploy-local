import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Clock,
  RefreshCw,
  ExternalLink,
  Info,
  Server,
  FileCode,
  Clock as TimelineIcon,
  Terminal,
  Link as LinkIcon,
} from "lucide-react";
import DeploymentStatusBadge from "./DeploymentStatusBadge";
import OverviewTab from "./OverviewTab";
import KubernetesTab from "./KubernetesTab";
import ManifestsTab from "./ManifestsTab";
import TimelineTab from "./TimelineTab";
import LogsTab from "./LogsTab";

// ─── Tab configuration ───────────────────────

const TABS = [
  { id: "overview", label: "Overview", icon: Info },
  { id: "kubernetes", label: "Kubernetes", icon: Server },
  { id: "manifests", label: "Manifests", icon: FileCode },
  { id: "timeline", label: "Timeline", icon: TimelineIcon },
  { id: "logs", label: "Logs", icon: Terminal },
];

// ─── Component ───────────────────────────────

const DeploymentDetailsDrawer = ({ deployment, onClose }) => {
  const [activeTab, setActiveTab] = useState("overview");
  // Track which tabs have been visited so they stay mounted (no re-fetch on return)
  const [visitedTabs, setVisitedTabs] = useState(() => new Set(["overview"]));

  // Stabilize onClose to prevent effect re-runs when parent recreates it
  const stableOnClose = useCallback(() => {
    onClose?.();
  }, [onClose]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") stableOnClose();
    };
    if (deployment) {
      document.addEventListener("keydown", handleKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [deployment, stableOnClose]);

  // Reset tabs when deployment changes
  useEffect(() => {
    setActiveTab("overview");
    setVisitedTabs(new Set(["overview"]));
  }, [deployment?.id]);

  const handleTabChange = useCallback((tabId) => {
    setActiveTab(tabId);
    setVisitedTabs((prev) => {
      if (prev.has(tabId)) return prev;
      return new Set([...prev, tabId]);
    });
  }, []);

  const isRunning = deployment?.status === "RUNNING";

  // ── Tab components map (for conditional rendering) ──
  const tabComponents = {
    overview: OverviewTab,
    kubernetes: KubernetesTab,
    manifests: ManifestsTab,
    timeline: TimelineTab,
    logs: LogsTab,
  };

  return (
    <AnimatePresence>
      {deployment && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Drawer panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 z-50 h-full w-full max-w-lg border-l border-slate-800 bg-slate-950 shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
              <h2 className="text-base font-semibold text-white">
                Deployment Details
              </h2>
              <button
                onClick={onClose}
                className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="flex h-[calc(100%-57px)] flex-col">
              {/* Deployment summary header */}
              <div className="border-b border-slate-800 px-5 py-4">
                <div className="flex items-center gap-2.5">
                  <h3 className="text-lg font-semibold text-white truncate">
                    {deployment.name}
                  </h3>
                  <DeploymentStatusBadge status={deployment.status} size="md" />
                </div>
                {deployment.repositoryUrl && (
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500 truncate">
                    <LinkIcon size={12} />
                    {deployment.repositoryUrl.replace(/^https?:\/\//, "")}
                  </p>
                )}

                {/* Status bar */}
                <div className="mt-3 flex items-center gap-4 rounded-lg border border-slate-800 bg-slate-900/30 px-4 py-2.5">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Clock size={13} />
                    Created {deployment.createdAtFormatted || deployment.created}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <RefreshCw size={13} />
                    Updated {deployment.updatedAtFormatted || deployment.updated}
                  </div>
                </div>

                {/* Preview link */}
                {isRunning && deployment.previewUrl && (
                  <a
                    href={deployment.previewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 flex items-center justify-center gap-2 rounded-lg bg-green-600/10 px-4 py-2.5 text-sm font-medium text-green-400 transition-colors hover:bg-green-600/20 border border-green-500/20"
                  >
                    <ExternalLink size={16} />
                    Open Application
                  </a>
                )}
              </div>

              {/* Tab navigation */}
              <div className="flex border-b border-slate-800 overflow-x-auto px-5 [&::-webkit-scrollbar]:h-0">
                {TABS.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleTabChange(tab.id)}
                      className={`flex items-center gap-1.5 whitespace-nowrap border-b-2 px-3 py-3 text-xs font-medium transition-colors ${
                        isActive
                          ? "border-[var(--accent)] text-[var(--accent-light)]"
                          : "border-transparent text-slate-500 hover:text-slate-300 hover:border-slate-600"
                      }`}
                    >
                      <Icon size={14} />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Tab content — visited tabs stay mounted to avoid re-fetching */}
              <div className="flex-1 overflow-y-auto p-5 relative">
                {TABS.map((tab) => {
                  if (!visitedTabs.has(tab.id)) return null;
                  const TabComponent = tabComponents[tab.id];
                  if (!TabComponent) return null;
                  return (
                    <div
                      key={tab.id}
                      className={activeTab === tab.id ? "" : "hidden"}
                    >
                      <TabComponent deployment={deployment} />
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default DeploymentDetailsDrawer;
