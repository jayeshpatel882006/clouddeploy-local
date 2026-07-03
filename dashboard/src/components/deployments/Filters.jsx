import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, Filter } from "lucide-react";

const statusOptions = ["Running", "Updating", "Failed", "Pending", "Scaling"];
const namespaceOptions = ["production", "staging", "default", "development"];

const Dropdown = ({ label, options, selected, onChange, colorMap }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const activeCount = selected.length;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors ${
          activeCount > 0
            ? "border-blue-600/40 bg-blue-600/10 text-blue-400"
            : "border-slate-700 bg-slate-900 text-slate-400 hover:border-slate-600 hover:text-slate-300"
        }`}
      >
        <span>{label}</span>
        {activeCount > 0 && (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[11px] font-medium text-white">
            {activeCount}
          </span>
        )}
        <ChevronDown size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-1.5 w-48 rounded-xl border border-slate-700 bg-slate-900 p-1.5 shadow-xl">
          {options.map((opt) => {
            const isSelected = selected.includes(opt);
            const optColor = colorMap?.[opt];

            return (
              <button
                key={opt}
                onClick={() => {
                  onChange(
                    isSelected
                      ? selected.filter((s) => s !== opt)
                      : [...selected, opt]
                  );
                }}
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
                {optColor && (
                  <span className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${optColor}`} />
                    {opt}
                  </span>
                )}
                {!optColor && opt}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

const statusColors = {
  Running: "bg-green-500",
  Updating: "bg-yellow-500",
  Failed: "bg-red-500",
  Pending: "bg-blue-500",
  Scaling: "bg-purple-500",
};

const namespaceColors = {
  production: "bg-blue-500",
  staging: "bg-purple-500",
  default: "bg-slate-500",
  development: "bg-cyan-500",
};

const Filters = ({ filters, onChange }) => {
  const handleStatusChange = (newStatus) => {
    onChange({ ...filters, status: newStatus });
  };

  const handleNamespaceChange = (newNs) => {
    onChange({ ...filters, namespace: newNs });
  };

  const clearAll = () => {
    onChange({ status: [], namespace: [] });
  };

  const hasFilters = filters.status.length > 0 || filters.namespace.length > 0;

  return (
    <div className="flex items-center gap-2">
      <Dropdown
        label="Status"
        options={statusOptions}
        selected={filters.status}
        onChange={handleStatusChange}
        colorMap={statusColors}
      />
      <Dropdown
        label="Namespace"
        options={namespaceOptions}
        selected={filters.namespace}
        onChange={handleNamespaceChange}
        colorMap={namespaceColors}
      />
      {hasFilters && (
        <button
          onClick={clearAll}
          className="rounded-lg px-3 py-2 text-xs text-slate-500 transition-colors hover:text-slate-300"
        >
          Clear
        </button>
      )}
    </div>
  );
};

export default Filters;
