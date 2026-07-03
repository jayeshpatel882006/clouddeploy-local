import { forwardRef } from "react";

const resizeOptions = {
  none: "resize-none",
  vertical: "resize-y",
  horizontal: "resize-x",
  both: "resize",
};

const Textarea = forwardRef(
  ({ label, error, helperText, className = "", id, resize = "vertical", rows = 4, ...props }, ref) => {
    const inputId = id || `textarea-${label?.toLowerCase().replace(/\s+/g, "-")}`;

    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-medium text-slate-400">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          rows={rows}
          className={`
            w-full rounded-lg border bg-slate-800 px-3.5 py-2.5 text-sm text-white
            outline-none transition-colors placeholder:text-slate-500
            focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30
            disabled:cursor-not-allowed disabled:opacity-50
            ${resizeOptions[resize] || resizeOptions.vertical}
            ${error ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/30" : "border-slate-700"}
            ${className}
          `.trim()}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={
            error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
          }
          {...props}
        />
        {error && (
          <p id={`${inputId}-error`} className="text-xs text-red-400" role="alert">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={`${inputId}-helper`} className="text-xs text-slate-500">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
export default Textarea;
