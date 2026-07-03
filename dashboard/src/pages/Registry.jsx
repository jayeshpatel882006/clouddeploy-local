import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Toaster, toast } from "react-hot-toast";
import { Search, X } from "lucide-react";
import RegistryHeader from "@/components/registry/RegistryHeader";
import RegistryTable from "@/components/registry/RegistryTable";
import ImageDetailsDrawer from "@/components/registry/ImageDetailsDrawer";
import DeleteImageDialog from "@/components/registry/DeleteImageDialog";

const sectionVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.35, ease: "easeOut" },
  }),
};

const Registry = () => {
  const [search, setSearch] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleView = useCallback((image) => {
    setSelectedImage(image);
    setDrawerOpen(true);
  }, []);

  const handleDelete = useCallback((image) => {
    setDeleteTarget(image);
    setDeleteOpen(true);
  }, []);

  const confirmDelete = useCallback((image) => {
    toast.success(`Deleted image: ${image.name}`, {
      style: { background: "#1e293b", color: "#f8fafc", border: "1px solid #334155" },
    });
    setDeleteOpen(false);
    setDeleteTarget(null);
  }, []);

  const handlePull = useCallback((image) => {
    toast.success(`Pulled ${image.name}:${image.tags[0]?.name || "latest"}`, {
      style: { background: "#1e293b", color: "#f8fafc", border: "1px solid #334155" },
    });
  }, []);

  const handleRefresh = useCallback(() => {
    toast.success("Registry refreshed", {
      style: { background: "#1e293b", color: "#f8fafc", border: "1px solid #334155" },
    });
  }, []);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

      <motion.div custom={0} variants={sectionVariants}>
        <RegistryHeader onRefresh={handleRefresh} />
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
              placeholder="Search images by name, description, or tag..."
              className="w-full rounded-lg border border-slate-700 bg-slate-900 py-2 pl-9 pr-8 text-sm text-white outline-none transition-colors placeholder:text-slate-500 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/30"
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
          search={search}
          onView={handleView}
          onDelete={handleDelete}
          onPull={handlePull}
        />
      </motion.div>

      <ImageDetailsDrawer
        image={drawerOpen ? selectedImage : null}
        onClose={() => {
          setDrawerOpen(false);
          setSelectedImage(null);
        }}
      />

      <DeleteImageDialog
        image={deleteTarget}
        isOpen={deleteOpen}
        onClose={() => {
          setDeleteOpen(false);
          setDeleteTarget(null);
        }}
        onConfirm={confirmDelete}
      />
    </motion.div>
  );
};

export default Registry;
