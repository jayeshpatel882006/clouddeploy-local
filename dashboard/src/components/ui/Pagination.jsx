import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onChange,
  itemLabel = "items",
  className = "",
}) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const delta = 1;
    const rangeStart = Math.max(2, currentPage - delta);
    const rangeEnd = Math.min(totalPages - 1, currentPage + delta);
    pages.push(1);
    if (rangeStart > 2) pages.push("...");
    for (let i = rangeStart; i <= rangeEnd; i++) pages.push(i);
    if (rangeEnd < totalPages - 1) pages.push("...");
    if (totalPages > 1) pages.push(totalPages);
    return pages;
  };

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const btnBase =
    "flex h-8 w-8 items-center justify-center rounded-lg text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40";

  return (
    <div
      className={`flex items-center justify-between border-t border-slate-800 px-5 py-3 ${className}`}
    >
      <p className="text-xs text-slate-500">
        Showing{" "}
        <span className="font-medium text-slate-400">{startItem}</span> to{" "}
        <span className="font-medium text-slate-400">{endItem}</span> of{" "}
        <span className="font-medium text-slate-400">{totalItems}</span>{" "}
        {itemLabel}
      </p>

      <nav className="flex items-center gap-1" aria-label="Pagination">
        <button
          onClick={() => onChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`${btnBase} border border-slate-700 text-slate-400 hover:border-slate-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-40`}
          aria-label="Previous page"
        >
          <ChevronLeft size={15} />
        </button>

        {getPageNumbers().map((page, idx) =>
          page === "..." ? (
            <span
              key={`ellipsis-${idx}`}
              className="flex h-8 w-8 items-center justify-center text-xs text-slate-500"
            >
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onChange(page)}
              aria-current={currentPage === page ? "page" : undefined}
              aria-label={`Page ${page}`}
              className={`${btnBase} ${
                currentPage === page
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              {page}
            </button>
          )
        )}

        <button
          onClick={() => onChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`${btnBase} border border-slate-700 text-slate-400 hover:border-slate-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-40`}
          aria-label="Next page"
        >
          <ChevronRight size={15} />
        </button>
      </nav>
    </div>
  );
};

export default Pagination;
