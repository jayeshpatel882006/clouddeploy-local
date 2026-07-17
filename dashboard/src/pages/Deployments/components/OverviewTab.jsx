import { useState, useEffect, useRef } from "react";
import {
  Hash,
  Box,
  ExternalLink,
  GitBranch,
  FolderGit2,
  Calendar,
  Container,
  Loader2,
  AlertCircle,
  FileCode,
} from "lucide-react";
import { getDeploymentOverview } from "@/api/deploymentDetails.api";
import DeploymentStatusBadge from "./DeploymentStatusBadge";

const safeValue = (val) => {
  if (val === null || val === undefined) return "—";
  if (typeof val === "string") return val;
  if (typeof val === "number") return String(val);
  if (typeof val === "object") {
    // Some APIs return repository as { url, branch } instead of a string
    if (val.url) return val.url;
    try {
      return JSON.stringify(val);
    } catch {
      return "—";
    }
  }
  return String(val);
};

const OverviewRow = ({ icon: Icon, label, value }) => {
  const display = safeValue(value);
  return (
    <div className="flex items-center justify-between rounded-lg bg-slate-900/50 px-3.5 py-2.5 gap-2">
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="rounded-md bg-slate-800 p-1.5 text-slate-400 shrink-0">
          <Icon size={14} />
        </div>
        <span className="text-xs text-slate-500 truncate">{label}</span>
      </div>
      <span className="text-sm font-medium text-slate-200 text-right break-all max-w-[55%] sm:max-w-[180px] sm:truncate">
        {display}
      </span>
    </div>
  );
};

const OverviewTab = ({ deployment, onError }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mountedRef = useRef(true);

  const projectName = deployment?.projectName || deployment?.name;

  useEffect(() => {
    mountedRef.current = true;

    const fetchOverview = async () => {
      if (!projectName) {
        setLoading(false);
        setError("No project name available");
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const result = await getDeploymentOverview(projectName);
        if (mountedRef.current) {
          setData(result);
        }
      } catch (err) {
        if (mountedRef.current) {
          const msg = err.message || "Failed to load overview";
          setError(msg);
          onError?.(msg);
        }
      } finally {
        if (mountedRef.current) setLoading(false);
      }
    };

    fetchOverview();

    return () => {
      mountedRef.current = false;
    };
  }, [projectName, onError]);

  // ── Loading state ──
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 size={20} className="animate-spin text-slate-400" />
        <span className="ml-2.5 text-sm text-slate-500">Loading overview...</span>
      </div>
    );
  }

  // ── Error state ──
  if (error) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-8">
        <AlertCircle size={24} className="text-red-400" />
        <p className="text-sm text-red-400">{error}</p>
      </div>
    );
  }

  // ── Empty state ──
  if (!data) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-lg border border-slate-700 bg-slate-900/30 px-4 py-8">
        <FileCode size={24} className="text-slate-600" />
        <p className="text-sm text-slate-500">No overview data available</p>
      </div>
    );
  }

  // ── Extract fields from response ──
  const overview = data.data || data;
  const status = overview.status || deployment?.status;

  return (
    <div className="space-y-4">
      {/* Status row */}
      <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/30 px-4 py-3">
        <span className="text-xs text-slate-500">Status</span>
        <DeploymentStatusBadge status={status} size="md" showIcon />
      </div>

      {/* Key info */}
      <div className="space-y-2">
        <OverviewRow icon={Container} label="Project Name" value={overview.projectName || deployment?.name} />
        <OverviewRow icon={FolderGit2} label="Repository" value={overview.repository || deployment?.repositoryUrl} />
        <OverviewRow icon={GitBranch} label="Branch" value={overview.branch || deployment?.branch || "main"} />
        {overview.repository?.branch && (
          <OverviewRow icon={GitBranch} label="Repo Branch" value={overview.repository.branch} />
        )}
        <OverviewRow icon={Hash} label="Image" value={overview.image || deployment?.image} />
        <OverviewRow icon={Hash} label="Image Tag" value={overview.imageTag || "latest"} />
        <OverviewRow icon={Box} label="Namespace" value={overview.namespace || deployment?.namespace || "default"} />
      </div>

      {/* Ports & Resources */}
      {(overview.containerPort || overview.servicePort) && (
        <div>
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Networking
          </h4>
          <div className="space-y-2">
            {overview.containerPort && (
              <OverviewRow icon={ExternalLink} label="Container Port" value={String(overview.containerPort)} />
            )}
            {overview.servicePort && (
              <OverviewRow icon={ExternalLink} label="Service Port" value={String(overview.servicePort)} />
            )}
          </div>
        </div>
      )}

      {/* Preview URL */}
      {status === "RUNNING" && overview.previewUrl && (
        <a
          href={overview.previewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 rounded-lg bg-green-600/10 px-4 py-3 text-sm font-medium text-green-400 transition-colors hover:bg-green-600/20 border border-green-500/20"
        >
          <ExternalLink size={16} />
          Open Application
        </a>
      )}

      {/* Dates */}
      {overview.createdAt && (
        <div>
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Timeline
          </h4>
          <div className="space-y-2">
            <OverviewRow icon={Calendar} label="Deployed At" value={new Date(overview.createdAt).toLocaleString()} />
          </div>
        </div>
      )}
    </div>
  );
};

export default OverviewTab;
