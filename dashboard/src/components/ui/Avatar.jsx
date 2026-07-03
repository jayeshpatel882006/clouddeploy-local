import { useState } from "react";
import { User } from "lucide-react";

const sizeMap = {
  xs: "h-6 w-6 text-[10px]",
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-16 w-16 text-xl",
  "2xl": "h-20 w-20 text-2xl",
};

const iconSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 20,
  xl: 24,
  "2xl": 28,
};

const Avatar = ({
  src,
  alt = "",
  name,
  size = "md",
  color = "blue",
  className = "",
}) => {
  const [imgError, setImgError] = useState(false);
  const sizeClass = sizeMap[size] || sizeMap.md;

  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : null;

  const colorMap = {
    blue: "bg-blue-600/20 text-blue-400",
    green: "bg-green-600/20 text-green-400",
    purple: "bg-purple-600/20 text-purple-400",
    emerald: "bg-emerald-600/20 text-emerald-400",
    orange: "bg-orange-600/20 text-orange-400",
    cyan: "bg-cyan-600/20 text-cyan-400",
    pink: "bg-pink-600/20 text-pink-400",
    red: "bg-red-600/20 text-red-400",
  };

  const bgClass = colorMap[color] || colorMap.blue;

  if (src && !imgError) {
    return (
      <div className={`${sizeClass} ${className}`}>
        <img
          src={src}
          alt={alt || name || "Avatar"}
          className="h-full w-full rounded-full object-cover"
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  return (
    <div
      className={`
        ${sizeClass} inline-flex items-center justify-center rounded-full font-semibold ${bgClass} ${className}
      `.trim()}
      role="img"
      aria-label={alt || name || "Avatar"}
    >
      {initials || <User size={iconSizes[size] || 16} aria-hidden="true" />}
    </div>
  );
};

export default Avatar;
