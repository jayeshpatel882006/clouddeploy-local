import Card from "@/components/ui/Card";
import TimeSeriesChart from "./TimeSeriesChart";
import { cpuData } from "./monitoringData";

const dotColors = {
  blue: "bg-blue-500",
  purple: "bg-purple-500",
  yellow: "bg-yellow-500",
  green: "bg-green-500",
  cyan: "bg-cyan-500",
};

const CpuUsage = () => {
  const peak = cpuData.peak;

  return (
    <Card title="CPU Usage" subtitle="Last 24 hours" className="xl:col-span-2">
      <div className="grid gap-4 xl:grid-cols-4">
        {/* Stats */}
        <div className="space-y-3 xl:col-span-1">
          <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-3">
            <p className="text-xs text-slate-500">Current Usage</p>
            <p className="mt-1 text-2xl font-bold text-blue-400">
              {cpuData.currentAvg}%
            </p>
            <p className="text-xs text-slate-500">of {cpuData.total} cores</p>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-3">
            <p className="text-xs text-slate-500">Peak (24h)</p>
            <p className="mt-1 text-2xl font-bold text-yellow-400">{peak}%</p>
            <div className="mt-2 h-1.5 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-blue-500"
                style={{ width: `${Math.min(cpuData.currentAvg, 100)}%` }}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            {cpuData.series.map((s) => (
              <div key={s.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-slate-400">
                  <span className={`h-2 w-2 rounded-full ${dotColors[s.color] || 'bg-slate-500'}`} />
                  {s.name}
                </span>
                <span className="text-slate-300">{s.data[s.data.length - 1]}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart */}
        <div className="xl:col-span-3">
          <TimeSeriesChart
            series={cpuData.series}
            labels={cpuData.labels}
            height={200}
          />
        </div>
      </div>
    </Card>
  );
};

export default CpuUsage;
