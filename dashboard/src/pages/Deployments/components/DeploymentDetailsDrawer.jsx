import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Clock,
  RefreshCw,
  ExternalLink,
  GitBranch,
  Globe,
  Hash,
  Box,
  Link as LinkIcon,
} from "lucide-react";
import DeploymentStatusBadge from "./DeploymentStatusBadge";

const DetailRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-center justify-between rounded-lg bg-slate-900/50 px-3.5 py-2.5">
    <div className="flex items-center gap-2.5">
      <div className="rounded-md bg-slate-800 p-1.5 text-slate-400">
        <Icon size={14} />
      </div>
      <span className="text-xs text-slate-500">{label}</span>
    </div>
    <span className="text-sm font-medium text-slate-200">{value || "—"}</span>
  </div>
);

const Section = ({ title, children }) => (
  <div className="space-y-2.5">
    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
      {title}
    </h4>
    {children}
  </div>
);

const DeploymentDetailsDrawer = ({ deployment, onClose }) => {
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (deployment) {
      document.addEventListener("keydown", handleKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [deployment, onClose]);

  const isRunning = deployment?.status === "RUNNING";

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
            <div className="h-[calc(100%-57px)] overflow-y-auto p-5">
              <div className="space-y-6">
                {/* Header info */}
                <div>
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-lg font-semibold text-white">
                      {deployment.name}
                    </h3>
                    <DeploymentStatusBadge status={deployment.status} size="md" />
                  </div>
                  {deployment.repositoryUrl && (
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
                      <LinkIcon size={12} />
                      {deployment.repositoryUrl.replace(/^https?:\/\//, "")}
                    </p>
                  )}
                </div>

                {/* Status bar */}
                <div className="flex items-center gap-4 rounded-lg border border-slate-800 bg-slate-900/30 px-4 py-3">
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
                    className="flex items-center justify-center gap-2 rounded-lg bg-green-600/10 px-4 py-3 text-sm font-medium text-green-400 transition-colors hover:bg-green-600/20 border border-green-500/20"
                  >
                    <ExternalLink size={16} />
                    Open Application
                  </a>
                )}

                {/* Configuration */}
                <Section title="Configuration">
                  <DetailRow icon={Hash} label="Branch" value={deployment.branch} />
                  <DetailRow icon={Box} label="Namespace" value={deployment.namespace} />
                  <DetailRow icon={Globe} label="Status" value={deployment.status} />
                  <DetailRow
                    icon={ExternalLink}
                    label="Preview URL"
                    value={deployment.previewUrl || "Not available"}
                  />
                </Section>

                {/* Source */}
                <Section title="Source">
                  <DetailRow
                    icon={LinkIcon}
                    label="Repository"
                    value={
                      deployment.repositoryUrl
                        ? deployment.repositoryUrl.split("/").pop().replace(".git", "")
                        : "—"
                    }
                  />
                  <DetailRow
                    icon={GitBranch}
                    label="Branch"
                    value={deployment.branch || "main"}
                  />
                </Section>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default DeploymentDetailsDrawer;
