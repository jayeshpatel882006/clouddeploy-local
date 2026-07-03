import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import Modal from "@/components/common/Modal";

const DeleteDeploymentDialog = ({ deployment, isOpen, onClose, onConfirm }) => {
  const [confirmText, setConfirmText] = useState("");

  const handleConfirm = () => {
    if (onConfirm) onConfirm(deployment);
    setConfirmText("");
    onClose();
  };

  const handleClose = () => {
    setConfirmText("");
    onClose();
  };

  const isVerified = confirmText === deployment?.name;

  if (!deployment) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} width="max-w-md">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10">
          <AlertTriangle size={24} className="text-red-400" />
        </div>

        <h3 className="text-lg font-semibold text-white">Delete Deployment</h3>
        <p className="mt-2 text-sm text-slate-400">
          This action cannot be undone. This will permanently delete the{" "}
          <span className="font-medium text-slate-300">{deployment.name}</span>{" "}
          deployment and all associated pods.
        </p>

        <div className="mt-5">
          <label className="block text-left text-xs text-slate-500 mb-1.5">
            Type <span className="font-mono text-slate-400">{deployment.name}</span> to confirm
          </label>
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder={deployment.name}
            className="w-full rounded-lg border border-red-500/30 bg-slate-900 px-3.5 py-2.5 text-sm text-white outline-none placeholder:text-slate-600 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20"
          />
        </div>

        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            onClick={handleClose}
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!isVerified}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Delete
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteDeploymentDialog;
