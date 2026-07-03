import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const DropdownMenu = ({
  trigger,
  items = [],
  align = "left",
  className = "",
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const alignClass = align === "right" ? "right-0" : "left-0";

  return (
    <div ref={ref} className={`relative inline-flex ${className}`}>
      <div onClick={() => setOpen(!open)}>{trigger}</div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.12 }}
            className={`absolute top-full z-50 mt-1.5 min-w-[180px] overflow-hidden rounded-xl border border-slate-700 bg-slate-900 py-1 shadow-xl ${alignClass}`}
          >
            {items.map((item, idx) => {
              if (item.separator) {
                return <div key={`sep-${idx}`} className="my-1 border-t border-slate-800" />;
              }

              const Icon = item.icon;
              const isDanger = item.variant === "danger";

              if (item.onClick) {
                return (
                  <button
                    key={item.label || idx}
                    onClick={() => {
                      item.onClick();
                      setOpen(false);
                    }}
                    disabled={item.disabled}
                    className={`
                      flex w-full items-center gap-2.5 px-3.5 py-2 text-sm transition-colors
                      ${isDanger
                        ? "text-red-400 hover:bg-red-500/10"
                        : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                      }
                      disabled:cursor-not-allowed disabled:opacity-40
                    `.trim()}
                  >
                    {Icon && <Icon size={15} aria-hidden="true" />}
                    {item.label}
                    {item.shortcut && (
                      <span className="ml-auto text-xs text-slate-600">{item.shortcut}</span>
                    )}
                  </button>
                );
              }

              if (item.href) {
                return (
                  <a
                    key={item.label || idx}
                    href={item.href}
                    className="flex w-full items-center gap-2.5 px-3.5 py-2 text-sm text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-200"
                  >
                    {Icon && <Icon size={15} aria-hidden="true" />}
                    {item.label}
                  </a>
                );
              }

              return null;
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DropdownMenu;
