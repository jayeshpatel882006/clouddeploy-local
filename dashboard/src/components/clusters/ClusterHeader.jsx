import { motion } from "framer-motion";
import { Boxes, Server, Layers, Container, Globe, Copy, AlignJustify, LayoutList, Network, ArrowRightLeft, HardDrive, Disc, FileJson, Key, Activity } from "lucide-react";

export const clusterTabs = [
  { id: "overview", label: "Overview", icon: Boxes },
  { id: "nodes", label: "Nodes", icon: Server },
  { id: "namespaces", label: "Namespaces", icon: Layers },
  { id: "pods", label: "Pods", icon: Container },
  { id: "deployments", label: "Deployments", icon: Globe },
  { id: "replicasets", label: "ReplicaSets", icon: Copy },
  { id: "daemonsets", label: "DaemonSets", icon: AlignJustify },
  { id: "statefulsets", label: "StatefulSets", icon: LayoutList },
  { id: "services", label: "Services", icon: Network },
  { id: "ingress", label: "Ingress", icon: ArrowRightLeft },
  { id: "persistentvolumes", label: "PVs", icon: HardDrive },
  { id: "persistentvolumeclaims", label: "PVCs", icon: Disc },
  { id: "configmaps", label: "ConfigMaps", icon: FileJson },
  { id: "secrets", label: "Secrets", icon: Key },
  { id: "events", label: "Events", icon: Activity },
];

const ClusterHeader = ({ activeTab, onTabChange }) => {
  return (
    <div>
      <div className="flex items-start gap-3 mb-5">
        <div className="rounded-lg bg-purple-600/10 p-2.5">
          <Boxes size={24} className="text-purple-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Clusters</h1>
          <p className="mt-0.5 text-sm text-slate-400">
            Manage Kubernetes cluster resources
          </p>
        </div>
      </div>

      {/* Scrollable tabs */}
      <div className="relative">
        <div className="flex overflow-x-auto gap-1 pb-1 scrollbar-thin scrollbar-track-slate-900 scrollbar-thumb-slate-700">
          {clusterTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`relative flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                  isActive
                    ? "bg-purple-600/15 text-purple-300"
                    : "text-slate-500 hover:bg-slate-800 hover:text-slate-300"
                }`}
              >
                <Icon size={14} />
                {tab.label}
                {isActive && (
                  <motion.div
                    layoutId="cluster-tab-indicator"
                    className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-purple-500"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>
        <div className="mt-2 h-px bg-slate-800" />
      </div>
    </div>
  );
};

export default ClusterHeader;
