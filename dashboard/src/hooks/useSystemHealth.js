import { useSystemHealthContext } from "@/contexts/SystemHealthContext";

// ==========================================
// useSystemHealth — Hook for system health data
// ==========================================
//
// This hook now reads from the shared SystemHealthContext.
// All components share the SAME health data — fetched once on app start.
// No polling. No duplicate API calls.
//
// Architecture:
//   Component → useSystemHealth → Context → API → Axios → Backend
//
// ==========================================

export const useSystemHealth = () => {
  const ctx = useSystemHealthContext();
  return ctx;
};

export default useSystemHealth;
