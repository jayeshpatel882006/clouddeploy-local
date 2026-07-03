import { Box, Container, Server, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react";
import { motion } from "framer-motion";

const stats = [
  {
    title: "Applications",
    value: "12",
    change: "+2",
    trend: "up",
    subtitle: "6 running, 4 stopped, 2 pending",
    icon: Box,
    color: "blue",
  },
  {
    title: "Running Pods",
    value: "47",
    change: "+5",
    trend: "up",
    subtitle: "Across 3 namespaces",
    icon: Container,
    color: "green",
  },
  {
    title: "Clusters",
    value: "3",
    change: "All Healthy",
    trend: "up",
    subtitle: "2 nodes, 1 control plane",
    icon: Server,
    color: "purple",
  },
  {
    title: "Active Alerts",
    value: "2",
    change: "-1",
    trend: "down",
    subtitle: "1 warning, 1 critical",
    icon: AlertTriangle,
    color: "red",
  },
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const StatsCards = () => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
    >
      {stats.map((stat) => {
        const Icon = stat.icon;
        const c = colorMap[stat.color];

        return (
          <motion.div
            key={stat.title}
            variants={itemVariants}
            className={`group relative overflow-hidden rounded-xl border ${c.border} bg-slate-950 p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:${c.glow} hover:-translate-y-0.5`}
          >
            {/* Background gradient */}
            <div className={`absolute inset-0 opacity-[0.03] ${c.bg}`} />

            <div className="relative">
              <div className="flex items-start justify-between">
                <div className={`rounded-lg ${c.bg} p-2.5 ${c.text}`}>
                  <Icon size={20} />
                </div>
                <div className="flex items-center gap-1 rounded-full bg-slate-800/80 px-2 py-0.5 text-xs">
                  {stat.trend === "up" ? (
                    <TrendingUp size={12} className="text-green-400" />
                  ) : (
                    <TrendingDown size={12} className="text-red-400" />
                  )}
                  <span
                    className={
                      stat.trend === "up" ? "text-green-400" : "text-red-400"
                    }
                  >
                    {stat.change}
                  </span>
                </div>
              </div>

              <div className="mt-4">
                <h2 className="text-2xl font-bold text-white">{stat.value}</h2>
                <p className="mt-0.5 text-sm font-medium text-slate-400">
                  {stat.title}
                </p>
                <p className="mt-1.5 text-xs text-slate-500">{stat.subtitle}</p>
              </div>

              {/* Hover shimmer */}
              <div className="absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                  background: "linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.02) 60%, transparent 80%)",
                }}
              />
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default StatsCards;
