import { AlertTriangle, Info, XCircle, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import Card from "@/components/ui/Card";
import { alerts } from "./monitoringData";

const severityConfig = {
  critical: {
    icon: XCircle,
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    dot: "bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.5)]",
  },
  warning: {
    icon: AlertTriangle,
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/20",
    dot: "bg-yellow-500 shadow-[0_0_6px_rgba(234,179,8,0.5)]",
  },
  info: {
    icon: Info,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    dot: "bg-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.5)]",
  },
};

const AlertsPanel = () => {
  const [dismissed, setDismissed] = useState(new Set());

  const activeAlerts = alerts.filter((a) => !dismissed.has(a.id));
  const criticalCount = activeAlerts.filter((a) => a.severity === "critical").length;
  const warningCount = activeAlerts.filter((a) => a.severity === "warning").length;

  return (
    <Card
      title="Alerts"
      subtitle={`${activeAlerts.length} active`}
      headerRight={
        criticalCount > 0 && (
          <div className="flex items-center gap-2">
            {criticalCount > 0 && (
              <span className="flex items-center gap-1 rounded-md bg-red-500/10 px-2 py-0.5 text-xs text-red-400">
                <XCircle size={11} />
                {criticalCount} critical
              </span>
            )}
            {warningCount > 0 && (
              <span className="flex items-center gap-1 rounded-md bg-yellow-500/10 px-2 py-0.5 text-xs text-yellow-400">
                <AlertTriangle size={11} />
                {warningCount} warnings
              </span>
            )}
          </div>
        )
      }
    >
      {activeAlerts.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-8 text-center">
          <CheckCircle2 size={32} className="text-green-400" />
          <p className="text-sm text-slate-400">All clear — no active alerts</p>
        </div>
      ) : (
        <div className="space-y-2">
          {activeAlerts.map((alert) => {
            const config = severityConfig[alert.severity] || severityConfig.info;
            const Icon = config.icon;

            return (
              <div
                key={alert.id}
                className={`group relative rounded-lg border ${config.border} ${config.bg} px-3.5 py-3 transition-all hover:opacity-90`}
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 ${config.color}`}>
                    <Icon size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium text-slate-200 truncate">
                        {alert.title}
                      </p>
                      <button
                        onClick={() => setDismissed(new Set([...dismissed, alert.id]))}
                        className="shrink-0 rounded p-0.5 text-slate-600 opacity-0 transition-all hover:text-slate-400 group-hover:opacity-100"
                        title="Dismiss"
                      >
                        <CheckCircle2 size={13} />
                      </button>
                    </div>
                    <p className="mt-0.5 text-xs text-slate-400">{alert.message}</p>
                    <p className="mt-1.5 text-[10px] text-slate-500">{alert.time}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
};

export default AlertsPanel;
