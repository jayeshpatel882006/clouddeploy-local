import { forwardRef } from "react";

const variantStyles = {
  primary:
    "bg-[var(--btn-primary-bg)] text-white hover:bg-[var(--btn-primary-hover)] active:bg-[var(--btn-primary-active)] focus-visible:ring-[var(--btn-primary-ring)]",
  secondary:
    "border border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 active:bg-slate-600 focus-visible:ring-slate-500/40",
  ghost:
    "text-slate-400 hover:bg-slate-800 hover:text-slate-200 active:bg-slate-700 focus-visible:ring-slate-500/40",
  danger:
    "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus-visible:ring-red-500/40",
  success:
    "bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800 focus-visible:ring-emerald-500/40",
  warning:
    "bg-amber-600 text-white hover:bg-amber-700 active:bg-amber-800 focus-visible:ring-amber-500/40",
};

const sizeStyles = {
  xs: "px-2 py-1 text-xs gap-1",
  sm: "px-3 py-1.5 text-sm gap-1.5",
  md: "px-4 py-2 text-sm gap-2",
  lg: "px-5 py-2.5 text-base gap-2",
  xl: "px-6 py-3 text-lg gap-2.5",
};

const LoadingSpinner = ({ size = 16 }) => (
  <svg
    className="animate-spin"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
    <path
      d="M12 2a10 10 0 0 1 10 10"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
    />
  </svg>
);

const Button = forwardRef(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      disabled = false,
      icon: Icon,
      iconPosition = "left",
      children,
      className = "",
      type = "button",
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        className={`
          inline-flex items-center justify-center rounded-lg font-medium
          transition-all duration-150
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-offset-slate-900
          disabled:cursor-not-allowed disabled:opacity-50
          active:scale-[0.97]
          ${variantStyles[variant] || variantStyles.primary}
          ${sizeStyles[size] || sizeStyles.md}
          ${className}
        `.trim()}
        {...props}
      >
        {loading ? (
          <LoadingSpinner size={size === "xs" ? 12 : size === "sm" ? 14 : 16} />
        ) : Icon && iconPosition === "left" ? (
          <Icon size={size === "xs" ? 14 : size === "sm" ? 15 : 16} aria-hidden="true" />
        ) : null}
        {children && <span>{children}</span>}
        {!loading && Icon && iconPosition === "right" ? (
          <Icon size={size === "xs" ? 14 : size === "sm" ? 15 : 16} aria-hidden="true" />
        ) : null}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
