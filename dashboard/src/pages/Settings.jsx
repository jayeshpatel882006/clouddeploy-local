import { useState } from "react";
import { motion } from "framer-motion";
import { Settings as SettingsIcon } from "lucide-react";
import SettingsSidebar from "@/components/settings/SettingsSidebar";
import GeneralSettings from "@/components/settings/GeneralSettings";
import DockerSettings from "@/components/settings/DockerSettings";
import KubernetesSettings from "@/components/settings/KubernetesSettings";
import RegistrySettings from "@/components/settings/RegistrySettings";
import FlociSettings from "@/components/settings/FlociSettings";
import ThemeSettings from "@/components/settings/ThemeSettings";
import ProfileSettings from "@/components/settings/ProfileSettings";
import NotificationsSettings from "@/components/settings/NotificationsSettings";
import AboutSettings from "@/components/settings/AboutSettings";

const sectionVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

const sectionComponents = {
  general: GeneralSettings,
  docker: DockerSettings,
  kubernetes: KubernetesSettings,
  registry: RegistrySettings,
  floci: FlociSettings,
  theme: ThemeSettings,
  profile: ProfileSettings,
  notifications: NotificationsSettings,
  about: AboutSettings,
};

const Settings = () => {
  const [activeSection, setActiveSection] = useState("general");

  const ActiveComponent = sectionComponents[activeSection] || GeneralSettings;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="rounded-lg bg-slate-600/10 p-2.5">
          <SettingsIcon size={24} className="text-slate-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="mt-0.5 text-sm text-slate-400">
            Manage platform configuration and preferences
          </p>
        </div>
      </div>

      {/* Layout: sidebar + content */}
      <div className="flex flex-col gap-6 md:flex-row">
        <SettingsSidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />

        <div className="min-w-0 flex-1">
          <motion.div
            key={activeSection}
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
          >
            <ActiveComponent />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Settings;
