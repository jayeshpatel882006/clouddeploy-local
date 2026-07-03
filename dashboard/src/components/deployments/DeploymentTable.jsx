import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ArrowUpDown } from "lucide-react";
import DeploymentRow from "./DeploymentRow";
import Pagination from "./Pagination";
import { deployments } from "./deploymentData";

const PAGE_SIZE = 8;

const columns = [
  { key: "select", label: "", width: "w-12" },
  { key: "name", label: "Application", sortable: true, width: "flex-1 min-w-[180px]" },
  { key: "namespace", label: "Namespace", width: "w-28" },
  { key: "status", label: "Status", sortable: true, width: "w-28" },
  { key: "replicas", label: "Replicas", width: "w-20" },
  { key: "resources", label: "Resources", width: "w-24" },
  { key: "created", label: "Created", sortable: true, width: "w-24" },
  { key: "actions", label: "", width: "w-28" },
];

const DeploymentTable = ({ search, filters, onView, onScale, onDelete }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [sortKey, setSortKey] = useState("created");
  const [sortDir, setSortDir] = useState("desc");

  const toggleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  // Filter deployments
  const filtered = deployments.filter((dep) => {
    const matchesSearch =
      !search ||
      dep.name.toLowerCase().includes(search.toLowerCase()) ||
      dep.image.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      filters.status.length === 0 || filters.status.includes(dep.status);

    const matchesNs =
      filters.namespace.length === 0 || filters.namespace.includes(dep.namespace);

    return matchesSearch && matchesStatus && matchesNs;
  });

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    let cmp = 0;
    if (sortKey === "name") cmp = a.name.localeCompare(b.name);
    else if (sortKey === "status") cmp = a.status.localeCompare(b.status);
    else if (sortKey === "created") cmp = a.sortDate - b.sortDate;
    return sortDir === "asc" ? cmp : -cmp;
  });

  // Paginate
  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const paged = sorted.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const allSelected = paged.length > 0 && paged.every((d) => selectedIds.has(d.id));
  const toggleAll = () => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paged.map((d) => d.id)));
    }
  };

  const toggleSelect = (id) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950 shadow-sm">
      {/* Selection bar */}
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-3 border-b border-blue-600/20 bg-blue-600/5 px-5 py-2.5">
          <span className="text-sm text-blue-400">
            {selectedIds.size} selected
          </span>
          <button
            onClick={() => setSelectedIds(new Set())}
            className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
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
                    className="h-4 w-4 rounded border-slate-600 bg-slate-800 text-blue-600 focus:ring-blue-600/30 focus:ring-offset-0"
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
                <td colSpan={8} className="py-12 text-center">
                  <p className="text-sm text-slate-500">No deployments match your filters</p>
                </td>
              </tr>
            ) : (
              paged.map((dep, idx) => (
                <motion.tr
                  key={dep.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.03 }}
                >
                  <DeploymentRow
                    deployment={dep}
                    onView={onView}
                    onScale={onScale}
                    onDelete={onDelete}
                    onSelect={toggleSelect}
                    isSelected={selectedIds.has(dep.id)}
                  />
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={safePage}
        totalPages={totalPages}
        totalItems={sorted.length}
        pageSize={PAGE_SIZE}
        onChange={setCurrentPage}
        itemLabel="deployments"
      />
    </div>
  );
};

export default DeploymentTable;
