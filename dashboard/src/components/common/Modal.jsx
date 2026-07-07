import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  width = "max-w-lg",
  showClose = true,
  closeOnOverlay = true,
}) => {
  const contentRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeOnOverlay ? onClose : undefined}
          />

          {/* Content */}
          <motion.div
            ref={contentRef}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={`modal-content relative w-full ${width} max-h-[85vh] overflow-y-auto rounded-xl border border-slate-700 bg-slate-900 shadow-2xl`}
            role="dialog"
            aria-modal="true"
            aria-label={title}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
              <div className="min-w-0 flex-1">
                {title && (
                  <h2 className="truncate text-lg font-semibold text-white">{title}</h2>
                )}
              </div>
              {showClose && (
                <button
                  onClick={onClose}
                  className="ml-3 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
                  aria-label="Close modal"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            {/* Body */}
            <div className="p-6">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
