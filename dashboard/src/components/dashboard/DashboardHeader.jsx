import { RefreshCw, Cloud, XCircle, HelpCircle } from "lucide-react";
import { useState } from "react";
import { useSystemHealth } from "@/hooks/useSystemHealth";
import HealthPopover from "@/components/common/HealthPopover";
import Skeleton from "@/components/ui/Skeleton";

const DashboardHeader = ({ onRefresh: externalRefresh }) => {
  const [rotating, setRotating] = useState(false);
  const { healthSummary, loading, error, refresh } = useSystemHealth();

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
    refresh();
    if (externalRefresh) {
      externalRefresh();
    }
  };

  const getHealthDot = () => {
    if (loading && !healthSummary) {
      return <span className="h-2 w-2 animate-pulse rounded-full bg-slate-600" />;
    }
    if (error || !healthSummary) {
      return (
        <HelpCircle size={16} className="text-slate-500" />
      );
    }
    if (healthSummary.allHealthy) {
      return (
        <span className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.5)]" />
      );
    }
    return (
      <XCircle size={16} className="text-red-400" />
    );
  };

  const getHealthLabel = () => {
    if (loading && !healthSummary) return "Checking system...";
    if (error || !healthSummary) return "Status Unknown";
    return healthSummary.allHealthy
      ? "All Systems Operational"
      : `${healthSummary.unhealthy} Service${healthSummary.unhealthy > 1 ? "s" : ""} Degraded`;
  };

  const getHealthBg = () => {
    if (error || !healthSummary) return "border-slate-700 bg-slate-900";
    return healthSummary.allHealthy
      ? "border-slate-700 bg-slate-900"
      : "border-red-600/30 bg-red-600/5";
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
        <HealthPopover
          healthSummary={healthSummary}
          loading={loading}
          error={error}
          onRefresh={refresh}
          align="right"
          trigger={
            <div
              className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 transition-colors hover:border-slate-600 ${getHealthBg()}`}
            >
              {getHealthDot()}
              <span className={`text-sm ${error ? "text-slate-400" : healthSummary?.allHealthy === false ? "text-red-400" : "text-slate-300"}`}>
                {getHealthLabel()}
              </span>
            </div>
          }
        />
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
