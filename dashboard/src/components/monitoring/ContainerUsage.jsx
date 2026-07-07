import Card from "@/components/ui/Card";
import StatusBadge from "@/components/ui/StatusBadge";
import { containerUsage } from "./monitoringData";

const ContainerUsage = () => {
  return (
    <Card title="Container Usage" subtitle="Top containers by resource consumption">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-800 text-left text-xs text-slate-500">
              <th className="pb-3 pr-3 font-medium">Container</th>
              <th className="pb-3 pr-3 font-medium">Pod</th>
              <th className="pb-3 pr-3 font-medium">CPU</th>
              <th className="pb-3 pr-3 font-medium">CPU %</th>
              <th className="pb-3 pr-3 font-medium">Memory</th>
              <th className="pb-3 pr-3 font-medium">Mem %</th>
              <th className="pb-3 pr-3 font-medium">Uptime</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {containerUsage.map((c, idx) => (
              <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                <td className="py-3 pr-3">
                  <span className="font-medium text-slate-200 text-xs font-mono">{c.name}</span>
                </td>
                <td className="py-3 pr-3 text-slate-400 text-xs">{c.pod}</td>
                <td className="py-3 pr-3 text-slate-300 text-xs">{c.cpu}</td>
                <td className="py-3 pr-3">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-12 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          c.cpuPercent > 20 ? "bg-yellow-500" : "bg-blue-500"
                        }`}
                        style={{ width: `${Math.min(c.cpuPercent, 100)}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-400">{c.cpuPercent}%</span>
                  </div>
                </td>
                <td className="py-3 pr-3 text-slate-300 text-xs">{c.memory}</td>
                <td className="py-3 pr-3">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-12 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          c.memoryPercent > 40 ? "bg-red-500" : c.memoryPercent > 20 ? "bg-yellow-500" : "bg-green-500"
                        }`}
                        style={{ width: `${Math.min(c.memoryPercent, 100)}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-400">{c.memoryPercent}%</span>
                  </div>
                </td>
                <td className="py-3 text-slate-500 text-xs">{c.uptime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default ContainerUsage;
