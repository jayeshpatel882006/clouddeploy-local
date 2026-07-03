import { useState } from "react";
import { Database, Search, X, RefreshCw } from "lucide-react";
import { toast } from "react-hot-toast";

const RegistryHeader = ({ onRefresh }) => {
  const [pulling, setPulling] = useState(false);

  const handlePullAll = () => {
    setPulling(true);
    setTimeout(() => {
      setPulling(false);
      toast.success("Pulled all images successfully", {
        style: { background: "#1e293b", color: "#f8fafc", border: "1px solid #334155" },
      });
    }, 1500);
  };

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
      <div className="flex items-start gap-3">
        <div className="rounded-lg bg-emerald-600/10 p-2.5">
          <Database size={24} className="text-emerald-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Container Registry</h1>
          <p className="mt-0.5 text-sm text-slate-400">
            Docker image registry for the local platform
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onRefresh}
          className="flex items-center gap-2 rounded-lg border border-slate-700 px-3.5 py-2.5 text-sm font-medium text-slate-400 transition-all hover:border-slate-600 hover:text-white active:scale-[0.97]"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
        <button
          onClick={handlePullAll}
          disabled={pulling}
          className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-emerald-700 active:scale-[0.97] disabled:opacity-60"
        >
          {pulling ? (
            <>
              <RefreshCw size={16} className="animate-spin" />
              Pulling...
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Pull All
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default RegistryHeader;
