import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ArrowUpDown, Search as SearchIcon } from "lucide-react";

const PAGE_SIZE = 8;

const K8sTable = ({ columns, data, search, onSearchChange, searchPlaceholder, searchFields, pageSize = PAGE_SIZE }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [sortKey, setSortKey] = useState(columns.find((c) => c.sortable)?.key || null);
  const [sortDir, setSortDir] = useState("asc");

  const toggleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const searchableFields = searchFields || ["name", "namespace"];

  const filtered = useMemo(() => {
    if (!search) return data;
    const q = search.toLowerCase();
    return data.filter((item) =>
      searchableFields.some((field) => {
        const val = item[field];
        return val != null && String(val).toLowerCase().includes(q);
      })
    );
  }, [data, search, searchableFields]);

  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    return [...filtered].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      let cmp = 0;
      if (typeof aVal === "string" && typeof bVal === "string") {
        cmp = aVal.localeCompare(bVal);
      } else {
        cmp = aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const paged = sorted.slice((safePage - 1) * pageSize, safePage * pageSize);

  const allSelected = paged.length > 0 && paged.every((d) => selectedIds.has(d.id));
  const toggleAll = () => {
    if (allSelected) setSelectedIds(new Set());
    else setSelectedIds(new Set(paged.map((d) => d.id)));
  };
  const toggleSelect = (id) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setSelectedIds(new Set());
  };

  return (
    <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950 shadow-sm">
      {/* Search */}
      {onSearchChange && (
        <div className="border-b border-slate-800 px-5 py-3">
          <div className="relative max-w-xs">
            <SearchIcon size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
            <input
              type="text"
              value={search || ""}
              onChange={(e) => {
                onSearchChange(e.target.value);
                setCurrentPage(1);
              }}
              placeholder={searchPlaceholder || "Search..."}
              className="w-full rounded-lg border border-slate-700 bg-slate-900 py-2 pl-9 pr-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-blue-600 focus:ring-1 focus:ring-blue-600/30"
            />
          </div>
        </div>
      )}

      {/* Selection bar */}
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-3 border-b border-blue-600/20 bg-blue-600/5 px-5 py-2.5">
          <span className="text-sm text-blue-400">{selectedIds.size} selected</span>
          <button onClick={() => setSelectedIds(new Set())} className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
            Clear selection
          </button>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/50">
              <th className="px-5 py-3.5 w-12">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAll}
                    className="h-4 w-4 rounded border-slate-600 bg-slate-800 text-blue-600 focus:ring-blue-600/30 focus:ring-offset-0"
                  />
                </label>
              </th>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`${col.width || ""} px-0 py-3.5 pr-4 text-left text-xs font-medium text-slate-500 ${
                    col.sortable ? "cursor-pointer select-none hover:text-slate-300" : ""
                  }`}
                  onClick={() => col.sortable && toggleSort(col.key)}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    {col.sortable && (
                      <span className="text-slate-600">
                        {sortKey === col.key ? (
                          <ChevronDown size={12} className={`transition-transform ${sortDir === "asc" ? "rotate-180" : ""}`} />
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
                <td colSpan={columns.length + 1} className="py-16 text-center">
                  <p className="text-sm text-slate-500">No resources found</p>
                </td>
              </tr>
            ) : (
              paged.map((item, idx) => (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.02 }}
                  className={`transition-colors ${
                    selectedIds.has(item.id) ? "bg-blue-600/5" : "hover:bg-slate-900/60"
                  }`}
                >
                  <td className="py-3 pl-5 pr-4 w-12">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(item.id)}
                        onChange={() => toggleSelect(item.id)}
                        className="h-4 w-4 rounded border-slate-600 bg-slate-800 text-blue-600 focus:ring-blue-600/30 focus:ring-offset-0"
                      />
                    </label>
                  </td>
                  {columns.map((col) => (
                    <td key={col.key} className="py-3 pr-4 text-sm">
                      {col.render ? col.render(item) : (
                        <span className="text-slate-300">
                          {item[col.key] != null ? String(item[col.key]) : "-"}
                        </span>
                      )}
                    </td>
                  ))}
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-slate-800 px-5 py-3">
          <p className="text-xs text-slate-500">
            Showing <span className="font-medium text-slate-400">{(safePage - 1) * pageSize + 1}</span>{" "}
            to <span className="font-medium text-slate-400">{Math.min(safePage * pageSize, sorted.length)}</span>{" "}
            of <span className="font-medium text-slate-400">{sorted.length}</span> items
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => handlePageChange(safePage - 1)}
              disabled={safePage === 1}
              className="rounded-lg border border-slate-700 p-1.5 text-slate-400 transition-colors hover:border-slate-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronDown size={15} className="rotate-90" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-medium transition-colors ${
                  safePage === page
                    ? "bg-blue-600 text-white"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(safePage + 1)}
              disabled={safePage === totalPages}
              className="rounded-lg border border-slate-700 p-1.5 text-slate-400 transition-colors hover:border-slate-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronDown size={15} className="-rotate-90" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default K8sTable;
