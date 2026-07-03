const sizeMap = {
  xs: 12,
  sm: 16,
  md: 24,
  lg: 32,
  xl: 48,
};

const LoadingSpinner = ({ size = "md", className = "", label = "Loading..." }) => {
  const px = sizeMap[size] || sizeMap.md;

  return (
    <svg
      className={`animate-spin ${className}`}
      width={px}
      height={px}
      viewBox="0 0 24 24"
      fill="none"
      role="status"
      aria-label={label}
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
        opacity="0.25"
        className="text-slate-600"
      />
      <path
        d="M12 2a10 10 0 0 1 10 10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        className="text-blue-500"
      />
    </svg>
  );
};

export default LoadingSpinner;
