import { Server } from "lucide-react";
import Card from "@/components/ui/Card";
import StatusBadge from "@/components/deployments/StatusBadge";
import { nodeUsage } from "./monitoringData";

const Bar = ({ percent, color = "bg-blue-500" }) => (
  <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
    <div className={`h-full rounded-full ${color}`} style={{ width: `${Math.min(percent, 100)}%` }} />
  </div>
);

const NodeUsage = () => {
  return (
    <Card title="Node Usage" subtitle="Per-node resource utilization">
      <div className="space-y-4">
        {nodeUsage.map((node) => (
          <div
            key={node.name}
            className="rounded-lg border border-slate-800 bg-slate-900/30 p-4 transition-colors hover:border-slate-700"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="rounded-md bg-purple-600/10 p-1.5 text-purple-400">
                  <Server size={15} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-200">{node.name}</p>
                  <p className="text-xs text-slate-500">{node.pods}/{node.podsCap} pods</p>
                </div>
              </div>
              <StatusBadge status={node.status} />
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-500">CPU</span>
                  <span className="text-slate-300">{node.cpu}%</span>
                </div>
                <Bar percent={node.cpu} color={node.cpu > 80 ? "bg-red-500" : node.cpu > 60 ? "bg-yellow-500" : "bg-blue-500"} />
              </div>
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-500">Memory</span>
                  <span className="text-slate-300">{node.memory}%</span>
                </div>
                <Bar percent={node.memory} color={node.memory > 80 ? "bg-red-500" : node.memory > 60 ? "bg-yellow-500" : "bg-green-500"} />
              </div>
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-500">CPU Req</span>
                  <span className="text-slate-300">{node.cpuReq}%</span>
                </div>
                <Bar percent={node.cpuReq} color="bg-purple-500" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default NodeUsage;
