import { useEffect, useRef, useCallback, useMemo, useState } from "react";
import LogEntry from "./LogEntry";
import LogToolbar from "./LogToolbar";
import { generateInitialLogs, generateLogEntry } from "./logsData";

const MAX_LOGS = 500;

const LogViewer = ({ selectedSource }) => {
  const [logs, setLogs] = useState(() => generateInitialLogs(150));
  const [search, setSearch] = useState("");
  const [activeLevels, setActiveLevels] = useState(["INFO", "WARN", "ERROR", "DEBUG"]);
  const [autoScroll, setAutoScroll] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [isNearBottom, setIsNearBottom] = useState(true);

  const scrollRef = useRef(null);
  const bottomRef = useRef(null);

  // Track if user has scrolled up from the bottom
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleScroll = () => {
      const threshold = 100;
      const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < threshold;
      setIsNearBottom(atBottom);
    };

    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto-scroll when new logs arrive (only if near bottom or auto-scroll enabled)
  useEffect(() => {
    if (autoScroll && isNearBottom && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs, autoScroll, isNearBottom]);

  // Live log simulation
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      const source = selectedSource === "all" ? undefined : selectedSource;
      const newLog = generateLogEntry({ source });

      setLogs((prev) => {
        const next = [...prev, newLog];
        return next.length > MAX_LOGS ? next.slice(next.length - MAX_LOGS) : next;
      });
    }, 800 + Math.random() * 1200);

    return () => clearInterval(interval);
  }, [isPaused, selectedSource]);

  // Filtered logs
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesLevel = activeLevels.includes(log.level);
      const matchesSearch =
        !search ||
        log.message.toLowerCase().includes(search.toLowerCase()) ||
        log.source.toLowerCase().includes(search.toLowerCase());
      return matchesLevel && matchesSearch;
    });
  }, [logs, activeLevels, search]);

  const toggleLevel = useCallback((level) => {
    setActiveLevels((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]
    );
  }, []);

  const handleClear = useCallback(() => {
    setLogs([]);
  }, []);

  // Jump to bottom when user clicks anchor
  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    setIsNearBottom(true);
  }, []);

  return (
    <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950 shadow-sm flex flex-col">
      <LogToolbar
        search={search}
        onSearchChange={setSearch}
        activeLevels={activeLevels}
        onToggleLevel={toggleLevel}
        onClear={handleClear}
        autoScroll={autoScroll}
        onToggleAutoScroll={() => setAutoScroll((v) => !v)}
        isPaused={isPaused}
        onTogglePause={() => setIsPaused((v) => !v)}
        totalLogs={logs.length}
        filteredCount={filteredLogs.length}
      />

      {/* Logs container */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto bg-[#0b1120] font-mono text-xs leading-6"
        style={{ minHeight: "400px", maxHeight: "calc(100vh - 300px)" }}
      >
        {filteredLogs.length === 0 ? (
          <div className="flex items-center justify-center h-full py-16 text-slate-600 text-xs">
            {logs.length === 0
              ? "No logs — click clear or wait for new entries"
              : "No logs match your filters"}
          </div>
        ) : (
          filteredLogs.map((log) => (
            <LogEntry key={log.id} log={log} highlighted={search} />
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Floating "scroll to bottom" button */}
      {!isNearBottom && (
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-10">
          <button
            onClick={scrollToBottom}
            className="rounded-full border border-slate-700 bg-slate-900 px-4 py-1.5 text-xs text-slate-400 shadow-lg transition-all hover:border-slate-600 hover:text-white"
          >
            ↓ Scroll to bottom
          </button>
        </div>
      )}
    </div>
  );
};

export default LogViewer;
