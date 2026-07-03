import Card from "@/components/ui/Card";
import { podHealthSummary, podHealth } from "./monitoringData";

const summaryCards = [
  { label: "Running", value: podHealthSummary.running, total: podHealthSummary.total, color: "text-green-400", bar: "bg-green-500" },
  { label: "Pending", value: podHealthSummary.pending, total: podHealthSummary.total, color: "text-blue-400", bar: "bg-blue-500" },
  { label: "Failed", value: podHealthSummary.failed, total: podHealthSummary.total, color: "text-red-400", bar: "bg-red-500" },
  { label: "CrashLoop", value: podHealthSummary.crashed, total: podHealthSummary.total, color: "text-orange-400", bar: "bg-orange-500" },
];

const nsColors = {
  production: "bg-blue-600/10 text-blue-400 border-blue-500/20",
  staging: "bg-purple-600/10 text-purple-400 border-purple-500/20",
  default: "bg-slate-600/10 text-slate-400 border-slate-500/20",
  development: "bg-cyan-600/10 text-cyan-400 border-cyan-500/20",
  "kube-system": "bg-yellow-600/10 text-yellow-400 border-yellow-500/20",
};

const PodHealth = () => {
  return (
    <Card title="Pod Health" subtitle={`${podHealthSummary.healthy} healthy, ${podHealthSummary.degraded} degraded`}>
      {/* Summary chips */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {summaryCards.map((s) => (
          <div key={s.label} className="rounded-lg border border-slate-800 bg-slate-900/50 p-2.5 text-center">
            <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
            <p className="text-[10px] text-slate-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Overall health bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-slate-400">Overall Health</span>
          <span className="text-slate-300">
            {podHealthSummary.healthy}/{podHealthSummary.total} pods healthy
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-800 flex">
          <div
            className="h-full rounded-l-full bg-green-500 transition-all"
            style={{ width: `${(podHealthSummary.running / podHealthSummary.total) * 100}%` }}
          />
          <div
            className="h-full bg-blue-500 transition-all"
            style={{ width: `${(podHealthSummary.pending / podHealthSummary.total) * 100}%` }}
          />
          <div
            className="h-full bg-red-500 transition-all"
            style={{ width: `${(podHealthSummary.failed / podHealthSummary.total) * 100}%` }}
          />
          <div
            className="h-full rounded-r-full bg-orange-500 transition-all"
            style={{ width: `${(podHealthSummary.crashed / podHealthSummary.total) * 100}%` }}
          />
        </div>
      </div>

      {/* Per-namespace breakdown */}
      <div className="space-y-2">
        {podHealth.map((ns) => {
          const pct = ns.total > 0 ? Math.round((ns.running / ns.total) * 100) : 0;
          return (
            <div key={ns.namespace} className="flex items-center gap-3 rounded-lg border border-slate-800/50 px-3.5 py-2.5">
              <span className={`rounded-md border px-2 py-0.5 text-xs font-medium ${nsColors[ns.namespace] || nsColors.default}`}>
                {ns.namespace}
              </span>
              <div className="flex-1">
                <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-green-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
              <span className="text-xs text-slate-400 min-w-[60px] text-right">
                {ns.running}/{ns.total} {pct < 100 ? `(${pct}%)` : ""}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default PodHealth;
