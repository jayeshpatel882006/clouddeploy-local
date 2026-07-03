import { useState } from "react";
import { Globe, Lock, FolderOpen, Shield, Clock, Eye } from "lucide-react";
import SettingsSection from "./SettingsSection";
import { registryDefaults } from "./settingsData";

const inputClass = "w-full rounded-lg border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-slate-500 focus:border-blue-600 focus:ring-1 focus:ring-blue-600/30";
const labelClass = "block text-xs font-medium text-slate-400 mb-1.5";
const toggleTrack = "relative inline-flex h-6 w-11 cursor-pointer items-center rounded-full transition-colors";
const toggleCircle = "inline-block h-4 w-4 rounded-full bg-white shadow transition-transform";

const RegistrySettings = () => {
  const [data, setData] = useState(registryDefaults);
  const [saved, setSaved] = useState(false);

  const handleChange = (field, value) => setData((prev) => ({ ...prev, [field]: value }));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <SettingsSection
      title="Registry Configuration"
      subtitle="Configure the internal Docker registry settings"
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
      {/* Registry URL */}
      <div className="space-y-1.5">
        <label className={labelClass}>Registry URL</label>
        <div className="relative">
          <Globe size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input type="text" value={data.registryUrl} onChange={(e) => handleChange("registryUrl", e.target.value)} className={inputClass + " pl-9 font-mono text-xs"} />
        </div>
      </div>

      {data.authEnabled && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className={labelClass}>Username</label>
            <input type="text" value={data.username} onChange={(e) => handleChange("username", e.target.value)} className={inputClass} />
          </div>
          <div className="space-y-1.5">
            <label className={labelClass}>Password</label>
            <input type="password" value={data.password} onChange={(e) => handleChange("password", e.target.value)} className={inputClass} />
          </div>
        </div>
      )}

      {/* Auth Toggle */}
      <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/50 px-4 py-3">
        <div className="flex items-center gap-3">
          <Lock size={16} className="text-slate-500" />
          <div>
            <p className="text-sm font-medium text-slate-200">Authentication Enabled</p>
            <p className="text-xs text-slate-500">Require authentication for push/pull operations</p>
          </div>
        </div>
        <button
          onClick={() => handleChange("authEnabled", !data.authEnabled)}
          className={`${toggleTrack} ${data.authEnabled ? "bg-blue-600" : "bg-slate-700"}`}
        >
          <span className={`${toggleCircle} ${data.authEnabled ? "translate-x-6" : "translate-x-1"}`} />
        </button>
      </div>

      {/* Storage Path */}
      <div className="space-y-1.5">
        <label className={labelClass}>Storage Path</label>
        <div className="relative">
          <FolderOpen size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input type="text" value={data.storagePath} onChange={(e) => handleChange("storagePath", e.target.value)} className={inputClass + " pl-9 font-mono text-xs"} />
        </div>
      </div>

      {/* TLS Toggle & Paths */}
      <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/50 px-4 py-3">
        <div className="flex items-center gap-3">
          <Shield size={16} className="text-slate-500" />
          <div>
            <p className="text-sm font-medium text-slate-200">TLS Enabled</p>
            <p className="text-xs text-slate-500">Serve registry over HTTPS</p>
          </div>
        </div>
        <button
          onClick={() => handleChange("tlsEnabled", !data.tlsEnabled)}
          className={`${toggleTrack} ${data.tlsEnabled ? "bg-blue-600" : "bg-slate-700"}`}
        >
          <span className={`${toggleCircle} ${data.tlsEnabled ? "translate-x-6" : "translate-x-1"}`} />
        </button>
      </div>

      {data.tlsEnabled && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className={labelClass}>TLS Certificate Path</label>
            <input type="text" value={data.tlsCertPath} onChange={(e) => handleChange("tlsCertPath", e.target.value)} className={inputClass + " font-mono text-xs"} />
          </div>
          <div className="space-y-1.5">
            <label className={labelClass}>TLS Key Path</label>
            <input type="text" value={data.tlsKeyPath} onChange={(e) => handleChange("tlsKeyPath", e.target.value)} className={inputClass + " font-mono text-xs"} />
          </div>
        </div>
      )}

      {/* GC Interval & Max Age */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className={labelClass}>Garbage Collection Interval</label>
          <div className="relative">
            <Clock size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input type="text" value={data.garbageCollectionInterval} onChange={(e) => handleChange("garbageCollectionInterval", e.target.value)} className={inputClass + " pl-9"} />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className={labelClass}>Max Image Age (days)</label>
          <input type="number" min="1" max="365" value={data.maxImageAge} onChange={(e) => handleChange("maxImageAge", e.target.value)} className={inputClass} />
        </div>
      </div>

      {/* Read-Only Toggle */}
      <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/50 px-4 py-3">
        <div className="flex items-center gap-3">
          <Eye size={16} className="text-slate-500" />
          <div>
            <p className="text-sm font-medium text-slate-200">Read-Only Mode</p>
            <p className="text-xs text-slate-500">Prevent new pushes to the registry</p>
          </div>
        </div>
        <button
          onClick={() => handleChange("readOnly", !data.readOnly)}
          className={`${toggleTrack} ${data.readOnly ? "bg-blue-600" : "bg-slate-700"}`}
        >
          <span className={`${toggleCircle} ${data.readOnly ? "translate-x-6" : "translate-x-1"}`} />
        </button>
      </div>
    </SettingsSection>
  );
};

export default RegistrySettings;
