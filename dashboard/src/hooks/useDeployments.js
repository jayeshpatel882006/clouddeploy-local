import { useState, useEffect, useCallback, useRef } from "react";
import * as deploymentApi from "../api/deployment.api.js";
import { transformDeployments, transformDeployment } from "../services/deployment.service.js";
import { isTerminalStatus } from "../utils/status.js";

// ==========================================
// useDeployments — Hook for deployment CRUD + polling
// ==========================================

export const useDeployments = ({ pollInterval = 2000 } = {}) => {
  const [deployments, setDeployments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const pollingRef = useRef(null);
  const pollingIdsRef = useRef(new Set());

  // ==========================================
  // Fetch all deployments
  // ==========================================

  const fetchDeployments = useCallback(async () => {
    try {
      const response = await deploymentApi.getDeployments();
      const transformed = transformDeployments(response.data?.deployments || []);
      setDeployments(transformed);
      setError(null);
      return transformed;
    } catch (err) {
      setError(err.message || "Failed to fetch deployments");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // ==========================================
  // Fetch single deployment by ID
  // ==========================================

  const fetchDeployment = useCallback(async (id) => {
    try {
      const response = await deploymentApi.getDeployment(id);
      return transformDeployment(response.data);
    } catch (err) {
      throw new Error(err.message || "Failed to fetch deployment");
    }
  }, []);

  // ==========================================
  // Create a new deployment
  // ==========================================

  const createDeployment = useCallback(async (repositoryUrl, branch = "main") => {
    try {
      const response = await deploymentApi.createDeployment({ repositoryUrl, branch });
      const newDep = transformDeployment(response.data?.deployment);

      // Add to the list and start polling
      setDeployments((prev) => [newDep, ...prev]);
      startPolling(newDep.id);

      return newDep;
    } catch (err) {
      throw new Error(err.message || "Failed to create deployment");
    }
  }, []);

  // ==========================================
  // Polling logic
  // ==========================================

  const pollDeployment = useCallback(async (id) => {
    try {
      const updated = await fetchDeployment(id);
      setDeployments((prev) => prev.map((d) => (d.id === id ? updated : d)));

      // Stop polling if terminal status
      if (isTerminalStatus(updated.status)) {
        pollingIdsRef.current.delete(id);
        if (pollingIdsRef.current.size === 0 && pollingRef.current) {
          clearInterval(pollingRef.current);
          pollingRef.current = null;
        }
      }

      return updated;
    } catch {
      pollingIdsRef.current.delete(id);
    }
  }, [fetchDeployment]);

  const startPolling = useCallback((id) => {
    pollingIdsRef.current.add(id);

    if (!pollingRef.current) {
      pollingRef.current = setInterval(() => {
        const ids = Array.from(pollingIdsRef.current);
        if (ids.length === 0) {
          clearInterval(pollingRef.current);
          pollingRef.current = null;
          return;
        }
        ids.forEach((pid) => pollDeployment(pid));
      }, pollInterval);
    }
  }, [pollDeployment, pollInterval]);

  // ==========================================
  // Initial fetch
  // ==========================================

  useEffect(() => {
    fetchDeployments();
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    };
  }, [fetchDeployments]);

  // ==========================================
  // Refresh
  // ==========================================

  const refresh = useCallback(() => {
    setLoading(true);
    return fetchDeployments();
  }, [fetchDeployments]);

  return {
    deployments,
    loading,
    error,
    createDeployment,
    refresh,
    fetchDeployment,
  };
};
