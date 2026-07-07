import { Rocket } from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";

const LoadingState = () => (
  <div className="space-y-6">
    {/* Header skeleton */}
    <div className="flex items-start gap-3">
      <div className="rounded-lg bg-slate-800 p-2.5">
        <Rocket size={24} className="text-slate-500" />
      </div>
      <div className="space-y-1.5">
        <Skeleton variant="title" className="w-48" />
        <Skeleton variant="subtitle" className="w-36" />
      </div>
    </div>

    {/* Stats cards skeleton */}
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Skeleton variant="card-sm" count={4} />
    </div>

    {/* Table skeleton */}
    <div className="space-y-3">
      <Skeleton variant="input" className="w-full max-w-xs" />
      <Skeleton variant="card" count={3} />
    </div>
  </div>
);

export default LoadingState;
