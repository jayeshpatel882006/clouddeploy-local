import { useState, useCallback } from "react";
import { Toaster, toast } from "react-hot-toast";
import DeploymentToolbar from "./components/DeploymentToolbar";
import DeploymentStats from "./components/DeploymentStats";
import DeploymentTable from "./components/DeploymentTable";
import DeploymentDetailsDrawer from "./components/DeploymentDetailsDrawer";
import CreateDeploymentDialog from "./components/CreateDeploymentDialog";
import LoadingState from "./components/LoadingState";
import ErrorState from "./components/ErrorState";
import useDeployments from "./hooks/useDeployments";

const toastStyle = {
  background: "#1e293b",
  color: "#f8fafc",
  border: "1px solid #334155",
};

const Deployments = () => {
  const { deployments, stats, loading, error, createDeployment, refresh } =
    useDeployments();

  const [search, setSearch] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [viewDrawer, setViewDrawer] = useState(null);

  // ── Create deployment ────────────────────────────────────────
  const handleCreate = useCallback(
    async (repositoryUrl, branch) => {
      try {
        await createDeployment(repositoryUrl, branch);
        toast.success("Deployment queued successfully!", { style: toastStyle });
      } catch (err) {
        toast.error(err.message || "Failed to create deployment", {
          style: toastStyle,
        });
        throw err; // Re-throw so dialog can catch it
      }
    },
    [createDeployment],
  );

  // ── View deployment details ──────────────────────────────────
  const handleView = useCallback((deployment) => {
    setViewDrawer(deployment);
  }, []);

  // ── Delete (placeholder) ─────────────────────────────────────
  const handleDelete = useCallback((deployment) => {
    toast.error("Delete coming soon", { style: toastStyle });
  }, []);

  // ── Loading ──────────────────────────────────────────────────
  if (loading) return <LoadingState />;

  // ── Error ────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="space-y-6">
        <DeploymentToolbar
          search={search}
          onSearchChange={setSearch}
          selectedStatuses={selectedStatuses}
          onStatusFilterChange={setSelectedStatuses}
          onRefresh={refresh}
          onNewDeployment={() => setCreateOpen(true)}
          loading={loading}
        />
        <ErrorState message={error} onRetry={refresh} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

      {/* Header + Toolbar */}
      <DeploymentToolbar
        search={search}
        onSearchChange={setSearch}
        selectedStatuses={selectedStatuses}
        onStatusFilterChange={setSelectedStatuses}
        onRefresh={refresh}
        onNewDeployment={() => setCreateOpen(true)}
        loading={loading}
      />

      {/* Stats */}
      <DeploymentStats stats={stats} />

      {/* Table */}
      <DeploymentTable
        deployments={deployments}
        search={search}
        selectedStatuses={selectedStatuses}
        onView={handleView}
        onDelete={handleDelete}
        onCreateDeployment={() => setCreateOpen(true)}
      />

      {/* Create Dialog */}
      <CreateDeploymentDialog
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={handleCreate}
      />

      {/* Details Drawer */}
      <DeploymentDetailsDrawer
        deployment={viewDrawer}
        onClose={() => setViewDrawer(null)}
      />
    </div>
  );
};

export default Deployments;
