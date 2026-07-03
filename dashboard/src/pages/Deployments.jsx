import DeploymentHeader from "@/components/deployments/DeploymentHeader";
import DeploymentTable from "@/components/deployments/DeploymentTable";

const Deployments = () => {
  return (
    <div className="space-y-8">
      <DeploymentHeader />

      <DeploymentTable />
    </div>
  );
};

export default Deployments;
