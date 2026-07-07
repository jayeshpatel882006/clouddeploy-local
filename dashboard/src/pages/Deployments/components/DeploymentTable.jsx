import { useState, useMemo } from "react";
import { ChevronDown, ArrowUpDown, Layers } from "lucide-react";
import DeploymentRow from "./DeploymentRow";
import COLUMNS from "../utils/deploymentColumns";
import EmptyState from "./EmptyState";

const PAGE_SIZE = 10;

const DeploymentTable = ({ deployments = [], search, selectedStatuses, onView, onDelete, onCreateDeployment }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState("created");
  const [sortDir, setSortDir] = useState("desc");

  const toggleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  // Filter
  const filtered = useMemo(() => {
    return deployments.filter((dep) => {
      const matchSearch =
        !search ||
        dep.name?.toLowerCase().includes(search.toLowerCase()) ||
        dep.repositoryUrl?.toLowerCase().includes(search.toLowerCase());

      const matchStatus =
        selectedStatuses.length === 0 || selectedStatuses.includes(dep.status);

      return matchSearch && matchStatus;
    });
  }, [deployments, search, selectedStatuses]);

  // Sort
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let cmp = 0;
      if (sortKey === "project") cmp = (a.name || "").localeCompare(b.name || "");
      else if (sortKey === "status") cmp = (a.status || "").localeCompare(b.status || "");
      else cmp = (a.sortDate || 0) - (b.sortDate || 0);
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [filtered, sortKey, sortDir]);

  // Paginate
  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const page = Math.min(currentPage, totalPages);
  const paged = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (sorted.length === 0 && !search && selectedStatuses.length === 0) {
    return (
      <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950 shadow-sm">
        <EmptyState onCreateDeployment={onCreateDeployment} />
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950 shadow-sm">
      <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <div className="responsive-table min-w-[600px] sm:min-w-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/50">
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  className={`${col.width} px-0 py-3.5 pr-3 text-left text-xs font-medium text-slate-500 ${
                    col.sortable ? "cursor-pointer select-none hover:text-slate-300" : ""
                  }`}
                  onClick={() => col.sortable && toggleSort(col.key)}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    {col.sortable && (
                      <span className="text-slate-600">
                        {sortKey === col.key ? (
                          <ChevronDown
                            size={12}
                            className={`transition-transform ${
                              sortDir === "asc" ? "rotate-180" : ""
                            }`}
                          />
                        ) : (
                          <ArrowUpDown size={12} />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/40">
            {paged.length === 0 ? (
              <tr>
                <td colSpan={COLUMNS.length} className="py-16 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Layers size={24} className="text-slate-600" />
                    <p className="text-sm text-slate-500">
                      No deployments match your filters
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              paged.map((dep) => (
                <DeploymentRow
                  key={dep.id}
                  deployment={dep}
                  onView={onView}
                  onDelete={onDelete}
                />
              ))
            )}
          </tbody>
        </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-slate-800 px-5 py-3">
          <p className="text-xs text-slate-500">
            Showing {(page - 1) * PAGE_SIZE + 1}–
            {Math.min(page * PAGE_SIZE, sorted.length)} of {sorted.length}
          </p>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="rounded-md border border-slate-700 px-3 py-1 text-xs text-slate-400 transition-colors hover:bg-slate-800 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Prev
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const start = Math.max(1, Math.min(page - 2, totalPages - 4));
              const num = start + i;
              if (num > totalPages) return null;
              return (
                <button
                  key={num}
                  onClick={() => setCurrentPage(num)}
                  className={`rounded-md border px-3 py-1 text-xs transition-colors ${
                    num === page
                      ? "border-blue-600 bg-blue-600/10 text-blue-400"
                      : "border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  {num}
                </button>
              );
            })}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="rounded-md border border-slate-700 px-3 py-1 text-xs text-slate-400 transition-colors hover:bg-slate-800 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeploymentTable;
