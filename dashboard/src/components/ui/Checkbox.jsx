import { forwardRef } from "react";
import { Check, Minus } from "lucide-react";

const Checkbox = forwardRef(
  ({ label, indeterminate = false, error, className = "", id, ...props }, ref) => {
    const inputId = id || `checkbox-${label?.toLowerCase().replace(/\s+/g, "-")}`;

    return (
      <div className="flex items-start gap-2.5">
        <div className="relative flex items-center">
          <input
            ref={ref}
            id={inputId}
            type="checkbox"
            className="peer absolute h-4 w-4 cursor-pointer opacity-0"
            {...props}
          />
          <div
            className={`
              flex h-4 w-4 shrink-0 items-center justify-center rounded
              border transition-colors
              peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--accent-ring)] peer-focus-visible:ring-offset-1 peer-focus-visible:ring-offset-slate-900
              peer-disabled:cursor-not-allowed peer-disabled:opacity-50
              ${error ? "border-red-500/50" : "border-slate-600"}
              ${props.checked
                ? "bg-[var(--accent)] border-[var(--accent)]"
                : "bg-slate-800 hover:border-slate-500"
              }
            `.trim()}
            aria-hidden="true"
          >
            {indeterminate ? (
              <Minus size={10} className="text-white" />
            ) : props.checked ? (
              <Check size={10} className="text-white" />
            ) : null}
          </div>
        </div>
        {label && (
          <label
            htmlFor={inputId}
            className="cursor-pointer text-sm text-slate-300 select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50"
          >
            {label}
          </label>
        )}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";
export default Checkbox;
