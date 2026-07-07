import { memo } from "react";
import {
  Eye,
  RotateCw,
  Trash2,
  ExternalLink,
  GitBranch,
} from "lucide-react";
import DeploymentStatusBadge from "./DeploymentStatusBadge";

const shortRepo = (url) => {
  if (!url) return "—";
  return url.replace(/^https?:\/\//, "").replace(/\.git$/, "");
};

const DeploymentRow = memo(({ deployment, onView, onDelete }) => {
  const isRunning = deployment.status === "RUNNING";
  const hasPreview = isRunning && deployment.previewUrl;

  return (
    <tr
      className="group border-b border-slate-800/60 transition-colors hover:bg-slate-900/40 cursor-pointer"
      onClick={() => onView?.(deployment)}
    >
      {/* Project Name */}
      <td className="py-3.5 pr-3">
        <span className="block truncate font-medium text-slate-200" title={deployment.name}>
          {deployment.name || "—"}
        </span>
      </td>

      {/* Repository */}
      <td className="py-3.5 pr-3">
        <div className="flex items-center gap-1.5 min-w-0">
          <ExternalLink size={12} className="shrink-0 text-slate-600" />
          <span
            className="truncate text-xs text-slate-400"
            title={deployment.repositoryUrl || ""}
          >
            {shortRepo(deployment.repositoryUrl)}
          </span>
        </div>
      </td>

      {/* Branch */}
      <td className="py-3.5 pr-3">
        <div className="flex items-center gap-1">
          <GitBranch size={12} className="shrink-0 text-slate-500" />
          <span className="text-xs text-slate-300">{deployment.branch || "—"}</span>
        </div>
      </td>

      {/* Status */}
      <td className="py-3.5 pr-3">
        <DeploymentStatusBadge status={deployment.status} />
      </td>

      {/* Preview */}
      <td className="py-3.5 pr-3">
        {hasPreview ? (
          <a
            href={deployment.previewUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1 rounded-md bg-green-600/10 px-2 py-1 text-xs font-medium text-green-400 transition-colors hover:bg-green-600/20 hover:shadow-[0_0_8px_rgba(34,197,94,0.25)]"
          >
            <ExternalLink size={11} />
            Open App
          </a>
        ) : (
          <span className="text-xs text-slate-600">Not Available</span>
        )}
      </td>

      {/* Created */}
      <td className="whitespace-nowrap py-3.5 pr-3">
        <span className="text-xs text-slate-400">
          {deployment.createdAtFormatted || "—"}
        </span>
      </td>

      {/* Updated */}
      <td className="whitespace-nowrap py-3.5 pr-3">
        <span className="text-xs text-slate-400">
          {deployment.updatedAtFormatted || "—"}
        </span>
      </td>

      {/* Actions */}
      <td className="py-3.5 pr-4">
        <div className="flex items-center gap-0.5" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => onView?.(deployment)}
            className="rounded-lg p-1.5 text-slate-500 opacity-0 transition-all hover:bg-slate-800 hover:text-slate-200 group-hover:opacity-100"
            title="View details"
          >
            <Eye size={15} />
          </button>
          {hasPreview ? (
            <a
              href={deployment.previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg p-1.5 text-slate-500 opacity-0 transition-all hover:bg-slate-800 hover:text-slate-200 group-hover:opacity-100"
              title="Open Application"
            >
              <ExternalLink size={15} />
            </a>
          ) : (
            <span
              className="rounded-lg p-1.5 text-slate-700 opacity-0 transition-all group-hover:opacity-100 cursor-not-allowed"
              title="Not available"
            >
              <ExternalLink size={15} />
            </span>
          )}
          <span
            className="rounded-lg p-1.5 text-slate-700 opacity-0 transition-all group-hover:opacity-100 cursor-not-allowed"
            title="Redeploy (coming soon)"
          >
            <RotateCw size={15} />
          </span>
          <button
            onClick={() => onDelete?.(deployment)}
            className="rounded-lg p-1.5 text-slate-500 opacity-0 transition-all hover:bg-red-900/30 hover:text-red-400 group-hover:opacity-100"
            title="Delete (coming soon)"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </td>
    </tr>
  );
});

export default DeploymentRow;
