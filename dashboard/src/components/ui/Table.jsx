import { ChevronDown, ArrowUpDown } from "lucide-react";
import Checkbox from "./Checkbox";

const Table = ({
  columns = [],
  data = [],
  sortKey,
  sortDir,
  onSort,
  selectedIds = new Set(),
  onSelectAll,
  onSelectOne,
  getItemId = (item) => item.id,
  emptyState,
  className = "",
  selectable = false,
}) => {
  const allSelected =
    selectable && data.length > 0 && data.every((item) => selectedIds.has(getItemId(item)));

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-800 bg-slate-900/50">
            {selectable && (
              <th className="w-12 px-5 py-3.5">
                <Checkbox
                  checked={allSelected}
                  onChange={onSelectAll}
                  indeterminate={selectedIds.size > 0 && !allSelected}
                />
              </th>
            )}
            {columns.map((col) => (
              <th
                key={col.key}
                className={`${col.width || ""} px-0 py-3.5 pr-4 text-left text-xs font-medium text-slate-500 ${
                  col.sortable ? "cursor-pointer select-none hover:text-slate-300" : ""
                }`}
                onClick={() => col.sortable && onSort?.(col.key)}
                scope="col"
                aria-sort={
                  col.sortable && sortKey === col.key
                    ? sortDir === "asc"
                      ? "ascending"
                      : "descending"
                    : undefined
                }
              >
                <div className="flex items-center gap-1">
                  {col.label}
                  {col.sortable && (
                    <span className="text-slate-600" aria-hidden="true">
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
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (selectable ? 1 : 0)}>
                {emptyState || (
                  <div className="py-12 text-center text-sm text-slate-500">
                    No data available
                  </div>
                )}
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr
                key={getItemId(item)}
                className={`group border-b border-slate-800/60 transition-colors ${
                  selectedIds.has(getItemId(item))
                    ? "bg-blue-600/5"
                    : "hover:bg-slate-900/60"
                }`}
              >
                {selectable && (
                  <td className="py-3.5 pl-5 pr-4">
                    <Checkbox
                      checked={selectedIds.has(getItemId(item))}
                      onChange={() => onSelectOne?.(getItemId(item))}
                    />
                  </td>
                )}
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`py-3.5 pr-4 ${col.cellClass || ""}`}
                  >
                    {col.render
                      ? col.render(item)
                      : item[col.key] ?? (
                          <span className="text-slate-500">&mdash;</span>
                        )}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
