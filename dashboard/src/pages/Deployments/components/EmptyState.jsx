import { Rocket } from "lucide-react";

const EmptyState = ({ onCreateDeployment }) => (
  <div className="flex flex-col items-center justify-center rounded-xl border border-slate-800 bg-slate-950 px-6 py-16 text-center">
    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-800">
      <Rocket size={28} className="text-slate-500" />
    </div>
    <h3 className="text-lg font-semibold text-slate-200">
      Create your first deployment
    </h3>
    <p className="mt-1.5 max-w-sm text-sm text-slate-500">
      Deploy a GitHub repository to your Kubernetes cluster.
    </p>
    <button
      onClick={onCreateDeployment}
      className="mt-6 flex items-center gap-2 rounded-lg bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-[var(--accent-hover)] active:scale-[0.97]"
    >
      <Rocket size={16} />
      Deploy Application
    </button>
  </div>
);

export default EmptyState;
