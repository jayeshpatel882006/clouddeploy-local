import { useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, MoreHorizontal } from "lucide-react";
import Card from "@/components/ui/Card";

const deployments = [
  {
    id: 1,
    name: "inventory-api",
    image: "inventory-api:v2.3.1",
    namespace: "production",
    status: "Running",
    replicas: 4,
    created: "2 hours ago",
    cpu: "125m",
    memory: "256Mi",
  },
  {
    id: 2,
    name: "auth-service",
    image: "auth-service:v1.8.0",
    namespace: "production",
    status: "Running",
    replicas: 3,
    created: "5 hours ago",
    cpu: "85m",
    memory: "128Mi",
  },
  {
    id: 3,
    name: "payment-api",
    image: "payment-api:v3.0.2",
    namespace: "production",
    status: "Updating",
    replicas: 2,
    created: "1 day ago",
    cpu: "150m",
    memory: "384Mi",
  },
  {
    id: 4,
    name: "notification-svc",
    image: "notification-svc:v1.0.1",
    namespace: "staging",
    status: "Running",
    replicas: 1,
    created: "3 days ago",
    cpu: "45m",
    memory: "96Mi",
  },
  {
    id: 5,
    name: "log-processor",
    image: "log-processor:v0.5.0",
    namespace: "default",
    status: "Failed",
    replicas: 0,
    created: "6 days ago",
    cpu: "0m",
    memory: "0Mi",
  },
];

const statusStyles = {
  Running: "bg-green-500/10 text-green-400 border-green-500/20",
  Updating: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  Failed: "bg-red-500/10 text-red-400 border-red-500/20",
  Pending: "bg-slate-500/10 text-slate-400 border-slate-500/20",
};

const statusDots = {
  Running: "bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.5)]",
  Updating: "bg-yellow-500 shadow-[0_0_6px_rgba(234,179,8,0.5)]",
  Failed: "bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.5)]",
  Pending: "bg-slate-500",
};

const namespaceColors = {
  production: "bg-blue-600/10 text-blue-400 border-blue-500/20",
  staging: "bg-purple-600/10 text-purple-400 border-purple-500/20",
  default: "bg-slate-600/10 text-slate-400 border-slate-500/20",
};

const RecentDeployments = () => {
  const [hoveredRow, setHoveredRow] = useState(null);

  return (
    <Card
      title="Recent Deployments"
      subtitle="Last 5 deployments across all namespaces"
      headerRight={
        <button className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-slate-400 transition-colors hover:border-slate-600 hover:text-white">
          View All
        </button>
      }
    >
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-800 text-left text-xs text-slate-500">
              <th className="pb-3 pr-4 font-medium">Application</th>
              <th className="pb-3 pr-4 font-medium">Namespace</th>
              <th className="pb-3 pr-4 font-medium">Status</th>
              <th className="pb-3 pr-4 font-medium">Replicas</th>
              <th className="pb-3 pr-4 font-medium">CPU</th>
              <th className="pb-3 pr-4 font-medium">Memory</th>
              <th className="pb-3 pr-4 font-medium">Created</th>
              <th className="pb-3 font-medium">&nbsp;</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {deployments.map((dep) => {
              const isHovered = hoveredRow === dep.id;

              return (
                <motion.tr
                  key={dep.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`transition-colors duration-150 ${
                    isHovered ? "bg-slate-900/60" : ""
                  }`}
                  onMouseEnter={() => setHoveredRow(dep.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  <td className="py-3.5 pr-4">
                    <span className="font-medium text-slate-200">
                      {dep.name}
                    </span>
                    <div className="mt-0.5 text-xs text-slate-500">
                      {dep.image}
                    </div>
                  </td>
                  <td className="py-3.5 pr-4">
                    <span
                      className={`inline-block rounded-md border px-2 py-0.5 text-xs font-medium ${
                        namespaceColors[dep.namespace] || namespaceColors.default
                      }`}
                    >
                      {dep.namespace}
                    </span>
                  </td>
                  <td className="py-3.5 pr-4">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium ${
                        statusStyles[dep.status]
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          statusDots[dep.status]
                        }`}
                      />
                      {dep.status}
                    </span>
                  </td>
                  <td className="py-3.5 pr-4 text-slate-300">
                    {dep.replicas}
                  </td>
                  <td className="py-3.5 pr-4 text-slate-400">{dep.cpu}</td>
                  <td className="py-3.5 pr-4 text-slate-400">{dep.memory}</td>
                  <td className="py-3.5 pr-4 text-slate-500">{dep.created}</td>
                  <td className="py-3.5">
                    <div className="flex items-center gap-1">
                      <button
                        className={`rounded-lg p-1.5 transition-colors ${
                          isHovered
                            ? "text-slate-400 hover:bg-slate-800 hover:text-white"
                            : "text-transparent"
                        }`}
                      >
                        <ExternalLink size={14} />
                      </button>
                      <button
                        className={`rounded-lg p-1.5 transition-colors ${
                          isHovered
                            ? "text-slate-400 hover:bg-slate-800 hover:text-white"
                            : "text-transparent"
                        }`}
                      >
                        <MoreHorizontal size={14} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default RecentDeployments;
