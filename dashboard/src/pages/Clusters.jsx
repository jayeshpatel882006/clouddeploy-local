import { useState } from "react";
import StatusBadge from "@/components/deployments/StatusBadge";
import ClusterHeader from "@/components/clusters/ClusterHeader";
import ClusterOverview from "@/components/clusters/ClusterOverview";
import K8sTable from "@/components/clusters/K8sTable";
import {
  nodes, namespaces, pods, clusterDeployments, replicaSets,
  daemonSets, statefulSets, services, ingresses,
  persistentVolumes, persistentVolumeClaims, configMaps, secrets, events,
} from "@/components/clusters/clusterData";

// ─── Namespace badge ────────────────────────
const nsColors = {
  production: "bg-blue-600/10 text-blue-400 border-blue-500/20",
  staging: "bg-purple-600/10 text-purple-400 border-purple-500/20",
  default: "bg-slate-600/10 text-slate-400 border-slate-500/20",
  development: "bg-cyan-600/10 text-cyan-400 border-cyan-500/20",
  "kube-system": "bg-yellow-600/10 text-yellow-400 border-yellow-500/20",
  monitoring: "bg-emerald-600/10 text-emerald-400 border-emerald-500/20",
  logging: "bg-orange-600/10 text-orange-400 border-orange-500/20",
};
const NsBadge = ({ ns }) => (
  <span className={`inline-block rounded-md border px-2 py-0.5 text-xs font-medium ${nsColors[ns] || nsColors.default}`}>
    {ns}
  </span>
);

// ─── Type badge for events ──────────────────
const typeStyles = {
  Normal: "bg-green-500/10 text-green-400 border-green-500/20",
  Warning: "bg-red-500/10 text-red-400 border-red-500/20",
};
const TypeBadge = ({ type }) => (
  <span className={`inline-block rounded-md border px-2 py-0.5 text-xs font-medium ${typeStyles[type] || typeStyles.Normal}`}>
    {type}
  </span>
);

