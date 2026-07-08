import { forwardRef } from "react";

const Radio = forwardRef(({ label, className = "", id, ...props }, ref) => {
  const inputId = id || `radio-${label?.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <div className="flex items-center gap-2.5">
      <div className="relative flex items-center">
        <input
          ref={ref}
          id={inputId}
          type="radio"
          className="peer absolute h-4 w-4 cursor-pointer opacity-0"
          {...props}
        />
        <div
          className={`
            flex h-4 w-4 shrink-0 items-center justify-center rounded-full
            border transition-colors
            peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--accent-ring)] peer-focus-visible:ring-offset-1 peer-focus-visible:ring-offset-slate-900
            peer-disabled:cursor-not-allowed peer-disabled:opacity-50
            ${props.checked ? "border-[var(--accent)]" : "border-slate-600 bg-slate-800 hover:border-slate-500"}
          `.trim()}
          aria-hidden="true"
        >
          {props.checked && (
            <div className="h-2 w-2 rounded-full bg-[var(--accent)]" />
          )}
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
});

Radio.displayName = "Radio";

const RadioGroup = ({ label, name, value, onChange, options, error, className = "" }) => {
  return (
    <div className="space-y-1.5">
      {label && (
        <span className="block text-xs font-medium text-slate-400">{label}</span>
      )}
      <div className={`space-y-2 ${className}`}>
        {options.map((option) => (
          <Radio
            key={option.value}
            name={name}
            label={option.label}
            value={option.value}
            checked={value === option.value}
            onChange={onChange}
          />
        ))}
      </div>
      {error && (
        <p className="text-xs text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

RadioGroup.displayName = "RadioGroup";

export { Radio, RadioGroup };
export default RadioGroup;
