import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import Modal from "@/components/common/Modal";

const DeleteDeploymentDialog = ({ isOpen, onClose, deployment, onDelete }) => {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    if (deleting) return;
    setDeleting(true);
    setError("");
    try {
      await onDelete(deployment.id);
      setDeleting(false);
      onClose();
    } catch (err) {
      setError(err.message || "Failed to delete deployment");
      setDeleting(false);
    }
  };

  const handleClose = () => {
    if (deleting) return;
    setError("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} width="max-w-md">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10">
          <Trash2 size={28} className="text-red-400" />
        </div>

        <h3 className="text-lg font-semibold text-white">Delete Deployment</h3>
        <p className="mt-3 text-sm text-slate-400 leading-relaxed">
          Are you sure you want to delete this deployment?
        </p>
        <p className="mt-2 text-sm text-slate-400 leading-relaxed">
          This action will remove the Kubernetes Deployment, Service and the
          deployment record.
        </p>
        <p className="mt-2 text-sm font-medium text-red-400">
          This action cannot be undone.
        </p>

        {deployment && (
          <div className="mt-4 rounded-lg border border-slate-700 bg-slate-900/50 px-4 py-3">
            <p className="text-sm font-medium text-slate-200 truncate">
              {deployment.name}
            </p>
            {deployment.repositoryUrl && (
              <p className="mt-0.5 text-xs text-slate-500 truncate">
                {deployment.repositoryUrl}
              </p>
            )}
          </div>
        )}

        {error && (
          <div className="mt-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2.5">
            <p className="text-xs text-red-400">{error}</p>
          </div>
        )}

        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            onClick={handleClose}
            disabled={deleting}
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-400 transition-colors hover:bg-slate-800 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2 text-sm font-medium text-white transition-all hover:bg-red-700 active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {deleting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 size={16} />
                Delete
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteDeploymentDialog;
