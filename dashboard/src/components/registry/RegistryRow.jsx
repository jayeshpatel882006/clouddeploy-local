import { Eye, Trash2, Download, Tag } from "lucide-react";
import RegistryStatusBadge from "./RegistryStatusBadge";
import { motion } from "framer-motion";

const RegistryRow = ({ image, onView, onDelete, onPull, onSelect, isSelected }) => {
  const vulnDot = image.vulnerabilities === null
    ? "bg-blue-500"
    : image.vulnerabilities > 0
      ? "bg-red-500"
      : "bg-green-500";

  const vulnLabel = image.vulnerabilities === null
    ? "Scanning"
    : image.vulnerabilities === 0
      ? "0 vulns"
      : `${image.vulnerabilities} vulns`;

  return (
    <motion.tr
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`group border-b border-slate-800/60 transition-colors ${
        isSelected ? "bg-blue-600/5" : "hover:bg-slate-900/60"
      } cursor-pointer`}
      onClick={() => onView(image)}
    >
      <td className="py-3 pl-5 pr-4" onClick={(e) => e.stopPropagation()}>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onSelect(image.id)}
            className="h-4 w-4 rounded border-slate-600 bg-slate-800 text-emerald-600 focus:ring-emerald-600/30 focus:ring-offset-0"
          />
        </label>
      </td>
      <td className="py-3 pr-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600/10 text-emerald-400">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
          </div>
          <div>
            <span className="font-medium text-slate-200">{image.name}</span>
            <div className="mt-0.5 text-xs text-slate-500">{image.description}</div>
          </div>
        </div>
      </td>
      <td className="py-3 pr-4">
        <div className="flex items-center gap-1.5">
          <Tag size={12} className="text-slate-500" />
          <span className="text-sm text-slate-300">{image.tags.length}</span>
        </div>
      </td>
      <td className="py-3 pr-4">
        <RegistryStatusBadge status={image.status} />
      </td>
      <td className="py-3 pr-4 text-sm text-slate-300">{image.totalSize}</td>
      <td className="py-3 pr-4">
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${vulnDot}`} />
          <span className="text-xs text-slate-400">{vulnLabel}</span>
        </div>
      </td>
      <td className="py-3 pr-4 text-sm text-slate-400">{image.lastPulled}</td>
      <td className="py-3 pr-4 text-sm text-slate-500">{image.totalPulls}</td>
      <td className="py-3 pr-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-0.5">
          <button
            onClick={() => onView(image)}
            className="rounded-lg p-1.5 text-slate-500 opacity-0 transition-all hover:bg-slate-800 hover:text-slate-200 group-hover:opacity-100"
            title="View details"
          >
            <Eye size={15} />
          </button>
          <button
            onClick={() => onPull(image)}
            className="rounded-lg p-1.5 text-slate-500 opacity-0 transition-all hover:bg-slate-800 hover:text-slate-200 group-hover:opacity-100"
            title="Pull image"
          >
            <Download size={15} />
          </button>
          <button
            onClick={() => onDelete(image)}
            className="rounded-lg p-1.5 text-slate-500 opacity-0 transition-all hover:bg-red-900/30 hover:text-red-400 group-hover:opacity-100"
            title="Delete image"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </td>
    </motion.tr>
  );
};

export default RegistryRow;
