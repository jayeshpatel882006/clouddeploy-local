import { useState } from "react";
import {
  Rocket,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  Info,
  ArrowUpDown,
  Activity,
} from "lucide-react";
import Card from "@/components/ui/Card";

const activities = [
  {
    id: 1,
    type: "deploy",
    message: "inventory-api deployed to production",
    timestamp: "2 min ago",
    user: "jdeploy",
  },
  {
    id: 2,
    type: "scale",
    message: "auth-service scaled from 2 to 3 replicas",
    timestamp: "15 min ago",
    user: "jdeploy",
  },
  {
    id: 3,
    type: "warning",
    message: "Memory threshold exceeded on payment-api (85%)",
    timestamp: "1 hour ago",
    user: "system",
  },
  {
    id: 4,
    type: "success",
    message: "Node worker-2 health check passed",
    timestamp: "2 hours ago",
    user: "system",
  },
  {
    id: 5,
    type: "info",
    message: "Container registry sync completed",
    timestamp: "3 hours ago",
    user: "system",
  },
  {
    id: 6,
    type: "restart",
    message: "log-processor pod restarted (OOMKilled)",
    timestamp: "5 hours ago",
    user: "kubelet",
  },
];

const activityConfig = {
  deploy: {
    icon: Rocket,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    dot: "bg-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.5)]",
  },
  scale: {
    icon: ArrowUpDown,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
    dot: "bg-purple-500 shadow-[0_0_6px_rgba(168,85,247,0.5)]",
  },
  warning: {
    icon: AlertTriangle,
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/20",
    dot: "bg-yellow-500 shadow-[0_0_6px_rgba(234,179,8,0.5)]",
  },
  success: {
    icon: CheckCircle2,
    color: "text-green-400",
    bg: "bg-green-500/10",
    border: "border-green-500/20",
    dot: "bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.5)]",
  },
  info: {
    icon: Info,
    color: "text-slate-400",
    bg: "bg-slate-500/10",
    border: "border-slate-500/20",
    dot: "bg-slate-500",
  },
  restart: {
    icon: RotateCcw,
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
    dot: "bg-cyan-500 shadow-[0_0_6px_rgba(34,211,238,0.5)]",
  },
};

const RecentActivity = () => {
  const [hoveredId, setHoveredId] = useState(null);

  return (
    <Card
      title="Recent Activity"
      subtitle="Latest cluster events"
      headerRight={
        <button className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-slate-400 transition-colors hover:border-slate-600 hover:text-white">
          <Activity size={14} />
        </button>
      }
    >
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-[21px] top-2 bottom-2 w-px bg-slate-800" />

        <div className="space-y-0">
          {activities.map((activity) => {
            const config = activityConfig[activity.type] || activityConfig.info;
            const Icon = config.icon;
            const isHovered = hoveredId === activity.id;

            return (
              <div
                key={activity.id}
                className={`group relative flex gap-4 py-2.5 pl-0 pr-2 transition-all duration-150 ${
                  isHovered ? "bg-slate-900/40 -mx-2 rounded-lg px-2" : ""
                }`}
                onMouseEnter={() => setHoveredId(activity.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Icon dot */}
                <div className="relative z-10 flex-shrink-0">
                  <div
                    className={`flex h-[42px] w-[42px] items-center justify-center rounded-xl border ${config.border} ${config.bg} transition-transform duration-150 ${
                      isHovered ? "scale-110" : ""
                    }`}
                  >
                    <Icon size={18} className={config.color} />
                  </div>
                </div>

                {/* Content */}
                <div className="flex min-w-0 flex-1 items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm text-slate-300">
                      {activity.message}
                    </p>
                    <p className="mt-0.5 flex items-center gap-2 text-xs text-slate-500">
                      <span>{activity.timestamp}</span>
                      <span className="text-slate-700">&middot;</span>
                      <span>{activity.user}</span>
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};

export default RecentActivity;
