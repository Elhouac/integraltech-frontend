import { memo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ACCENT, BORDER, TEXT, TEXT_SECONDARY, SURFACE } from "../../../constants";

export interface PaginationMeta {
  page: number;
  perPage: number;
  total: number;
}

interface PaginationProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
}

function PaginationComponent({ meta, onPageChange }: PaginationProps) {
  const { page, perPage, total } = meta;
  const totalPages = Math.ceil(total / perPage);
  if (totalPages <= 1) return null;

  const from = (page - 1) * perPage + 1;
  const to = Math.min(page * perPage, total);

  // Generate page numbers with ellipsis
  const getPages = (): (number | "...")[] => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push("...");
      for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
        pages.push(i);
      }
      if (page < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  const buttonBase: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 32,
    height: 32,
    padding: "0 8px",
    border: `1px solid ${BORDER}`,
    borderRadius: "var(--radius-sm)",
    background: SURFACE,
    color: TEXT,
    fontSize: 13,
    fontWeight: 500,
    fontFamily: "var(--font-sans)",
    cursor: "pointer",
    transition: "background 0.15s, border-color 0.15s",
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 12,
        paddingTop: 16,
      }}
    >
      {/* Info */}
      <span style={{ fontSize: 12, color: TEXT_SECONDARY, fontFamily: "var(--font-sans)" }}>
        Affichage {from}–{to} sur {total} résultats
      </span>

      {/* Controls */}
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        {/* Prev */}
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          aria-label="Page précédente"
          style={{
            ...buttonBase,
            opacity: page === 1 ? 0.4 : 1,
            cursor: page === 1 ? "not-allowed" : "pointer",
          }}
        >
          <ChevronLeft size={14} />
        </button>

        {/* Pages */}
        {getPages().map((p, i) =>
          p === "..." ? (
            <span
              key={`ellipsis-${i}`}
              style={{ ...buttonBase, border: "none", background: "none", cursor: "default", color: TEXT_SECONDARY }}
            >
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              aria-current={p === page ? "page" : undefined}
              style={{
                ...buttonBase,
                background: p === page ? ACCENT : SURFACE,
                color: p === page ? "#fff" : TEXT,
                borderColor: p === page ? ACCENT : BORDER,
                fontWeight: p === page ? 700 : 500,
              }}
            >
              {p}
            </button>
          )
        )}

        {/* Next */}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          aria-label="Page suivante"
          style={{
            ...buttonBase,
            opacity: page === totalPages ? 0.4 : 1,
            cursor: page === totalPages ? "not-allowed" : "pointer",
          }}
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}

const Pagination = memo(PaginationComponent);
export default Pagination;
