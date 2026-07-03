import Card from "@/components/ui/Card";
import TimeSeriesChart from "./TimeSeriesChart";
import { diskData } from "./monitoringData";

const DiskUsage = () => {
  const percent = Math.round((diskData.used / diskData.total) * 100);
  return (
    <Card title="Disk" subtitle={`${diskData.used} GB / ${diskData.total} GB`}>
      <div className="grid gap-4 xl:grid-cols-4">
        <div className="space-y-2 xl:col-span-1">
          <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-3">
            <p className="text-xs text-slate-500">Used</p>
            <p className="mt-1 text-xl font-bold text-yellow-400">{percent}%</p>
            <div className="mt-2 h-1.5 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-yellow-500"
                style={{ width: `${Math.min(percent, 100)}%` }}
              />
            </div>
          </div>
          <div className="flex justify-between text-xs text-slate-400 px-1">
            <span>Read: {diskData.readLatency}</span>
            <span>Write: {diskData.writeLatency}</span>
          </div>
        </div>
        <div className="xl:col-span-3">
          <TimeSeriesChart
            series={diskData.series}
            labels={diskData.labels}
            height={160}
          />
        </div>
      </div>
    </Card>
  );
};

export default DiskUsage;
