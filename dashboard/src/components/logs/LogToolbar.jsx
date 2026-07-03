import { Search, X, RotateCcw, Trash2, Pause, Play, Filter } from "lucide-react";

const levels = ["INFO", "WARN", "ERROR", "DEBUG"];

const levelColors = {
  INFO: "data-[active=true]:bg-blue-600 data-[active=true]:text-white text-blue-400",
  WARN: "data-[active=true]:bg-yellow-600 data-[active=true]:text-white text-yellow-400",
  ERROR: "data-[active=true]:bg-red-600 data-[active=true]:text-white text-red-400",
  DEBUG: "data-[active=true]:bg-slate-600 data-[active=true]:text-white text-slate-400",
};

const LogToolbar = ({
  search,
  onSearchChange,
  activeLevels,
  onToggleLevel,
  onClear,
  autoScroll,
  onToggleAutoScroll,
  isPaused,
  onTogglePause,
  totalLogs,
  filteredCount,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 bg-slate-950 px-4 py-2.5">
      {/* Search */}
      <div className="relative flex-1 min-w-[200px] max-w-sm">
        <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search logs..."
          className="w-full rounded-md border border-slate-700 bg-slate-900 py-1.5 pl-8 pr-7 text-xs text-white outline-none placeholder:text-slate-500 focus:border-slate-600"
        />
        {search && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
          >
            <X size={12} />
          </button>
        )}
      </div>

      {/* Level filter */}
      <div className="flex items-center gap-1">
        {levels.map((level) => {
          const active = activeLevels.includes(level);
          return (
            <button
              key={level}
              onClick={() => onToggleLevel(level)}
              data-active={active}
              className={`rounded px-2 py-1 text-[10px] font-semibold transition-all ${
                active
                  ? levelColors[level].replace("data-[active=true]:", "")
                  : "bg-slate-800 text-slate-500 hover:bg-slate-700"
              }`}
            >
              {level}
            </button>
          );
        })}
      </div>

      <div className="h-4 w-px bg-slate-700" />

      {/* Log count */}
      <span className="text-[10px] text-slate-500 whitespace-nowrap">
        {filteredCount}/{totalLogs}
      </span>

      <div className="h-4 w-px bg-slate-700" />

      {/* Controls */}
      <div className="flex items-center gap-1">
        <button
          onClick={onTogglePause}
          title={isPaused ? "Resume live logs" : "Pause live logs"}
          className={`rounded p-1.5 transition-all ${
            isPaused
              ? "bg-yellow-600/20 text-yellow-400"
              : "text-slate-500 hover:bg-slate-800 hover:text-slate-300"
          }`}
        >
          {isPaused ? <Play size={13} /> : <Pause size={13} />}
        </button>

        <button
          onClick={onToggleAutoScroll}
          title="Toggle auto-scroll"
          className={`rounded p-1.5 transition-all ${
            autoScroll
              ? "bg-blue-600/20 text-blue-400"
              : "text-slate-500 hover:bg-slate-800 hover:text-slate-300"
          }`}
        >
          <RotateCcw size={13} className={autoScroll ? "" : "opacity-50"} />
        </button>

        <button
          onClick={onClear}
          title="Clear logs"
          className="rounded p-1.5 text-slate-500 hover:bg-slate-800 hover:text-slate-300 transition-all"
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
};

export default LogToolbar;
