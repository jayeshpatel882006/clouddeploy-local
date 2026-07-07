import { AlertTriangle } from "lucide-react";

const ErrorState = ({ message, onRetry }) => (
  <div className="flex flex-col items-center justify-center rounded-xl border border-red-800/40 bg-slate-950 px-6 py-16 text-center">
    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
      <AlertTriangle size={28} className="text-red-400" />
    </div>
    <h3 className="text-lg font-semibold text-slate-200">
      Failed to load deployments
    </h3>
    <p className="mt-1.5 max-w-md text-sm text-slate-500">
      {message || "An unexpected error occurred. Please try again."}
    </p>
    <button
      onClick={onRetry}
      className="mt-6 rounded-lg bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-[var(--accent-hover)] active:scale-[0.97]"
    >
      Try Again
    </button>
  </div>
);

export default ErrorState;
