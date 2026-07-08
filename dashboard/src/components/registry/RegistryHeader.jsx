import { useState } from "react";
import { Database, RefreshCw, Download } from "lucide-react";
import { toast } from "react-hot-toast";

const toastStyle = {
  background: "#1e293b",
  color: "#f8fafc",
  border: "1px solid #334155",
};

const RegistryHeader = ({ onRefresh, loading, totalImages, totalRepos }) => {
  const [pulling, setPulling] = useState(false);

  const handlePullAll = () => {
    setPulling(true);
    setTimeout(() => {
      setPulling(false);
      toast.success("Pulled all images successfully", { style: toastStyle });
    }, 1500);
  };

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
      <div className="flex items-start gap-3">
        <div className="rounded-lg bg-[var(--accent-bg)] p-2.5">
          <Database size={24} className="text-[var(--accent)]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Container Registry</h1>
          <p className="mt-0.5 text-sm text-slate-400">
            {totalRepos > 0
              ? `${totalRepos} repositor${totalRepos !== 1 ? "ies" : "y"}, ${totalImages} image${totalImages !== 1 ? "s" : ""}`
              : "Docker image registry for the local platform"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onRefresh}
          disabled={loading}
          className="flex items-center gap-2 rounded-lg border border-slate-700 px-3.5 py-2.5 text-sm font-medium text-slate-400 transition-all hover:border-slate-600 hover:text-white active:scale-[0.97] disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          {loading ? "Loading..." : "Refresh"}
        </button>
        <button
          onClick={handlePullAll}
          disabled={pulling}
          className="flex items-center gap-2 rounded-lg bg-[var(--accent)] px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-[var(--accent-hover)] active:scale-[0.97] disabled:opacity-60"
        >
          {pulling ? (
            <>
              <RefreshCw size={16} className="animate-spin" />
              Pulling...
            </>
          ) : (
            <>
              <Download size={16} />
              Pull All
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default RegistryHeader;