// ─── Column configs for each resource ───────
const configs = {
  nodes: {
    data: nodes,
    columns: [
      { key: "name", label: "Name", sortable: true, width: "min-w-[160px] flex-1", render: (n) => <span className="font-medium text-slate-200">{n.name}</span> },
      { key: "status", label: "Status", sortable: true, width: "w-24", render: (n) => <StatusBadge status={n.status} /> },
      { key: "role", label: "Role", width: "w-24" },
      { key: "cpu", label: "CPU", sortable: true, width: "w-24", render: (n) => <><span className="text-slate-300">{n.cpuUsed}</span><span className="text-slate-500">/{n.cpuTotal}</span> cores</> },
      { key: "memory", label: "Memory", sortable: true, width: "w-28", render: (n) => <><span className="text-slate-300">{n.memoryUsed}GB</span><span className="text-slate-500">/{n.memoryTotal}GB</span></> },
      { key: "pods", label: "Pods", sortable: true, width: "w-20", render: (n) => <span className="text-slate-300">{n.pods}/{n.podsCapacity}</span> },
      { key: "age", label: "Age", width: "w-16", render: (n) => <span className="text-slate-500">{n.age}</span> },
    ],
    searchFields: ["name", "role", "internalIP"],
    placeholder: "Search nodes...",
  },
  namespaces: {
    data: namespaces,
    columns: [
      { key: "name", label: "Name", sortable: true, width: "flex-1 min-w-[160px]", render: (n) => <span className="font-medium text-slate-200">{n.name}</span> },
      { key: "status", label: "Status", sortable: true, width: "w-24", render: (n) => <StatusBadge status={n.status} /> },
      { key: "pods", label: "Pods", sortable: true, width: "w-16", render: (n) => <span className="text-slate-300">{n.pods}</span> },
      { key: "age", label: "Age", width: "w-16", render: (n) => <span className="text-slate-500">{n.age}</span> },
    ],
    placeholder: "Search namespaces...",
  },
  pods: {
    data: pods,
    columns: [
      { key: "name", label: "Name", sortable: true, width: "min-w-[200px] flex-1", render: (p) => <span className="font-medium text-slate-200 font-mono text-xs">{p.name}</span> },
      { key: "namespace", label: "Namespace", width: "w-28", render: (p) => <NsBadge ns={p.namespace} /> },
      { key: "status", label: "Status", sortable: true, width: "w-28", render: (p) => <StatusBadge status={p.status} /> },
      { key: "node", label: "Node", width: "w-24", render: (p) => <span className="text-slate-400">{p.node}</span> },
      { key: "cpu", label: "CPU", width: "w-16", render: (p) => <span className="text-slate-300">{p.cpu}</span> },
      { key: "memory", label: "Memory", width: "w-20", render: (p) => <span className="text-slate-300">{p.memory}</span> },
      { key: "restarts", label: "Restarts", sortable: true, width: "w-16", render: (p) => <span className={p.restarts > 5 ? "text-red-400" : "text-slate-400"}>{p.restarts}</span> },
      { key: "age", label: "Age", width: "w-16", render: (p) => <span className="text-slate-500">{p.age}</span> },
    ],
    searchFields: ["name", "namespace", "node"],
    placeholder: "Search pods...",
  },
  deployments: {
    data: clusterDeployments,
    columns: [
      { key: "name", label: "Name", sortable: true, width: "min-w-[160px] flex-1", render: (d) => <span className="font-medium text-slate-200">{d.name}</span> },
      { key: "namespace", label: "Namespace", width: "w-28", render: (d) => <NsBadge ns={d.namespace} /> },
      { key: "replicas", label: "Replicas", width: "w-24", render: (d) => <span className="text-slate-300">{d.available}/{d.replicas}</span> },
      { key: "status", label: "Status", sortable: true, width: "w-24", render: (d) => <StatusBadge status={d.status} /> },
      { key: "age", label: "Age", width: "w-16", render: (d) => <span className="text-slate-500">{d.age}</span> },
    ],
    searchFields: ["name", "namespace"],
    placeholder: "Search deployments...",
  },
  replicasets: {
    data: replicaSets,
    columns: [
      { key: "name", label: "Name", sortable: true, width: "min-w-[180px] flex-1", render: (r) => <span className="font-medium text-slate-200 font-mono text-xs">{r.name}</span> },
      { key: "namespace", label: "Namespace", width: "w-28", render: (r) => <NsBadge ns={r.namespace} /> },
      { key: "desired", label: "Desired", sortable: true, width: "w-16", render: (r) => <span className="text-slate-300">{r.desired}</span> },
      { key: "current", label: "Current", sortable: true, width: "w-16", render: (r) => <span className="text-slate-300">{r.current}</span> },
      { key: "ready", label: "Ready", sortable: true, width: "w-16", render: (r) => <span className="text-slate-300">{r.ready}</span> },
      { key: "age", label: "Age", width: "w-16", render: (r) => <span className="text-slate-500">{r.age}</span> },
    ],
    searchFields: ["name", "namespace"],
    placeholder: "Search ReplicaSets...",
  },
  daemonsets: {
    data: daemonSets,
    columns: [
      { key: "name", label: "Name", sortable: true, width: "min-w-[160px] flex-1", render: (d) => <span className="font-medium text-slate-200">{d.name}</span> },
      { key: "namespace", label: "Namespace", width: "w-28", render: (d) => <NsBadge ns={d.namespace} /> },
      { key: "desired", label: "Desired", sortable: true, width: "w-16" },
      { key: "current", label: "Current", sortable: true, width: "w-16" },
      { key: "ready", label: "Ready", sortable: true, width: "w-16" },
      { key: "available", label: "Available", sortable: true, width: "w-16" },
      { key: "age", label: "Age", width: "w-16", render: (d) => <span className="text-slate-500">{d.age}</span> },
    ],
    searchFields: ["name", "namespace"],
    placeholder: "Search DaemonSets...",
  },
  statefulsets: {
    data: statefulSets,
    columns: [
      { key: "name", label: "Name", sortable: true, width: "min-w-[160px] flex-1", render: (s) => <span className="font-medium text-slate-200">{s.name}</span> },
      { key: "namespace", label: "Namespace", width: "w-28", render: (s) => <NsBadge ns={s.namespace} /> },
      { key: "replicas", label: "Replicas", sortable: true, width: "w-20", render: (s) => <span className="text-slate-300">{s.ready}/{s.replicas}</span> },
      { key: "status", label: "Status", sortable: true, width: "w-24", render: (s) => <StatusBadge status={s.status} /> },
      { key: "storage", label: "Storage", width: "w-20", render: (s) => <span className="text-slate-400">{s.storage}</span> },
      { key: "age", label: "Age", width: "w-16", render: (s) => <span className="text-slate-500">{s.age}</span> },
    ],
    searchFields: ["name", "namespace"],
    placeholder: "Search StatefulSets...",
  },
  services: {
    data: services,
    columns: [
      { key: "name", label: "Name", sortable: true, width: "min-w-[140px] flex-1", render: (s) => <span className="font-medium text-slate-200">{s.name}</span> },
      { key: "namespace", label: "Namespace", width: "w-28", render: (s) => <NsBadge ns={s.namespace} /> },
      { key: "type", label: "Type", sortable: true, width: "w-24", render: (s) => <span className="text-slate-300">{s.type}</span> },
      { key: "clusterIP", label: "Cluster IP", width: "w-28", render: (s) => <span className="text-slate-400 font-mono text-xs">{s.clusterIP}</span> },
      { key: "ports", label: "Ports", width: "min-w-[140px]", render: (s) => <span className="text-slate-400 text-xs">{s.ports}</span> },
      { key: "age", label: "Age", width: "w-16", render: (s) => <span className="text-slate-500">{s.age}</span> },
    ],
    searchFields: ["name", "namespace", "type", "clusterIP"],
    placeholder: "Search services...",
  },
  ingress: {
    data: ingresses,
    columns: [
      { key: "name", label: "Name", sortable: true, width: "min-w-[160px] flex-1", render: (i) => <span className="font-medium text-slate-200">{i.name}</span> },
      { key: "namespace", label: "Namespace", width: "w-28", render: (i) => <NsBadge ns={i.namespace} /> },
      { key: "hosts", label: "Hosts", width: "min-w-[180px]", render: (i) => <span className="text-slate-300 text-xs font-mono">{i.hosts}</span> },
      { key: "addresses", label: "Address", width: "w-32", render: (i) => <span className="text-slate-400 text-xs">{i.addresses}</span> },
      { key: "tls", label: "TLS", width: "w-28", render: (i) => <span className={`${i.tls === "-" ? "text-slate-600" : "text-slate-300"} text-xs`}>{i.tls}</span> },
      { key: "age", label: "Age", width: "w-16", render: (i) => <span className="text-slate-500">{i.age}</span> },
    ],
    searchFields: ["name", "hosts", "namespace"],
    placeholder: "Search ingress...",
  },
  persistentvolumes: {
    data: persistentVolumes,
    columns: [
      { key: "name", label: "Name", sortable: true, width: "min-w-[160px] flex-1", render: (p) => <span className="font-medium text-slate-200 font-mono text-xs">{p.name}</span> },
      { key: "capacity", label: "Capacity", sortable: true, width: "w-20", render: (p) => <span className="text-slate-300">{p.capacity}</span> },
      { key: "accessModes", label: "Access", width: "w-16", render: (p) => <span className="text-slate-400 text-xs">{p.accessModes}</span> },
      { key: "reclaim", label: "Reclaim", width: "w-16", render: (p) => <span className="text-slate-400 text-xs">{p.reclaim}</span> },
      { key: "status", label: "Status", sortable: true, width: "w-20", render: (p) => <StatusBadge status={p.status} /> },
      { key: "storageClass", label: "Storage Class", width: "w-24", render: (p) => <span className="text-slate-400 text-xs">{p.storageClass}</span> },
      { key: "claim", label: "Claim", width: "min-w-[140px]", render: (p) => <span className="text-slate-500 text-xs">{p.claim}</span> },
      { key: "age", label: "Age", width: "w-16", render: (p) => <span className="text-slate-500">{p.age}</span> },
    ],
    searchFields: ["name", "storageClass", "status", "claim"],
    placeholder: "Search PVs...",
  },
  persistentvolumeclaims: {
    data: persistentVolumeClaims,
    columns: [
      { key: "name", label: "Name", sortable: true, width: "min-w-[160px] flex-1", render: (p) => <span className="font-medium text-slate-200">{p.name}</span> },
      { key: "namespace", label: "Namespace", width: "w-28", render: (p) => <NsBadge ns={p.namespace} /> },
      { key: "status", label: "Status", sortable: true, width: "w-20", render: (p) => <StatusBadge status={p.status} /> },
      { key: "volume", label: "Volume", width: "min-w-[140px]", render: (p) => <span className="text-slate-400 text-xs font-mono">{p.volume}</span> },
      { key: "capacity", label: "Capacity", sortable: true, width: "w-20", render: (p) => <span className="text-slate-300">{p.capacity}</span> },
      { key: "storageClass", label: "Storage Class", width: "w-24", render: (p) => <span className="text-slate-400 text-xs">{p.storageClass}</span> },
      { key: "age", label: "Age", width: "w-16", render: (p) => <span className="text-slate-500">{p.age}</span> },
    ],
    searchFields: ["name", "namespace", "status", "volume"],
    placeholder: "Search PVCs...",
  },
  configmaps: {
    data: configMaps,
    columns: [
      { key: "name", label: "Name", sortable: true, width: "min-w-[160px] flex-1", render: (c) => <span className="font-medium text-slate-200">{c.name}</span> },
      { key: "namespace", label: "Namespace", width: "w-28", render: (c) => <NsBadge ns={c.namespace} /> },
      { key: "data", label: "Data", sortable: true, width: "w-16", render: (c) => <span className="text-slate-300">{c.data} keys</span> },
      { key: "age", label: "Age", width: "w-16", render: (c) => <span className="text-slate-500">{c.age}</span> },
    ],
    searchFields: ["name", "namespace"],
    placeholder: "Search ConfigMaps...",
  },
  secrets: {
    data: secrets,
    columns: [
      { key: "name", label: "Name", sortable: true, width: "min-w-[160px] flex-1", render: (s) => <span className="font-medium text-slate-200">{s.name}</span> },
      { key: "namespace", label: "Namespace", width: "w-28", render: (s) => <NsBadge ns={s.namespace} /> },
      { key: "type", label: "Type", sortable: true, width: "min-w-[180px]", render: (s) => <span className="text-slate-400 text-xs font-mono">{s.type}</span> },
      { key: "data", label: "Data", sortable: true, width: "w-16", render: (s) => <span className="text-slate-300">{s.data} keys</span> },
      { key: "age", label: "Age", width: "w-16", render: (s) => <span className="text-slate-500">{s.age}</span> },
    ],
    searchFields: ["name", "namespace", "type"],
    placeholder: "Search secrets...",
  },
  events: {
    data: events,
    columns: [
      { key: "namespace", label: "Namespace", width: "w-28", render: (e) => <NsBadge ns={e.namespace} /> },
      { key: "type", label: "Type", sortable: true, width: "w-20", render: (e) => <TypeBadge type={e.type} /> },
      { key: "reason", label: "Reason", sortable: true, width: "w-28", render: (e) => <span className="font-medium text-slate-300 text-xs">{e.reason}</span> },
      { key: "message", label: "Message", width: "min-w-[300px] flex-1", render: (e) => <span className="text-slate-400 text-xs">{e.message}</span> },
      { key: "count", label: "Count", sortable: true, width: "w-12", render: (e) => <span className="text-slate-300">{e.count}</span> },
      { key: "lastSeen", label: "Last Seen", width: "w-20", render: (e) => <span className="text-slate-500 text-xs">{e.lastSeen}</span> },
    ],
    searchFields: ["namespace", "reason", "message", "source"],
    placeholder: "Search events...",
  },
};

const Clusters = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [search, setSearch] = useState("");

  const tab = configs[activeTab];

  return (
    <div className="space-y-6">
      <ClusterHeader activeTab={activeTab} onTabChange={(t) => { setActiveTab(t); setSearch(""); }} />

      {activeTab === "overview" ? (
        <ClusterOverview />
      ) : tab ? (
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white capitalize">
              {activeTab.replace(/([a-z])([A-Z])/g, "$1 $2")}
            </h2>
            <span className="text-xs text-slate-500">{tab.data.length} items</span>
          </div>
          <K8sTable
            key={activeTab}
            columns={tab.columns}
            data={tab.data}
            search={search}
            onSearchChange={setSearch}
            searchPlaceholder={tab.placeholder}
            searchFields={tab.searchFields}
          />
        </div>
      ) : null}
    </div>
  );
};

export default Clusters;
