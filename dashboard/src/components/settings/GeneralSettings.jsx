import { useState, useEffect } from "react";
import { Settings, Globe, Clock, RefreshCw, Activity, RotateCcw } from "lucide-react";
import SettingsSection from "./SettingsSection";
import { useSettings } from "@/hooks/useSettings";
import PopoverSelect from "@/components/ui/PopoverSelect";

const timezoneOptions = [
  { value: "UTC", label: "UTC" },
  { value: "America/New_York", label: "America/New_York" },
  { value: "America/Chicago", label: "America/Chicago" },
  { value: "America/Los_Angeles", label: "America/Los_Angeles" },
  { value: "Europe/London", label: "Europe/London" },
  { value: "Europe/Berlin", label: "Europe/Berlin" },
  { value: "Asia/Tokyo", label: "Asia/Tokyo" },
  { value: "Asia/Kolkata", label: "Asia/Kolkata" },
  { value: "Australia/Sydney", label: "Australia/Sydney" },
];

const languageOptions = [
  { value: "en-US", label: "English (US)" },
  { value: "en-GB", label: "English (UK)" },
  { value: "de-DE", label: "German" },
  { value: "fr-FR", label: "French" },
  { value: "ja-JP", label: "Japanese" },
  { value: "zh-CN", label: "Chinese" },
  { value: "hi-IN", label: "Hindi" },
];

const inputClass = "w-full rounded-lg border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-slate-500 focus:border-blue-600 focus:ring-1 focus:ring-blue-600/30";
const labelClass = "block text-xs font-medium text-slate-400 mb-1.5";
const toggleTrack = "relative inline-flex h-6 w-11 cursor-pointer items-center rounded-full transition-colors focus:outline-none";
const toggleCircle = "inline-block h-4 w-4 rounded-full bg-white shadow transition-transform";

const GeneralSettings = () => {
  const { settings, updateSettings, reset } = useSettings();
  const [local, setLocal] = useState({ ...settings });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setLocal({ ...settings });
  }, [settings]);

  const handleChange = (field, value) => {
    setLocal((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    updateSettings({
      platformName: local.platformName,
      timezone: local.timezone,
      language: local.language,
      autoRefreshInterval: local.autoRefreshInterval,
      telemetryEnabled: local.telemetryEnabled,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    reset();
    setSaved(false);
  };

  const hasChanges = local.platformName !== settings.platformName ||
    local.timezone !== settings.timezone ||
    local.language !== settings.language ||
    local.autoRefreshInterval !== settings.autoRefreshInterval ||
    local.telemetryEnabled !== settings.telemetryEnabled;

  return (
    <SettingsSection
      title="General Settings"
      subtitle="Configure platform-wide preferences"
      headerRight={
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-400 transition-all hover:border-slate-600 hover:text-white"
            title="Reset to defaults"
          >
            <RotateCcw size={14} />
            <span className="hidden sm:inline">Reset to Defaults</span>
          </button>
          <button
            onClick={handleSave}
            disabled={!hasChanges}
            className={`rounded-lg px-4 py-2 text-sm font-medium text-white transition-all active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed ${
              saved ? "bg-green-600" : "bg-[var(--accent)] hover:bg-[var(--accent-hover)]"
            }`}
          >
            {saved ? "Saved!" : "Save Changes"}
          </button>
        </div>
      }
    >
      {/* Platform Name */}
      <div className="space-y-1.5">
        <label className={labelClass}>Platform Name</label>
        <div className="relative">
          <Settings size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={local.platformName}
            onChange={(e) => handleChange("platformName", e.target.value)}
            className={inputClass + " pl-9"}
          />
        </div>
      </div>

      {/* Timezone & Language */}
      <div className="grid gap-4 sm:grid-cols-2">
        <PopoverSelect
          label="Timezone"
          icon={Globe}
          value={local.timezone}
          onChange={(v) => handleChange("timezone", v)}
          options={timezoneOptions}
          searchable={true}
        />
        <PopoverSelect
          label="Language"
          icon={Globe}
          value={local.language}
          onChange={(v) => handleChange("language", v)}
          options={languageOptions}
        />
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
            value={local.autoRefreshInterval}
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
          onClick={() => handleChange("telemetryEnabled", !local.telemetryEnabled)}
          className={`${toggleTrack} ${local.telemetryEnabled ? "bg-[var(--toggle-active)]" : "bg-slate-700"}`}
        >
          <span className={`${toggleCircle} ${local.telemetryEnabled ? "translate-x-6" : "translate-x-1"}`} />
        </button>
      </div>
    </SettingsSection>
  );
};

export default GeneralSettings;
