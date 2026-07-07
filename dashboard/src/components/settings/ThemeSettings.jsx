import { useState, useEffect } from "react";
import { Palette, Type, AlignLeft, Monitor, Eye } from "lucide-react";
import SettingsSection from "./SettingsSection";
import { useSettings } from "@/hooks/useSettings";
import PopoverSelect from "@/components/ui/PopoverSelect";

const inputClass = "w-full rounded-lg border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-slate-500 focus:border-blue-600 focus:ring-1 focus:ring-blue-600/30";
const labelClass = "block text-xs font-medium text-slate-400 mb-1.5";
const toggleTrack = "relative inline-flex h-6 w-11 cursor-pointer items-center rounded-full transition-colors";
const toggleCircle = "inline-block h-4 w-4 rounded-full bg-white shadow transition-transform";

const colorSchemeOptions = [
  { value: "dark", label: "Dark" },
  { value: "light", label: "Light" },
  { value: "system", label: "System" },
];

const sidebarPositionOptions = [
  { value: "left", label: "Left" },
  { value: "right", label: "Right" },
];

const fontSizeOptions = [
  { value: "small", label: "Small" },
  { value: "medium", label: "Medium" },
  { value: "large", label: "Large" },
];

const codeFontOptions = [
  { value: "monospace", label: "Monospace" },
  { value: "jetbrains", label: "JetBrains Mono" },
  { value: "fira", label: "Fira Code" },
  { value: "source", label: "Source Code Pro" },
];

const accentColors = [
  { value: "blue", label: "Blue", color: "bg-blue-500" },
  { value: "indigo", label: "Indigo", color: "bg-indigo-500" },
  { value: "purple", label: "Purple", color: "bg-purple-500" },
  { value: "violet", label: "Violet", color: "bg-violet-500" },
  { value: "pink", label: "Pink", color: "bg-pink-500" },
  { value: "rose", label: "Rose", color: "bg-rose-500" },
  { value: "red", label: "Red", color: "bg-red-500" },
  { value: "orange", label: "Orange", color: "bg-orange-500" },
  { value: "amber", label: "Amber", color: "bg-amber-500" },
  { value: "yellow", label: "Yellow", color: "bg-yellow-500" },
  { value: "lime", label: "Lime", color: "bg-lime-500" },
  { value: "green", label: "Green", color: "bg-green-500" },
  { value: "emerald", label: "Emerald", color: "bg-emerald-500" },
  { value: "teal", label: "Teal", color: "bg-teal-500" },
  { value: "cyan", label: "Cyan", color: "bg-cyan-500" },
  { value: "sky", label: "Sky", color: "bg-sky-500" },
  { value: "slate", label: "Slate", color: "bg-slate-500" },
  { value: "neutral", label: "Neutral", color: "bg-neutral-500" },
];

const ThemeSettings = () => {
  const { settings, updateSettings } = useSettings();
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
      colorScheme: local.colorScheme,
      accentColor: local.accentColor,
      sidebarPosition: local.sidebarPosition,
      fontSize: local.fontSize,
      codeFont: local.codeFont,
      reducedMotion: local.reducedMotion,
      compactMode: local.compactMode,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const hasChanges = local.colorScheme !== settings.colorScheme ||
    local.accentColor !== settings.accentColor ||
    local.sidebarPosition !== settings.sidebarPosition ||
    local.fontSize !== settings.fontSize ||
    local.codeFont !== settings.codeFont ||
    local.reducedMotion !== settings.reducedMotion ||
    local.compactMode !== settings.compactMode;

  return (
    <SettingsSection
      title="Theme Settings"
      subtitle="Customize the appearance of the dashboard"
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
      {/* Color Scheme */}
      <div>
        <PopoverSelect
          label="Color Scheme"
          icon={Monitor}
          value={local.colorScheme}
          onChange={(v) => handleChange("colorScheme", v)}
          options={colorSchemeOptions}
        />
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
                local.accentColor === color.value ? "ring-2 ring-white ring-offset-2 ring-offset-slate-900 scale-110" : "hover:scale-110"
              } ${color.color}`}
              title={color.label}
            >
              {local.accentColor === color.value && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Sidebar Position */}
      <div>
        <PopoverSelect
          label="Sidebar Position"
          icon={AlignLeft}
          value={local.sidebarPosition}
          onChange={(v) => handleChange("sidebarPosition", v)}
          options={sidebarPositionOptions}
        />
      </div>

      {/* Font Size */}
      <div>
        <PopoverSelect
          label="Font Size"
          icon={Type}
          value={local.fontSize}
          onChange={(v) => handleChange("fontSize", v)}
          options={fontSizeOptions}
        />
      </div>

      {/* Code Font */}
      <div>
        <PopoverSelect
          label="Code Font"
          icon={Type}
          value={local.codeFont}
          onChange={(v) => handleChange("codeFont", v)}
          options={codeFontOptions}
        />
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
          onClick={() => handleChange("reducedMotion", !local.reducedMotion)}
          className={`${toggleTrack} ${local.reducedMotion ? "bg-[var(--toggle-active)]" : "bg-slate-700"}`}
        >
          <span className={`${toggleCircle} ${local.reducedMotion ? "translate-x-6" : "translate-x-1"}`} />
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
          onClick={() => handleChange("compactMode", !local.compactMode)}
          className={`${toggleTrack} ${local.compactMode ? "bg-[var(--toggle-active)]" : "bg-slate-700"}`}
        >
          <span className={`${toggleCircle} ${local.compactMode ? "translate-x-6" : "translate-x-1"}`} />
        </button>
      </div>
    </SettingsSection>
  );
};

export default ThemeSettings;
