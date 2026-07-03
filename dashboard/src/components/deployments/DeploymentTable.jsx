import DeploymentRow from "./DeploymentRow";

const deployments = [
  {
    id: 1,
    name: "Inventory API",
    image: "inventory:v1.2",
    status: "Running",
    replicas: 3,
  },
  {
    id: 2,
    name: "Auth Service",
    image: "auth:v2.1",
    status: "Running",
    replicas: 2,
  },
  {
    id: 3,
    name: "Payment API",
    image: "payment:v3.0",
    status: "Updating",
    replicas: 1,
  },
];

const DeploymentTable = () => {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
      <table className="w-full">
        <thead className="bg-slate-900">
          <tr className="text-left text-slate-400">
            <th className="px-4 py-4">Application</th>
            <th>Docker Image</th>
            <th>Status</th>
            <th>Replicas</th>
          </tr>
        </thead>

        <tbody>
          {deployments.map((deployment) => (
            <DeploymentRow key={deployment.id} deployment={deployment} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DeploymentTable;
