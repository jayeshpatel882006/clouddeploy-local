import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  HelpCircle,
  RefreshCw,
  ChevronDown,
} from "lucide-react";

// ==========================================
// HealthPopover — Click/hover popover for health status
// ==========================================
//
// Displays per-service health status with troubleshooting instructions
// when a service is unhealthy.
//
// Designed to support any number of future services automatically.
//
// ==========================================

const statusConfig = {
  healthy: {
    icon: CheckCircle2,
    color: "text-green-400",
    bg: "bg-green-500/10",
    border: "border-green-500/20",
    dot: "bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.5)]",
    label: "Healthy",
  },
  unhealthy: {
    icon: XCircle,
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    dot: "bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.5)]",
    label: "Unhealthy",
  },
  unknown: {
    icon: HelpCircle,
    color: "text-slate-400",
    bg: "bg-slate-500/10",
    border: "border-slate-500/20",
    dot: "bg-slate-500",
    label: "Unknown",
  },
};

const HealthPopover = ({
  healthSummary,
  loading,
  error,
  onRefresh,
  trigger,
  align = "left",
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const alignClass = align === "right" ? "right-0" : "left-0";

  const status = healthSummary?.label?.toLowerCase() || "unknown";
  const config = statusConfig[status] || statusConfig.unknown;
  const StatusIcon = config.icon;
  const services = healthSummary?.services || [];

  return (
    <div ref={ref} className="relative inline-flex">
      {/* Trigger */}
      <div onClick={() => setOpen(!open)} className="cursor-pointer">
        {trigger}
      </div>

      {/* Popover */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.12, ease: "easeOut" }}
            className={`absolute top-full z-50 mt-1.5 min-w-[280px] overflow-hidden rounded-xl border border-slate-700 bg-slate-900 shadow-xl ${alignClass}`}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
              <div className="flex items-center gap-2">
                <StatusIcon size={16} className={config.color} />
                <span className={`text-sm font-medium ${config.color}`}>
                  {healthSummary?.label || "Unknown"}
                </span>
                {healthSummary && (
                  <span className="text-xs text-slate-500">
                    ({healthSummary.healthy}/{healthSummary.total} healthy)
                  </span>
                )}
              </div>
              {onRefresh && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRefresh();
                  }}
                  className="rounded p-1 text-slate-500 transition-colors hover:bg-slate-800 hover:text-slate-300"
                  title="Refresh health status"
                >
                  <RefreshCw size={14} />
                </button>
              )}
            </div>

            {/* Body */}
            <div className="max-h-64 overflow-y-auto px-4 py-3">
              {loading && services.length === 0 ? (
                <div className="space-y-3 py-2">
                  <div className="h-4 w-full animate-pulse rounded bg-slate-800" />
                  <div className="h-4 w-3/4 animate-pulse rounded bg-slate-800" />
                </div>
              ) : error && services.length === 0 ? (
                <div className="py-2 text-center">
                  <HelpCircle size={24} className="mx-auto text-slate-500" />
                  <p className="mt-2 text-sm text-slate-400">
                    Unable to contact backend.
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Please verify the backend service is running.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {services.map((service) => {
                    const svcConfig =
                      statusConfig[service.status] || statusConfig.unknown;
                    const SvcIcon = svcConfig.icon;

                    return (
                      <div
                        key={service.key}
                        className="rounded-lg border border-slate-800/50 bg-slate-950/50 p-3"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div
                              className={`rounded-md ${svcConfig.bg} p-1 ${svcConfig.color}`}
                            >
                              <SvcIcon size={14} />
                            </div>
                            <span className="text-sm font-medium text-slate-200">
                              {service.name}
                            </span>
                          </div>
                          <span
                            className={`flex items-center gap-1.5 text-xs font-medium ${svcConfig.color}`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${svcConfig.dot}`}
                            />
                            {svcConfig.label}
                          </span>
                        </div>

                        {/* Status message */}
                        <p className="mt-2 text-xs text-slate-400">
                          {service.message}
                        </p>

                        {/* Troubleshooting for unhealthy services */}
                        {service.status === "unhealthy" && service.action && (
                          <div className="mt-2 rounded-md border border-red-500/10 bg-red-500/5 px-2.5 py-2">
                            <p className="text-xs font-medium text-red-400">
                              How to fix
                            </p>
                            <ol className="mt-1 list-inside list-decimal space-y-0.5 text-xs text-slate-400">
                              {service.action
                                .split(". ")
                                .filter(Boolean)
                                .map((step, i) => (
                                  <li key={i}>{step}.</li>
                                ))}
                            </ol>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>


          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HealthPopover;
