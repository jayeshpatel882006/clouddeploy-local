import { useState } from "react";
import { SlidersHorizontal, Minus, Plus } from "lucide-react";
import Modal from "@/components/common/Modal";

const ScaleDeploymentDialog = ({ deployment, isOpen, onClose, onConfirm }) => {
  const initialReplicas = deployment?.replicas || 1;
  const [replicas, setReplicas] = useState(initialReplicas);

  const handleConfirm = () => {
    if (onConfirm) onConfirm(deployment, replicas);
    onClose();
  };

  const handleClose = () => {
    setReplicas(initialReplicas);
    onClose();
  };

  if (!deployment) return null;

  const isChanged = replicas !== initialReplicas;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} width="max-w-sm">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-500/10">
          <SlidersHorizontal size={24} className="text-purple-400" />
        </div>

        <h3 className="text-lg font-semibold text-white">Scale Deployment</h3>
        <p className="mt-1 text-sm text-slate-400">
          Adjust replica count for{" "}
          <span className="font-medium text-slate-300">{deployment.name}</span>
        </p>
      </div>

      <div className="mt-6 flex items-center justify-center gap-4">
        <button
          onClick={() => setReplicas(Math.max(0, replicas - 1))}
          disabled={replicas <= 0}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-700 text-slate-400 transition-colors hover:border-slate-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Minus size={18} />
        </button>

        <div className="flex flex-col items-center">
          <span className="text-3xl font-bold text-white">{replicas}</span>
          <span className="text-xs text-slate-500">replicas</span>
        </div>

        <button
          onClick={() => setReplicas(Math.min(20, replicas + 1))}
          disabled={replicas >= 20}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-700 text-slate-400 transition-colors hover:border-slate-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Plus size={18} />
        </button>
      </div>

      {isChanged && (
        <div className="mt-4 rounded-lg bg-purple-500/5 border border-purple-500/20 px-4 py-2.5 text-center">
          <p className="text-xs text-purple-300">
            {replicas > initialReplicas
              ? `Scaling up by ${replicas - initialReplicas} replica${replicas - initialReplicas > 1 ? "s" : ""}`
              : `Scaling down by ${initialReplicas - replicas} replica${initialReplicas - replicas > 1 ? "s" : ""}`}
          </p>
        </div>
      )}

      <div className="mt-6 flex items-center justify-center gap-3">
        <button
          onClick={handleClose}
          className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
        >
          Cancel
        </button>
        <button
          onClick={handleConfirm}
          disabled={!isChanged}
          className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Scale
        </button>
      </div>
    </Modal>
  );
};

export default ScaleDeploymentDialog;
