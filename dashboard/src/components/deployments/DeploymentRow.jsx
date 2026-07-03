import { Eye, SlidersHorizontal, Trash2 } from "lucide-react";
import StatusBadge from "./StatusBadge";

const namespaceColors = {
  production: "bg-blue-600/10 text-blue-400 border-blue-500/20",
  staging: "bg-purple-600/10 text-purple-400 border-purple-500/20",
  default: "bg-slate-600/10 text-slate-400 border-slate-500/20",
  development: "bg-cyan-600/10 text-cyan-400 border-cyan-500/20",
};

const DeploymentRow = ({ deployment, onView, onScale, onDelete, onSelect, isSelected }) => {

  const handleClick = () => {
    if (onView) onView(deployment);
  };

  return (
    <tr
      className={`group border-b border-slate-800/60 transition-colors ${
        isSelected
          ? "bg-blue-600/5"
          : "hover:bg-slate-900/60"
      } cursor-pointer`}
      onClick={handleClick}
    >
      <td className="py-3.5 pl-5 pr-4">
        <label className="flex items-center" onClick={(e) => e.stopPropagation()}>
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onSelect?.(deployment.id)}
            className="h-4 w-4 rounded border-slate-600 bg-slate-800 text-blue-600 focus:ring-blue-600/30 focus:ring-offset-0"
          />
        </label>
      </td>
      <td className="py-3.5 pr-4">
        <div>
          <span className="font-medium text-slate-200">{deployment.name}</span>
          <div className="mt-0.5 text-xs text-slate-500">{deployment.image}</div>
        </div>
      </td>
      <td className="py-3.5 pr-4">
        <span
          className={`inline-block rounded-md border px-2 py-0.5 text-xs font-medium ${
            namespaceColors[deployment.namespace] || namespaceColors.default
          }`}
        >
          {deployment.namespace}
        </span>
      </td>
      <td className="py-3.5 pr-4">
        <StatusBadge status={deployment.status} />
      </td>
      <td className="py-3.5 pr-4 text-slate-300">
        {deployment.readyReplicas}/{deployment.replicas}
      </td>
      <td className="py-3.5 pr-4 text-slate-400 text-xs">
        <div>{deployment.cpu}</div>
        <div className="text-slate-500">{deployment.memory}</div>
      </td>
      <td className="py-3.5 pr-4 text-slate-500 text-xs">{deployment.created}</td>
      <td className="py-3.5 pr-4">
        <div className="flex items-center gap-0.5" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => onView?.(deployment)}
            className="rounded-lg p-1.5 text-slate-500 opacity-0 transition-all hover:bg-slate-800 hover:text-slate-200 group-hover:opacity-100"
            title="View details"
          >
            <Eye size={15} />
          </button>
          <button
            onClick={() => onScale?.(deployment)}
            className="rounded-lg p-1.5 text-slate-500 opacity-0 transition-all hover:bg-slate-800 hover:text-slate-200 group-hover:opacity-100"
            title="Scale replicas"
          >
            <SlidersHorizontal size={15} />
          </button>
          <button
            onClick={() => onDelete?.(deployment)}
            className="rounded-lg p-1.5 text-slate-500 opacity-0 transition-all hover:bg-red-900/30 hover:text-red-400 group-hover:opacity-100"
            title="Delete deployment"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default DeploymentRow;
