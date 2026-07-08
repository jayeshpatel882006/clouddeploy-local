import { useState, useEffect, useCallback, useRef } from "react";
import { getRegistry } from "@/api/registry.api";

// ==========================================
// useRegistry — Hook for registry data
// ==========================================
//
// Fetches registry data once on mount, then only on manual refresh.
// No auto-polling.
//
// Architecture:
//   Component → useRegistry → registry.api → axios → backend
//
// ==========================================

export const useRegistry = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mountedRef = useRef(true);

  // ── Fetch from backend ──
  const fetchRegistry = useCallback(async () => {
    try {
      const response = await getRegistry();
      if (!mountedRef.current) return;

      const repositories = response.repositories || [];
      setData(repositories);
      setError(null);
      return repositories;
    } catch (err) {
      if (!mountedRef.current) return;
      setError(err.message || "Unable to load Container Registry.");
      return [];
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, []);

  // ── Fetch ONCE on mount ──
  useEffect(() => {
    mountedRef.current = true;
    setLoading(true);
    fetchRegistry();
    return () => { mountedRef.current = false; };
  }, [fetchRegistry]);

  // ── Manual refresh ──
  const refresh = useCallback(() => {
    setLoading(true);
    return fetchRegistry();
  }, [fetchRegistry]);

  return {
    repositories: data,
    loading,
    error,
    refresh,
  };
};

export default useRegistry;
