import React from "react";

const PaginationBar = ({
  currentPage,
  totalPages,
  onPageChange,
  isLoading,
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center space-x-4 p-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || isLoading}
        className={`rounded-lg border px-4 py-2 transition-colors ${
          currentPage === 1 || isLoading
            ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
            : "border-slate-300 bg-white/70 text-slate-700 backdrop-blur-sm hover:border-slate-400 hover:bg-white"
        }`}
      >
        Previous
      </button>
      <span className="px-4 py-2 text-slate-600 dark:text-slate-400">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || isLoading}
        className={`rounded-lg border px-4 py-2 transition-colors ${
          currentPage === totalPages || isLoading
            ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
            : "border-slate-300 bg-white/70 text-slate-700 backdrop-blur-sm hover:border-slate-400 hover:bg-white"
        }`}
      >
        Next
      </button>
    </div>
  );
};

export default PaginationBar;

export function paginate(items, page = 1, perPage = 10) {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * perPage;
  return {
    data: items.slice(start, start + perPage),
    meta: { current_page: safePage, last_page: totalPages, total, per_page: perPage },
  };
}
