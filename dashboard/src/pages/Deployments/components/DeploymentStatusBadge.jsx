import { getStatusConfig } from "../utils/deploymentStatus";

const sizeMap = {
  sm: "px-2 py-0.5 text-xs gap-1",
  md: "px-2.5 py-1 text-xs gap-1.5",
  lg: "px-3 py-1.5 text-sm gap-1.5",
};

const DeploymentStatusBadge = ({ status, size = "sm", showDot = true, showIcon = false }) => {
  const config = getStatusConfig(status);
  const Icon = config.icon;
  const sizeClass = sizeMap[size] || sizeMap.sm;

  return (
    <span
      className={`inline-flex items-center rounded-md border font-medium ${config.badge} ${sizeClass}`}
    >
      {showIcon && <Icon size={size === "lg" ? 14 : 12} />}
      {showDot && (
        <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} aria-hidden="true" />
      )}
      {config.label}
    </span>
  );
};

export default DeploymentStatusBadge;
