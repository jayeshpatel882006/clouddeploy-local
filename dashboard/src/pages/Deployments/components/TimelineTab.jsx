import { useState, useEffect, useRef } from "react";
import {
  Clock,
  Loader2,
  AlertCircle,
  CheckCircle2,
  XCircle,
  RefreshCw,
} from "lucide-react";
import { getTimeline } from "@/api/deploymentDetails.api";
import { getStatusConfig } from "../utils/deploymentStatus";

const TimelineItem = ({ entry, isLast, isFirst }) => {
  const config = getStatusConfig(entry.status);

  const statusIcon = (status) => {
    switch (status) {
      case "RUNNING":
        return <CheckCircle2 size={14} className="text-green-400" />;
      case "FAILED":
        return <XCircle size={14} className="text-red-400" />;
      default:
        return <RefreshCw size={14} className="text-blue-400 animate-pulse" />;
    }
  };

  return (
    <div className="relative flex gap-4 pb-6 last:pb-0">
      {/* Timeline line */}
      {!isLast && (
        <div className="absolute left-[11px] top-5 bottom-0 w-px bg-slate-700" />
      )}

      {/* Icon */}
      <div className="relative z-10 mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-900 ring-2 ring-slate-700">
        {statusIcon(entry.status)}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-3">
          <span
            className={`text-sm font-medium ${
              entry.status === "FAILED" ? "text-red-400" : "text-slate-200"
            }`}
          >
            {config?.label || entry.status}
          </span>
          <span className="text-xs text-slate-500 whitespace-nowrap">
            {entry.displayTime || (entry.timestamp ? new Date(entry.timestamp).toLocaleString() : "")}
          </span>
        </div>
        {entry.message && (
          <p className="mt-1 text-xs text-slate-500 leading-relaxed">{entry.message}</p>
        )}
      </div>
    </div>
  );
};

const TimelineTab = ({ deployment, onError }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mountedRef = useRef(true);

  const projectName = deployment?.projectName || deployment?.name;

  useEffect(() => {
    mountedRef.current = true;

    const fetchTimeline = async () => {
      if (!projectName) {
        setLoading(false);
        setError("No project name available");
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const result = await getTimeline(projectName);
        if (mountedRef.current) {
          setData(result);
        }
      } catch (err) {
        if (mountedRef.current) {
          const msg = err.message || "Failed to load timeline";
          setError(msg);
          onError?.(msg);
        }
      } finally {
        if (mountedRef.current) setLoading(false);
      }
    };

    fetchTimeline();

    return () => {
      mountedRef.current = false;
    };
  }, [projectName, onError]);

  // ── Loading state ──
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 size={20} className="animate-spin text-slate-400" />
        <span className="ml-2.5 text-sm text-slate-500">Loading timeline...</span>
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
        <Clock size={24} className="text-slate-600" />
        <p className="text-sm text-slate-500">No timeline data available</p>
      </div>
    );
  }

  const timeline = data.timeline || [];

  if (timeline.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-lg border border-slate-700 bg-slate-900/30 px-4 py-8">
        <Clock size={24} className="text-slate-600" />
        <p className="text-sm text-slate-500">No timeline entries yet</p>
        <p className="text-xs text-slate-600">Timeline updates as the deployment progresses.</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {/* Current status header */}
      {data.currentStatus && (
        <div className="mb-4 flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/30 px-4 py-3">
          <span className="text-xs text-slate-500">Current Status</span>
          <span className="text-sm font-medium text-slate-200">{data.currentStatus}</span>
        </div>
      )}

      {/* Timeline entries */}
      <div className="pl-1">
        {timeline.map((entry, idx) => (
          <TimelineItem
            key={entry.timestamp || idx}
            entry={entry}
            isFirst={idx === 0}
            isLast={idx === timeline.length - 1}
          />
        ))}
      </div>
    </div>
  );
};

export default TimelineTab;
