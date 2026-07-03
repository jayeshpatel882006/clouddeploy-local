import { Circle } from "lucide-react";
import { navigation } from "@/config/navigation";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="flex w-64 flex-col border-r border-slate-800 bg-slate-950">
      {/* Logo */}
      <div className="border-b border-slate-800 p-6">
        <h1 className="text-2xl font-bold text-blue-500">CloudDeploy</h1>

        <p className="mt-1 text-sm text-slate-400">Local Platform</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <li key={item.id}>
                <NavLink
                  key={item.id}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex w-full items-center gap-3 rounded-lg px-4 py-3 transition-all ${
                      isActive
                        ? "bg-blue-600 text-white"
                        : "text-slate-400 hover:bg-slate-800 hover:text-white"
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
      <div className="border-t border-slate-800 p-4">
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Circle size={10} className="fill-green-500 text-green-500" />
          System Healthy
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
