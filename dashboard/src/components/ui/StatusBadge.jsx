const statusStyles = {
  // Generic
  Running: "bg-green-500/10 text-green-400 border-green-500/20",
  Healthy: "bg-green-500/10 text-green-400 border-green-500/20",
  Active: "bg-green-500/10 text-green-400 border-green-500/20",
  Updating: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  Scaling: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  Pending: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Failed: "bg-red-500/10 text-red-400 border-red-500/20",
  Degraded: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  Error: "bg-red-500/10 text-red-400 border-red-500/20",
  Warning: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  Scanning: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Vulnerable: "bg-red-500/10 text-red-400 border-red-500/20",
  Unknown: "bg-slate-500/10 text-slate-400 border-slate-500/20",
  Stopped: "bg-slate-500/10 text-slate-400 border-slate-500/20",
  // K8s node statuses
  Ready: "bg-green-500/10 text-green-400 border-green-500/20",
  NotReady: "bg-red-500/10 text-red-400 border-red-500/20",
  // Events
  Normal: "bg-green-500/10 text-green-400 border-green-500/20",
};

const statusDots = {
  Running: "bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.5)]",
  Healthy: "bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.5)]",
  Active: "bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.5)]",
  Updating: "bg-yellow-500 shadow-[0_0_6px_rgba(234,179,8,0.5)]",
  Scaling: "bg-purple-500 shadow-[0_0_6px_rgba(168,85,247,0.5)]",
  Pending: "bg-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.5)]",
  Failed: "bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.5)]",
  Degraded: "bg-orange-500 shadow-[0_0_6px_rgba(249,115,22,0.5)]",
  Error: "bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.5)]",
  Warning: "bg-yellow-500 shadow-[0_0_6px_rgba(234,179,8,0.5)]",
  Scanning: "bg-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.5)]",
  Vulnerable: "bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.5)]",
  Unknown: "bg-slate-500",
  Stopped: "bg-slate-500",
  Ready: "bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.5)]",
  NotReady: "bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.5)]",
  Normal: "bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.5)]",
};

const StatusBadge = ({ status, size = "sm", showDot = true }) => {
  const statusText = status ?? "Unknown";
  const style = statusStyles[statusText] || statusStyles.Unknown;
  const dot = statusDots[statusText] || statusDots.Unknown;
  const sizeClasses = size === "lg" ? "px-3 py-1 text-sm" : "px-2 py-0.5 text-xs";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border font-medium ${style} ${sizeClasses}`}
    >
      {showDot && (
        <span className={`h-1.5 w-1.5 rounded-full ${dot}`} aria-hidden="true" />
      )}
      {statusText}
    </span>
  );
};

export default StatusBadge;
