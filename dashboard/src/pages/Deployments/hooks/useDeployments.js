import { useState, useEffect, useCallback, useRef } from "react";
import * as deploymentApi from "@/api/deployment.api";
import { transformDeployments, transformDeployment, calculateStats } from "@/services/deployment.service";
import { isTerminalStatus } from "@/utils/status";

const useDeployments = ({ pollInterval = 2000 } = {}) => {
  const [deployments, setDeployments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const pollingRef = useRef(null);
  const pollingIdsRef = useRef(new Set());

  // ── Fetch all deployments ──────────────────────────────────
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

  // ── Fetch single deployment ─────────────────────────────────
  const fetchDeployment = useCallback(async (id) => {
    const response = await deploymentApi.getDeployment(id);
    return transformDeployment(response.data);
  }, []);

  // ── Create deployment ───────────────────────────────────────
  const createDeployment = useCallback(async (repositoryUrl, branch = "main") => {
    const response = await deploymentApi.createDeployment({ repositoryUrl, branch });
    const newDep = transformDeployment(response.data?.deployment);
    setDeployments((prev) => [newDep, ...prev]);
    startPolling(newDep.id);
    return newDep;
  }, []);

  // ── Delete deployment ───────────────────────────────────────
  const deleteDeployment = useCallback(async (id) => {
    await deploymentApi.deleteDeployment(id);
    setDeployments((prev) => prev.filter((d) => d.id !== id));
    return true;
  }, []);

  // ── Polling ─────────────────────────────────────────────────
  const pollDeployment = useCallback(async (id) => {
    try {
      const updated = await fetchDeployment(id);
      setDeployments((prev) => prev.map((d) => (d.id === id ? updated : d)));
      if (isTerminalStatus(updated.status)) {
        pollingIdsRef.current.delete(id);
        if (pollingIdsRef.current.size === 0 && pollingRef.current) {
          clearInterval(pollingRef.current);
          pollingRef.current = null;
        }
      }
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

  // ── Initial load ────────────────────────────────────────────
  useEffect(() => {
    fetchDeployments();
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    };
  }, [fetchDeployments]);

  // ── Refresh ─────────────────────────────────────────────────
  const refresh = useCallback(() => {
    setLoading(true);
    return fetchDeployments();
  }, [fetchDeployments]);

  // ── Derived stats ───────────────────────────────────────────
  const stats = calculateStats(deployments);

  return {
    deployments,
    stats,
    loading,
    error,
    createDeployment,
    deleteDeployment,
    refresh,
    fetchDeployment,
  };
};

export default useDeployments;
