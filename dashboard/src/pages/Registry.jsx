import { useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { Toaster, toast } from "react-hot-toast";
import { Search, X } from "lucide-react";
import RegistryHeader from "@/components/registry/RegistryHeader";
import RegistryTable from "@/components/registry/RegistryTable";
import { useRegistry } from "@/hooks/useRegistry";
import { useSettings } from "@/hooks/useSettings";

const toastStyle = {
  background: "#1e293b",
  color: "#f8fafc",
  border: "1px solid #334155",
};

const sectionVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.35, ease: "easeOut" },
  }),
};

const Registry = () => {
  const { repositories, loading, error, refresh } = useRegistry();
  const { settings } = useSettings();
  const [search, setSearch] = useState("");

  // ── Search filtering ──
  const filtered = useMemo(() => {
    if (!search) return repositories;
    const q = search.toLowerCase();
    return repositories.filter((repo) => {
      // Search by repository name
      if (repo.repository.toLowerCase().includes(q)) return true;
      // Search by tag names
      if (repo.images?.some((img) => img.tag?.toLowerCase().includes(q))) return true;
      // Search by image name
      if (repo.images?.some((img) => img.image?.toLowerCase().includes(q))) return true;
      // Search by image ID
      if (repo.images?.some((img) => img.imageId?.toLowerCase().includes(q))) return true;
      return false;
    });
  }, [repositories, search]);

  // ── Copy image name to clipboard ──
  const handleCopyImage = useCallback((imageName) => {
    navigator.clipboard?.writeText(imageName);
    toast.success(`Copied: ${imageName}`, { style: toastStyle });
  }, []);

  // ── View details (disabled for now) ──
  const handleView = useCallback(() => {
    toast("View details — coming soon", { style: toastStyle });
  }, []);

  // ── Delete (disabled for now) ──
  const handleDelete = useCallback(() => {
    toast("Delete image — coming soon", { style: toastStyle });
  }, []);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

      <motion.div custom={0} variants={sectionVariants}>
        <RegistryHeader
          onRefresh={refresh}
          loading={loading}
          totalImages={repositories.reduce((sum, r) => sum + (r.images?.length || 0), 0)}
          totalRepos={repositories.length}
        />
      </motion.div>

      <motion.div custom={1} variants={sectionVariants}>
        {/* Search bar */}
        <div className="w-full max-w-xs">
          <div className="relative flex items-center">
            <Search size={16} className="pointer-events-none absolute left-3 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search repositories, tags, or IDs..."
              className="w-full rounded-lg border border-slate-700 bg-slate-900 py-2 pl-9 pr-8 text-sm text-white outline-none transition-colors placeholder:text-slate-500 focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]/30"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-2 rounded p-0.5 text-slate-500 transition-colors hover:text-slate-300"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      </motion.div>

      <motion.div custom={2} variants={sectionVariants}>
        <RegistryTable
          repositories={filtered}
          loading={loading}
          error={error}
          search={search}
          onRefresh={refresh}
          onCopyImage={handleCopyImage}
          onView={handleView}
          onDelete={handleDelete}
          timezone={settings.timezone}
        />
      </motion.div>
    </motion.div>
  );
};

export default Registry;
