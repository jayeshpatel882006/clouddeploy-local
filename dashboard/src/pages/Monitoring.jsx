import { useState } from "react";
import { motion } from "framer-motion";
import MonitoringHeader from "@/components/monitoring/MonitoringHeader";
import CpuUsage from "@/components/monitoring/CpuUsage";
import MemoryUsage from "@/components/monitoring/MemoryUsage";
import NetworkUsage from "@/components/monitoring/NetworkUsage";
import DiskUsage from "@/components/monitoring/DiskUsage";
import NodeUsage from "@/components/monitoring/NodeUsage";
import ContainerUsage from "@/components/monitoring/ContainerUsage";
import PodHealth from "@/components/monitoring/PodHealth";
import AlertsPanel from "@/components/monitoring/AlertsPanel";

const sectionVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.35, ease: "easeOut" },
  }),
};

const Monitoring = () => {
  const [timeRange, setTimeRange] = useState("24h");

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div custom={0} variants={sectionVariants}>
        <MonitoringHeader timeRange={timeRange} onTimeRangeChange={setTimeRange} />
      </motion.div>

      {/* Chart widgets */}
      <div className="grid gap-5 xl:grid-cols-4">
        <motion.div custom={1} variants={sectionVariants} className="xl:col-span-2">
          <CpuUsage />
        </motion.div>
        <motion.div custom={2} variants={sectionVariants} className="xl:col-span-2">
          <MemoryUsage />
        </motion.div>
      </div>

      <div className="grid gap-5 xl:grid-cols-4">
        <motion.div custom={3} variants={sectionVariants}>
          <NetworkUsage />
        </motion.div>
        <motion.div custom={4} variants={sectionVariants}>
          <DiskUsage />
        </motion.div>
        <motion.div custom={5} variants={sectionVariants} className="xl:col-span-2">
          <NodeUsage />
        </motion.div>
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        <motion.div custom={6} variants={sectionVariants} className="xl:col-span-2">
          <ContainerUsage />
        </motion.div>
        <motion.div custom={7} variants={sectionVariants}>
          <PodHealth />
        </motion.div>
      </div>

      <motion.div custom={8} variants={sectionVariants}>
        <AlertsPanel />
      </motion.div>
    </motion.div>
  );
};

export default Monitoring;
