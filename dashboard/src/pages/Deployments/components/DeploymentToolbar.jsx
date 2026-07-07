import { Plus, RefreshCw, Search as SearchIcon, X } from "lucide-react";
import { useState } from "react";
import DeploymentFilters from "./DeploymentFilters";

const DeploymentToolbar = ({
  search,
  onSearchChange,
  selectedStatuses,
  onStatusFilterChange,
  onRefresh,
  onNewDeployment,
  loading,
}) => {
  const [rotating, setRotating] = useState(false);

  const handleRefresh = () => {
    setRotating(true);
    setTimeout(() => setRotating(false), 600);
    onRefresh?.();
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Top row: title + action button */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Deployments</h1>
          <p className="mt-0.5 text-sm text-slate-400">
            Manage and monitor your application deployments.
          </p>
        </div>

        <button
          onClick={onNewDeployment}
          className="flex shrink-0 items-center gap-2 rounded-lg bg-[var(--accent)] px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-[var(--accent-hover)] active:scale-[0.97]"
        >
          <Plus size={18} />
          New Deployment
        </button>
      </div>

      {/* Bottom row: search, filter, refresh */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative w-full max-w-xs">
          <SearchIcon
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search deployments..."
            className="w-full rounded-lg border border-slate-700 bg-slate-900 py-2 pl-9 pr-8 text-sm text-white outline-none transition-colors placeholder:text-slate-500 focus:border-blue-600 focus:ring-1 focus:ring-blue-600/30"
          />
          {search && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-0.5 text-slate-500 hover:text-slate-300 transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Status filter */}
        <DeploymentFilters
          selectedStatuses={selectedStatuses}
          onChange={onStatusFilterChange}
        />

        {/* Refresh */}
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="rounded-lg border border-slate-700 p-2 text-slate-400 transition-all hover:border-slate-600 hover:text-white hover:bg-slate-800 disabled:opacity-40"
          title="Refresh"
        >
          <RefreshCw
            size={16}
            className={`transition-transform duration-500 ${rotating ? "rotate-180" : ""}`}
          />
        </button>
      </div>
    </div>
  );
};

export default DeploymentToolbar;
