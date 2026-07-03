const deployments = [
  {
    name: "Inventory API",
    version: "v1.2.0",
    status: "Running",
  },
  {
    name: "Auth Service",
    version: "v1.1.3",
    status: "Running",
  },
  {
    name: "Payment API",
    version: "v2.0.1",
    status: "Updating",
  },
];

const statusColor = {
  Running: "text-green-400",
  Updating: "text-yellow-400",
  Failed: "text-red-400",
};

const DeploymentTable = () => {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
      <h2 className="mb-5 text-lg font-semibold">Recent Deployments</h2>

      <table className="w-full">
        <thead className="text-left text-sm text-slate-400">
          <tr>
            <th>Name</th>
            <th>Version</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {deployments.map((deployment) => (
            <tr key={deployment.name} className="border-t border-slate-800">
              <td className="py-4">{deployment.name}</td>

              <td>{deployment.version}</td>

              <td className={statusColor[deployment.status]}>
                {deployment.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DeploymentTable;
