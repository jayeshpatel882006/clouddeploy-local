import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { getSystemHealth } from "@/api/system.api";

// ==========================================
// SystemHealthContext
// ==========================================
//
// Fetches health data ONCE when the application starts.
// Stores it globally so every component reads from the same state.
// No auto-polling — only refreshes on manual refreshHealth() call.
//
// Architecture:
//   Component → useSystemHealth → Context → API → Axios → Backend
//
// ==========================================

const HEALTHY_STATUS = "HEALTHY";

/**
 * Compute an overall summary from the health object.
 * Dynamically maps all services from the backend response.
 * Adding a new backend service requires no frontend changes.
 */
export const computeHealthSummary = (health) => {
  if (!health) return null;

  const healthData = health.health || health;
  const services = [];

  // Service display configuration
  const serviceConfig = {
    docker:    { name: "Docker Engine",       icon: "container" },
    kubernetes: { name: "Kubernetes API",       icon: "wifi" },
    registry:  { name: "Container Registry",   icon: "database" },
    mongodb:   { name: "MongoDB",              icon: "database" },
    backend:   { name: "Backend API",          icon: "server" },
    // Future services (mapped automatically when backend returns them)
    // floci:             { name: "Floci",              icon: "terminal" },
    // securityScanner:   { name: "Security Scanner",    icon: "shield" },
    // storageController: { name: "Storage Controller",  icon: "hardDrive" },
  };

  // Dynamically build services from whatever the backend returns
  for (const [key, cfg] of Object.entries(serviceConfig)) {
    const svc = healthData[key];
    if (svc) {
      // Collect all extra fields beyond the standard ones
      const { status, running, message, action, ...extra } = svc;
      services.push({
        key,
        name: cfg.name,
        icon: cfg.icon,
        status: svc.status === HEALTHY_STATUS ? "healthy" : svc.status === "UNHEALTHY" ? "unhealthy" : "unknown",
        running: svc.running,
        message: svc.message || `Status: ${svc.status || "UNKNOWN"}`,
        action: svc.action || null,
        details: Object.keys(extra).length > 0 ? extra : null,
      });
    }
  }

  const allServices = services;

  const total = allServices.length;
  const healthy = allServices.filter((s) => s.status === "healthy").length;
  const unhealthy = allServices.filter((s) => s.status === "unhealthy").length;
  const unknown = allServices.filter((s) => s.status === "unknown").length;
  const allHealthy = total > 0 && unhealthy === 0;

  // Calculate health percentage (unknown services count as partial)
  const weightedHealthy = healthy + (unknown * 0.5);
  const healthPercent = total > 0 ? Math.round((weightedHealthy / total) * 100) : 0;

  return {
    services: allServices,
    total,
    healthy,
    unhealthy,
    unknown,
    allHealthy,
    healthPercent,
    label: allHealthy ? "Healthy" : unhealthy > 0 ? "Unhealthy" : "Unknown",
    lastChecked: healthData.lastChecked || null,
  };
};

// ── Context ──

const SystemHealthContext = createContext(null);

export const SystemHealthProvider = ({ children }) => {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mountedRef = useRef(true);

  // ── Fetch health from backend ──
  const fetchHealth = useCallback(async () => {
    try {
      const response = await getSystemHealth();
      if (!mountedRef.current) return;
      setHealth(response);
      setError(null);
      return response;
    } catch (err) {
      if (!mountedRef.current) return;
      setError(err.message || "Unable to contact backend.");
      return null;
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, []);

  // ── Fetch ONCE on mount ──
  useEffect(() => {
    mountedRef.current = true;
    setLoading(true);
    fetchHealth();
    return () => { mountedRef.current = false; };
  }, [fetchHealth]);

  // ── Manual refresh ──
  // NOTE: named `refresh` to match the contract expected by all consumers
  const refresh = useCallback(() => {
    setLoading(true);
    return fetchHealth();
  }, [fetchHealth]);

  // ── Derived state ──
  const summary = computeHealthSummary(health);
  const isHealthy = summary?.allHealthy ?? false;

  return (
    <SystemHealthContext.Provider
      value={{
        health,
        loading,
        error,
        refresh,
        isHealthy,
        healthSummary: summary,
      }}
    >
      {children}
    </SystemHealthContext.Provider>
  );
};

export const useSystemHealthContext = () => {
  const ctx = useContext(SystemHealthContext);
  if (!ctx) {
    throw new Error("useSystemHealthContext must be used within a SystemHealthProvider");
  }
  return ctx;
};

export default SystemHealthContext;
