import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const sideConfig = {
  right: {
    initial: { x: "100%" },
    animate: { x: 0 },
    overlay: "left-0",
    panel: "right-0 border-l",
  },
  left: {
    initial: { x: "-100%" },
    animate: { x: 0 },
    overlay: "right-0",
    panel: "left-0 border-r",
  },
};

const widthMap = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  full: "max-w-full",
};

const Drawer = ({
  isOpen,
  onClose,
  title,
  children,
  side = "right",
  width = "xl",
  showClose = true,
  closeOnOverlay = true,
}) => {
  const config = sideConfig[side] || sideConfig.right;
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
        <div className="fixed inset-0 z-50">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeOnOverlay ? onClose : undefined}
          />

          {/* Panel */}
          <motion.div
            ref={contentRef}
            initial={config.initial}
            animate={config.animate}
            exit={config.initial}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className={`absolute inset-y-0 ${config.panel} flex w-full ${widthMap[width] || widthMap.xl} flex-col bg-slate-950 shadow-2xl`}
            style={{ borderColor: "var(--card-accent-border)" }}
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
                  aria-label="Close drawer"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Drawer;
