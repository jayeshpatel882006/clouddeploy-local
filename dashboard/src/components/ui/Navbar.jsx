import { Bell, Search, CircleUserRound, Menu, CheckCircle2 } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useSettings } from "@/hooks/useSettings";
import { useSystemHealth } from "@/hooks/useSystemHealth";
import HealthPopover from "@/components/common/HealthPopover";
import Skeleton from "@/components/ui/Skeleton";

const pageTitles = {
  "/": { title: "Dashboard", subtitle: "Manage your local cloud platform" },
  "/deployments": { title: "Deployments", subtitle: "Manage and monitor your application deployments" },
  "/clusters": { title: "Clusters", subtitle: "Kubernetes cluster resources and management" },
  "/monitoring": { title: "Monitoring", subtitle: "Real-time cluster metrics and observability" },
  "/logs": { title: "Logs", subtitle: "Centralized log aggregation and search" },
  "/registry": { title: "Registry", subtitle: "Container image registry management" },
  "/settings": { title: "Settings", subtitle: "Platform configuration and preferences" },
};

const Navbar = ({ onMenuToggle }) => {
  const location = useLocation();
  const { settings } = useSettings();
  const { healthSummary, loading, error, refresh } = useSystemHealth();
  const page = pageTitles[location.pathname] || { title: "Dashboard", subtitle: "" };

  return (
    <header
      className="flex h-16 items-center justify-between border-b border-slate-800 bg-[var(--bg-header)] px-4 md:px-6"
      role="banner"
      style={{ borderBottomColor: "var(--card-accent-border)" }}
    >
      {/* Left */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile hamburger */}
        <button
          onClick={onMenuToggle}
          className="rounded-lg border border-slate-700 p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white md:hidden"
          aria-label="Open menu"
        >
          <Menu size={18} />
        </button>
        <div className="min-w-0">
          <h2 className="truncate text-xl font-semibold text-white">{page.title}</h2>
          <p className="hidden truncate text-xs text-slate-400 sm:block">{page.subtitle}</p>
        </div>
      </div>

      {/* Right */}
      <nav className="flex items-center gap-2 md:gap-4" aria-label="Top navigation">
        {/* Search */}
        <div className="hidden items-center rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 transition-colors focus-within:border-[var(--accent)] focus-within:ring-1 focus-within:ring-[var(--accent)]/30 md:flex">
          <Search size={18} className="text-slate-400" aria-hidden="true" />
          <input
            type="text"
            placeholder="Search..."
            aria-label="Search the platform"
            className="ml-2 w-36 lg:w-48 bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
          />
        </div>

        {/* Notification */}
        <button
          className="rounded-lg border border-slate-700 p-2 text-slate-400 transition-all hover:bg-slate-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/40"
          aria-label="View notifications"
        >
          <Bell size={18} />
        </button>

        {/* System Status - hidden on mobile/tablet */}
        <div className="hidden lg:block">
          <HealthPopover
            healthSummary={healthSummary}
            loading={loading}
            error={error}
            onRefresh={refresh}
            align="right"
            trigger={
              <div
                className="flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 transition-colors hover:border-slate-600"
                role="status"
                aria-label="System health status"
              >
                {loading && !healthSummary ? (
                  <>
                    <Skeleton variant="circle" className="!h-2 !w-2" />
                    <Skeleton variant="text-sm" className="!h-3 !w-14" />
                  </>
                ) : (
                  <>
                    <span
                      className={`h-2 w-2 rounded-full ${
                        healthSummary?.allHealthy
                          ? "bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.5)]"
                          : error
                            ? "bg-slate-500"
                            : "bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.5)]"
                      }`}
                    />
                    <span className="text-sm text-slate-300">
                      {healthSummary?.label || (error ? "Unknown" : "Checking...")}
                    </span>
                  </>
                )}
              </div>
            }
          />
        </div>

        {/* User */}
        <button
          className="rounded-full border border-slate-700 p-1 text-slate-400 transition-all hover:bg-slate-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/40"
          aria-label="User menu"
        >
          <CircleUserRound size={28} className="md:size-[30px]" />
        </button>
      </nav>
    </header>
  );
};

export default Navbar;
