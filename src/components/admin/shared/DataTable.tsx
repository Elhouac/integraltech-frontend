import { memo } from "react";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { BORDER, SURFACE, TEXT, TEXT_SECONDARY } from "../../../constants";

// ── Types ──

export interface Column<T> {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string | number;
  render?: (item: T, index: number) => React.ReactNode;
}

export interface SortState {
  key: string;
  direction: "asc" | "desc";
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  sort?: SortState;
  onSort?: (key: string) => void;
  getRowKey: (item: T) => string | number;
  onRowClick?: (item: T) => void;
  emptyContent?: React.ReactNode;
}

function DataTableInner<T>({
  columns,
  data,
  loading,
  sort,
  onSort,
  getRowKey,
  onRowClick,
  emptyContent,
}: DataTableProps<T>) {
  const SortIcon = ({ columnKey }: { columnKey: string }) => {
    if (sort?.key !== columnKey) return <ArrowUpDown size={12} aria-hidden="true" style={{ opacity: 0.3 }} />;
    return sort.direction === "asc"
      ? <ArrowUp size={12} aria-hidden="true" style={{ opacity: 0.7 }} />
      : <ArrowDown size={12} aria-hidden="true" style={{ opacity: 0.7 }} />;
  };

  return (
    <div className="admin-data-table-wrapper" style={{ overflow: "auto" }}>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontFamily: "var(--font-sans)",
          fontSize: 13,
        }}
      >
        {/* Head */}
        <thead>
          <tr>
            {columns.map((col) => {
              const isSortable = Boolean(col.sortable && onSort);
              const ariaSort = isSortable
                ? sort?.key === col.key
                  ? sort.direction === "asc" ? "ascending" : "descending"
                  : "none"
                : undefined;

              return (
                <th
                  key={col.key}
                  scope="col"
                  aria-sort={ariaSort}
                  style={{
                    padding: "12px 16px",
                    textAlign: "left",
                    fontSize: 11,
                    fontWeight: 600,
                    color: TEXT_SECONDARY,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    borderBottom: `1px solid ${BORDER}`,
                    background: SURFACE,
                    whiteSpace: "nowrap",
                    userSelect: isSortable ? "none" : "auto",
                    width: col.width,
                    position: "sticky",
                    top: 0,
                    zIndex: 1,
                  }}
                >
                  {isSortable ? (
                    <button
                      type="button"
                      onClick={() => onSort?.(col.key)}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                        padding: 0,
                        border: "none",
                        background: "transparent",
                        color: "inherit",
                        font: "inherit",
                        textTransform: "inherit",
                        letterSpacing: "inherit",
                        cursor: "pointer",
                      }}
                    >
                      {col.label}
                      <SortIcon columnKey={col.key} />
                    </button>
                  ) : (
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      {col.label}
                    </div>
                  )}
                </th>
              );
            })}
          </tr>
        </thead>

        {/* Body */}
        <tbody>
          {loading ? (
            // Loading skeleton rows
            Array.from({ length: 5 }).map((_, i) => (
              <tr key={`skeleton-${i}`}>
                {columns.map((col) => (
                  <td
                    key={col.key}
                    style={{ padding: "14px 16px", borderBottom: `1px solid ${BORDER}` }}
                  >
                    <div
                      className="admin-table-skeleton"
                      style={{
                        height: 14,
                        borderRadius: 4,
                        background: "var(--hover)",
                        opacity: 0.5,
                        width: `${60 + ((i + col.key.length) % 4) * 10}%`,
                      }}
                    />
                  </td>
                ))}
              </tr>
            ))
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} style={{ padding: 0 }}>
                {emptyContent}
              </td>
            </tr>
          ) : (
            data.map((item, rowIndex) => (
              <tr
                key={getRowKey(item)}
                onClick={onRowClick ? () => onRowClick(item) : undefined}
                style={{
                  cursor: onRowClick ? "pointer" : "default",
                  transition: "background 0.12s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--hover)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    style={{
                      padding: "12px 16px",
                      borderBottom: `1px solid ${BORDER}`,
                      color: TEXT,
                      verticalAlign: "middle",
                    }}
                  >
                    {col.render
                      ? col.render(item, rowIndex)
                      : String((item as Record<string, unknown>)[col.key] ?? "")}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

// Type-safe memo wrapper
const DataTable = memo(DataTableInner) as typeof DataTableInner;
export default DataTable;
