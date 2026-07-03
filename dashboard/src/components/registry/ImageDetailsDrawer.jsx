import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";import { X, Tag, Download, Clock, Layers, Hash, HardDrive, Shield,
  Activity, Copy, Check, ChevronDown,
} from "lucide-react";
import RegistryStatusBadge from "./RegistryStatusBadge";
import { pullHistory } from "./registryData";

const ImageDetailsDrawer = ({ image, onClose }) => {
  const [copiedDigest, setCopiedDigest] = useState(null);
  const [tagSortKey, setTagSortKey] = useState("pushed");
  const [tagSortDir, setTagSortDir] = useState("desc");

  const toggleTagSort = (key) => {
    if (tagSortKey === key) setTagSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setTagSortKey(key); setTagSortDir("desc"); }
  };

  const sortedTags = useMemo(() => {
    if (!image) return [];
    return [...image.tags].sort((a, b) => {
      let cmp = 0;
      if (tagSortKey === "name") cmp = a.name.localeCompare(b.name);
      else if (tagSortKey === "size") {
        const aNum = parseFloat(a.size);
        const bNum = parseFloat(b.size);
        cmp = aNum - bNum;
      } else if (tagSortKey === "pulled") cmp = b.pullCount - a.pullCount;
      else if (tagSortKey === "pushed") cmp = a.sortDate - b.sortDate;
      return tagSortDir === "asc" ? cmp : -cmp;
    });
  }, [image, tagSortKey, tagSortDir]);

  const copyDigest = (digest) => {
    navigator.clipboard?.writeText(digest);
    setCopiedDigest(digest);
    setTimeout(() => setCopiedDigest(null), 2000);
  };

  const imagePulls = useMemo(() => {
    if (!image) return [];
    return pullHistory.filter((p) => p.image === image.name).slice(0, 10);
  }, [image]);

  if (!image) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="fixed inset-y-0 right-0 z-50 flex">
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          className="flex h-full w-full max-w-xl flex-col border-l border-slate-800 bg-slate-950 shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-600/10 text-emerald-400">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="M21 15l-5-5L5 21" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">{image.name}</h2>
                <p className="text-xs text-slate-400">{image.description}</p>
              </div>
            </div>
            <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white">
              <X size={20} />
            </button>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto">
            {/* Quick stats */}
            <div className="grid grid-cols-4 gap-px bg-slate-800">
              {[
                { icon: HardDrive, label: "Size", value: image.totalSize },
                { icon: Layers, label: "Layers", value: image.layers },
                { icon: Tag, label: "Tags", value: image.tags.length },
                { icon: Download, label: "Pulls", value: image.totalPulls.toLocaleString() },
              ].map((stat) => (
                <div key={stat.label} className="flex flex-col items-center gap-1 bg-slate-950 px-3 py-4">
                  <stat.icon size={14} className="text-slate-500" />
                  <span className="text-sm font-semibold text-white">{stat.value}</span>
                  <span className="text-[10px] text-slate-500">{stat.label}</span>
                </div>
              ))}
            </div>

            {/* Status & Security */}
            <div className="space-y-5 px-6 py-5">
              <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/50 px-4 py-3">
                <div className="flex items-center gap-3">
                  <Shield size={16} className="text-slate-500" />
                  <span className="text-sm text-slate-300">Security Scan</span>
                </div>
                <div className="flex items-center gap-2">
                  {image.vulnerabilities === null ? (
                    <span className="flex items-center gap-1.5 rounded-md bg-blue-500/10 px-2 py-0.5 text-xs text-blue-400">
                      <Activity size={12} />
                      Scanning...
                    </span>
                  ) : image.vulnerabilities === 0 ? (
                    <span className="flex items-center gap-1.5 rounded-md bg-green-500/10 px-2 py-0.5 text-xs text-green-400">
                      <Shield size={12} />
                      No vulnerabilities
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 rounded-md bg-red-500/10 px-2 py-0.5 text-xs text-red-400">
                      <Shield size={12} />
                      {image.vulnerabilities} vulnerabilities
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/50 px-4 py-3">
                <div className="flex items-center gap-3">
                  <Clock size={16} className="text-slate-500" />
                  <span className="text-sm text-slate-300">Last Pulled</span>
                </div>
                <span className="text-sm text-slate-400">{image.lastPulled}</span>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/50 px-4 py-3">
                <div className="flex items-center gap-3">
                  <Activity size={16} className="text-slate-500" />
                  <span className="text-sm text-slate-300">Status</span>
                </div>
                <RegistryStatusBadge status={image.status} />
              </div>
            </div>

            {/* Tags section */}
            <div className="border-t border-slate-800 px-6 py-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-white">
                  <Tag size={14} className="text-emerald-400" />
                  Tags ({image.tags.length})
                </h3>
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <span>Sort:</span>
                  {["name", "size", "pushed", "pulled"].map((key) => (
                    <button
                      key={key}
                      onClick={() => toggleTagSort(key)}
                      className={`rounded-md px-2 py-0.5 transition-colors ${
                        tagSortKey === key
                          ? "bg-slate-800 text-slate-200"
                          : "hover:text-slate-300"
                      }`}
                    >
                      {key === "pulled" ? "Pulls" : key.charAt(0).toUpperCase() + key.slice(1)}
                      {tagSortKey === key && (
                        <ChevronDown
                          size={10}
                          className={`ml-0.5 inline transition-transform ${
                            tagSortDir === "asc" ? "rotate-180" : ""
                          }`}
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                {sortedTags.map((tag) => (
                  <div
                    key={tag.name}
                    className="group flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/30 px-4 py-3 transition-colors hover:border-slate-700"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-600/10">
                        <Tag size={12} className="text-emerald-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-slate-200">{tag.name}</span>
                          {tag.name === "latest" && (
                            <span className="rounded bg-blue-500/10 px-1.5 py-0.5 text-[10px] text-blue-400">LATEST</span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-500">
                          <span>{tag.size}</span>
                          <span>{tag.os}</span>
                          <span>Pulled {tag.pullCount} times</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => copyDigest(tag.digest)}
                        className="rounded-lg p-1.5 text-slate-500 opacity-0 transition-all hover:bg-slate-800 hover:text-slate-200 group-hover:opacity-100"
                        title="Copy digest"
                      >
                        {copiedDigest === tag.digest ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                      </button>
                      <button
                        className="rounded-lg p-1.5 text-slate-500 opacity-0 transition-all hover:bg-slate-800 hover:text-slate-200 group-hover:opacity-100"
                        title="Pull tag"
                      >
                        <Download size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pull History */}
            {imagePulls.length > 0 && (
              <div className="border-t border-slate-800 px-6 py-4">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
                  <Download size={14} className="text-emerald-400" />
                  Recent Pulls
                </h3>
                <div className="space-y-1.5">
                  {imagePulls.map((pull) => (
                    <div
                      key={pull.id}
                      className="flex items-center justify-between rounded-lg px-3 py-2 text-xs text-slate-400 transition-colors hover:bg-slate-900/50"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500">{pull.pulled}</span>
                        <span className="text-slate-300">by {pull.by}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-slate-500">{pull.duration}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-slate-800 px-6 py-3">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Hash size={12} />
                {image.tags[0]?.digest || "No digest available"}
              </span>
              <span>Created {image.created}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ImageDetailsDrawer;
