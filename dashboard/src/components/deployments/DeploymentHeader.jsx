import { useState } from "react";
import { Plus, Rocket } from "lucide-react";
import Search from "./Search";
import Filters from "./Filters";
import CreateDeploymentModal from "./CreateDeploymentModal";

const DeploymentHeader = ({ search, onSearchChange, filters, onFiltersChange }) => {
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-blue-600/10 p-2.5">
            <Rocket size={24} className="text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Deployments</h1>
            <p className="mt-0.5 text-sm text-slate-400">
              Manage Kubernetes deployments
            </p>
          </div>
        </div>

        <button
          onClick={() => setCreateOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-blue-700 active:scale-[0.97]"
        >
          <Plus size={18} />
          New Deployment
        </button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="w-full max-w-xs">
          <Search value={search} onChange={onSearchChange} />
        </div>
        <Filters filters={filters} onChange={onFiltersChange} />
      </div>

      <CreateDeploymentModal isOpen={createOpen} onClose={() => setCreateOpen(false)} />
    </>
  );
};

export default DeploymentHeader;
