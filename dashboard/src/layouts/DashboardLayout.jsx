import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Sidebar from "@/components/ui/Sidebar";
import Navbar from "@/components/ui/Navbar";
import { useSettings } from "@/hooks/useSettings";

const DashboardLayout = ({ children }) => {
  const { settings } = useSettings();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Close sidebar on navigation (mobile)
  const handleNav = () => {
    if (isMobile) setSidebarOpen(false);
  };

  const isRight = settings.sidebarPosition === "right";

  return (
    <div className="flex h-screen bg-slate-900 text-white">
      {/* Mobile hamburger */}
      {isMobile && (
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="fixed left-4 top-3 z-50 rounded-lg border border-slate-700 bg-slate-950 p-2 text-slate-400 transition-colors hover:text-white md:hidden"
          aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      )}

      {/* Overlay for mobile */}
      {isMobile && sidebarOpen && (
        <div
          className="sidebar-overlay open md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`sidebar-wrapper ${
          isMobile
            ? `fixed inset-y-0 z-[45] w-64 transform transition-transform duration-200 ${
                sidebarOpen ? "translate-x-0" : "-translate-x-full"
              } ${isRight ? "right-0 left-auto translate-x-full data-[open=true]:translate-x-0" : "left-0"}`
            : "relative shrink-0"
        }`}
        data-open={sidebarOpen}
        style={{ order: isRight && !isMobile ? 1 : undefined }}
      >
        <div className={`h-full ${isMobile ? "" : ""}`}>
          <Sidebar onNav={handleNav} isMobile={isMobile} />
        </div>
      </div>

      {/* Main content */}
      <div className="main-wrapper flex flex-1 flex-col overflow-hidden">
        <Navbar onMenuToggle={() => setSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto bg-slate-900 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
