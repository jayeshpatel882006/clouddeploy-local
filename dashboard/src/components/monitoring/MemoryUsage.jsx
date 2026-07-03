import Card from "@/components/ui/Card";
import TimeSeriesChart from "./TimeSeriesChart";
import { memoryData } from "./monitoringData";

const dotColors = {
  green: "bg-green-500",
  cyan: "bg-cyan-500",
};

const MemoryUsage = () => {
  return (
    <Card title="Memory Usage" subtitle={`${memoryData.currentUsed} GB / ${memoryData.total} GB total`} className="xl:col-span-2">
      <div className="grid gap-4 xl:grid-cols-4">
        {/* Stats */}
        <div className="space-y-3 xl:col-span-1">
          <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-3">
            <p className="text-xs text-slate-500">Used</p>
            <p className="mt-1 text-2xl font-bold text-green-400">
              {memoryData.currentUsed} GB
            </p>
            <p className="text-xs text-slate-500">
              {Math.round((memoryData.currentUsed / memoryData.total) * 100)}% utilized
            </p>
            <div className="mt-2 h-1.5 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-green-500"
                style={{ width: `${Math.min((memoryData.currentUsed / memoryData.total) * 100, 100)}%` }}
              />
            </div>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-3">
            <p className="text-xs text-slate-500">Peak (24h)</p>
            <p className="mt-1 text-2xl font-bold text-yellow-400">{memoryData.peak} GB</p>
          </div>
          <div className="space-y-1.5">
            {memoryData.series.map((s) => (
              <div key={s.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-slate-400">
                  <span className={`h-2 w-2 rounded-full ${dotColors[s.color] || 'bg-slate-500'}`} />
                  {s.name}
                </span>
                <span className="text-slate-300">{s.data[s.data.length - 1]} GB</span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart */}
        <div className="xl:col-span-3">
          <TimeSeriesChart
            series={memoryData.series}
            labels={memoryData.labels}
            height={200}
          />
        </div>
      </div>
    </Card>
  );
};

export default MemoryUsage;
