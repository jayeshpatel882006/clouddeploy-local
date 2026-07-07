import { forwardRef } from "react";

const switchSizeStyles = {
  sm: { track: "h-5 w-9", circle: "h-3.5 w-3.5", translateOn: "translate-x-[18px]", translateOff: "translate-x-[3px]" },
  md: { track: "h-6 w-11", circle: "h-4 w-4", translateOn: "translate-x-6", translateOff: "translate-x-1" },
  lg: { track: "h-7 w-14", circle: "h-5 w-5", translateOn: "translate-x-[34px]", translateOff: "translate-x-[4px]" },
};

const Switch = forwardRef(
  ({ label, description, checked = false, onChange, size = "md", disabled = false, id }, ref) => {
    const inputId = id || `switch-${label?.toLowerCase().replace(/\s+/g, "-")}`;
    const sizes = switchSizeStyles[size];

    return (
      <label
        htmlFor={inputId}
        className={`flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/50 px-4 py-3 transition-colors hover:border-slate-700 ${
          disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
        }`}
      >
        <div className="flex items-center gap-3">
          <div>
            {label && (
              <p className="text-sm font-medium text-slate-200">{label}</p>
            )}
            {description && (
              <p className="text-xs text-slate-500">{description}</p>
            )}
          </div>
        </div>
        <div className="relative flex items-center">
          <input
            ref={ref}
            id={inputId}
            type="checkbox"
            checked={checked}
            onChange={onChange}
            disabled={disabled}
            className="peer absolute h-6 w-11 cursor-pointer opacity-0"
            aria-label={label}
          />
          <div
            className={`
              ${sizes.track} relative inline-flex shrink-0 cursor-pointer items-center rounded-full
              transition-colors duration-200
              peer-focus-visible:ring-2 peer-focus-visible:ring-blue-500/40 peer-focus-visible:ring-offset-1 peer-focus-visible:ring-offset-slate-900
              ${checked ? "bg-[var(--toggle-active)]" : "bg-slate-700"}
            `.trim()}
            aria-hidden="true"
          >
            <span
              className={`
                ${sizes.circle} inline-block rounded-full bg-white shadow transition-transform duration-200
                ${checked ? sizes.translateOn : sizes.translateOff}
              `.trim()}
            />
          </div>
        </div>
      </label>
    );
  }
);

Switch.displayName = "Switch";
export default Switch;
