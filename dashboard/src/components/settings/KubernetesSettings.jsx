import { useState, useEffect } from "react";
import { Server, GitBranch, Globe, Clock, Shield, Box } from "lucide-react";
import SettingsSection from "./SettingsSection";
import { useSettings } from "@/hooks/useSettings";
import PopoverSelect from "@/components/ui/PopoverSelect";

const inputClass = "w-full rounded-lg border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-slate-500 focus:border-blue-600 focus:ring-1 focus:ring-blue-600/30";
const labelClass = "block text-xs font-medium text-slate-400 mb-1.5";
const toggleTrack = "relative inline-flex h-6 w-11 cursor-pointer items-center rounded-full transition-colors";
const toggleCircle = "inline-block h-4 w-4 rounded-full bg-white shadow transition-transform";

const namespaceOptions = [
  { value: "default", label: "default" },
  { value: "production", label: "production" },
  { value: "staging", label: "staging" },
  { value: "development", label: "development" },
  { value: "kube-system", label: "kube-system" },
  { value: "monitoring", label: "monitoring" },
];

const KubernetesSettings = () => {
  const { settings, updateSection } = useSettings();
  const [data, setData] = useState({ ...settings.kubernetes });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setData({ ...settings.kubernetes });
  }, [settings.kubernetes]);

  const handleChange = (field, value) => setData((prev) => ({ ...prev, [field]: value }));

  const handleSave = () => {
    updateSection("kubernetes", data);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const hasChanges = JSON.stringify(data) !== JSON.stringify(settings.kubernetes);

  return (
    <SettingsSection
      title="Kubernetes Configuration"
      subtitle="Configure cluster connection and resource defaults"
      headerRight={
        <button
          onClick={handleSave}
          disabled={!hasChanges}
          className={`rounded-lg px-4 py-2 text-sm font-medium text-white transition-all active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed ${
            saved ? "bg-green-600" : "bg-[var(--accent)] hover:bg-[var(--accent-hover)]"
          }`}
        >
          {saved ? "Saved!" : "Save Changes"}
        </button>
      }
    >
      {/* Kubeconfig Path */}
      <div className="space-y-1.5">
        <label className={labelClass}>Kubeconfig Path</label>
        <div className="relative">
          <Server size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input type="text" value={data.kubeconfigPath} onChange={(e) => handleChange("kubeconfigPath", e.target.value)} className={inputClass + " pl-9 font-mono text-xs"} />
        </div>
      </div>

      {/* Context & Cluster */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className={labelClass}>Context Name</label>
          <div className="relative">
            <GitBranch size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input type="text" value={data.contextName} onChange={(e) => handleChange("contextName", e.target.value)} className={inputClass + " pl-9"} />
          </div>
        </div>
        <PopoverSelect
          label="Default Namespace"
          icon={Box}
          value={data.defaultNamespace}
          onChange={(v) => handleChange("defaultNamespace", v)}
          options={namespaceOptions}
        />
      </div>

      {/* Cluster Endpoint & Timeout */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className={labelClass}>Cluster Endpoint</label>
          <div className="relative">
            <Globe size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input type="text" value={data.clusterEndpoint} onChange={(e) => handleChange("clusterEndpoint", e.target.value)} className={inputClass + " pl-9 font-mono text-xs"} />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className={labelClass}>Connection Timeout (seconds)</label>
          <div className="relative">
            <Clock size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input type="number" min="5" max="120" value={data.connectionTimeout} onChange={(e) => handleChange("connectionTimeout", e.target.value)} className={inputClass + " pl-9"} />
          </div>
        </div>
      </div>

      {/* Pod Log Retention & Max Pods */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className={labelClass}>Pod Log Retention (days)</label>
          <input type="number" min="1" max="90" value={data.podLogRetention} onChange={(e) => handleChange("podLogRetention", e.target.value)} className={inputClass} />
        </div>
        <div className="space-y-1.5">
          <label className={labelClass}>Max Pods Per Node</label>
          <input type="number" min="10" max="500" value={data.maxPodsPerNode} onChange={(e) => handleChange("maxPodsPerNode", e.target.value)} className={inputClass} />
        </div>
      </div>

      {/* Audit Toggle */}
      <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/50 px-4 py-3">
        <div className="flex items-center gap-3">
          <Shield size={16} className="text-slate-500" />
          <div>
            <p className="text-sm font-medium text-slate-200">Enable Audit Logging</p>
            <p className="text-xs text-slate-500">Record API requests and cluster events for auditing</p>
          </div>
        </div>
        <button
          onClick={() => handleChange("enableAudit", !data.enableAudit)}
          className={`${toggleTrack} ${data.enableAudit ? "bg-[var(--toggle-active)]" : "bg-slate-700"}`}
        >
          <span className={`${toggleCircle} ${data.enableAudit ? "translate-x-6" : "translate-x-1"}`} />
        </button>
      </div>
    </SettingsSection>
  );
};

export default KubernetesSettings;
