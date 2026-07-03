// Re-export from the shared UI library for backward compatibility
import StatusBadge from "@/components/ui/StatusBadge";

// RegistryStatusBadge supports the same statuses plus registry-specific ones like Scanning, Vulnerable
// These are already included in the base ui/StatusBadge component
const RegistryStatusBadge = StatusBadge;

export default RegistryStatusBadge;
export { RegistryStatusBadge };
