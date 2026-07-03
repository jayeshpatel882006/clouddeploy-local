import { useState } from "react";
import { Bell, Mail, Globe, MessageCircle, Clock, Shield, AlertTriangle, Info, CheckCircle } from "lucide-react";
import SettingsSection from "./SettingsSection";
import { notificationDefaults } from "./settingsData";

const inputClass = "w-full rounded-lg border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-slate-500 focus:border-blue-600 focus:ring-1 focus:ring-blue-600/30";
const labelClass = "block text-xs font-medium text-slate-400 mb-1.5";
const selectClass = inputClass + " appearance-none cursor-pointer";
const toggleTrack = "relative inline-flex h-6 w-11 cursor-pointer items-center rounded-full transition-colors";
const toggleCircle = "inline-block h-4 w-4 rounded-full bg-white shadow transition-transform";

const levelConfig = {
  critical: { icon: Shield, color: "text-red-400", bg: "bg-red-500/10" },
  warning: { icon: AlertTriangle, color: "text-yellow-400", bg: "bg-yellow-500/10" },
  info: { icon: Info, color: "text-blue-400", bg: "bg-blue-500/10" },
  success: { icon: CheckCircle, color: "text-green-400", bg: "bg-green-500/10" },
};

const NotificationsSettings = () => {
  const [data, setData] = useState(notificationDefaults);
  const [saved, setSaved] = useState(false);

  const handleChange = (field, value) => setData((prev) => ({ ...prev, [field]: value }));

  const handleLevelChange = (level) => {
    setData((prev) => ({
      ...prev,
      notificationLevels: { ...prev.notificationLevels, [level]: !prev.notificationLevels[level] },
    }));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <SettingsSection
      title="Notification Settings"
      subtitle="Configure how and when you receive notifications"
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
      {/* Email Notifications */}
      <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/50 px-4 py-3">
        <div className="flex items-center gap-3">
          <Mail size={16} className="text-slate-500" />
          <div>
            <p className="text-sm font-medium text-slate-200">Email Notifications</p>
            <p className="text-xs text-slate-500">Receive notifications via email</p>
          </div>
        </div>
        <button
          onClick={() => handleChange("emailNotifications", !data.emailNotifications)}
          className={`${toggleTrack} ${data.emailNotifications ? "bg-blue-600" : "bg-slate-700"}`}
        >
          <span className={`${toggleCircle} ${data.emailNotifications ? "translate-x-6" : "translate-x-1"}`} />
        </button>
      </div>

      {data.emailNotifications && (
        <div className="space-y-1.5">
          <label className={labelClass}>Email Address</label>
          <div className="relative">
            <Mail size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input type="email" value={data.emailAddress} onChange={(e) => handleChange("emailAddress", e.target.value)} className={inputClass + " pl-9"} />
          </div>
        </div>
      )}

      {/* Webhook URL */}
      <div className="space-y-1.5">
        <label className={labelClass}>Webhook URL</label>
        <div className="relative">
          <Globe size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input type="text" value={data.webhookUrl} onChange={(e) => handleChange("webhookUrl", e.target.value)} placeholder="https://hooks.example.com/notify" className={inputClass + " pl-9"} />
        </div>
      </div>

      {/* Slack Webhook */}
      <div className="space-y-1.5">
        <label className={labelClass}>Slack Webhook URL</label>
        <div className="relative">
          <MessageCircle size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input type="text" value={data.slackWebhook} onChange={(e) => handleChange("slackWebhook", e.target.value)} placeholder="https://hooks.slack.com/services/..." className={inputClass + " pl-9"} />
        </div>
      </div>

      {/* Notification Levels */}
      <div className="space-y-2">
        <label className={labelClass}>Notification Levels</label>
        {Object.entries(levelConfig).map(([level, config]) => {
          const Icon = config.icon;
          const isActive = data.notificationLevels[level];
          return (
            <div
              key={level}
              className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/30 px-4 py-3 transition-colors hover:border-slate-700"
            >
              <div className="flex items-center gap-3">
                <div className={`rounded-md ${config.bg} p-1.5 ${config.color}`}>
                  <Icon size={14} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-200 capitalize">{level}</p>
                  <p className="text-xs text-slate-500">
                    {level === "critical" && "Cluster outages and critical failures"}
                    {level === "warning" && "Degraded performance and resource warnings"}
                    {level === "info" && "Deployment updates and general information"}
                    {level === "success" && "Successful deployments and operations"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleLevelChange(level)}
                className={`${toggleTrack} ${isActive ? "bg-blue-600" : "bg-slate-700"}`}
              >
                <span className={`${toggleCircle} ${isActive ? "translate-x-6" : "translate-x-1"}`} />
              </button>
            </div>
          );
        })}
      </div>

      {/* Digest Frequency */}
      <div className="space-y-1.5">
        <label className={labelClass}>Digest Frequency</label>
        <div className="relative">
          <Clock size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 z-10" />
          <select value={data.digestFrequency} onChange={(e) => handleChange("digestFrequency", e.target.value)} className={selectClass + " pl-9"}>
            <option value="realtime">Real-time</option>
            <option value="hourly">Hourly</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
          </select>
        </div>
      </div>

      {/* Alert Categories */}
      <div className="space-y-2">
        <label className={labelClass}>Alert Categories</label>
        {[
          { key: "deploymentAlerts", label: "Deployment Alerts", desc: "Changes in deployment status" },
          { key: "systemAlerts", label: "System Alerts", desc: "System health and performance issues" },
          { key: "securityAlerts", label: "Security Alerts", desc: "Security vulnerabilities and threats" },
        ].map((category) => (
          <div key={category.key} className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/30 px-4 py-3 transition-colors hover:border-slate-700">
            <div className="flex items-center gap-3">
              <Bell size={14} className="text-slate-500" />
              <div>
                <p className="text-sm font-medium text-slate-200">{category.label}</p>
                <p className="text-xs text-slate-500">{category.desc}</p>
              </div>
            </div>
            <button
              onClick={() => handleChange(category.key, !data[category.key])}
              className={`${toggleTrack} ${data[category.key] ? "bg-blue-600" : "bg-slate-700"}`}
            >
              <span className={`${toggleCircle} ${data[category.key] ? "translate-x-6" : "translate-x-1"}`} />
            </button>
          </div>
        ))}
      </div>
    </SettingsSection>
  );
};

export default NotificationsSettings;
