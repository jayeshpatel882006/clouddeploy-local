import { CheckCircle2, XCircle, AlertCircle, Clock, Wifi, HardDrive, Database, Container, Shield, Terminal } from "lucide-react";
import Card from "@/components/ui/Card";

const services = [
  { name: "Docker Engine", status: "running", icon: Container, uptime: "14d 7h" },
  { name: "Kubernetes API", status: "running", icon: Wifi, uptime: "14d 7h" },
  { name: "Container Registry", status: "running", icon: Database, uptime: "14d 7h" },
  { name: "Floci", status: "running", icon: Terminal, uptime: "14d 7h" },
  { name: "Storage Controller", status: "degraded", icon: HardDrive, uptime: "12d 3h" },
  { name: "Security Scanner", status: "running", icon: Shield, uptime: "14d 7h" },
];

const statusConfig = {
  running: {
    icon: CheckCircle2,
    label: "Running",
    color: "text-green-400",
    bg: "bg-green-500/10",
    dot: "bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.5)]",
  },
  degraded: {
    icon: AlertCircle,
    label: "Degraded",
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
    dot: "bg-yellow-500 shadow-[0_0_6px_rgba(234,179,8,0.5)]",
  },
  down: {
    icon: XCircle,
    label: "Down",
    color: "text-red-400",
    bg: "bg-red-500/10",
    dot: "bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.5)]",
  },
  unknown: {
    icon: Clock,
    label: "Unknown",
    color: "text-slate-400",
    bg: "bg-slate-500/10",
    dot: "bg-slate-500",
  },
};

const overallHealth = {
  healthy: 5,
  degraded: 1,
  down: 0,
  total: 6,
};

const ClusterHealth = () => {
  const healthPercent = Math.round(
    ((overallHealth.healthy + overallHealth.degraded * 0.5) / overallHealth.total) * 100
  );

  const healthColor =
    healthPercent >= 90
      ? "bg-green-500"
      : healthPercent >= 70
        ? "bg-yellow-500"
        : "bg-red-500";

  return (
    <Card title="Cluster Health" subtitle="6 services monitored">
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
          const config = statusConfig[service.status] || statusConfig.unknown;
          const StatusIcon = config.icon;
          const SvcIcon = service.icon;

          return (
            <div
              key={service.name}
              className="flex items-center justify-between rounded-lg border border-slate-800/50 px-3.5 py-3 transition-colors hover:border-slate-700/50 hover:bg-slate-900/50"
            >
              <div className="flex items-center gap-3">
                <div className={`rounded-md ${config.bg} p-1.5 ${config.color}`}>
                  <SvcIcon size={16} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-200">
                    {service.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    Uptime: {service.uptime}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <StatusIcon size={14} className={config.color} />
                <span className={`text-xs font-medium ${config.color}`}>
                  {config.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary row */}
      <div className="mt-4 flex items-center gap-4 border-t border-slate-800 pt-4 text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-green-500" />
          {overallHealth.healthy} healthy
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-yellow-500" />
          {overallHealth.degraded} degraded
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-red-500" />
          {overallHealth.down} down
        </span>
      </div>
    </Card>
  );
};

export default ClusterHealth;
