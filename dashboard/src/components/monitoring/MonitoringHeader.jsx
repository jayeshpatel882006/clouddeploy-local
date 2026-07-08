import { Activity } from "lucide-react";

const ranges = ["1h", "6h", "24h", "7d", "30d"];

const MonitoringHeader = ({ timeRange, onTimeRangeChange }) => {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
      <div className="flex items-start gap-3">
        <div className="rounded-lg bg-[var(--accent-bg)] p-2.5">
          <Activity size={24} className="text-[var(--accent-light)]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Monitoring</h1>
          <p className="mt-0.5 text-sm text-slate-400">
            Cluster metrics and observability
          </p>
        </div>
      </div>

      {/* Time range selector */}
      <div className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-900 p-1">
        {ranges.map((r) => (
          <button
            key={r}
            onClick={() => onTimeRangeChange(r)}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              timeRange === r
                ? "bg-[var(--accent)] text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            {r}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MonitoringHeader;
