import { useState } from "react";
import { Clipboard, ClipboardCheck } from "lucide-react";

const levelStyles = {
  INFO: "text-blue-400",
  WARN: "text-yellow-400",
  ERROR: "text-red-400",
  DEBUG: "text-slate-500",
};

const levelBg = {
  INFO: "bg-blue-500/10 text-blue-400",
  WARN: "bg-yellow-500/10 text-yellow-400",
  ERROR: "bg-red-500/10 text-red-400",
  DEBUG: "bg-slate-500/10 text-slate-500",
};

const LogEntry = ({ log, highlighted }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = `[${log.timestamp}] [${log.level}] [${log.source}] ${log.message}`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const isHighlighted =
    highlighted &&
    log.message.toLowerCase().includes(highlighted.toLowerCase());

  return (
    <div
      className={`group flex items-start gap-2 px-4 py-0.5 text-xs leading-6 transition-colors hover:bg-slate-800/40 ${
        isHighlighted ? "bg-yellow-500/5 border-l-2 border-yellow-500/40" : ""
      }`}
    >
      {/* Timestamp */}
      <span className="shrink-0 font-mono text-slate-600 w-[70px] select-none">
        {log.timestamp}
      </span>

      {/* Level */}
      <span
        className={`shrink-0 inline-block w-[52px] rounded px-1 text-[10px] font-semibold text-center leading-5 ${
          levelBg[log.level]
        }`}
      >
        {log.level}
      </span>

      {/* Source */}
      <span className="shrink-0 font-mono text-slate-500 w-[120px] truncate select-none">
        {log.source}
      </span>

      {/* Message */}
      <span
        className={`flex-1 font-mono ${
          levelStyles[log.level] || "text-slate-300"
        } ${isHighlighted ? "text-yellow-200" : ""}`}
      >
        {log.message}
      </span>

      {/* Copy button */}
      <button
        onClick={handleCopy}
        className="shrink-0 mt-0.5 rounded p-0.5 text-slate-600 opacity-0 transition-all hover:text-slate-300 group-hover:opacity-100"
        title="Copy log line"
      >
        {copied ? (
          <ClipboardCheck size={12} className="text-green-400" />
        ) : (
          <Clipboard size={12} />
        )}
      </button>
    </div>
  );
};

export default LogEntry;
