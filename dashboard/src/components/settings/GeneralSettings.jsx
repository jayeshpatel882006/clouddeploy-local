import { useState } from "react";
import { Settings, Globe, Clock, RefreshCw, Activity } from "lucide-react";
import SettingsSection from "./SettingsSection";
import { generalDefaults } from "./settingsData";

const timezones = ["UTC", "America/New_York", "America/Chicago", "America/Los_Angeles", "Europe/London", "Europe/Berlin", "Asia/Tokyo", "Asia/Kolkata", "Australia/Sydney"];
const languages = ["en-US", "en-GB", "de-DE", "fr-FR", "ja-JP", "zh-CN", "hi-IN"];

const inputClass = "w-full rounded-lg border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-slate-500 focus:border-blue-600 focus:ring-1 focus:ring-blue-600/30";
const labelClass = "block text-xs font-medium text-slate-400 mb-1.5";
const selectClass = inputClass + " appearance-none cursor-pointer";
const toggleTrack = "relative inline-flex h-6 w-11 cursor-pointer items-center rounded-full transition-colors focus:outline-none";
const toggleCircle = "inline-block h-4 w-4 rounded-full bg-white shadow transition-transform";

const GeneralSettings = () => {
  const [data, setData] = useState(generalDefaults);
  const [saved, setSaved] = useState(false);

  const handleChange = (field, value) => setData((prev) => ({ ...prev, [field]: value }));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <SettingsSection
      title="General Settings"
      subtitle="Configure platform-wide preferences"
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
      {/* Platform Name */}
      <div className="space-y-1.5">
        <label className={labelClass}>Platform Name</label>
        <div className="relative">
          <Settings size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={data.platformName}
            onChange={(e) => handleChange("platformName", e.target.value)}
            className={inputClass + " pl-9"}
          />
        </div>
      </div>

      {/* Timezone & Language */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className={labelClass}>Timezone</label>
          <div className="relative">
            <Globe size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <select
              value={data.timezone}
              onChange={(e) => handleChange("timezone", e.target.value)}
              className={selectClass + " pl-9"}
            >
              {timezones.map((tz) => <option key={tz} value={tz}>{tz}</option>)}
            </select>
          </div>
        </div>
        <div className="space-y-1.5">
          <label className={labelClass}>Language</label>
          <div className="relative">
            <Globe size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <select
              value={data.language}
              onChange={(e) => handleChange("language", e.target.value)}
              className={selectClass + " pl-9"}
            >
              {languages.map((lang) => <option key={lang} value={lang}>{lang}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Auto-refresh Interval */}
      <div className="space-y-1.5">
        <label className={labelClass}>Auto-Refresh Interval (seconds)</label>
        <div className="relative">
          <Clock size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="number"
            min="5"
            max="300"
            value={data.autoRefreshInterval}
            onChange={(e) => handleChange("autoRefreshInterval", e.target.value)}
            className={inputClass + " pl-9"}
          />
        </div>
      </div>

      {/* Telemetry Toggle */}
      <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/50 px-4 py-3">
        <div className="flex items-center gap-3">
          <Activity size={16} className="text-slate-500" />
          <div>
            <p className="text-sm font-medium text-slate-200">Telemetry</p>
            <p className="text-xs text-slate-500">Send anonymous usage data to improve the platform</p>
          </div>
        </div>
        <button
          onClick={() => handleChange("telemetryEnabled", !data.telemetryEnabled)}
          className={`${toggleTrack} ${data.telemetryEnabled ? "bg-blue-600" : "bg-slate-700"}`}
        >
          <span className={`${toggleCircle} ${data.telemetryEnabled ? "translate-x-6" : "translate-x-1"}`} />
        </button>
      </div>
    </SettingsSection>
  );
};

export default GeneralSettings;
