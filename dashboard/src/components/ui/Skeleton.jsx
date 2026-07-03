const shapeMap = {
  text: "h-4 w-full rounded",
  "text-sm": "h-3 w-full rounded",
  "text-lg": "h-5 w-full rounded",
  title: "h-6 w-2/3 rounded",
  subtitle: "h-4 w-1/2 rounded",
  avatar: "h-10 w-10 rounded-full",
  "avatar-sm": "h-8 w-8 rounded-full",
  "avatar-lg": "h-14 w-14 rounded-full",
  button: "h-9 w-24 rounded-lg",
  "button-sm": "h-8 w-20 rounded-lg",
  card: "h-40 w-full rounded-xl",
  "card-sm": "h-24 w-full rounded-xl",
  input: "h-9 w-full rounded-lg",
  badge: "h-6 w-16 rounded-md",
  image: "aspect-video w-full rounded-lg",
  circle: "h-12 w-12 rounded-full",
};

const Skeleton = ({ variant = "text", className = "", count = 1 }) => {
  const baseClass = shapeMap[variant] || shapeMap.text;

  if (count > 1) {
    return (
      <div className="space-y-3">
        {Array.from({ length: count }, (_, i) => (
          <div
            key={i}
            className={`animate-pulse bg-slate-800 ${baseClass} ${className}`}
            aria-hidden="true"
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`animate-pulse bg-slate-800 ${baseClass} ${className}`}
      aria-hidden="true"
    />
  );
};

const SkeletonGroup = ({ children, className = "" }) => (
  <div className={`space-y-4 ${className}`} role="status" aria-label="Loading">
    {children}
    <span className="sr-only">Loading...</span>
  </div>
);

export { Skeleton, SkeletonGroup };
export default Skeleton;
