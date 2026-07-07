import { motion } from "framer-motion";
import { Box, Rocket, Container, AlertTriangle } from "lucide-react";

const cards = [
  { key: "total", label: "Total Deployments", icon: Box, color: "blue" },
  { key: "running", label: "Running", icon: Rocket, color: "green" },
  { key: "building", label: "Building", icon: Container, color: "purple" },
  { key: "failed", label: "Failed", icon: AlertTriangle, color: "red" },
];

const colorMap = {
  blue: {
    bg: "bg-blue-600/10",
    text: "text-blue-400",
    border: "border-blue-500/20",
    glow: "shadow-blue-500/10",
  },
  green: {
    bg: "bg-green-600/10",
    text: "text-green-400",
    border: "border-green-500/20",
    glow: "shadow-green-500/10",
  },
  purple: {
    bg: "bg-purple-600/10",
    text: "text-purple-400",
    border: "border-purple-500/20",
    glow: "shadow-purple-500/10",
  },
  red: {
    bg: "bg-red-600/10",
    text: "text-red-400",
    border: "border-red-500/20",
    glow: "shadow-red-500/10",
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.35, ease: "easeOut" },
  }),
};

const DeploymentStats = ({ stats = {} }) => {
  const values = {
    total: stats.total ?? 0,
    running: stats.running ?? 0,
    building: stats.building ?? 0,
    failed: stats.failed ?? 0,
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card, i) => {
        const Icon = card.icon;
        const c = colorMap[card.color];
        const value = values[card.key];

        return (
          <motion.div
            key={card.key}
            custom={i}
            initial="hidden"
            animate="visible"
            variants={itemVariants}
            className={`group relative overflow-hidden rounded-xl border ${c.border} bg-slate-950 p-5 transition-all duration-200 hover:shadow-md hover:${c.glow} hover:-translate-y-0.5`}
          >
            <div className={`absolute inset-0 opacity-[0.03] ${c.bg}`} />

            <div className="relative flex items-start justify-between">
              <div>
                <p className="text-2xl font-bold text-white">{value}</p>
                <p className="mt-0.5 text-sm font-medium text-slate-400">
                  {card.label}
                </p>
              </div>
              <div className={`rounded-lg ${c.bg} p-2.5 ${c.text}`}>
                <Icon size={20} />
              </div>
            </div>

            <div
              className="absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{
                background:
                  "linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.02) 60%, transparent 80%)",
              }}
            />
          </motion.div>
        );
      })}
    </div>
  );
};

export default DeploymentStats;
