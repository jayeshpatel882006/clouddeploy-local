import { Circle, XCircle, HelpCircle } from "lucide-react";
import { navigation } from "@/config/navigation";
import { NavLink } from "react-router-dom";
import { useSystemHealth } from "@/hooks/useSystemHealth";
import HealthPopover from "@/components/common/HealthPopover";
import Skeleton from "@/components/ui/Skeleton";

const Sidebar = ({ onNav, isMobile }) => {
  return (
    <aside className="flex h-full w-64 flex-col border-r border-slate-800 bg-[var(--bg-sidebar)]">
      {/* Logo */}
      <div className="border-b border-slate-800 p-6" style={{ borderColor: "var(--card-accent-border)" }}>
        <h1 className="text-2xl font-bold text-[var(--accent)]">CloudDeploy</h1>

        <p className="mt-1 text-sm text-slate-400">Local Platform</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <li key={item.id}>
                <NavLink
                  to={item.path}
                  onClick={onNav}
                  className={({ isActive }) =>
                    `flex w-full items-center gap-3 rounded-lg px-4 py-3 transition-all ${
                      isActive
                        ? "bg-[var(--accent)] text-white"
                        : "text-slate-400 hover:bg-[var(--sidebar-hover-bg)] hover:text-[var(--accent-light)]"
                    }`
                  }
                >
                  <Icon size={20} />
                  {item.title}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-800 p-4" style={{ borderColor: "var(--card-accent-border)" }}>
        <SidebarFooter />
      </div>
    </aside>
  );
};

// ── Sidebar health footer ──
const SidebarFooter = () => {
  const { healthSummary, loading, error } = useSystemHealth();

  const getStatusIcon = () => {
    if (loading && !healthSummary) {
      return (
        <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-slate-600" />
      );
    }
    if (error || !healthSummary) {
      return (
        <HelpCircle size={10} className="text-slate-500" />
      );
    }
    if (healthSummary.allHealthy) {
      return (
        <Circle size={10} className="fill-green-500 text-green-500" />
      );
    }
    return (
      <XCircle size={10} className="text-red-400" />
    );
  };

  const getStatusLabel = () => {
    if (loading && !healthSummary) return "Checking...";
    if (error || !healthSummary) return "Unknown";
    return healthSummary.allHealthy ? "All Systems Healthy" : "Issues Detected";
  };

  const getStatusColor = () => {
    if (loading && !healthSummary) return "text-slate-500";
    if (error || !healthSummary) return "text-slate-500";
    return healthSummary.allHealthy ? "text-slate-400" : "text-red-400";
  };

  return (
    <HealthPopover
      healthSummary={healthSummary}
      loading={loading}
      error={error}
      trigger={
        <div
          className={`flex items-center gap-2 text-sm ${getStatusColor()} transition-colors hover:text-slate-300`}
        >
          {getStatusIcon()}
          {getStatusLabel()}
        </div>
      }
    />
  );
};

export default Sidebar;
