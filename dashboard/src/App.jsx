import { SettingsProvider } from "@/contexts/SettingsContext";
import AppRoutes from "@/routes/AppRoutes";

function App() {
  return (
    <SettingsProvider>
      <AppRoutes />
    </SettingsProvider>
  );
}

export default App;
