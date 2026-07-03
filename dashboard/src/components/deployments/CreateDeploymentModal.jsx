import { useState } from "react";
import Modal from "@/components/common/Modal";

const CreateDeploymentModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    appName: "",
    image: "",
    namespace: "default",
    replicas: 1,
    port: 3000,
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    console.log(formData);

    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Deployment">
      <div className="space-y-5">
        <div className="space-y-2">
          <label
            htmlFor="appName"
            className="block text-sm font-medium text-slate-300"
          >
            Application Name
          </label>

          <input
            id="appName"
            name="appName"
            type="text"
            placeholder="inventory-api"
            value={formData.appName}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="image"
            className="block text-sm font-medium text-slate-300"
          >
            Docker Image
          </label>

          <input
            id="image"
            name="image"
            type="text"
            placeholder="localhost:5000/inventory:v1"
            value={formData.image}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="namespace"
            className="block text-sm font-medium text-slate-300"
          >
            Namespace
          </label>

          <input
            id="namespace"
            name="namespace"
            type="text"
            value={formData.namespace}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="replicas"
            className="block text-sm font-medium text-slate-300"
          >
            Replicas
          </label>

          <input
            id="replicas"
            name="replicas"
            type="number"
            min="1"
            value={formData.replicas}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="port"
            className="block text-sm font-medium text-slate-300"
          >
            Container Port
          </label>

          <input
            id="port"
            name="port"
            type="number"
            value={formData.port}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-700 px-4 py-2 hover:bg-slate-800"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="rounded-lg bg-blue-600 px-4 py-2 hover:bg-blue-700"
          >
            Deploy
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default CreateDeploymentModal;
