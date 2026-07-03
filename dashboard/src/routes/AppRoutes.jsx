import { BrowserRouter, Routes, Route } from "react-router-dom";

import DashboardLayout from "@/layouts/DashboardLayout";

import Dashboard from "@/pages/Dashboard";
import Deployments from "@/pages/Deployments";
import Clusters from "@/pages/Clusters";
import Monitoring from "@/pages/Monitoring";
import Logs from "@/pages/Logs";
import Registry from "@/pages/Registry";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/NotFound";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <DashboardLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/deployments" element={<Deployments />} />
          <Route path="/clusters" element={<Clusters />} />
          <Route path="/monitoring" element={<Monitoring />} />
          <Route path="/logs" element={<Logs />} />
          <Route path="/registry" element={<Registry />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </DashboardLayout>
    </BrowserRouter>
  );
};

export default AppRoutes;
