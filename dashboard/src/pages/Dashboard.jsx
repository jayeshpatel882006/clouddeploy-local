import StatsCard from "@/components/dashboard/StatsCard";
import DeploymentTable from "@/components/dashboard/DeploymentTable";
import ClusterStatus from "@/components/dashboard/ClusterStatus";

const stats = [
  {
    title: "Applications",
    value: 8,
    subtitle: "Running applications",
    color: "blue",
  },
  {
    title: "Pods",
    value: 24,
    subtitle: "Running pods",
    color: "green",
  },
  {
    title: "Cluster",
    value: "Healthy",
    subtitle: "Kubernetes status",
    color: "green",
  },
  {
    title: "CPU Usage",
    value: "32%",
    subtitle: "Current utilization",
    color: "yellow",
  },
];

const Dashboard = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>

        <p className="mt-2 text-slate-400">Welcome to CloudDeploy Local</p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <DeploymentTable />
        </div>

        <ClusterStatus />
      </div>
    </div>
  );
};

export default Dashboard;
