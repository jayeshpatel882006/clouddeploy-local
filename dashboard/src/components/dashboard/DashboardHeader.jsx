import { RefreshCw, Cloud } from "lucide-react";
import { useState } from "react";

const DashboardHeader = () => {
  const [rotating, setRotating] = useState(false);

  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const timeStr = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleRefresh = () => {
    setRotating(true);
    setTimeout(() => setRotating(false), 600);
  };

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex items-start gap-3">
        <div className="rounded-lg bg-blue-600/10 p-2.5">
          <Cloud size={24} className="text-blue-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="mt-0.5 text-sm text-slate-400">
            {dateStr} &middot; {timeStr}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5">
          <span className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.5)]" />
          <span className="text-sm text-slate-300">All Systems Operational</span>
        </div>
        <button
          onClick={handleRefresh}
          className="rounded-lg border border-slate-700 p-2 text-slate-400 transition-all hover:border-slate-600 hover:text-white hover:bg-slate-800"
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

export default DashboardHeader;
