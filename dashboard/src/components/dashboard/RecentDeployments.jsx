import { useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, MoreHorizontal, GitBranch, Rocket } from "lucide-react";
import Card from "@/components/ui/Card";
import StatusBadge from "@/components/ui/StatusBadge";
import EmptyState from "@/components/ui/EmptyState";

const namespaceColors = {
  production: "bg-blue-600/10 text-blue-400 border-blue-500/20",
  staging: "bg-purple-600/10 text-purple-400 border-purple-500/20",
  default: "bg-slate-600/10 text-slate-400 border-slate-500/20",
  development: "bg-cyan-600/10 text-cyan-400 border-cyan-500/20",
};

const RecentDeployments = ({ deployments = [] }) => {
  const [hoveredRow, setHoveredRow] = useState(null);

  if (deployments.length === 0) {
    return (
      <Card title="Recent Deployments" subtitle="Last 5 deployments">
        <EmptyState
          icon={Rocket}
          title="No deployments yet"
          description="Create your first deployment to see it here."
        />
      </Card>
    );
  }

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
                    <div className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
                      <GitBranch size={11} />
                      {dep.branch || "main"}
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
                    <StatusBadge status={dep.status} />
                  </td>
                  <td className="py-3.5 pr-4 text-slate-500 text-xs">{dep.created}</td>
                  <td className="py-3.5">
                    <div className="flex items-center gap-1">
                      {dep.previewUrl && dep.status === "RUNNING" ? (
                        <a
                          href={dep.previewUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`rounded-lg p-1.5 transition-colors ${
                            isHovered
                              ? "text-slate-400 hover:bg-slate-800 hover:text-white"
                              : "text-transparent"
                          }`}
                        >
                          <ExternalLink size={14} />
                        </a>
                      ) : (
                        <span className="p-1.5" />
                      )}
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
