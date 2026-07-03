const colorVariants = {
  gray: "bg-slate-500/10 text-slate-400 border-slate-500/20",
  blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  green: "bg-green-500/10 text-green-400 border-green-500/20",
  red: "bg-red-500/10 text-red-400 border-red-500/20",
  yellow: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  purple: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  orange: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  cyan: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  pink: "bg-pink-500/10 text-pink-400 border-pink-500/20",
};

const dotColors = {
  gray: "bg-slate-400",
  blue: "bg-blue-400",
  green: "bg-green-400",
  red: "bg-red-400",
  yellow: "bg-yellow-400",
  purple: "bg-purple-400",
  emerald: "bg-emerald-400",
  orange: "bg-orange-400",
  cyan: "bg-cyan-400",
  pink: "bg-pink-400",
};

const sizeClasses = {
  sm: "px-1.5 py-0.5 text-[10px]",
  md: "px-2 py-0.5 text-xs",
  lg: "px-2.5 py-1 text-sm",
};

const Badge = ({
  children,
  color = "gray",
  size = "md",
  dot = false,
  variant = "outline",
  className = "",
}) => {
  const baseStyle = colorVariants[color] || colorVariants.gray;
  const dotStyle = dotColors[color] || dotColors.gray;

  const variantStyle =
    variant === "solid"
      ? baseStyle.replace(/bg-\w+-\d+\/\d+/g, `bg-${color}-600`).replace(/text-\w+-\d+/g, "text-white").replace(/border-\w+-\d+\/\d+/g, "")
      : baseStyle;

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-md border font-medium
        ${variantStyle}
        ${sizeClasses[size] || sizeClasses.md}
        ${className}
      `.trim()}
    >
      {dot && <span className={`h-1.5 w-1.5 rounded-full ${dotStyle}`} aria-hidden="true" />}
      {children}
    </span>
  );
};

export default Badge;
