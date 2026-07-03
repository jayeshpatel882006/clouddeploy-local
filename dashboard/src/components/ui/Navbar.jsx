import { Bell, Search, CircleUserRound } from "lucide-react";

const Navbar = () => {
  return (
    <header
      className="flex h-16 items-center justify-between border-b border-slate-800 bg-slate-950 px-6"
      role="banner"
    >
      {/* Left */}
      <div>
        <h2 className="text-xl font-semibold text-white">Dashboard</h2>
        <p className="text-xs text-slate-400">Manage your local cloud platform</p>
      </div>

      {/* Right */}
      <nav className="flex items-center gap-4" aria-label="Top navigation">
        {/* Search */}
        <div className="hidden items-center rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 transition-colors focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500/30 md:flex">
          <Search size={18} className="text-slate-400" aria-hidden="true" />
          <input
            type="text"
            placeholder="Search..."
            aria-label="Search the platform"
            className="ml-2 w-48 bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
          />
        </div>

        {/* Notification */}
        <button
          className="rounded-lg border border-slate-700 p-2 text-slate-400 transition-all hover:bg-slate-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
          aria-label="View notifications"
        >
          <Bell size={18} />
        </button>

        {/* System Status */}
        <div
          className="hidden items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 lg:flex"
          role="status"
          aria-label="System health status"
        >
          <span className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.5)]" />
          <span className="text-sm text-slate-300">Healthy</span>
        </div>

        {/* User */}
        <button
          className="rounded-full border border-slate-700 p-1 text-slate-400 transition-all hover:bg-slate-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
          aria-label="User menu"
        >
          <CircleUserRound size={30} />
        </button>
      </nav>
    </header>
  );
};

export default Navbar;
