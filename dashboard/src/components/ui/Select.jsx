import { forwardRef } from "react";
import { ChevronDown } from "lucide-react";

const Select = forwardRef(
  ({ label, icon: Icon, error, helperText, className = "", id, children, ...props }, ref) => {
    const inputId = id || `select-${label?.toLowerCase().replace(/\s+/g, "-")}`;

    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-medium text-slate-400">
            {label}
          </label>
        )}
        <div className="relative">
          {Icon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-3">
              <Icon size={16} className="text-slate-500" aria-hidden="true" />
            </div>
          )}
          <select
            ref={ref}
            id={inputId}
            className={`
              w-full appearance-none rounded-lg border bg-slate-800 px-3.5 py-2.5 pr-10 text-sm text-white
              outline-none transition-colors
              focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30
              disabled:cursor-not-allowed disabled:opacity-50
              ${Icon ? "pl-9" : ""}
              ${error ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/30" : "border-slate-700"}
              ${className}
            `.trim()}
            aria-invalid={error ? "true" : undefined}
            {...props}
          >
            {children}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <ChevronDown size={16} className="text-slate-500" aria-hidden="true" />
          </div>
        </div>
        {error && (
          <p className="text-xs text-red-400" role="alert">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className="text-xs text-slate-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";
export default Select;
