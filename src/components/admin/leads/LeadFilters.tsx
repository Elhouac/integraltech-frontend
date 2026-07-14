import SearchInput from "../shared/SearchInput";
import { BORDER, SURFACE, TEXT, ACCENT } from "../../../constants";
import { LEAD_STATUS_CONFIG } from "../../../data/admin-mocks";
import type { LeadStatus } from "../../../data/admin-mocks";

interface LeadFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: LeadStatus | "all";
  onStatusChange: (status: LeadStatus | "all") => void;
}

const STATUS_OPTIONS: { value: LeadStatus | "all"; label: string }[] = [
  { value: "all", label: "Tous les statuts" },
  ...Object.entries(LEAD_STATUS_CONFIG).map(([key, config]) => ({
    value: key as LeadStatus,
    label: config.label,
  })),
];

export default function LeadFilters({
  search,
  onSearchChange,
  statusFilter,
  onStatusChange,
}: LeadFiltersProps) {
  return (
    <div
      className="admin-lead-filters"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        flexWrap: "wrap",
      }}
    >
      {/* Search */}
      <div style={{ flex: "1 1 240px", minWidth: 200 }}>
        <SearchInput
          value={search}
          onChange={onSearchChange}
          placeholder="Rechercher un lead…"
        />
      </div>

      {/* Status dropdown */}
      <select
        value={statusFilter}
        onChange={(e) => onStatusChange(e.target.value as LeadStatus | "all")}
        aria-label="Filtrer par statut"
        style={{
          padding: "8px 32px 8px 12px",
          border: `1px solid ${BORDER}`,
          borderRadius: "var(--radius-md)",
          background: SURFACE,
          color: TEXT,
          fontSize: 13,
          fontFamily: "var(--font-sans)",
          cursor: "pointer",
          outline: "none",
          appearance: "none",
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 10px center",
          transition: "border-color 0.2s",
        }}
        onFocus={(e) => { e.currentTarget.style.borderColor = ACCENT; }}
        onBlur={(e) => { e.currentTarget.style.borderColor = BORDER; }}
      >
        {STATUS_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
