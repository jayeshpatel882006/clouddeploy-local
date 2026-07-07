import { motion } from "framer-motion";
import {
  Settings, Container, Server, Database, Wrench, Palette, User, Bell, Info,
} from "lucide-react";

const sections = [
  { id: "general", label: "General", icon: Settings },
  { id: "docker", label: "Docker", icon: Container },
  { id: "kubernetes", label: "Kubernetes", icon: Server },
  { id: "registry", label: "Registry", icon: Database },
  { id: "floci", label: "Floci", icon: Wrench },
  { id: "theme", label: "Theme", icon: Palette },
  { id: "profile", label: "Profile", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "about", label: "About", icon: Info },
];

const SettingsSidebar = ({ activeSection, onSectionChange }) => {
  return (
    <nav className="settings-sidebar flex shrink-0 flex-col gap-1 rounded-xl border border-slate-800 bg-slate-950 p-2 shadow-sm md:w-48">
      {sections.map((section) => {
        const isActive = activeSection === section.id;
        const Icon = section.icon;
        return (
          <motion.button
            key={section.id}
            onClick={() => onSectionChange(section.id)}
            whileTap={{ scale: 0.97 }}
            className={`flex items-center gap-2.5 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-all ${
              isActive
                ? "bg-[var(--accent)] text-white shadow-sm"
                : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
            }`}
          >
            <Icon size={18} />
            {section.label}
          </motion.button>
        );
      })}
    </nav>
  );
};

export default SettingsSidebar;
