// ==========================================
// useSettings — Convenience hook for consuming settings
// ==========================================

import { useSettingsContext } from "@/contexts/SettingsContext";

export const useSettings = () => {
  return useSettingsContext();
};

export default useSettings;
