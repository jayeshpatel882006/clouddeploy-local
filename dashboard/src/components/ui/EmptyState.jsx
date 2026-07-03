import { Inbox } from "lucide-react";

const EmptyState = ({
  icon: Icon = Inbox,
  title = "No data",
  description,
  action,
  className = "",
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center px-6 py-12 text-center ${className}`}
    >
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-800">
        <Icon size={24} className="text-slate-500" aria-hidden="true" />
      </div>
      <h3 className="text-base font-semibold text-slate-300">{title}</h3>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-slate-500">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
};

export default EmptyState;
