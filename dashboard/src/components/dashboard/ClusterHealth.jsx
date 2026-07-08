import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, HelpCircle, Clock, Wifi, HardDrive, Database, Container, Shield, Terminal, Server, ChevronDown, RefreshCw } from "lucide-react";
import Card from "@/components/ui/Card";
import { useSystemHealth } from "@/hooks/useSystemHealth";

// ─── Icon mapping ──
const iconMap = {
  container: Container,
  wifi: Wifi,
  database: Database,
  server: Server,
  terminal: Terminal,
  hardDrive: HardDrive,
  shield: Shield,
};

// ─── Status display config ──
const statusConfig = {
  healthy: {
    icon: CheckCircle2,
    label: "Running",
    color: "text-green-400",
    bg: "bg-green-500/10",
    border: "border-green-500/20",
    dot: "bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.5)]",
  },
  unhealthy: {
    icon: XCircle,
    label: "Not Running",
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    dot: "bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.5)]",
  },
  unknown: {
    icon: HelpCircle,
    label: "Waiting...",
    color: "text-slate-400",
    bg: "bg-slate-500/10",
    border: "border-slate-500/20",
    dot: "bg-slate-500",
  },
};

// ─── Service Details Popover ──
const ServicePopover = ({ service, children }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const svcConfig = statusConfig[service.status] || statusConfig.unknown;
  const SvcIcon = iconMap[service.icon] || HelpCircle;

  return (
    <div ref={ref} className="relative">
      <div onClick={() => setOpen(!open)} className="cursor-pointer">
        {children}
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.12, ease: "easeOut" }}
            className="absolute left-0 top-full z-50 mt-1.5 min-w-[220px] overflow-hidden rounded-xl border border-slate-700 bg-slate-900 shadow-xl"
          >
            {/* Header */}
            <div className="flex items-center gap-2.5 border-b border-slate-800 px-3.5 py-2.5">
              <div className={`rounded-md ${svcConfig.bg} p-1 ${svcConfig.color}`}>
                <SvcIcon size={14} />
              </div>
              <span className="text-sm font-medium text-slate-200">{service.name}</span>
              <span className={`ml-auto flex items-center gap-1.5 text-xs font-medium ${svcConfig.color}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${svcConfig.dot}`} />
                {svcConfig.label}
              </span>
            </div>

            {/* Body */}
            <div className="space-y-2 px-3.5 py-3">
              {/* Status */}
              <div>
                <span className="text-[10px] font-medium uppercase tracking-wider text-slate-600">Status</span>
                <p className="mt-0.5 text-sm text-slate-300">{svcConfig.label}</p>
              </div>

              {/* Message */}
              <div>
                <span className="text-[10px] font-medium uppercase tracking-wider text-slate-600">Message</span>
                <p className="mt-0.5 text-xs text-slate-400">{service.message}</p>
              </div>

              {/* Extra details (e.g. MongoDB host/database) */}
              {service.details && Object.keys(service.details).length > 0 && (
                <>
                  {Object.entries(service.details).map(([key, value]) => (
                    <div key={key}>
                      <span className="text-[10px] font-medium uppercase tracking-wider text-slate-600">
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </span>
                      <p className="mt-0.5 text-xs font-mono text-slate-300">{value}</p>
                    </div>
                  ))}
                </>
              )}

              {/* Troubleshooting */}
              {service.action && (
                <div className="mt-1 rounded-md border border-red-500/10 bg-red-500/5 px-2.5 py-2">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-red-400">How to fix</p>
                  <ol className="mt-1 list-inside list-decimal space-y-0.5 text-xs text-slate-400">
                    {service.action.split(". ").filter(Boolean).map((step, i) => (
                      <li key={i}>{step}.</li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Cluster Health Card ──
const ClusterHealth = () => {
  const { healthSummary, loading, error, refresh } = useSystemHealth();

  // ── Loading state ──
  if (loading && !healthSummary) {
    return (
      <Card title="Cluster Health" subtitle="Loading services...">
        <div className="space-y-3 py-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="h-8 w-8 animate-pulse rounded-md bg-slate-800" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 w-32 animate-pulse rounded bg-slate-800" />
                <div className="h-2 w-20 animate-pulse rounded bg-slate-800" />
              </div>
              <div className="h-4 w-16 animate-pulse rounded bg-slate-800" />
            </div>
          ))}
        </div>
      </Card>
    );
  }

  // ── Error state ──
  if (error && !healthSummary) {
    return (
      <Card title="Cluster Health" subtitle="Unable to connect">
        <div className="flex flex-col items-center gap-3 py-8 text-center">
          <HelpCircle size={32} className="text-slate-500" />
          <p className="text-sm text-slate-400">Unable to retrieve system health.</p>
          <button
            onClick={refresh}
            className="rounded-lg bg-[var(--accent)] px-4 py-1.5 text-xs font-medium text-white transition-all hover:bg-[var(--accent-hover)]"
          >
            Retry
          </button>
        </div>
      </Card>
    );
  }

  const services = healthSummary?.services || [];
  const total = healthSummary?.total || 0;
  const healthPercent = healthSummary?.healthPercent ?? 0;

  const healthColor =
    healthPercent >= 90 ? "bg-green-500"
    : healthPercent >= 70 ? "bg-yellow-500"
    : "bg-red-500";

  const subtitle = `${total} services monitored`;

  // ── Format last checked time ──
  const formatLastChecked = (iso) => {
    if (!iso) return null;
    const diff = Date.now() - new Date(iso).getTime();
    const seconds = Math.floor(diff / 1000);
    if (seconds < 5) return "Just now";
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    return new Date(iso).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  // ── Counts for summary ──
  const healthyCount = healthSummary?.healthy || 0;
  const unknownCount = healthSummary?.unknown || 0;
  const unhealthyCount = healthSummary?.unhealthy || 0;

  return (
    <Card
      title="Cluster Health"
      subtitle={subtitle}
      headerRight={
        <div className="flex items-center gap-2">
          {healthSummary?.lastChecked && (
            <span className="text-[10px] text-slate-600">
              Last: {formatLastChecked(healthSummary.lastChecked)}
            </span>
          )}
          <button
            onClick={refresh}
            className="rounded p-0.5 text-slate-600 transition-colors hover:text-slate-400"
            title="Refresh health"
          >
            <RefreshCw size={12} />
          </button>
        </div>
      }
    >
      {/* Overall health bar */}
      <div className="mb-5">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-medium text-slate-300">Overall Health</span>
          <span className="text-slate-400">{healthPercent}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-800">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${healthColor}`}
            style={{ width: `${healthPercent}%` }}
          />
        </div>
      </div>

      {/* Service list */}
      <div className="space-y-2">
        {services.map((service) => {
          const svcConfig = statusConfig[service.status] || statusConfig.unknown;
          const SvcIcon = iconMap[service.icon] || HelpCircle;

          return (
            <ServicePopover key={service.key} service={service}>
              <div className="flex items-center justify-between rounded-lg border border-slate-800/50 px-3.5 py-3 transition-colors hover:border-slate-700/50 hover:bg-slate-900/50">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`shrink-0 rounded-md ${svcConfig.bg} p-1.5 ${svcConfig.color}`}>
                    <SvcIcon size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className="flex items-center gap-2 text-sm font-medium text-slate-200">
                      {service.name}
                      {/* Extra label for MongoDB host when healthy */}
                      {service.key === "mongodb" && service.status === "healthy" && service.details?.host && (
                        <span className="truncate text-[10px] text-slate-500">
                          {service.details.host}
                        </span>
                      )}
                    </p>
                    <p className="truncate text-xs text-slate-500">
                      {service.message}
                      {/* Show database name for MongoDB when healthy */}
                      {service.key === "mongodb" && service.status === "healthy" && service.details?.database && (
                        <span className="ml-2 text-[10px] text-slate-600">
                          DB: {service.details.database}
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <span className={`h-1.5 w-1.5 rounded-full ${svcConfig.dot}`} />
                  <span className={`text-xs font-medium ${svcConfig.color}`}>
                    {svcConfig.label}
                  </span>
                </div>
              </div>
            </ServicePopover>
          );
        })}
      </div>

      {/* Summary row */}
      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-slate-800 pt-4 text-xs text-slate-500">
        {healthyCount > 0 && (
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            {healthyCount} healthy
          </span>
        )}
        {unknownCount > 0 && (
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-slate-500" />
            {unknownCount} waiting
          </span>
        )}
        {unhealthyCount > 0 && (
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-red-500" />
            {unhealthyCount} unhealthy
          </span>
        )}
        {healthyCount === 0 && unknownCount === 0 && unhealthyCount === 0 && (
          <span className="text-slate-600">No services</span>
        )}
      </div>
    </Card>
  );
};

export default ClusterHealth;
