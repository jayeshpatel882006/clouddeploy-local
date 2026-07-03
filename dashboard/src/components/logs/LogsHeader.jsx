import { FileText } from "lucide-react";
import { sources } from "./logsData";

const LogsHeader = ({ selectedSource, onSourceChange }) => {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
      <div className="flex items-start gap-3">
        <div className="rounded-lg bg-amber-600/10 p-2.5">
          <FileText size={24} className="text-amber-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Logs</h1>
          <p className="mt-0.5 text-sm text-slate-400">
            Container and cluster log streams
          </p>
        </div>
      </div>

      {/* Source selector */}
      <select
        value={selectedSource}
        onChange={(e) => onSourceChange(e.target.value)}
        className="rounded-lg border border-slate-700 bg-slate-900 px-3.5 py-2 text-sm text-slate-300 outline-none focus:border-amber-600/50"
      >
        <option value="all">All Sources</option>
        {sources.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LogsHeader;
