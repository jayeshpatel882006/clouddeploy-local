import { useState } from "react";
import { Wrench, Clock, FolderOpen, Layout, Terminal, Upload } from "lucide-react";
import SettingsSection from "./SettingsSection";
import { flociDefaults } from "./settingsData";

const inputClass = "w-full rounded-lg border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-slate-500 focus:border-blue-600 focus:ring-1 focus:ring-blue-600/30";
const labelClass = "block text-xs font-medium text-slate-400 mb-1.5";
const selectClass = inputClass + " appearance-none cursor-pointer";
const toggleTrack = "relative inline-flex h-6 w-11 cursor-pointer items-center rounded-full transition-colors";
const toggleCircle = "inline-block h-4 w-4 rounded-full bg-white shadow transition-transform";

const FlociSettings = () => {
  const [data, setData] = useState(flociDefaults);
  const [saved, setSaved] = useState(false);

  const handleChange = (field, value) => setData((prev) => ({ ...prev, [field]: value }));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <SettingsSection
      title="Floci Configuration"
      subtitle="Configure Floci build tool settings"
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
      {/* Floci Path */}
      <div className="space-y-1.5">
        <label className={labelClass}>Floci Binary Path</label>
        <div className="relative">
          <Wrench size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input type="text" value={data.flociPath} onChange={(e) => handleChange("flociPath", e.target.value)} className={inputClass + " pl-9 font-mono text-xs"} />
        </div>
      </div>

      {/* Default Registry & Build Timeout */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className={labelClass}>Default Registry</label>
          <input type="text" value={data.defaultRegistry} onChange={(e) => handleChange("defaultRegistry", e.target.value)} className={inputClass + " font-mono text-xs"} />
        </div>
        <div className="space-y-1.5">
          <label className={labelClass}>Build Timeout (seconds)</label>
          <div className="relative">
            <Clock size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input type="number" min="30" max="3600" value={data.buildTimeout} onChange={(e) => handleChange("buildTimeout", e.target.value)} className={inputClass + " pl-9"} />
          </div>
        </div>
      </div>

      {/* Default Build Args */}
      <div className="space-y-1.5">
        <label className={labelClass}>Default Build Arguments</label>
        <div className="relative">
          <Terminal size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input type="text" value={data.defaultBuildArgs} onChange={(e) => handleChange("defaultBuildArgs", e.target.value)} className={inputClass + " pl-9 font-mono text-xs"} />
        </div>
      </div>

      {/* Parallel Builds & Output Format */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className={labelClass}>Parallel Builds</label>
          <input type="number" min="1" max="16" value={data.parallelBuilds} onChange={(e) => handleChange("parallelBuilds", e.target.value)} className={inputClass} />
        </div>
        <div className="space-y-1.5">
          <label className={labelClass}>Output Format</label>
          <select value={data.outputFormat} onChange={(e) => handleChange("outputFormat", e.target.value)} className={selectClass}>
            <option value="json">JSON</option>
            <option value="text">Text</option>
            <option value="yaml">YAML</option>
          </select>
        </div>
      </div>

      {/* Cache Path */}
      <div className="space-y-1.5">
        <label className={labelClass}>Cache Path</label>
        <div className="relative">
          <FolderOpen size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input type="text" value={data.cachePath} onChange={(e) => handleChange("cachePath", e.target.value)} className={inputClass + " pl-9 font-mono text-xs"} />
        </div>
      </div>

      {/* Toggles */}
      <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/50 px-4 py-3">
        <div className="flex items-center gap-3">
          <Layout size={16} className="text-slate-500" />
          <div>
            <p className="text-sm font-medium text-slate-200">Build Cache</p>
            <p className="text-xs text-slate-500">Enable layer caching for faster builds</p>
          </div>
        </div>
        <button
          onClick={() => handleChange("cacheEnabled", !data.cacheEnabled)}
          className={`${toggleTrack} ${data.cacheEnabled ? "bg-blue-600" : "bg-slate-700"}`}
        >
          <span className={`${toggleCircle} ${data.cacheEnabled ? "translate-x-6" : "translate-x-1"}`} />
        </button>
      </div>

      <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/50 px-4 py-3">
        <div className="flex items-center gap-3">
          <Upload size={16} className="text-slate-500" />
          <div>
            <p className="text-sm font-medium text-slate-200">Auto-Push After Build</p>
            <p className="text-xs text-slate-500">Automatically push images to the registry after build</p>
          </div>
        </div>
        <button
          onClick={() => handleChange("pushAfterBuild", !data.pushAfterBuild)}
          className={`${toggleTrack} ${data.pushAfterBuild ? "bg-blue-600" : "bg-slate-700"}`}
        >
          <span className={`${toggleCircle} ${data.pushAfterBuild ? "translate-x-6" : "translate-x-1"}`} />
        </button>
      </div>
    </SettingsSection>
  );
};

export default FlociSettings;
