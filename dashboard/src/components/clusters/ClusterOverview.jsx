import { Cpu, MemoryStick as MemoryIcon, Server, Container, Activity, Clock, Wifi, Boxes } from "lucide-react";
import Card from "@/components/ui/Card";
import { clusterOverview } from "./clusterData";

const StatCard = ({ icon: Icon, label, value, sub, color }) => {
  const colors = {
    blue: "text-blue-400 bg-blue-600/10",
    green: "text-green-400 bg-green-600/10",
    purple: "text-purple-400 bg-purple-600/10",
    yellow: "text-yellow-400 bg-yellow-600/10",
    cyan: "text-cyan-400 bg-cyan-600/10",
  };
  const c = colors[color] || colors.blue;

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 transition-colors hover:border-slate-700">
      <div className="flex items-center gap-3">
        <div className={`rounded-lg ${c} p-2`}>
          <Icon size={18} />
        </div>
        <div>
          <p className="text-xs text-slate-500">{label}</p>
          <p className="text-xl font-bold text-white">{value}</p>
        </div>
      </div>
      {sub && <p className="mt-2 text-xs text-slate-500">{sub}</p>}
    </div>
  );
};

const ClusterOverview = () => {
  const cpuPercent = Math.round((clusterOverview.cpuUsed / clusterOverview.cpuTotal) * 100);
  const memPercent = Math.round((clusterOverview.memoryUsedGB / clusterOverview.memoryTotalGB) * 100);
  const podPercent = Math.round((clusterOverview.runningPods / clusterOverview.totalPods) * 100);
  const nodeHealth = clusterOverview.healthyNodes === clusterOverview.totalNodes ? "Healthy" : "Degraded";

  return (
    <div className="space-y-5">
      {/* Stats grid */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Server} label="Nodes" value={`${clusterOverview.healthyNodes}/${clusterOverview.totalNodes}`} sub={`${nodeHealth} — ${clusterOverview.platform}`} color="purple" />
        <StatCard icon={Container} label="Total Pods" value={clusterOverview.totalPods} sub={`${clusterOverview.runningPods} running (${podPercent}%)`} color="cyan" />
        <StatCard icon={Cpu} label="CPU" value={`${clusterOverview.cpuUsed}/${clusterOverview.cpuTotal} cores`} sub={`${cpuPercent}% utilized`} color="blue" />
        <StatCard icon={MemoryIcon} label="Memory" value={`${clusterOverview.memoryUsedGB}/${clusterOverview.memoryTotalGB} GB`} sub={`${memPercent}% utilized`} color="green" />
      </div>

      {/* Cluster info card */}
      <Card title="Cluster Info">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <InfoItem icon={Boxes} label="Cluster Name" value={clusterOverview.name} />
          <InfoItem icon={Activity} label="Kubernetes Version" value={clusterOverview.version} />
          <InfoItem icon={Clock} label="Uptime" value={clusterOverview.uptime} />
          <InfoItem icon={Wifi} label="Network Plugin" value={clusterOverview.networkPlugin} />
        </div>
      </Card>

      {/* Resource bars */}
      <Card title="Resource Utilization">
        <div className="space-y-4">
          <ResourceBar label="CPU" used={clusterOverview.cpuUsed} total={clusterOverview.cpuTotal} unit="cores" percent={cpuPercent} color="bg-blue-500" />
          <ResourceBar label="Memory" used={clusterOverview.memoryUsedGB} total={clusterOverview.memoryTotalGB} unit="GB" percent={memPercent} color="bg-green-500" />
          <ResourceBar label="Pods" used={clusterOverview.runningPods} total={clusterOverview.totalPods} unit="pods" percent={podPercent} color="bg-cyan-500" />
        </div>
      </Card>
    </div>
  );
};

const InfoItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-3 rounded-lg bg-slate-900/50 px-3.5 py-3">
    <div className="rounded-md bg-slate-800 p-1.5 text-slate-400">
      <Icon size={14} />
    </div>
    <div>
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-sm font-medium text-slate-200">{value}</p>
    </div>
  </div>
);

const ResourceBar = ({ label, used, total, unit, percent, color }) => (
  <div>
    <div className="mb-1.5 flex items-center justify-between text-sm">
      <span className="font-medium text-slate-300">{label}</span>
      <span className="text-xs text-slate-400">
        {used}/{total} {unit} ({percent}%)
      </span>
    </div>
    <div className="h-2 overflow-hidden rounded-full bg-slate-800">
      <div
        className={`h-full rounded-full transition-all duration-1000 ${color}`}
        style={{ width: `${Math.min(percent, 100)}%` }}
      />
    </div>
  </div>
);

export default ClusterOverview;
