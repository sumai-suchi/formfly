"use client";

import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  basePath: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  basePath,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const from = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const to = Math.min(currentPage * pageSize, totalItems);

  // Helper to generate page URL
  const getPageUrl = (page: number) => {
    return page === 1 ? basePath : `${basePath}?page=${page}`;
  };

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) {
        pages.push("ellipsis");
      }
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) {
        pages.push("ellipsis");
      }
      pages.push(totalPages);
    }
    return pages;
  };

  const pages = getPageNumbers();

  return (
    <nav
      aria-label="Pagination"
      className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-white/8 text-xs text-slate-400"
    >
      {/* Item range summary */}
      <div>
        Showing <span className="font-semibold text-white">{from}</span> to{" "}
        <span className="font-semibold text-white">{to}</span> of{" "}
        <span className="font-semibold text-white">{totalItems}</span> results
      </div>

      {/* Pagination controls */}
      <div className="flex items-center gap-1.5">
        {/* Previous Button */}
        {currentPage > 1 ? (
          <Link
            href={getPageUrl(currentPage - 1)}
            className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-slate-800/80 px-3 py-1.5 font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            <span>Previous</span>
          </Link>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-lg border border-white/5 bg-slate-900/50 px-3 py-1.5 font-medium text-slate-600 cursor-not-allowed">
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            <span>Previous</span>
          </span>
        )}

        {/* Page numbers (hidden on very small mobile, visible on sm+) */}
        <div className="hidden sm:flex items-center gap-1">
          {pages.map((p, idx) => {
            if (p === "ellipsis") {
              return (
                <span key={`ellipsis-${idx}`} className="px-2 text-slate-600">
                  …
                </span>
              );
            }
            const isCurrent = p === currentPage;
            return isCurrent ? (
              <span
                key={p}
                aria-current="page"
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 font-semibold text-white shadow-sm shadow-indigo-600/30"
              >
                {p}
              </span>
            ) : (
              <Link
                key={p}
                href={getPageUrl(p)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-slate-800/80 font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition"
              >
                {p}
              </Link>
            );
          })}
        </div>

        {/* Mobile current page indicator */}
        <span className="sm:hidden px-2 text-xs font-medium text-slate-300">
          Page {currentPage} of {totalPages}
        </span>

        {/* Next Button */}
        {currentPage < totalPages ? (
          <Link
            href={getPageUrl(currentPage + 1)}
            className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-slate-800/80 px-3 py-1.5 font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition"
          >
            <span>Next</span>
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-lg border border-white/5 bg-slate-900/50 px-3 py-1.5 font-medium text-slate-600 cursor-not-allowed">
            <span>Next</span>
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </span>
        )}
      </div>
    </nav>
  );
}
