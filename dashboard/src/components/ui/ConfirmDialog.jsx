import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import Modal from "@/components/common/Modal";
import Button from "./Button";

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm",
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",
  requireTyping,
  icon: Icon = AlertTriangle,
}) => {
  const [typed, setTyped] = useState("");

  const handleConfirm = () => {
    onConfirm?.();
    setTyped("");
    onClose();
  };

  const handleClose = () => {
    setTyped("");
    onClose();
  };

  const isVerified = requireTyping ? typed === requireTyping : true;

  const iconColors = {
    danger: "bg-red-500/10 text-red-400",
    warning: "bg-yellow-500/10 text-yellow-400",
    info: "bg-blue-500/10 text-blue-400",
  };

  const btnColors = {
    danger: "bg-red-600 hover:bg-red-700",
    warning: "bg-yellow-600 hover:bg-yellow-700",
    info: "bg-blue-600 hover:bg-blue-700",
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} width="max-w-md">
      <div className="text-center">
        <div
          className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full ${
            iconColors[variant] || iconColors.danger
          }`}
        >
          <Icon size={24} />
        </div>

        <h3 className="text-lg font-semibold text-white">{title}</h3>
        {message && (
          <p className="mt-2 text-sm text-slate-400">{message}</p>
        )}

        {requireTyping && (
          <div className="mt-5">
            <label className="block text-left text-xs text-slate-500 mb-1.5">
              Type <span className="font-mono text-slate-400">{requireTyping}</span> to confirm
            </label>
            <input
              type="text"
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              placeholder={requireTyping}
              className="w-full rounded-lg border border-red-500/30 bg-slate-900 px-3.5 py-2.5 text-sm text-white outline-none placeholder:text-slate-600 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20"
              autoFocus
            />
          </div>
        )}

        <div className="mt-6 flex items-center justify-center gap-3">
          <Button variant="secondary" onClick={handleClose}>
            {cancelLabel}
          </Button>
          <button
            onClick={handleConfirm}
            disabled={!isVerified}
            className={`rounded-lg px-4 py-2 text-sm font-medium text-white transition-all disabled:cursor-not-allowed disabled:opacity-40 active:scale-[0.97] ${
              btnColors[variant] || btnColors.danger
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
