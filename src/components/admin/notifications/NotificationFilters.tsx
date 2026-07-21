import React from "react";
import { Search, RotateCcw, Filter } from "lucide-react";
import type { NotificationType, NotificationPriority, NotificationStatus } from "../../../types/admin";
import { BORDER, SURFACE, TEXT, TEXT_SECONDARY } from "../../../constants";

export type DateFilterOption = "all" | "today" | "7days" | "30days";
export type SortOption = "newest" | "oldest" | "priority" | "unread_first";

interface NotificationFiltersProps {
  search: string;
  onSearchChange: (search: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  typeFilter: string;
  onTypeFilterChange: (type: string) => void;
  priorityFilter: string;
  onPriorityFilterChange: (priority: string) => void;
  dateFilter: DateFilterOption;
  onDateFilterChange: (date: DateFilterOption) => void;
  sortBy: SortOption;
  onSortByChange: (sort: SortOption) => void;
  onReset: () => void;
  isFiltered: boolean;
}

const STATUS_TABS: { key: string; label: string }[] = [
  { key: "all", label: "Toutes" },
  { key: "unread", label: "Non lues" },
  { key: "read", label: "Lues" },
  { key: "archived", label: "Archivées" },
];

const TYPE_OPTIONS: { key: string; label: string }[] = [
  { key: "all", label: "Tous les types" },
  { key: "system", label: "Système" },
  { key: "content", label: "Contenu" },
  { key: "review", label: "Révision" },
  { key: "security", label: "Sécurité" },
  { key: "lead", label: "Prospects" },
  { key: "media", label: "Médiathèque" },
  { key: "account", label: "Compte" },
];

const PRIORITY_OPTIONS: { key: string; label: string }[] = [
  { key: "all", label: "Toutes les priorités" },
  { key: "low", label: "Basse" },
  { key: "normal", label: "Normale" },
  { key: "high", label: "Haute" },
  { key: "critical", label: "Critique" },
];

const DATE_OPTIONS: { key: DateFilterOption; label: string }[] = [
  { key: "all", label: "Toutes les dates" },
  { key: "today", label: "Aujourd'hui" },
  { key: "7days", label: "7 derniers jours" },
  { key: "30days", label: "30 derniers jours" },
];

const SORT_OPTIONS: { key: SortOption; label: string }[] = [
  { key: "newest", label: "Plus récentes d'abord" },
  { key: "oldest", label: "Plus anciennes d'abord" },
  { key: "priority", label: "Priorité haute d'abord" },
  { key: "unread_first", label: "Non lues d'abord" },
];

const selectStyle: React.CSSProperties = {
  padding: "8px 12px",
  fontSize: 13,
  fontFamily: "var(--font-sans)",
  color: TEXT,
  background: SURFACE,
  border: `1px solid ${BORDER}`,
  borderRadius: "var(--radius-md)",
  cursor: "pointer",
  outline: "none",
};

export default function NotificationFilters({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  typeFilter,
  onTypeFilterChange,
  priorityFilter,
  onPriorityFilterChange,
  dateFilter,
  onDateFilterChange,
  sortBy,
  onSortByChange,
  onReset,
  isFiltered,
}: NotificationFiltersProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Top row: Status tabs + Search bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
        {/* Status Filter Tabs */}
        <div style={{ display: "flex", gap: 4, borderBottom: `1px solid ${BORDER}`, overflowX: "auto" }}>
          {STATUS_TABS.map((tab) => {
            const isActive = statusFilter === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => onStatusFilterChange(tab.key)}
                className={`admin-profile-tab${isActive ? " active" : ""}`}
                style={{ fontSize: 13, padding: "8px 14px" }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div style={{ position: "relative", minWidth: 220, flex: "1 1 220px", maxWidth: 360 }}>
          <Search
            size={15}
            style={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              color: TEXT_SECONDARY,
            }}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Rechercher une notification..."
            style={{
              width: "100%",
              padding: "8px 12px 8px 36px",
              fontSize: 13,
              fontFamily: "var(--font-sans)",
              color: TEXT,
              background: SURFACE,
              border: `1px solid ${BORDER}`,
              borderRadius: "var(--radius-md)",
              outline: "none",
            }}
          />
        </div>
      </div>

      {/* Second row: Dropdown filters + Sort + Reset */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, color: TEXT_SECONDARY, fontFamily: "var(--font-sans)" }}>
          <Filter size={14} />
          <span>Filtres :</span>
        </div>

        {/* Type select */}
        <select value={typeFilter} onChange={(e) => onTypeFilterChange(e.target.value)} style={selectStyle}>
          {TYPE_OPTIONS.map((opt) => (
            <option key={opt.key} value={opt.key}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Priority select */}
        <select value={priorityFilter} onChange={(e) => onPriorityFilterChange(e.target.value)} style={selectStyle}>
          {PRIORITY_OPTIONS.map((opt) => (
            <option key={opt.key} value={opt.key}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Date select */}
        <select value={dateFilter} onChange={(e) => onDateFilterChange(e.target.value as DateFilterOption)} style={selectStyle}>
          {DATE_OPTIONS.map((opt) => (
            <option key={opt.key} value={opt.key}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Sort select */}
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 12, color: TEXT_SECONDARY, fontFamily: "var(--font-sans)" }}>Trier par :</span>
          <select value={sortBy} onChange={(e) => onSortByChange(e.target.value as SortOption)} style={selectStyle}>
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.key} value={opt.key}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Reset filters button */}
        {isFiltered && (
          <button
            onClick={onReset}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              padding: "7px 12px",
              border: `1px solid ${BORDER}`,
              borderRadius: "var(--radius-md)",
              background: SURFACE,
              color: TEXT_SECONDARY,
              fontSize: 12,
              fontFamily: "var(--font-sans)",
              cursor: "pointer",
            }}
          >
            <RotateCcw size={13} /> Réinitialiser
          </button>
        )}
      </div>
    </div>
  );
}
