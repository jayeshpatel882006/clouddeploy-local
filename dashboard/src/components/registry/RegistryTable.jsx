import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  Tag,
  HardDrive,
  Clock,
  Hash,
  Copy,
  Eye,
  Trash2,
  Image,
  Layers,
  Search,
  RefreshCw,
  HelpCircle,
} from "lucide-react";
import Skeleton from "@/components/ui/Skeleton";
import {
  formatBytes,
  shortenImageId,
  formatDate,
  formatShortDate,
  formatRelativeTime,
} from "@/utils/format";

// ─── Repository Card ──
const RepositoryCard = ({
  repo,
  onCopyImage,
  onView,
  onDelete,
  sortKey,
  sortDir,
  timezone,
}) => {
  const [expanded, setExpanded] = useState(false);

  // Sort images within the repo
  const sortedImages = useMemo(() => {
    if (!repo.images?.length) return [];
    const imgs = [...repo.images];
    imgs.sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case "tag":
          cmp = (a.tag || "").localeCompare(b.tag || "");
          break;
        case "created":
          cmp = new Date(a.created || 0) - new Date(b.created || 0);
          break;
        case "size":
          cmp = (a.size || 0) - (b.size || 0);
          break;
        default:
          cmp = (a.tag || "").localeCompare(b.tag || "");
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
    return imgs;
  }, [repo.images, sortKey, sortDir]);

  const totalImages = repo.images?.length || 0;

  return (
    <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950 shadow-sm transition-all duration-200">
      {/* Card header — clickable to expand */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-slate-900/50"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--accent-bg)] text-[var(--accent)]">
            <Image size={18} />
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold text-white">
              {repo.repository}
            </h3>
            <p className="text-xs text-slate-500">
              {totalImages} image{totalImages !== 1 ? "s" : ""}
              {totalImages > 0 && (
                <span className="ml-2 text-slate-600">
                  — {formatBytes(sortedImages[0]?.size)} each
                </span>
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="rounded-md bg-slate-800 px-2 py-0.5 text-xs font-medium text-slate-400">
            {totalImages}
          </span>
          {expanded ? (
            <ChevronUp size={18} className="text-slate-500" />
          ) : (
            <ChevronDown size={18} className="text-slate-500" />
          )}
        </div>
      </button>

      {/* Expanded image list */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="border-t border-slate-800">
              {sortedImages.length === 0 ? (
                <div className="px-5 py-8 text-center text-sm text-slate-500">
                  No images in this repository
                </div>
              ) : (
                <div className="divide-y divide-slate-800/40">
                  {sortedImages.map((image, idx) => (
                    <div
                      key={`${image.tag}-${idx}`}
                      className="group px-5 py-3.5 transition-colors hover:bg-slate-900/30"
                    >
                      <div className="flex items-start justify-between gap-4">
                        {/* Left: Image details */}
                        <div className="min-w-0 flex-1 space-y-2">
                          {/* Tag + Image name row */}
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <span className="inline-flex items-center gap-1.5 rounded-md bg-[var(--accent-bg)] px-2 py-0.5 text-xs font-medium text-[var(--accent)]">
                              <Tag size={11} />
                              {image.tag || "latest"}
                            </span>
                            <code className="text-xs text-slate-400 font-mono truncate max-w-[300px]">
                              {image.image || `${repo.repository}:${image.tag}`}
                            </code>
                          </div>

                          {/* Metadata grid */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-1.5">
                            {/* Image ID */}
                            <div
                              className="flex items-center gap-1.5 text-xs text-slate-500"
                              title={image.imageId || ""}
                            >
                              <Hash size={11} className="shrink-0" />
                              <span className="truncate font-mono">
                                {shortenImageId(image.imageId)}
                              </span>
                            </div>

                            {/* Created date */}
                            <div className="flex items-center gap-1.5 text-xs text-slate-500">
                              <Clock size={11} className="shrink-0" />
                              <span>
                                {formatShortDate(image.created, timezone)}
                              </span>
                            </div>

                            {/* Size */}
                            <div className="flex items-center gap-1.5 text-xs text-slate-500">
                              <HardDrive size={11} className="shrink-0" />
                              <span>{formatBytes(image.size)}</span>
                            </div>

                            {/* Full Image ID (shown on hover/tooltip) */}
                            <div className="flex items-center gap-1.5 text-xs text-slate-500">
                              <Layers size={11} className="shrink-0" />
                              <span
                                className="truncate"
                                title={image.imageId || ""}
                              >
                                {image.imageId
                                  ? `sha256:${shortenImageId(image.imageId, 12)}`
                                  : "—"}
                              </span>
                            </div>
                          </div>

                          {/* Future fields — reserved layout slots (hidden until backend provides data) */}
                          <div className="hidden group-data-[has-details]:flex gap-x-4 gap-y-1 pt-1 text-[11px] text-slate-600">
                            {image.deployment && (
                              <span>Deployment: {image.deployment}</span>
                            )}
                            {image.namespace && (
                              <span>Namespace: {image.namespace}</span>
                            )}
                            {image.status && (
                              <span>Status: {image.status}</span>
                            )}
                            {image.previewUrl && (
                              <span>URL: {image.previewUrl}</span>
                            )}
                            {image.digest && (
                              <span className="font-mono" title={image.digest}>
                                Digest: {shortenImageId(image.digest, 12)}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Right: Actions */}
                        <div className="flex shrink-0 items-center gap-0.5 pt-0.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onCopyImage(
                                image.image ||
                                  `${repo.repository}:${image.tag}`,
                              );
                            }}
                            className="rounded-lg p-1.5 text-slate-500 opacity-0 transition-all hover:bg-slate-800 hover:text-slate-200 group-hover:opacity-100"
                            title="Copy image name"
                          >
                            <Copy size={14} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onView(image);
                            }}
                            className="rounded-lg p-1.5 text-slate-500 opacity-0 transition-all hover:bg-slate-800 hover:text-slate-200 group-hover:opacity-100"
                            title="View details (coming soon)"
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDelete(image);
                            }}
                            className="rounded-lg p-1.5 text-slate-500 opacity-0 transition-all hover:bg-red-900/30 hover:text-red-400 group-hover:opacity-100"
                            title="Delete image (coming soon)"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Sort controls ──
const SortControls = ({ sortKey, sortDir, onSort }) => {
  const options = [
    { key: "name", label: "Repository" },
    { key: "tag", label: "Tag" },
    { key: "created", label: "Created" },
    { key: "size", label: "Size" },
  ];

  return (
    <div className="flex items-center gap-1.5 text-xs text-slate-500">
      <span>Sort:</span>
      {options.map((opt) => (
        <button
          key={opt.key}
          onClick={() => onSort(opt.key)}
          className={`flex items-center gap-0.5 rounded-md px-2 py-0.5 transition-colors ${
            sortKey === opt.key
              ? "bg-slate-800 text-slate-200"
              : "hover:text-slate-300"
          }`}
        >
          {opt.label}
          {sortKey === opt.key && (
            <ChevronDown
              size={10}
              className={`transition-transform ${sortDir === "asc" ? "rotate-180" : ""}`}
            />
          )}
        </button>
      ))}
    </div>
  );
};

// ─── Loading skeletons ──
const LoadingState = () => (
  <div className="space-y-4">
    {[1, 2, 3].map((i) => (
      <div
        key={i}
        className="rounded-xl border border-slate-800 bg-slate-950 p-5"
      >
        <div className="flex items-center gap-3">
          <Skeleton variant="circle" className="!h-9 !w-9" />
          <div className="flex-1 space-y-2">
            <Skeleton variant="title" className="!w-48" />
            <Skeleton variant="text-sm" className="!w-32" />
          </div>
          <Skeleton variant="button-sm" />
        </div>
      </div>
    ))}
  </div>
);

// ─── Error state ──
const ErrorState = ({ error, onRefresh }) => (
  <div className="flex flex-col items-center gap-4 rounded-xl border border-slate-800 bg-slate-950 py-12 text-center">
    <HelpCircle size={40} className="text-slate-600" />
    <div>
      <p className="text-sm text-slate-400">
        Unable to load Container Registry.
      </p>
      <p className="mt-1 text-xs text-slate-600">{error}</p>
    </div>
    <button
      onClick={onRefresh}
      className="flex items-center gap-2 rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white transition-all hover:bg-[var(--accent-hover)] active:scale-[0.97]"
    >
      <RefreshCw size={14} />
      Retry
    </button>
  </div>
);

// ─── Empty state ──
const EmptyState = ({ search }) => (
  <div className="flex flex-col items-center gap-3 rounded-xl border border-slate-800 bg-slate-950 py-12 text-center">
    <Image size={40} className="text-slate-700" />
    {search ? (
      <>
        <p className="text-sm text-slate-500">No images match your search</p>
        <p className="text-xs text-slate-600">Try a different search term</p>
      </>
    ) : (
      <>
        <p className="text-sm text-slate-500">No container images found.</p>
        <p className="text-xs text-slate-600">
          Deploy an application to create your first Docker image.
        </p>
      </>
    )}
  </div>
);

// ─── Main RegistryTable ──
const RegistryTable = ({
  repositories = [],
  loading,
  error,
  search,
  onRefresh,
  onCopyImage,
  onView,
  onDelete,
  timezone,
}) => {
  const [sortKey, setSortKey] = useState("created");
  const [sortDir, setSortDir] = useState("desc");

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  // ✅ Hooks MUST come before any conditional return
  const sortedRepos = useMemo(() => {
    if (sortKey !== "name") return repositories;

    const repos = [...repositories];

    repos.sort((a, b) => {
      const cmp = (a.repository || "").localeCompare(b.repository || "");

      return sortDir === "asc" ? cmp : -cmp;
    });

    return repos;
  }, [repositories, sortKey, sortDir]);

  // Loading
  if (loading && repositories.length === 0) {
    return <LoadingState />;
  }

  // Error
  if (error && repositories.length === 0) {
    return <ErrorState error={error} onRefresh={onRefresh} />;
  }

  // Empty
  if (repositories.length === 0) {
    return <EmptyState search={search} />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-500">
          {sortedRepos.length} repositor
          {sortedRepos.length !== 1 ? "ies" : "y"}
        </p>

        <SortControls sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
      </div>

      {sortedRepos.map((repo) => (
        <RepositoryCard
          key={repo.repository}
          repo={repo}
          onCopyImage={onCopyImage}
          onView={onView}
          onDelete={onDelete}
          sortKey={sortKey}
          sortDir={sortDir}
          timezone={timezone}
        />
      ))}
    </div>
  );
};

export default RegistryTable;
