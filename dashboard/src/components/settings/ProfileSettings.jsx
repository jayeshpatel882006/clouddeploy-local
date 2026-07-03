import { useState } from "react";
import { User, Mail, MessageSquare, Key, Plus, Trash2, Copy, Check } from "lucide-react";
import SettingsSection from "./SettingsSection";
import { profileDefaults } from "./settingsData";

const inputClass = "w-full rounded-lg border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-slate-500 focus:border-blue-600 focus:ring-1 focus:ring-blue-600/30";
const labelClass = "block text-xs font-medium text-slate-400 mb-1.5";

const ProfileSettings = () => {
  const [data, setData] = useState(profileDefaults);
  const [saved, setSaved] = useState(false);
  const [copiedToken, setCopiedToken] = useState(null);

  const handleChange = (field, value) => setData((prev) => ({ ...prev, [field]: value }));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const copyToken = (token) => {
    navigator.clipboard?.writeText(token);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  return (
    <SettingsSection
      title="Profile Settings"
      subtitle="Manage your personal profile and credentials"
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
      {/* Avatar */}
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600/20 text-2xl font-bold text-blue-400">
          {data.name.split(" ").map((n) => n[0]).join("")}
        </div>
        <div>
          <p className="text-sm font-medium text-slate-200">{data.name}</p>
          <p className="text-xs text-slate-500">{data.email}</p>
          <button className="mt-1 text-xs text-blue-400 hover:text-blue-300 transition-colors">Change avatar</button>
        </div>
      </div>

      {/* Name & Email */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className={labelClass}>Full Name</label>
          <div className="relative">
            <User size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input type="text" value={data.name} onChange={(e) => handleChange("name", e.target.value)} className={inputClass + " pl-9"} />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className={labelClass}>Email Address</label>
          <div className="relative">
            <Mail size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input type="email" value={data.email} onChange={(e) => handleChange("email", e.target.value)} className={inputClass + " pl-9"} />
          </div>
        </div>
      </div>

      {/* Bio */}
      <div className="space-y-1.5">
        <label className={labelClass}>Bio</label>
        <div className="relative">
          <MessageSquare size={16} className="pointer-events-none absolute left-3 top-3 text-slate-500" />
          <textarea
            value={data.bio}
            onChange={(e) => handleChange("bio", e.target.value)}
            rows={3}
            className={inputClass + " pl-9 resize-none"}
          />
        </div>
      </div>

      {/* SSH Keys */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <label className={labelClass}>SSH Keys</label>
          <button className="flex items-center gap-1 rounded-lg border border-slate-700 px-2.5 py-1 text-xs text-slate-400 transition-colors hover:border-slate-600 hover:text-white">
            <Plus size={12} />
            Add Key
          </button>
        </div>
        <div className="space-y-2">
          {data.sshKeys.map((key) => (
            <div key={key.id} className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/30 px-4 py-3 transition-colors hover:border-slate-700">
              <div className="flex items-center gap-3 min-w-0">
                <Key size={14} className="shrink-0 text-slate-500" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-200">{key.name}</p>
                  <p className="truncate text-xs text-slate-500 font-mono">{key.key.substring(0, 50)}...</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-slate-500">Added {key.added}</span>
                <button className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-red-900/30 hover:text-red-400">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* API Tokens */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <label className={labelClass}>API Tokens</label>
          <button className="flex items-center gap-1 rounded-lg border border-slate-700 px-2.5 py-1 text-xs text-slate-400 transition-colors hover:border-slate-600 hover:text-white">
            <Plus size={12} />
            Generate Token
          </button>
        </div>
        <div className="space-y-2">
          {data.apiTokens.map((token) => (
            <div key={token.id} className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/30 px-4 py-3 transition-colors hover:border-slate-700">
              <div className="flex items-center gap-3 min-w-0">
                <Key size={14} className="shrink-0 text-amber-500" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-200">{token.name}</p>
                  <p className="text-xs text-slate-500">
                    Created {token.created} · Last used {token.lastUsed}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => copyToken(token.token)}
                  className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-800 hover:text-slate-200"
                  title="Copy token"
                >
                  {copiedToken === token.token ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                </button>
                <button className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-red-900/30 hover:text-red-400">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SettingsSection>
  );
};

export default ProfileSettings;
