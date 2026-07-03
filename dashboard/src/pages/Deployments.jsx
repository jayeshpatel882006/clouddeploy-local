import { useState, useCallback } from "react";
import { Toaster, toast } from "react-hot-toast";
import DeploymentHeader from "@/components/deployments/DeploymentHeader";
import DeploymentTable from "@/components/deployments/DeploymentTable";
import DeploymentDrawer from "@/components/deployments/DeploymentDrawer";
import DeleteDeploymentDialog from "@/components/deployments/DeleteDeploymentDialog";
import ScaleDeploymentDialog from "@/components/deployments/ScaleDeploymentDialog";

const Deployments = () => {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ status: [], namespace: [] });

  const [selectedDeployment, setSelectedDeployment] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [scaleTarget, setScaleTarget] = useState(null);
  const [scaleOpen, setScaleOpen] = useState(false);

  const handleView = useCallback((deployment) => {
    setSelectedDeployment(deployment);
    setDrawerOpen(true);
  }, []);

  const handleDelete = useCallback((deployment) => {
    setDeleteTarget(deployment);
    setDeleteOpen(true);
  }, []);

  const handleScale = useCallback((deployment) => {
    setScaleTarget(deployment);
    setScaleOpen(true);
  }, []);

  const confirmDelete = useCallback((deployment) => {
    toast.success(`Deleted deployment: ${deployment.name}`, {
      style: {
        background: "#1e293b",
        color: "#f8fafc",
        border: "1px solid #334155",
      },
    });
  }, []);

  const confirmScale = useCallback((deployment, replicas) => {
    toast.success(`Scaled ${deployment.name} to ${replicas} replicas`, {
      style: {
        background: "#1e293b",
        color: "#f8fafc",
        border: "1px solid #334155",
      },
    });
  }, []);

  return (
    <div className="space-y-6">
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <DeploymentHeader
        search={search}
        onSearchChange={setSearch}
        filters={filters}
        onFiltersChange={setFilters}
      />

      <DeploymentTable
        search={search}
        filters={filters}
        onView={handleView}
        onScale={handleScale}
        onDelete={handleDelete}
      />

      <DeploymentDrawer
        deployment={drawerOpen ? selectedDeployment : null}
        onClose={() => {
          setDrawerOpen(false);
          setSelectedDeployment(null);
        }}
      />

      <DeleteDeploymentDialog
        deployment={deleteTarget}
        isOpen={deleteOpen}
        onClose={() => {
          setDeleteOpen(false);
          setDeleteTarget(null);
        }}
        onConfirm={confirmDelete}
      />

      <ScaleDeploymentDialog
        deployment={scaleTarget}
        isOpen={scaleOpen}
        onClose={() => {
          setScaleOpen(false);
          setScaleTarget(null);
        }}
        onConfirm={confirmScale}
      />
    </div>
  );
};

export default Deployments;
