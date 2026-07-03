const Card = ({ title, subtitle, children, className = "", headerRight, padding = true }) => {
  return (
    <div
      className={`rounded-xl border border-slate-800 bg-slate-950 shadow-sm ${className}`}
    >
      {(title || subtitle || headerRight) && (
        <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
          <div>
            {title && <h3 className="text-base font-semibold text-white">{title}</h3>}
            {subtitle && <p className="mt-0.5 text-xs text-slate-400">{subtitle}</p>}
          </div>
          {headerRight && <div className="flex-shrink-0">{headerRight}</div>}
        </div>
      )}
      <div className={padding ? "p-5" : ""}>{children}</div>
    </div>
  );
};

export default Card;
