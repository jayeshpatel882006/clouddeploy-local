import { useState, useEffect, useRef, useMemo } from "react";
import {
  Loader2,
  AlertCircle,
  Terminal,
  Info,
  AlertTriangle,
  XCircle,
  Bug,
  Filter,
} from "lucide-react";
import { getApplicationLogs } from "@/api/deploymentDetails.api";

const LEVEL_STYLES = {
  INFO: {
    badge: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    dot: "bg-blue-500",
    icon: Info,
  },
  WARN: {
    badge: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    dot: "bg-yellow-500",
    icon: AlertTriangle,
  },
  ERROR: {
    badge: "bg-red-500/10 text-red-400 border-red-500/20",
    dot: "bg-red-500",
    icon: XCircle,
  },
  DEBUG: {
    badge: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    dot: "bg-purple-500",
    icon: Bug,
  },
};

const getLevelStyle = (level) => LEVEL_STYLES[level] || LEVEL_STYLES.INFO;

const LogLevelBadge = ({ level }) => {
  const style = getLevelStyle(level);
  return (
    <span
      className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${style.badge}`}
    >
      <span className={`h-1 w-1 rounded-full ${style.dot}`} />
      {level || "UNKNOWN"}
    </span>
  );
};

const LogEntryRow = ({ entry }) => {
  const level = entry.level || "INFO";
  const isError = level === "ERROR";
  const bgClass = isError ? "bg-red-500/5" : "";

  return (
    <div className={`flex items-start gap-3 rounded-lg px-3.5 py-2.5 ${bgClass} hover:bg-slate-800/40 transition-colors max-sm:flex-col max-sm:gap-1.5`}>
      {/* Timestamp + Level row (stacked on mobile) */}
      <div className="flex items-center gap-2 shrink-0 max-sm:w-full max-sm:justify-between">
        <span className="text-xs text-slate-500 font-mono whitespace-nowrap">
          {entry.displayTime || (entry.timestamp ? new Date(entry.timestamp).toLocaleTimeString() : "")}
        </span>
        <LogLevelBadge level={level} />
      </div>

      {/* Message */}
      <p className={`text-xs leading-relaxed min-w-0 break-words ${
        isError ? "text-red-300" : level === "WARN" ? "text-yellow-300" : "text-slate-300"
      }`}>
        {entry.message}
      </p>
    </div>
  );
};

const LogsTab = ({ deployment, onError }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [levelFilter, setLevelFilter] = useState("all");
  const mountedRef = useRef(true);

  const projectName = deployment?.projectName || deployment?.name;

  useEffect(() => {
    mountedRef.current = true;

    const fetchLogs = async () => {
      if (!projectName) {
        setLoading(false);
        setError("No project name available");
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const result = await getApplicationLogs(projectName);
        if (mountedRef.current) {
          setData(result);
        }
      } catch (err) {
        if (mountedRef.current) {
          const msg = err.message || "Failed to load logs";
          setError(msg);
          onError?.(msg);
        }
      } finally {
        if (mountedRef.current) setLoading(false);
      }
    };

    fetchLogs();

    return () => {
      mountedRef.current = false;
    };
  }, [projectName, onError]);

  // ── Filtered logs ──
  const logs = data?.logs || [];
  const summary = data?.summary || null;
  const podInfo = data?.pod || null;

  const filteredLogs = useMemo(() => {
    if (levelFilter === "all") return logs;
    return logs.filter((entry) => (entry.level || "INFO") === levelFilter);
  }, [logs, levelFilter]);

  // ── Loading state ──
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 size={20} className="animate-spin text-slate-400" />
        <span className="ml-2.5 text-sm text-slate-500">Loading logs...</span>
      </div>
    );
  }

  // ── Error state ──
  if (error) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-8">
        <AlertCircle size={24} className="text-red-400" />
        <p className="text-sm text-red-400">{error}</p>
        <p className="text-xs text-slate-500">Logs may not be available for this deployment.</p>
      </div>
    );
  }

  const LEVELS = ["all", "INFO", "WARN", "ERROR", "DEBUG"];

  return (
    <div className="space-y-4">
      {/* Pod info */}
      {podInfo && (
        <div className="rounded-lg border border-slate-800 bg-slate-900/30 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal size={14} className="text-slate-500" />
              <span className="text-xs text-slate-400 font-mono truncate max-w-[200px]">
                {podInfo.name}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span>Phase: {podInfo.phase || "—"}</span>
              {podInfo.restartCount !== undefined && (
                <span>Restarts: {podInfo.restartCount}</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Summary */}
      {summary && (
        <div className="flex flex-wrap gap-2">
          {[
            { label: "Total", value: summary.totalLogs, color: "text-slate-400" },
            { label: "Errors", value: summary.errors, color: "text-red-400" },
            { label: "Warnings", value: summary.warnings, color: "text-yellow-400" },
            { label: "Info", value: summary.info, color: "text-blue-400" },
            { label: "Debug", value: summary.debug, color: "text-purple-400" },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-1.5 rounded-md border border-slate-700 bg-slate-900/50 px-2.5 py-1.5"
            >
              <span className="text-xs text-slate-500">{item.label}</span>
              <span className={`text-xs font-semibold ${item.color}`}>{item.value ?? 0}</span>
            </div>
          ))}
        </div>
      )}

      {/* Level filter */}
      {logs.length > 0 && (
        <div className="flex items-center gap-2">
          <Filter size={13} className="text-slate-500" />
          <div className="flex flex-wrap gap-1.5">
            {LEVELS.map((level) => (
              <button
                key={level}
                onClick={() => setLevelFilter(level)}
                className={`rounded-md border px-2.5 py-1 text-xs font-medium transition-colors ${
                  levelFilter === level
                    ? "bg-[var(--accent-bg)] text-[var(--accent-light)] border-[var(--accent-border)]"
                    : "text-slate-500 border-slate-700 hover:text-slate-300 hover:border-slate-600"
                }`}
              >
                {level === "all" ? "All" : level}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {logs.length === 0 && (
        <div className="flex flex-col items-center gap-3 rounded-lg border border-slate-700 bg-slate-900/30 px-4 py-8">
          <Terminal size={24} className="text-slate-600" />
          <p className="text-sm text-slate-500">No logs available</p>
          <p className="text-xs text-slate-600">
            Logs will appear once the deployment starts running.
          </p>
        </div>
      )}

      {/* No matching filter */}
      {logs.length > 0 && filteredLogs.length === 0 && (
        <div className="flex flex-col items-center gap-2 py-8">
          <Filter size={20} className="text-slate-600" />
          <p className="text-sm text-slate-500">No logs match the selected level</p>
        </div>
      )}

      {/* Log entries */}
      {filteredLogs.length > 0 && (
        <div className="space-y-1 max-h-[400px] overflow-y-auto rounded-lg border border-slate-800 bg-slate-950 p-2">
          {filteredLogs.map((entry, idx) => (
            <LogEntryRow key={entry.id || idx} entry={entry} />
          ))}
        </div>
      )}
    </div>
  );
};

export default LogsTab;
