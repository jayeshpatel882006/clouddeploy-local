import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ArrowUpDown, Tag } from "lucide-react";
import RegistryRow from "./RegistryRow";
import { registryImages } from "./registryData";

const PAGE_SIZE = 8;

const columns = [
  { key: "select", label: "", width: "w-12" },
  { key: "name", label: "Image", sortable: true, width: "flex-1 min-w-[200px]" },
  { key: "tags", label: "Tags", sortable: true, width: "w-16" },
  { key: "status", label: "Status", sortable: true, width: "w-28" },
  { key: "size", label: "Size", sortable: true, width: "w-24" },
  { key: "vulnerabilities", label: "Vulnerabilities", sortable: true, width: "w-28" },
  { key: "lastPulled", label: "Last Pulled", sortable: true, width: "w-28" },
  { key: "pullCount", label: "Pulls", sortable: true, width: "w-16" },
  { key: "actions", label: "", width: "w-28" },
];

const RegistryTable = ({ search, onView, onDelete, onPull }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [sortKey, setSortKey] = useState("name");
  const [sortDir, setSortDir] = useState("asc");

  const toggleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  // Filter
  const filtered = useMemo(() => {
    if (!search) return registryImages;
    const q = search.toLowerCase();
    return registryImages.filter(
      (img) =>
        img.name.toLowerCase().includes(q) ||
        img.description.toLowerCase().includes(q) ||
        img.tags.some((t) => t.name.toLowerCase().includes(q))
    );
  }, [search]);

  // Sort
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let cmp = 0;
      if (sortKey === "name") cmp = a.name.localeCompare(b.name);
      else if (sortKey === "tags") cmp = a.tags.length - b.tags.length;
      else if (sortKey === "status") cmp = a.status.localeCompare(b.status);
      else if (sortKey === "size") {
        const aNum = parseFloat(a.totalSize);
        const bNum = parseFloat(b.totalSize);
        cmp = aNum - bNum;
      } else if (sortKey === "vulnerabilities") {
        const aV = a.vulnerabilities === null ? -1 : a.vulnerabilities;
        const bV = b.vulnerabilities === null ? -1 : b.vulnerabilities;
        cmp = aV - bV;
      } else if (sortKey === "lastPulled") {
        cmp = a.lastPulled.localeCompare(b.lastPulled);
      } else if (sortKey === "pullCount") cmp = a.totalPulls - b.totalPulls;
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [filtered, sortKey, sortDir]);

  // Paginate
  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const paged = sorted.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const startItem = (safePage - 1) * PAGE_SIZE + 1;
  const endItem = Math.min(safePage * PAGE_SIZE, sorted.length);

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

  // Pagination helpers
  const getPageNumbers = () => {
    const pages = [];
    const delta = 1;
    const rangeStart = Math.max(2, safePage - delta);
    const rangeEnd = Math.min(totalPages - 1, safePage + delta);
    pages.push(1);
    if (rangeStart > 2) pages.push("...");
    for (let i = rangeStart; i <= rangeEnd; i++) pages.push(i);
    if (rangeEnd < totalPages - 1) pages.push("...");
    if (totalPages > 1) pages.push(totalPages);
    return pages;
  };

  return (
    <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950 shadow-sm">
      {/* Selection bar */}
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-3 border-b border-emerald-600/20 bg-emerald-600/5 px-5 py-2.5">
          <span className="text-sm text-emerald-400">{selectedIds.size} selected</span>
          <button
            onClick={() => setSelectedIds(new Set())}
            className="text-xs text-slate-500 transition-colors hover:text-slate-300"
          >
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
                    className="h-4 w-4 rounded border-slate-600 bg-slate-800 text-emerald-600 focus:ring-emerald-600/30 focus:ring-offset-0"
                  />
                </label>
              </th>
              {columns.slice(1).map((col) => (
                <th
                  key={col.key}
                  className={`${col.width} px-0 py-3.5 pr-4 text-left text-xs font-medium text-slate-500 ${
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
                            className={`transition-transform ${sortDir === "asc" ? "rotate-180" : ""}`}
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
                <td colSpan={9} className="py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <Tag size={32} className="text-slate-700" />
                    <p className="text-sm text-slate-500">No images match your search</p>
                  </div>
                </td>
              </tr>
            ) : (
              paged.map((img) => (
                <RegistryRow
                  key={img.id}
                  image={img}
                  onView={onView}
                  onDelete={onDelete}
                  onPull={onPull}
                  onSelect={toggleSelect}
                  isSelected={selectedIds.has(img.id)}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-slate-800 px-5 py-3">
          <p className="text-xs text-slate-500">
            Showing <span className="font-medium text-slate-400">{startItem}</span> to{" "}
            <span className="font-medium text-slate-400">{endItem}</span> of{" "}
            <span className="font-medium text-slate-400">{sorted.length}</span> images
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(safePage - 1)}
              disabled={safePage === 1}
              className="rounded-lg border border-slate-700 p-1.5 text-slate-400 transition-colors hover:border-slate-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            {getPageNumbers().map((page, idx) =>
              page === "..." ? (
                <span key={`ellipsis-${idx}`} className="px-2 text-xs text-slate-500">...</span>
              ) : (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-medium transition-colors ${
                    safePage === page
                      ? "bg-emerald-600 text-white"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  {page}
                </button>
              )
            )}
            <button
              onClick={() => setCurrentPage(safePage + 1)}
              disabled={safePage === totalPages}
              className="rounded-lg border border-slate-700 p-1.5 text-slate-400 transition-colors hover:border-slate-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistryTable;
