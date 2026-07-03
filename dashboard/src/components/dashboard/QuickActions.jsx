import { Rocket, Scale, RotateCcw, FileText, Activity, Box } from "lucide-react";
import Card from "@/components/ui/Card";

const actions = [
  { label: "New Deployment", icon: Rocket, color: "blue", description: "Deploy a new application" },
  { label: "Scale Service", icon: Scale, color: "green", description: "Adjust replica count" },
  { label: "Restart Pod", icon: RotateCcw, color: "yellow", description: "Rolling restart" },
  { label: "View Logs", icon: FileText, color: "purple", description: "Stream container logs" },
  { label: "Run Diagnostic", icon: Activity, color: "cyan", description: "Check system health" },
  { label: "Manage Clusters", icon: Box, color: "orange", description: "Cluster administration" },
];

const colorMap = {
  blue: {
    bg: "bg-blue-600/10 hover:bg-blue-600/20",
    text: "text-blue-400",
    border: "border-blue-500/20 hover:border-blue-500/40",
    icon: "text-blue-400",
  },
  green: {
    bg: "bg-green-600/10 hover:bg-green-600/20",
    text: "text-green-400",
    border: "border-green-500/20 hover:border-green-500/40",
    icon: "text-green-400",
  },
  yellow: {
    bg: "bg-yellow-600/10 hover:bg-yellow-600/20",
    text: "text-yellow-400",
    border: "border-yellow-500/20 hover:border-yellow-500/40",
    icon: "text-yellow-400",
  },
  purple: {
    bg: "bg-purple-600/10 hover:bg-purple-600/20",
    text: "text-purple-400",
    border: "border-purple-500/20 hover:border-purple-500/40",
    icon: "text-purple-400",
  },
  cyan: {
    bg: "bg-cyan-600/10 hover:bg-cyan-600/20",
    text: "text-cyan-400",
    border: "border-cyan-500/20 hover:border-cyan-500/40",
    icon: "text-cyan-400",
  },
  orange: {
    bg: "bg-orange-600/10 hover:bg-orange-600/20",
    text: "text-orange-400",
    border: "border-orange-500/20 hover:border-orange-500/40",
    icon: "text-orange-400",
  },
};

const QuickActions = () => {
  const handleAction = (label) => {
    // Placeholder — future implementations will wire these to real actions
    console.log(`Quick action triggered: ${label}`);
  };

  return (
    <Card title="Quick Actions">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {actions.map((action) => {
          const Icon = action.icon;
          const c = colorMap[action.color];

          return (
            <button
              key={action.label}
              onClick={() => handleAction(action.label)}
              className={`group flex flex-col items-center gap-2 rounded-xl border ${c.border} ${c.bg} px-3 py-4 text-center transition-all duration-200 hover:scale-[1.02]`}
            >
              <div className={`rounded-lg p-2 ${c.icon}`}>
                <Icon size={20} />
              </div>
              <span className="text-xs font-medium text-slate-300 group-hover:text-white">
                {action.label}
              </span>
              <span className="text-[10px] leading-tight text-slate-500">
                {action.description}
              </span>
            </button>
          );
        })}
      </div>
    </Card>
  );
};

export default QuickActions;
