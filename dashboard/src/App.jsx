import { SettingsProvider } from "@/contexts/SettingsContext";
import { SystemHealthProvider } from "@/contexts/SystemHealthContext";
import AppRoutes from "@/routes/AppRoutes";

function App() {
  return (
    <SettingsProvider>
      <SystemHealthProvider>
        <AppRoutes />
      </SystemHealthProvider>
    </SettingsProvider>
  );
}

export default App;
