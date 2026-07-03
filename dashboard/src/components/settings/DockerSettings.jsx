import { useState } from "react";
import { Container, FolderOpen, HardDrive, Server, AlertTriangle } from "lucide-react";
import SettingsSection from "./SettingsSection";
import { dockerDefaults } from "./settingsData";

const inputClass = "w-full rounded-lg border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-slate-500 focus:border-blue-600 focus:ring-1 focus:ring-blue-600/30";
const labelClass = "block text-xs font-medium text-slate-400 mb-1.5";
const selectClass = inputClass + " appearance-none cursor-pointer";
const toggleTrack = "relative inline-flex h-6 w-11 cursor-pointer items-center rounded-full transition-colors";
const toggleCircle = "inline-block h-4 w-4 rounded-full bg-white shadow transition-transform";

const DockerSettings = () => {
  const [data, setData] = useState(dockerDefaults);
  const [saved, setSaved] = useState(false);

  const handleChange = (field, value) => setData((prev) => ({ ...prev, [field]: value }));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <SettingsSection
      title="Docker Configuration"
      subtitle="Configure Docker daemon connection and settings"
      headerRight={
        <button
          onClick={handleSave}
          className={`rounded-lg px-4 py-2 text-sm font-medium text-white transition-all active:scale-[0.97] ${
            saved ? "bg-green-600" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {saved ? "Saved!" : "Save Changes"}
        </button>
      }
    >
      {/* Socket Path */}
      <div className="space-y-1.5">
        <label className={labelClass}>Docker Socket Path</label>
        <div className="relative">
          <Container size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input type="text" value={data.socketPath} onChange={(e) => handleChange("socketPath", e.target.value)} className={inputClass + " pl-9 font-mono text-xs"} />
        </div>
      </div>

      {/* Data Root & Storage Driver */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className={labelClass}>Data Root</label>
          <div className="relative">
            <FolderOpen size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input type="text" value={data.dataRoot} onChange={(e) => handleChange("dataRoot", e.target.value)} className={inputClass + " pl-9 font-mono text-xs"} />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className={labelClass}>Storage Driver</label>
          <div className="relative">
            <HardDrive size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <select value={data.storageDriver} onChange={(e) => handleChange("storageDriver", e.target.value)} className={selectClass + " pl-9"}>
              <option value="overlay2">overlay2</option>
              <option value="overlay">overlay</option>
              <option value="aufs">aufs</option>
              <option value="devicemapper">devicemapper</option>
              <option value="btrfs">btrfs</option>
              <option value="zfs">zfs</option>
              <option value="vfs">vfs</option>
            </select>
          </div>
        </div>
      </div>

      {/* Registry Mirrors */}
      <div className="space-y-1.5">
        <label className={labelClass}>Registry Mirrors (comma-separated)</label>
        <div className="relative">
          <Server size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input type="text" value={data.registryMirrors} onChange={(e) => handleChange("registryMirrors", e.target.value)} className={inputClass + " pl-9"} />
        </div>
      </div>

      {/* Insecure Registries */}
      <div className="space-y-1.5">
        <label className={labelClass}>Insecure Registries</label>
        <div className="relative">
          <AlertTriangle size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input type="text" value={data.insecureRegistries} onChange={(e) => handleChange("insecureRegistries", e.target.value)} className={inputClass + " pl-9"} />
        </div>
        <p className="text-xs text-slate-500">One per line or comma-separated. Use only for local/internal registries.</p>
      </div>

      {/* Log Driver & Max Log Size */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className={labelClass}>Log Driver</label>
          <select value={data.logDriver} onChange={(e) => handleChange("logDriver", e.target.value)} className={selectClass}>
            <option value="json-file">json-file</option>
            <option value="journald">journald</option>
            <option value="syslog">syslog</option>
            <option value="gelf">gelf</option>
            <option value="fluentd">fluentd</option>
            <option value="awslogs">awslogs</option>
            <option value="none">none</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <label className={labelClass}>Max Log Size</label>
          <input type="text" value={data.maxLogSize} onChange={(e) => handleChange("maxLogSize", e.target.value)} className={inputClass} />
        </div>
      </div>

      {/* Experimental Features Toggle */}
      <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/50 px-4 py-3">
        <div className="flex items-center gap-3">
          <Container size={16} className="text-slate-500" />
          <div>
            <p className="text-sm font-medium text-slate-200">Experimental Features</p>
            <p className="text-xs text-slate-500">Enable experimental Docker features (may be unstable)</p>
          </div>
        </div>
        <button
          onClick={() => handleChange("experimentalFeatures", !data.experimentalFeatures)}
          className={`${toggleTrack} ${data.experimentalFeatures ? "bg-blue-600" : "bg-slate-700"}`}
        >
          <span className={`${toggleCircle} ${data.experimentalFeatures ? "translate-x-6" : "translate-x-1"}`} />
        </button>
      </div>
    </SettingsSection>
  );
};

export default DockerSettings;
