import { AlertTriangle, X } from "lucide-react";

const DeleteImageDialog = ({ image, isOpen, onClose, onConfirm }) => {
  if (!isOpen || !image) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-xl border border-slate-700 bg-slate-900 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-500/10">
              <AlertTriangle size={18} className="text-red-400" />
            </div>
            <h2 className="text-lg font-semibold text-white">Delete Image</h2>
          </div>
          <button onClick={onClose} className="text-2xl text-slate-400 transition hover:text-white">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-sm text-slate-300">
            Are you sure you want to delete <span className="font-semibold text-white">{image.name}</span>?
          </p>
          <p className="mt-2 text-sm text-slate-500">
            This will remove all <span className="font-medium text-slate-400">{image.tags.length} tags</span> and associated data. This action cannot be undone.
          </p>

          <div className="mt-4 rounded-lg border border-slate-800 bg-slate-950 p-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Total size</span>
              <span className="text-slate-200">{image.totalSize}</span>
            </div>
            <div className="mt-1.5 flex items-center justify-between text-sm">
              <span className="text-slate-400">Total pulls</span>
              <span className="text-slate-200">{image.totalPulls.toLocaleString()}</span>
            </div>
            <div className="mt-1.5 flex items-center justify-between text-sm">
              <span className="text-slate-400">Status</span>
              <span className="text-slate-200">{image.status}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-800 px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(image)}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-red-700 active:scale-[0.97]"
          >
            Delete Image
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteImageDialog;
