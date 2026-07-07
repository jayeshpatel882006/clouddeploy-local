import { motion } from "framer-motion";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatsCards from "@/components/dashboard/StatsCards";
import ClusterHealth from "@/components/dashboard/ClusterHealth";
import QuickActions from "@/components/dashboard/QuickActions";
import ResourceUsage from "@/components/dashboard/ResourceUsage";
import RecentDeployments from "@/components/dashboard/RecentDeployments";
import RecentActivity from "@/components/dashboard/RecentActivity";
import { useDeployments } from "@/hooks/useDeployments";
import { calculateStats } from "@/services/deployment.service";
import { Skeleton } from "@/components/ui/Skeleton";
import { Cloud } from "lucide-react";

const sectionVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.4, ease: "easeOut" },
  }),
};

const Dashboard = () => {
  const { deployments, loading, refresh } = useDeployments();

  const stats = calculateStats(deployments);

  if (loading) {
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-slate-800 p-2.5">
            <Cloud size={24} className="text-slate-500" />
          </div>
          <div>
            <Skeleton variant="title" className="w-48" />
            <Skeleton variant="subtitle" className="w-32 mt-1" />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Skeleton variant="card-sm" count={4} />
        </div>
        <Skeleton variant="card" count={2} />
      </motion.div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div custom={0} variants={sectionVariants}>
        <DashboardHeader onRefresh={refresh} />
      </motion.div>

      <motion.div custom={1} variants={sectionVariants}>
        <StatsCards stats={stats} />
      </motion.div>

      <motion.div custom={2} variants={sectionVariants}>
        <ResourceUsage />
      </motion.div>

      <div className="grid gap-6 xl:grid-cols-3">
        <motion.div custom={3} variants={sectionVariants} className="xl:col-span-2">
          <RecentDeployments deployments={deployments.slice(0, 5)} />
        </motion.div>
        <motion.div custom={4} variants={sectionVariants}>
          <ClusterHealth />
        </motion.div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <motion.div custom={5} variants={sectionVariants}>
          <QuickActions />
        </motion.div>
        <motion.div custom={6} variants={sectionVariants} className="xl:col-span-2">
          <RecentActivity />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
