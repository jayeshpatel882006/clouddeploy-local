import { ExternalLink, BookOpen, Code2, Heart } from "lucide-react";
import SettingsSection from "./SettingsSection";
import { aboutInfo } from "./settingsData";

const AboutSettings = () => {
  return (
    <SettingsSection
      title="About"
      subtitle="Platform information and system details"
    >
      {/* Version info */}
      <div className="rounded-lg border border-slate-800 bg-linear-to-br from-blue-600/5 to-purple-600/5 p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/15">
            <span className="text-xl font-bold text-blue-400">CD</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">
              CloudDeploy Local
            </h3>
            <p className="text-sm text-slate-400">
              Version {aboutInfo.version}
            </p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-slate-500">Build</span>
            <p className="text-slate-300">{aboutInfo.buildNumber}</p>
          </div>
          <div>
            <span className="text-slate-500">Last Updated</span>
            <p className="text-slate-300">{aboutInfo.lastUpdated}</p>
          </div>
          <div>
            <span className="text-slate-500">License</span>
            <p className="text-slate-300">{aboutInfo.license}</p>
          </div>
        </div>
      </div>

      {/* System Details */}
      <div className="space-y-1">
        <h4 className="text-sm font-semibold text-white">System Details</h4>
        <div className="divide-y divide-slate-800 rounded-lg border border-slate-800">
          {[
            { label: "Node.js Version", value: aboutInfo.nodeVersion },
            { label: "npm Version", value: aboutInfo.npmVersion },
            { label: "Operating System", value: aboutInfo.os },
            { label: "Kernel", value: aboutInfo.kernel },
            { label: "Docker Engine", value: aboutInfo.dockerVersion },
            { label: "Kubernetes", value: aboutInfo.kubernetesVersion },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between px-4 py-2.5"
            >
              <span className="text-sm text-slate-400">{item.label}</span>
              <span className="text-sm font-mono text-slate-200">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Links */}
      <div className="space-y-1">
        <h4 className="text-sm font-semibold text-white">Links</h4>
        <div className="flex flex-wrap gap-2">
          {[
            { icon: BookOpen, label: "Documentation", href: "#" },
            { icon: Code2, label: "GitHub", href: "#" },
            { icon: Heart, label: "Support", href: "#" },
          ].map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.label}
                href={link.href}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-400 transition-colors hover:border-slate-600 hover:text-white"
              >
                <Icon size={16} />
                {link.label}
                <ExternalLink size={12} />
              </a>
            );
          })}
        </div>
      </div>
    </SettingsSection>
  );
};

export default AboutSettings;
