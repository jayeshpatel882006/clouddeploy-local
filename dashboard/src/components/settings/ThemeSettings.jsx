import { useState } from "react";
import { Palette, Type, AlignLeft, Monitor, Eye } from "lucide-react";
import SettingsSection from "./SettingsSection";
import { themeDefaults } from "./settingsData";

const inputClass = "w-full rounded-lg border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-slate-500 focus:border-blue-600 focus:ring-1 focus:ring-blue-600/30";
const labelClass = "block text-xs font-medium text-slate-400 mb-1.5";
const selectClass = inputClass + " appearance-none cursor-pointer";
const toggleTrack = "relative inline-flex h-6 w-11 cursor-pointer items-center rounded-full transition-colors";
const toggleCircle = "inline-block h-4 w-4 rounded-full bg-white shadow transition-transform";

const accentColors = [
  { value: "blue", label: "Blue", class: "bg-blue-500" },
  { value: "green", label: "Green", class: "bg-green-500" },
  { value: "purple", label: "Purple", class: "bg-purple-500" },
  { value: "emerald", label: "Emerald", class: "bg-emerald-500" },
  { value: "orange", label: "Orange", class: "bg-orange-500" },
  { value: "cyan", label: "Cyan", class: "bg-cyan-500" },
  { value: "pink", label: "Pink", class: "bg-pink-500" },
  { value: "indigo", label: "Indigo", class: "bg-indigo-500" },
];

const ThemeSettings = () => {
  const [data, setData] = useState(themeDefaults);
  const [saved, setSaved] = useState(false);

  const handleChange = (field, value) => setData((prev) => ({ ...prev, [field]: value }));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <SettingsSection
      title="Theme Settings"
      subtitle="Customize the appearance of the dashboard"
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
      {/* Color Scheme */}
      <div className="space-y-1.5">
        <label className={labelClass}>Color Scheme</label>
        <div className="relative">
          <Monitor size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 z-10" />
          <select value={data.colorScheme} onChange={(e) => handleChange("colorScheme", e.target.value)} className={selectClass + " pl-9"}>
            <option value="dark">Dark</option>
            <option value="light">Light</option>
            <option value="system">System</option>
          </select>
        </div>
      </div>

      {/* Accent Color */}
      <div className="space-y-1.5">
        <label className={labelClass}>Accent Color</label>
        <div className="flex flex-wrap gap-2.5">
          {accentColors.map((color) => (
            <button
              key={color.value}
              onClick={() => handleChange("accentColor", color.value)}
              className={`flex h-9 w-9 items-center justify-center rounded-full transition-all ${
                data.accentColor === color.value ? "ring-2 ring-white ring-offset-2 ring-offset-slate-900 scale-110" : "hover:scale-110"
              } ${color.class}`}
              title={color.label}
            >
              {data.accentColor === color.value && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Sidebar Position */}
      <div className="space-y-1.5">
        <label className={labelClass}>Sidebar Position</label>
        <div className="relative">
          <AlignLeft size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 z-10" />
          <select value={data.sidebarPosition} onChange={(e) => handleChange("sidebarPosition", e.target.value)} className={selectClass + " pl-9"}>
            <option value="left">Left</option>
            <option value="right">Right</option>
          </select>
        </div>
      </div>

      {/* Font Size */}
      <div className="space-y-1.5">
        <label className={labelClass}>Font Size</label>
        <div className="relative">
          <Type size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 z-10" />
          <select value={data.fontSize} onChange={(e) => handleChange("fontSize", e.target.value)} className={selectClass + " pl-9"}>
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </div>
      </div>

      {/* Code Font */}
      <div className="space-y-1.5">
        <label className={labelClass}>Code Font</label>
        <div className="relative">
          <Type size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 z-10" />
          <select value={data.codeFont} onChange={(e) => handleChange("codeFont", e.target.value)} className={selectClass + " pl-9"}>
            <option value="monospace">Monospace</option>
            <option value="jetbrains">JetBrains Mono</option>
            <option value="fira">Fira Code</option>
            <option value="source">Source Code Pro</option>
          </select>
        </div>
      </div>

      {/* Toggles */}
      <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/50 px-4 py-3">
        <div className="flex items-center gap-3">
          <Eye size={16} className="text-slate-500" />
          <div>
            <p className="text-sm font-medium text-slate-200">Reduced Motion</p>
            <p className="text-xs text-slate-500">Minimize animations and transitions</p>
          </div>
        </div>
        <button
          onClick={() => handleChange("reducedMotion", !data.reducedMotion)}
          className={`${toggleTrack} ${data.reducedMotion ? "bg-blue-600" : "bg-slate-700"}`}
        >
          <span className={`${toggleCircle} ${data.reducedMotion ? "translate-x-6" : "translate-x-1"}`} />
        </button>
      </div>

      <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/50 px-4 py-3">
        <div className="flex items-center gap-3">
          <Palette size={16} className="text-slate-500" />
          <div>
            <p className="text-sm font-medium text-slate-200">Compact Mode</p>
            <p className="text-xs text-slate-500">Reduce padding and spacing for more content density</p>
          </div>
        </div>
        <button
          onClick={() => handleChange("compactMode", !data.compactMode)}
          className={`${toggleTrack} ${data.compactMode ? "bg-blue-600" : "bg-slate-700"}`}
        >
          <span className={`${toggleCircle} ${data.compactMode ? "translate-x-6" : "translate-x-1"}`} />
        </button>
      </div>
    </SettingsSection>
  );
};

export default ThemeSettings;
