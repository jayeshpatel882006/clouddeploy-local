import Card from "@/components/ui/Card";
import TimeSeriesChart from "./TimeSeriesChart";
import { networkData } from "./monitoringData";

const NetworkUsage = () => {
  return (
    <Card title="Network" subtitle="Bandwidth usage (Mbps)">
      <div className="grid gap-4 xl:grid-cols-4">
        <div className="space-y-2 xl:col-span-1">
          <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-3">
            <p className="text-xs text-slate-500">Inbound</p>
            <p className="mt-1 text-xl font-bold text-cyan-400">{networkData.currentIn} Mbps</p>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-3">
            <p className="text-xs text-slate-500">Outbound</p>
            <p className="mt-1 text-xl font-bold text-blue-400">{networkData.currentOut} Mbps</p>
          </div>
          <div className="text-xs text-slate-500 px-1">
            Total today: {networkData.totalIn} GB in / {networkData.totalOut} GB out
          </div>
        </div>
        <div className="xl:col-span-3">
          <TimeSeriesChart
            series={networkData.series}
            labels={networkData.labels}
            height={160}
          />
        </div>
      </div>
    </Card>
  );
};

export default NetworkUsage;
