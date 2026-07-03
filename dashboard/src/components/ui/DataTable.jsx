import { useState, useMemo } from "react";
import { Search, X } from "lucide-react";
import Table from "./Table";
import Pagination from "./Pagination";

const PAGE_SIZES = [8, 12, 16, 24];

const DataTable = ({
  columns = [],
  data = [],
  pageSize: defaultPageSize = 8,
  searchable = true,
  searchPlaceholder = "Search...",
  searchFields,
  selectable = false,
  defaultSortKey,
  defaultSortDir = "asc",
  itemLabel = "items",
  className = "",
  onRowClick,
}) => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState(defaultSortKey || columns.find((c) => c.sortable)?.key);
  const [sortDir, setSortDir] = useState(defaultSortDir);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [pageSize, setPageSize] = useState(defaultPageSize);

  // Filter
  const filtered = useMemo(() => {
    if (!search) return data;
    const q = search.toLowerCase();
    const fields = searchFields || columns.map((c) => c.key);
    return data.filter((item) =>
      fields.some((field) => {
        const val = item[field];
        return val != null && String(val).toLowerCase().includes(q);
      })
    );
  }, [data, search, searchFields, columns]);

  // Sort
  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    return [...filtered].sort((a, b) => {
      let cmp = 0;
      const col = columns.find((c) => c.key === sortKey);
      if (col?.sortFn) {
        cmp = col.sortFn(a, b);
      } else {
        const aVal = a[sortKey];
        const bVal = b[sortKey];
        if (typeof aVal === "number" && typeof bVal === "number") {
          cmp = aVal - bVal;
        } else {
          cmp = String(aVal ?? "").localeCompare(String(bVal ?? ""));
        }
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [filtered, sortKey, sortDir, columns]);

  // Paginate
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const paged = sorted.slice((safePage - 1) * pageSize, safePage * pageSize);

  const toggleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
    setCurrentPage(1);
  };

  const handleSelectAll = () => {
    if (paged.every((item) => selectedIds.has(item.id))) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paged.map((item) => item.id)));
    }
  };

  const handleSelectOne = (id) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950 shadow-sm">
      {/* Search bar */}
      {searchable && (
        <div className="border-b border-slate-800 px-5 py-3">
          <div className="relative flex max-w-xs items-center">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 text-slate-500"
              aria-hidden="true"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder={searchPlaceholder}
              className="w-full rounded-lg border border-slate-700 bg-slate-900 py-2 pl-9 pr-8 text-sm text-white outline-none transition-colors placeholder:text-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30"
              aria-label="Search"
            />
            {search && (
              <button
                onClick={() => {
                  setSearch("");
                  setCurrentPage(1);
                }}
                className="absolute right-2 rounded p-0.5 text-slate-500 transition-colors hover:text-slate-300"
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Selection bar */}
      {selectable && selectedIds.size > 0 && (
        <div className="flex items-center gap-3 border-b border-blue-600/20 bg-blue-600/5 px-5 py-2.5">
          <span className="text-sm text-blue-400">
            {selectedIds.size} selected
          </span>
          <button
            onClick={() => setSelectedIds(new Set())}
            className="text-xs text-slate-500 transition-colors hover:text-slate-300"
          >
            Clear selection
          </button>
        </div>
      )}

      {/* Table */}
      <Table
        columns={columns}
        data={paged}
        sortKey={sortKey}
        sortDir={sortDir}
        onSort={toggleSort}
        selectedIds={selectedIds}
        onSelectAll={handleSelectAll}
        onSelectOne={handleSelectOne}
        selectable={selectable}
      />

      {/* Pagination */}
      <Pagination
        currentPage={safePage}
        totalPages={totalPages}
        totalItems={sorted.length}
        pageSize={pageSize}
        onChange={setCurrentPage}
        itemLabel={itemLabel}
      />
    </div>
  );
};

export default DataTable;
