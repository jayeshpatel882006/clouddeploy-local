import { motion } from "framer-motion";
import { Cpu, MemoryStick as MemoryIcon, Network, HardDrive } from "lucide-react";
import Card from "@/components/ui/Card";

const resources = [
  {
    name: "CPU",
    icon: Cpu,
    used: 3.2,
    total: 8,
    unit: "Cores",
    percentage: 40,
    color: "blue",
    history: [35, 42, 38, 45, 40, 38, 42, 40],
  },
  {
    name: "Memory",
    icon: MemoryIcon,
    used: 12.4,
    total: 32,
    unit: "GB",
    percentage: 39,
    color: "green",
    history: [45, 42, 38, 35, 39, 42, 40, 39],
  },
  {
    name: "Network",
    icon: Network,
    used: 1.8,
    total: 10,
    unit: "Gbps",
    percentage: 18,
    color: "purple",
    history: [25, 30, 22, 18, 20, 15, 18, 18],
  },
  {
    name: "Storage",
    icon: HardDrive,
    used: 245,
    total: 500,
    unit: "GB",
    percentage: 49,
    color: "yellow",
    history: [35, 38, 42, 45, 47, 48, 48, 49],
  },
];

const colorMap = {
  blue: {
    bar: "bg-blue-500",
    spark: "stroke-blue-500",
    fill: "fill-blue-500/20",
    text: "text-blue-400",
    dot: "bg-blue-500",
    glow: "shadow-blue-500/30",
  },
  green: {
    bar: "bg-green-500",
    spark: "stroke-green-500",
    fill: "fill-green-500/20",
    text: "text-green-400",
    dot: "bg-green-500",
    glow: "shadow-green-500/30",
  },
  purple: {
    bar: "bg-purple-500",
    spark: "stroke-purple-500",
    fill: "fill-purple-500/20",
    text: "text-purple-400",
    dot: "bg-purple-500",
    glow: "shadow-purple-500/30",
  },
  yellow: {
    bar: "bg-yellow-500",
    spark: "stroke-yellow-500",
    fill: "fill-yellow-500/20",
    text: "text-yellow-400",
    dot: "bg-yellow-500",
    glow: "shadow-yellow-500/30",
  },
};

const Sparkline = ({ data, color }) => {
  const c = colorMap[color];
  const width = 100;
  const height = 32;
  const max = Math.max(...data, 1);
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - (v / max) * height;
    return `${x},${y}`;
  });
  const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p}`).join(" ");

  const areaD = `${pathD} L ${width},${height} L 0,${height} Z`;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="flex-shrink-0">
      <path d={areaD} className={c.fill} />
      <path d={pathD} className={`${c.spark} fill-none`} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

const ResourceCard = ({ resource }) => {
  const c = colorMap[resource.color];
  const Icon = resource.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-slate-800 bg-slate-950 p-4 transition-all duration-200 hover:border-slate-700"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`rounded-lg ${c.bar.replace("bg-", "bg-")}/10 p-2`}>
            <Icon size={18} className={c.text} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-300">{resource.name}</p>
            <p className="text-xs text-slate-500">{resource.unit}</p>
          </div>
        </div>
        <Sparkline data={resource.history} color={resource.color} />
      </div>

      <div className="mt-3">
        <div className="flex items-baseline justify-between">
          <span className="text-xl font-bold text-white">
            {resource.used}
            <span className="ml-0.5 text-sm font-normal text-slate-500">
              /{resource.total}
            </span>
          </span>
          <span className={`text-sm font-medium ${c.text}`}>
            {resource.percentage}%
          </span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-800">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${resource.percentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={`h-full rounded-full ${c.bar} ${c.glow}`}
            style={{ boxShadow: `0 0 8px` }}
          />
        </div>
      </div>
    </motion.div>
  );
};

const ResourceUsage = () => {
  return (
    <Card title="Resource Usage" subtitle="Real-time cluster resource utilization">
      <div className="grid gap-3 sm:grid-cols-2">
        {resources.map((resource) => (
          <ResourceCard key={resource.name} resource={resource} />
        ))}
      </div>
    </Card>
  );
};

export default ResourceUsage;
