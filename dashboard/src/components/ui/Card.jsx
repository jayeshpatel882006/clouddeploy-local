const hoverVariants = {
  none: "",
  lift: "hover:-translate-y-0.5 hover:shadow-md transition-all duration-200",
  glow: "hover:shadow-md transition-all duration-200",
  border: "hover:border-slate-700 transition-colors duration-200",
};

const Card = ({
  title,
  subtitle,
  children,
  className = "",
  headerRight,
  padding = true,
  hover = "none",
}) => {
  return (
    <div
      className={`rounded-xl border border-slate-800 bg-slate-950 shadow-sm ${hoverVariants[hover] || ""} ${className}`}
    >
      {(title || subtitle || headerRight) && (
        <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
          <div className="min-w-0 flex-1">
            {title && (
              <h3 className="truncate text-base font-semibold text-white">{title}</h3>
            )}
            {subtitle && (
              <p className="mt-0.5 truncate text-xs text-slate-400">{subtitle}</p>
            )}
          </div>
          {headerRight && <div className="ml-3 shrink-0">{headerRight}</div>}
        </div>
      )}
      <div className={padding ? "p-5" : ""}>{children}</div>
    </div>
  );
};

export default Card;
