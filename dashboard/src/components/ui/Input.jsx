import { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const Input = forwardRef(
  (
    {
      label,
      icon: Icon,
      error,
      helperText,
      className = "",
      id,
      type = "text",
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputId = id || `input-${label?.toLowerCase().replace(/\s+/g, "-")}`;
    const isPassword = type === "password";
    const resolvedType = isPassword && showPassword ? "text" : type;

    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-medium text-slate-400">
            {label}
          </label>
        )}
        <div className="relative">
          {Icon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Icon size={16} className="text-slate-500" aria-hidden="true" />
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            type={resolvedType}
            className={`
              w-full rounded-lg border bg-slate-800 px-3.5 py-2.5 text-sm text-white
              outline-none transition-colors placeholder:text-slate-500
              focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30
              disabled:cursor-not-allowed disabled:opacity-50
              ${Icon ? "pl-9" : ""}
              ${isPassword ? "pr-10" : ""}
              ${error ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/30" : "border-slate-700"}
              ${className}
            `.trim()}
            aria-invalid={error ? "true" : undefined}
            aria-describedby={
              error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
            }
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 hover:text-slate-300"
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          )}
        </div>
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

Input.displayName = "Input";
export default Input;
