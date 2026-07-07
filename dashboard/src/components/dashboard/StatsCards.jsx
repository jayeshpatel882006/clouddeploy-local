import { Box, Container, Server, Rocket, TrendingUp, TrendingDown } from "lucide-react";
import { motion } from "framer-motion";

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

const StatsCards = ({ stats }) => {
  const statCards = [
    {
      title: "Total Deployments",
      value: String(stats?.total || 0),
      change: "",
      trend: "neutral",
      subtitle: `${stats?.running || 0} running, ${stats?.failed || 0} failed`,
      icon: Box,
      color: "blue",
    },
    {
      title: "Running",
      value: String(stats?.running || 0),
      change: "",
      trend: "up",
      subtitle: "Currently active",
      icon: Rocket,
      color: "green",
    },
    {
      title: "Building",
      value: String(stats?.building || 0),
      change: "",
      trend: "up",
      subtitle: `${stats?.pending || 0} pending`,
      icon: Container,
      color: "purple",
    },
    {
      title: "Failed",
      value: String(stats?.failed || 0),
      change: "",
      trend: "down",
      subtitle: "Deployments that failed",
      icon: Server,
      color: "red",
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
    >
      {statCards.map((stat) => {
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
                {stat.trend !== "neutral" && (
                  <div className="flex items-center gap-1 rounded-full bg-slate-800/80 px-2 py-0.5 text-xs">
                    {stat.trend === "up" ? (
                      <TrendingUp size={12} className="text-green-400" />
                    ) : (
                      <TrendingDown size={12} className="text-red-400" />
                    )}
                  </div>
                )}
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
