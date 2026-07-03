import { Plus, Search } from "lucide-react";
import { useState } from "react";
import CreateDeploymentModal from "./CreateDeploymentModal";

const DeploymentHeader = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-3xl font-bold">Deployments</h1>
        <p className="mt-1 text-slate-400">Manage Kubernetes deployments</p>
      </div>

      <div className="flex gap-3">
        <div className="flex items-center rounded-lg border border-slate-700 bg-slate-900 px-3">
          <Search size={18} className="text-slate-400" />

          <input
            type="text"
            placeholder="Search deployment..."
            className="bg-transparent px-2 py-2 text-sm outline-none"
          />
        </div>

        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 hover:bg-blue-700"
        >
          <Plus size={18} />
          New Deployment
        </button>
      </div>
      <CreateDeploymentModal isOpen={open} onClose={() => setOpen(false)} />
    </div>
  );
};

export default DeploymentHeader;
