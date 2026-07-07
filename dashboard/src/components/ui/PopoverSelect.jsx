import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { ChevronDown, Check, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ==========================================
// PopoverSelect — Custom dropdown selector
// Replace native <select> with this component
// ==========================================

const PopoverSelect = ({
  value,
  onChange,
  options = [],
  label,
  icon: Icon,
  placeholder = "Select...",
  searchable = false,
  className = "",
  disabled = false,
  width = "w-full",
  id,
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef(null);
  const searchRef = useRef(null);
  const listRef = useRef(null);
  const activeIndexRef = useRef(-1);

  const selectedOption = useMemo(
    () => options.find((opt) => opt.value === value),
    [options, value]
  );

  const filteredOptions = useMemo(() => {
    if (!search) return options;
    const q = search.toLowerCase();
    return options.filter(
      (opt) =>
        opt.label.toLowerCase().includes(q) ||
        (opt.searchTerm && opt.searchTerm.toLowerCase().includes(q))
    );
  }, [options, search]);

  // Open handler
  const handleOpen = useCallback(() => {
    if (disabled) return;
    setOpen((prev) => !prev);
    setSearch("");
    activeIndexRef.current = -1;
  }, [disabled]);

  const handleSelect = useCallback(
    (option) => {
      onChange(option.value);
      setOpen(false);
      setSearch("");
    },
    [onChange]
  );

  const handleClose = useCallback(() => {
    setOpen(false);
    setSearch("");
  }, []);

  // Click outside
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        handleClose();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, handleClose]);

  // Escape key
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, handleClose]);

  // Focus search when opening
  useEffect(() => {
    if (open && searchable && searchRef.current) {
      setTimeout(() => searchRef.current?.focus(), 50);
    }
  }, [open, searchable]);

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (!open) {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
        e.preventDefault();
        handleOpen();
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        activeIndexRef.current = Math.min(
          activeIndexRef.current + 1,
          filteredOptions.length - 1
        );
        scrollToActive();
        break;
      case "ArrowUp":
        e.preventDefault();
        activeIndexRef.current = Math.max(activeIndexRef.current - 1, 0);
        scrollToActive();
        break;
      case "Enter":
        e.preventDefault();
        if (activeIndexRef.current >= 0 && filteredOptions[activeIndexRef.current]) {
          handleSelect(filteredOptions[activeIndexRef.current]);
        }
        break;
      case "Escape":
        handleClose();
        break;
    }
  };

  const scrollToActive = () => {
    if (listRef.current && activeIndexRef.current >= 0) {
      const items = listRef.current.querySelectorAll("[data-option-index]");
      items[activeIndexRef.current]?.scrollIntoView({ block: "nearest" });
    }
  };

  const inputId = id || `select-${label?.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-medium text-slate-400">
          {label}
        </label>
      )}
      <div ref={ref} className={`relative ${width}`}>
        {/* Trigger button */}
        <button
          id={inputId}
          type="button"
          onClick={handleOpen}
          disabled={disabled}
          onKeyDown={handleKeyDown}
          aria-haspopup="listbox"
          aria-expanded={open}
          className={`
            flex w-full items-center rounded-lg border bg-slate-800 px-3.5 py-2.5 text-sm text-white
            outline-none transition-all duration-150
            focus-visible:ring-2 focus-visible:ring-[var(--accent)]/40
            disabled:cursor-not-allowed disabled:opacity-50
            ${open ? "border-[var(--accent)]/50 ring-1 ring-[var(--accent)]/30" : "border-slate-700 hover:border-slate-600"}
            ${Icon ? "pl-9" : ""}
            ${className}
          `.trim()}
        >
          {Icon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Icon size={16} className="text-slate-500" aria-hidden="true" />
            </div>
          )}
          <span className={`flex-1 truncate text-left ${selectedOption ? "text-white" : "text-slate-500"}`}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown
            size={16}
            className={`shrink-0 text-slate-500 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        </button>

        {/* Dropdown popup */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -4 }}
              transition={{ duration: 0.12, ease: "easeOut" }}
              className="absolute left-0 top-full z-50 mt-1.5 w-full overflow-hidden rounded-xl border border-slate-700 bg-slate-900/95 shadow-xl backdrop-blur-xl"
              role="listbox"
              aria-label={label || "Select option"}
            >
              {/* Search input */}
              {searchable && (
                <div className="border-b border-slate-800 p-2">
                  <div className="relative flex items-center">
                    <Search size={14} className="pointer-events-none absolute left-2.5 text-slate-500" />
                    <input
                      ref={searchRef}
                      type="text"
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value);
                        activeIndexRef.current = -1;
                      }}
                      placeholder="Search..."
                      className="w-full rounded-md border border-slate-700 bg-slate-800 py-1.5 pl-8 pr-2.5 text-sm text-white outline-none placeholder:text-slate-500 focus:border-[var(--accent)]/50 focus:ring-1 focus:ring-[var(--accent)]/30"
                      onKeyDown={handleKeyDown}
                    />
                  </div>
                </div>
              )}

              {/* Options list */}
              <div
                ref={listRef}
                className="max-h-56 overflow-y-auto overscroll-contain py-1"
                role="listbox"
                aria-label="Options"
              >
                {filteredOptions.length === 0 ? (
                  <div className="px-3.5 py-3 text-center text-sm text-slate-500">
                    No options found
                  </div>
                ) : (
                  filteredOptions.map((option, idx) => {
                    const isSelected = option.value === value;
                    const isActive = activeIndexRef.current === idx;

                    return (
                      <button
                        key={option.value}
                        type="button"
                        data-option-index={idx}
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => handleSelect(option)}
                        onMouseEnter={() => { activeIndexRef.current = idx; }}
                        className={`
                          flex w-full items-center gap-2.5 px-3.5 py-2 text-sm text-left transition-colors duration-100
                          ${isSelected
                            ? "text-white bg-[var(--accent)]/10"
                            : isActive
                              ? "text-slate-200 bg-slate-800"
                              : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                          }
                        `.trim()}
                      >
                        {/* Color dot if available */}
                        {option.color && (
                          <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${option.color}`} />
                        )}
                        <span className="flex-1 truncate">{option.label}</span>
                        {isSelected && (
                          <Check size={14} className="shrink-0 text-[var(--accent)]" />
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PopoverSelect;
