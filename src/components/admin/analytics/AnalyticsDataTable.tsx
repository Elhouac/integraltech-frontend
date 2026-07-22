import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, TableProperties } from "lucide-react";
import type { AnalyticsTableCell, AnalyticsTableColumn, AnalyticsTableRow } from "../../../types/admin";

interface AnalyticsDataTableProps {
  title: string;
  description: string;
  columns: AnalyticsTableColumn[];
  rows: AnalyticsTableRow[];
}

interface SortState {
  key: string;
  direction: "asc" | "desc";
}

function compareCells(a: AnalyticsTableCell, b: AnalyticsTableCell): number {
  if (typeof a === "number" && typeof b === "number") return a - b;
  return String(a ?? "").localeCompare(String(b ?? ""), "fr", { numeric: true });
}

function formatCell(value: AnalyticsTableCell, columnKey: string): string | number {
  if (value === null || value === undefined) return "—";
  if (columnKey !== "size" || typeof value !== "number") return value;
  if (value === 0) return "0 o";
  const units = ["o", "Ko", "Mo", "Go"];
  const unitIndex = Math.min(Math.floor(Math.log(value) / Math.log(1024)), units.length - 1);
  return `${new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 1 }).format(value / 1024 ** unitIndex)} ${units[unitIndex]}`;
}

export default function AnalyticsDataTable({ title, description, columns, rows }: AnalyticsDataTableProps) {
  const [sort, setSort] = useState<SortState>({ key: "label", direction: "asc" });
  const tableId = `analytics-table-${title.replace(/[^a-z0-9]/gi, "-").toLowerCase()}`;

  const sortedRows = useMemo(() => {
    return [...rows].sort((a, b) => {
      const aValue: AnalyticsTableCell = sort.key === "label" ? a.label : a.values[sort.key];
      const bValue: AnalyticsTableCell = sort.key === "label" ? b.label : b.values[sort.key];
      const comparison = compareCells(aValue, bValue);
      return sort.direction === "asc" ? comparison : -comparison;
    });
  }, [rows, sort]);

  const toggleSort = (key: string) => {
    setSort((current) => current.key === key
      ? { key, direction: current.direction === "asc" ? "desc" : "asc" }
      : { key, direction: "asc" });
  };

  const SortIcon = ({ columnKey }: { columnKey: string }) => {
    if (sort.key !== columnKey) return <ArrowUpDown size={13} aria-hidden="true" />;
    return sort.direction === "asc"
      ? <ArrowUp size={13} aria-hidden="true" />
      : <ArrowDown size={13} aria-hidden="true" />;
  };

  return (
    <section className="admin-analytics-panel" aria-labelledby={tableId}>
      <div className="admin-analytics-section-heading">
        <div>
          <h3 id={tableId}>{title}</h3>
          <p>{description}</p>
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="admin-analytics-empty-inline">
          <TableProperties size={22} aria-hidden="true" />
          <p>Donnée indisponible en mode démonstration pour ce tableau.</p>
        </div>
      ) : (
        <div className="admin-analytics-table-scroll">
          <table>
            <caption>{description}</caption>
            <thead>
              <tr>
                <th scope="col" aria-sort={sort.key === "label" ? (sort.direction === "asc" ? "ascending" : "descending") : "none"}>
                  <button type="button" onClick={() => toggleSort("label")}>Module <SortIcon columnKey="label" /></button>
                </th>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    scope="col"
                    className={column.numeric ? "is-numeric" : undefined}
                    aria-sort={sort.key === column.key ? (sort.direction === "asc" ? "ascending" : "descending") : "none"}
                  >
                    {column.sortable ? (
                      <button type="button" onClick={() => toggleSort(column.key)}>{column.label} <SortIcon columnKey={column.key} /></button>
                    ) : column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedRows.map((row) => (
                <tr key={row.id}>
                  <th scope="row">{row.label}</th>
                  {columns.map((column) => (
                    <td key={column.key} className={column.numeric ? "is-numeric" : undefined}>
                      {formatCell(row.values[column.key], column.key)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
