import { useState } from "react";
import { Rocket, GitBranch, Loader2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CreateDeploymentDialog = ({ isOpen, onClose, onCreate }) => {
  const [repositoryUrl, setRepositoryUrl] = useState("");
  const [branch, setBranch] = useState("main");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!repositoryUrl.trim()) {
      setError("Repository URL is required");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      await onCreate(repositoryUrl.trim(), branch.trim() || "main");
      setRepositoryUrl("");
      setBranch("main");
      onClose();
    } catch (err) {
      setError(err.message || "Failed to create deployment");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (submitting) return;
    setRepositoryUrl("");
    setBranch("main");
    setError("");
    onClose();
  };

  const inputClass =
    "w-full rounded-lg border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-slate-500 focus:border-blue-600 focus:ring-1 focus:ring-blue-600/30";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="w-full max-w-lg rounded-xl border border-slate-700 bg-slate-950 shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-blue-600/10 p-2">
                    <Rocket size={18} className="text-blue-400" />
                  </div>
                  <h2 className="text-base font-semibold text-white">
                    New Deployment
                  </h2>
                </div>
                <button
                  onClick={handleClose}
                  disabled={submitting}
                  className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white disabled:opacity-40"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Body */}
              <div className="space-y-5 px-5 py-5">
                <div className="rounded-lg border border-blue-600/20 bg-blue-600/5 px-4 py-3">
                  <p className="text-xs text-blue-300">
                    Deploy a public GitHub repository. The engine will clone,
                    build, and deploy it to your Kubernetes cluster.
                  </p>
                </div>

                {/* Repository URL */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-slate-400">
                    GitHub Repository URL
                  </label>
                  <input
                    type="text"
                    placeholder="https://github.com/username/repository"
                    value={repositoryUrl}
                    onChange={(e) => setRepositoryUrl(e.target.value)}
                    className={inputClass}
                    disabled={submitting}
                  />
                </div>

                {/* Branch */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-slate-400">
                    Branch
                  </label>
                  <div className="relative">
                    <GitBranch
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                    />
                    <input
                      type="text"
                      placeholder="main"
                      value={branch}
                      onChange={(e) => setBranch(e.target.value)}
                      className={`${inputClass} pl-9`}
                      disabled={submitting}
                    />
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2.5">
                    <p className="text-xs text-red-400">{error}</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 border-t border-slate-800 px-5 py-4">
                <button
                  onClick={handleClose}
                  disabled={submitting}
                  className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-400 transition-colors hover:bg-slate-800 hover:text-white disabled:opacity-40"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white transition-all hover:bg-blue-700 active:scale-[0.97] disabled:opacity-40"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Deploying...
                    </>
                  ) : (
                    <>
                      <Rocket size={16} />
                      Deploy
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CreateDeploymentDialog;
