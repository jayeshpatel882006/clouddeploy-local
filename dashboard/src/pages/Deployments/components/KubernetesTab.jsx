import { useState, useEffect, useRef } from "react";
import {
  Box,
  Layers,
  Globe,
  Loader2,
  AlertCircle,
  Server,
  Hash,
  Activity,
  ExternalLink,
} from "lucide-react";
import { getKubernetesInfo } from "@/api/deploymentDetails.api";
import DeploymentStatusBadge from "./DeploymentStatusBadge";

const K8sRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-center justify-between rounded-lg bg-slate-900/50 px-3.5 py-2.5">
    <div className="flex items-center gap-2.5">
      <div className="rounded-md bg-slate-800 p-1.5 text-slate-400">
        <Icon size={14} />
      </div>
      <span className="text-xs text-slate-500">{label}</span>
    </div>
    <span className="text-sm font-medium text-slate-200 truncate max-w-[200px] text-right">
      {value ?? "—"}
    </span>
  </div>
);

const SectionTitle = ({ children }) => (
  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2.5">
    {children}
  </h4>
);

const PodStatusBadge = ({ phase }) => {
  const colorMap = {
    Running: "bg-green-500/10 text-green-400 border-green-500/20",
    Pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    Failed: "bg-red-500/10 text-red-400 border-red-500/20",
    Succeeded: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    Unknown: "bg-slate-500/10 text-slate-400 border-slate-500/20",
  };
  const style = colorMap[phase] || colorMap.Unknown;
  return (
    <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${style}`}>
      {phase || "Unknown"}
    </span>
  );
};

const KubernetesTab = ({ deployment, onError }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mountedRef = useRef(true);

  const projectName = deployment?.projectName || (deployment && deployment.name);

  useEffect(() => {
    mountedRef.current = true;

    const fetchK8s = async () => {
      if (!projectName) {
        setLoading(false);
        setError("No project name available");
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const result = await getKubernetesInfo(projectName);
        if (mountedRef.current) {
          setData(result);
        }
      } catch (err) {
        if (mountedRef.current) {
          const msg = err.message || "Failed to load Kubernetes info";
          setError(msg);
          onError?.(msg);
        }
      } finally {
        if (mountedRef.current) setLoading(false);
      }
    };

    fetchK8s();

    return () => {
      mountedRef.current = false;
    };
  }, [projectName, onError]);

  // ── Loading state ──
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 size={20} className="animate-spin text-slate-400" />
        <span className="ml-2.5 text-sm text-slate-500">Loading Kubernetes info...</span>
      </div>
    );
  }

  // ── Error state ──
  if (error) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-8">
        <AlertCircle size={24} className="text-red-400" />
        <p className="text-sm text-red-400">{error}</p>
        <p className="text-xs text-slate-500">Kubernetes resources may not exist for this deployment.</p>
      </div>
    );
  }

  // ── Empty state ──
  if (!data) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-lg border border-slate-700 bg-slate-900/30 px-4 py-8">
        <Server size={24} className="text-slate-600" />
        <p className="text-sm text-slate-500">No Kubernetes resources found</p>
        <p className="text-xs text-slate-600">This may happen if the deployment is still being created or has failed.</p>
      </div>
    );
  }

  const k8s = data.data || data;

  // ── Deployment section ──
  const k8sDeployment = k8s.deployment || k8s.kubernetesDeployment;
  const pods = k8s.pods || [];
  const service = k8s.service || k8s.kubernetesService;

  return (
    <div className="space-y-5">
      {/* K8s Deployment Info */}
      {k8sDeployment && (
        <div>
          <SectionTitle>Deployment</SectionTitle>
          <div className="space-y-2">
            <K8sRow icon={Box} label="Name" value={k8sDeployment.name || k8sDeployment.metadata?.name} />
            <K8sRow icon={Box} label="Namespace" value={k8sDeployment.namespace || k8sDeployment.metadata?.namespace || "default"} />
            {k8sDeployment.replicas !== undefined && (
              <K8sRow icon={Layers} label="Replicas" value={String(k8sDeployment.replicas)} />
            )}
            {k8sDeployment.readyReplicas !== undefined && (
              <K8sRow icon={Activity} label="Ready Replicas" value={String(k8sDeployment.readyReplicas)} />
            )}
            {k8sDeployment.availableReplicas !== undefined && (
              <K8sRow icon={Activity} label="Available Replicas" value={String(k8sDeployment.availableReplicas)} />
            )}
          </div>
        </div>
      )}

      {/* Pods */}
      {pods.length > 0 && (
        <div>
          <SectionTitle>Pods ({pods.length})</SectionTitle>
          <div className="space-y-2">
            {pods.map((pod, idx) => (
              <div
                key={pod.name || idx}
                className="rounded-lg border border-slate-800 bg-slate-900/30 px-3.5 py-3"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-200 font-mono text-xs truncate max-w-[200px]">
                    {pod.name}
                  </span>
                  <PodStatusBadge phase={pod.phase || pod.status} />
                </div>
                <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                  {pod.node && <span>Node: {pod.node}</span>}
                  {pod.restartCount !== undefined && (
                    <span className={pod.restartCount > 5 ? "text-red-400" : ""}>
                      Restarts: {pod.restartCount}
                    </span>
                  )}
                  {pod.ready !== undefined && <span>Ready: {String(pod.ready)}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Service Info */}
      {service && (
        <div>
          <SectionTitle>Service</SectionTitle>
          <div className="space-y-2">
            <K8sRow icon={Globe} label="Name" value={service.name || service.metadata?.name} />
            <K8sRow icon={Hash} label="Type" value={service.type || service.spec?.type || "ClusterIP"} />
            {service.clusterIP && (
              <K8sRow icon={Globe} label="Cluster IP" value={service.clusterIP} />
            )}
            {service.nodePort && (
              <K8sRow icon={ExternalLink} label="Node Port" value={String(service.nodePort)} />
            )}
            {service.port && (
              <K8sRow icon={ExternalLink} label="Port" value={String(service.port)} />
            )}
            {service.previewUrl && (
              <a
                href={service.previewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-lg bg-green-600/10 mt-3 px-4 py-2.5 text-sm font-medium text-green-400 transition-colors hover:bg-green-600/20 border border-green-500/20"
              >
                <ExternalLink size={16} />
                Open Preview URL
              </a>
            )}
          </div>
        </div>
      )}

      {/* No K8s resources found message */}
      {!k8sDeployment && pods.length === 0 && !service && (
        <div className="flex flex-col items-center gap-3 rounded-lg border border-slate-700 bg-slate-900/30 px-4 py-8">
          <Server size={24} className="text-slate-600" />
          <p className="text-sm text-slate-500">No Kubernetes resources found</p>
          <p className="text-xs text-slate-600">
            The deployment may have failed before creating Kubernetes resources.
          </p>
        </div>
      )}
    </div>
  );
};

export default KubernetesTab;
