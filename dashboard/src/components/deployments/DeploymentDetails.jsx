import {
  Cpu,
  MemoryStick as MemoryIcon,
  Globe,
  Hash,
  Tag,
  Box,
  Clock,
  RefreshCw,
  Layers,
} from "lucide-react";
import StatusBadge from "./StatusBadge";

const DetailRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-center justify-between rounded-lg bg-slate-900/50 px-3.5 py-2.5">
    <div className="flex items-center gap-2.5">
      <div className="rounded-md bg-slate-800 p-1.5 text-slate-400">
        <Icon size={14} />
      </div>
      <span className="text-xs text-slate-500">{label}</span>
    </div>
    <span className="text-sm font-medium text-slate-200">{value}</span>
  </div>
);

const Section = ({ title, children }) => (
  <div className="space-y-2.5">
    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
      {title}
    </h4>
    {children}
  </div>
);

const DeploymentDetails = ({ deployment }) => {
  if (!deployment) return null;

  const pods = Array.from(
    { length: deployment.readyReplicas },
    (_, i) =>
      `${deployment.name}-${String.fromCharCode(97 + i)}-${Math.random().toString(36).slice(2, 6)}`
  );

  return (
    <div className="space-y-6">
      {/* Header info */}
      <div>
        <div className="flex items-center gap-2.5">
          <h3 className="text-lg font-semibold text-white">{deployment.name}</h3>
          <StatusBadge status={deployment.status} size="lg" />
        </div>
        <p className="mt-1 text-sm text-slate-500">{deployment.image}</p>
      </div>

      {/* Status bar */}
      <div className="flex items-center gap-4 rounded-lg border border-slate-800 bg-slate-900/30 px-4 py-3">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Clock size={13} />
          Created {deployment.created}
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <RefreshCw size={13} />
          Updated {deployment.updated}
        </div>
      </div>

      {/* Configuration */}
      <Section title="Configuration">
        <DetailRow icon={Hash} label="Port" value={deployment.port} />
        <DetailRow icon={Layers} label="Replicas" value={`${deployment.readyReplicas}/${deployment.replicas}`} />
        <DetailRow icon={Box} label="Namespace" value={deployment.namespace} />
        <DetailRow icon={Tag} label="Environment Variables" value={`${deployment.env} vars`} />
      </Section>

      {/* Resources */}
      <Section title="Resource Usage">
        <DetailRow icon={Cpu} label="CPU" value={deployment.cpu} />
        <DetailRow icon={MemoryIcon} label="Memory" value={deployment.memory} />
      </Section>

      {/* Pods */}
      <Section title={`Running Pods (${deployment.readyReplicas})`}>
        <div className="space-y-1.5">
          {pods.map((pod) => (
            <div
              key={pod}
              className="flex items-center gap-2.5 rounded-lg border border-slate-800 bg-slate-900/30 px-3.5 py-2"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.5)]" />
              <span className="text-xs text-slate-300 font-mono">{pod}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* Labels */}
      <Section title="Labels">
        <div className="flex flex-wrap gap-1.5">
          {Object.entries(deployment.labels || {}).map(([key, val]) => (
            <span
              key={key}
              className="inline-flex items-center gap-1 rounded-md bg-slate-800 px-2 py-1 text-xs text-slate-400"
            >
              <Tag size={11} />
              {key}: {val}
            </span>
          ))}
        </div>
      </Section>
    </div>
  );
};

export default DeploymentDetails;
