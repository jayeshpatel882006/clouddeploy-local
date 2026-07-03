import { useState } from "react";
import { Plus, X } from "lucide-react";
import Modal from "@/components/common/Modal";

const namespaces = ["default", "production", "staging", "development"];

const CreateDeploymentModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    appName: "",
    image: "",
    namespace: "default",
    replicas: 1,
    port: 3000,
    cpu: "100m",
    memory: "128Mi",
    healthPath: "/health",
  });

  const [envVars, setEnvVars] = useState([{ key: "", value: "" }]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.name === "replicas" || e.target.name === "port"
        ? Number(e.target.value)
        : e.target.value,
    });
  };

  const handleEnvChange = (index, field, value) => {
    const updated = [...envVars];
    updated[index] = { ...updated[index], [field]: value };
    setEnvVars(updated);
  };

  const addEnvVar = () => {
    setEnvVars([...envVars, { key: "", value: "" }]);
  };

  const removeEnvVar = (index) => {
    if (envVars.length <= 1) return;
    setEnvVars(envVars.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    const payload = {
      ...formData,
      envVars: envVars.filter((e) => e.key && e.value),
    };
    console.log("Create deployment:", payload);
    // Reset
    setFormData({
      appName: "",
      image: "",
      namespace: "default",
      replicas: 1,
      port: 3000,
      cpu: "100m",
      memory: "128Mi",
      healthPath: "/health",
    });
    setEnvVars([{ key: "", value: "" }]);
    onClose();
  };

  const handleClose = () => {
    setFormData({
      appName: "",
      image: "",
      namespace: "default",
      replicas: 1,
      port: 3000,
      cpu: "100m",
      memory: "128Mi",
      healthPath: "/health",
    });
    setEnvVars([{ key: "", value: "" }]);
    onClose();
  };

  const inputClass =
    "w-full rounded-lg border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-slate-500 focus:border-blue-600 focus:ring-1 focus:ring-blue-600/30";

  const labelClass = "block text-xs font-medium text-slate-400 mb-1.5";

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create Deployment" width="max-w-2xl">
      <div className="space-y-5">
        {/* App Name & Image */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label htmlFor="appName" className={labelClass}>
              Application Name
            </label>
            <input
              id="appName"
              name="appName"
              type="text"
              placeholder="inventory-api"
              value={formData.appName}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="image" className={labelClass}>
              Docker Image
            </label>
            <input
              id="image"
              name="image"
              type="text"
              placeholder="registry.local/inventory:v2"
              value={formData.image}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
        </div>

        {/* Namespace & Replicas & Port */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-1.5">
            <label htmlFor="namespace" className={labelClass}>
              Namespace
            </label>
            <select
              id="namespace"
              name="namespace"
              value={formData.namespace}
              onChange={handleChange}
              className={inputClass}
            >
              {namespaces.map((ns) => (
                <option key={ns} value={ns}>
                  {ns}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label htmlFor="replicas" className={labelClass}>
              Replicas
            </label>
            <input
              id="replicas"
              name="replicas"
              type="number"
              min="1"
              max="20"
              value={formData.replicas}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="port" className={labelClass}>
              Container Port
            </label>
            <input
              id="port"
              name="port"
              type="number"
              min="1"
              max="65535"
              value={formData.port}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
        </div>

        {/* CPU & Memory & Health */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-1.5">
            <label htmlFor="cpu" className={labelClass}>
              CPU Limit
            </label>
            <input
              id="cpu"
              name="cpu"
              type="text"
              placeholder="100m"
              value={formData.cpu}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="memory" className={labelClass}>
              Memory Limit
            </label>
            <input
              id="memory"
              name="memory"
              type="text"
              placeholder="128Mi"
              value={formData.memory}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="healthPath" className={labelClass}>
              Health Check Path
            </label>
            <input
              id="healthPath"
              name="healthPath"
              type="text"
              placeholder="/health"
              value={formData.healthPath}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
        </div>

        {/* Environment Variables */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className={labelClass}>Environment Variables</label>
            <button
              type="button"
              onClick={addEnvVar}
              className="flex items-center gap-1 rounded-lg border border-slate-700 px-2.5 py-1 text-xs text-slate-400 transition-colors hover:border-slate-600 hover:text-white"
            >
              <Plus size={12} />
              Add
            </button>
          </div>
          <div className="space-y-2">
            {envVars.map((env, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="KEY"
                  value={env.key}
                  onChange={(e) => handleEnvChange(idx, "key", e.target.value)}
                  className={`${inputClass} w-2/5 font-mono text-xs uppercase`}
                />
                <input
                  type="text"
                  placeholder="value"
                  value={env.value}
                  onChange={(e) => handleEnvChange(idx, "value", e.target.value)}
                  className={`${inputClass} flex-1 font-mono text-xs`}
                />
                <button
                  onClick={() => removeEnvVar(idx)}
                  disabled={envVars.length <= 1}
                  className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-800 hover:text-red-400 disabled:opacity-30"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-800 pt-5">
          <button
            onClick={handleClose}
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white transition-all hover:bg-blue-700 active:scale-[0.97]"
          >
            Deploy
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default CreateDeploymentModal;
