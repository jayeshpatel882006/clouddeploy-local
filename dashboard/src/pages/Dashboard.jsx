import { motion } from "framer-motion";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatsCards from "@/components/dashboard/StatsCards";
import ClusterHealth from "@/components/dashboard/ClusterHealth";
import QuickActions from "@/components/dashboard/QuickActions";
import ResourceUsage from "@/components/dashboard/ResourceUsage";
import RecentDeployments from "@/components/dashboard/RecentDeployments";
import RecentActivity from "@/components/dashboard/RecentActivity";

const sectionVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.4, ease: "easeOut" },
  }),
};

const Dashboard = () => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div custom={0} variants={sectionVariants}>
        <DashboardHeader />
      </motion.div>

      <motion.div custom={1} variants={sectionVariants}>
        <StatsCards />
      </motion.div>

      <motion.div custom={2} variants={sectionVariants}>
        <ResourceUsage />
      </motion.div>

      <div className="grid gap-6 xl:grid-cols-3">
        <motion.div custom={3} variants={sectionVariants} className="xl:col-span-2">
          <RecentDeployments />
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
