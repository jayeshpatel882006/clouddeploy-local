import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, X } from "lucide-react";
import { STATUSES, getStatusConfig } from "../utils/deploymentStatus";

const DeploymentFilters = ({ selectedStatuses = [], onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const toggleStatus = (status) => {
    const next = selectedStatuses.includes(status)
      ? selectedStatuses.filter((s) => s !== status)
      : [...selectedStatuses, status];
    onChange(next);
  };

  const clearAll = () => onChange([]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors ${
          selectedStatuses.length > 0
            ? "border-blue-600/40 bg-blue-600/10 text-blue-400"
            : "border-slate-700 bg-slate-900 text-slate-400 hover:border-slate-600 hover:text-slate-300"
        }`}
      >
        <span>Status</span>
        {selectedStatuses.length > 0 && (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[11px] font-medium text-white">
            {selectedStatuses.length}
          </span>
        )}
        <ChevronDown
          size={14}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-1.5 w-52 rounded-xl border border-slate-700 bg-slate-900 p-2 shadow-xl">
          <div className="mb-1 flex items-center justify-between px-1">
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
              Status
            </span>
            {selectedStatuses.length > 0 && (
              <button
                onClick={clearAll}
                className="flex items-center gap-0.5 text-[11px] text-slate-500 hover:text-slate-300"
              >
                <X size={11} />
                Clear
              </button>
            )}
          </div>
          {STATUSES.map((status) => {
            const config = getStatusConfig(status);
            const isSelected = selectedStatuses.includes(status);

            return (
              <button
                key={status}
                onClick={() => toggleStatus(status)}
                className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors ${
                  isSelected
                    ? "bg-blue-600/10 text-blue-400"
                    : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                }`}
              >
                <div
                  className={`flex h-4 w-4 items-center justify-center rounded border ${
                    isSelected
                      ? "border-blue-500 bg-blue-600"
                      : "border-slate-600"
                  }`}
                >
                  {isSelected && <Check size={10} className="text-white" />}
                </div>
                <span className={`h-2 w-2 rounded-full ${config.dot}`} />
                {config.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DeploymentFilters;
