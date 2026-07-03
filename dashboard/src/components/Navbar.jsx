import { Bell, Search, CircleUserRound } from "lucide-react";

const Navbar = () => {
  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-800 bg-slate-950 px-6">
      {/* Left */}
      <div>
        <h2 className="text-xl font-semibold text-white">Dashboard</h2>
        <p className="text-xs text-slate-400">
          Manage your local cloud platform
        </p>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="hidden items-center rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 md:flex">
          <Search size={18} className="text-slate-400" />
          <input
            type="text"
            placeholder="Search..."
            className="ml-2 w-48 bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
          />
        </div>

        {/* Notification */}
        <button className="rounded-lg border border-slate-700 p-2 hover:bg-slate-800">
          <Bell size={18} />
        </button>

        {/* System Status */}
        <div className="hidden items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 lg:flex">
          <span className="h-2 w-2 rounded-full bg-green-500"></span>
          <span className="text-sm text-slate-300">Healthy</span>
        </div>

        {/* User */}
        <button className="rounded-full border border-slate-700 p-1 hover:bg-slate-800">
          <CircleUserRound size={30} />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
