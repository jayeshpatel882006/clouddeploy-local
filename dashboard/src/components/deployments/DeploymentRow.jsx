const statusColors = {
  Running: "bg-green-500",
  Updating: "bg-yellow-500",
  Failed: "bg-red-500",
};

const DeploymentRow = ({ deployment }) => {
  return (
    <tr className="border-b border-slate-800 hover:bg-slate-900">
      <td className="px-4 py-4">{deployment.name}</td>

      <td>{deployment.image}</td>

      <td>
        <div className="flex items-center gap-2">
          <span
            className={`h-2 w-2 rounded-full ${statusColors[deployment.status]}`}
          ></span>

          {deployment.status}
        </div>
      </td>

      <td>{deployment.replicas}</td>
    </tr>
  );
};

export default DeploymentRow;
