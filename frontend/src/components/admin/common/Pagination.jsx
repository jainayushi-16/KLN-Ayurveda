import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ pagination, onPageChange }) {
  if (!pagination || pagination.totalPages <= 1) return null;

  const { page, totalPages, totalItems } = pagination;

  return (
    <div className="flex items-center justify-between p-4 border-t border-white/10 text-xs text-[#a3b8ad]">
      <div>
        Showing page <strong className="text-[#f5f8f6]">{page}</strong> of <strong className="text-[#f5f8f6]">{totalPages}</strong> ({totalItems} records)
      </div>

      <div className="flex gap-2">
        <button
          className="btn-secondary py-1.5 px-3"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          style={{ opacity: page <= 1 ? 0.5 : 1 }}
        >
          <ChevronLeft size={16} />
          <span>Previous</span>
        </button>
        <button
          className="btn-secondary py-1.5 px-3"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          style={{ opacity: page >= totalPages ? 0.5 : 1 }}
        >
          <span>Next</span>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
