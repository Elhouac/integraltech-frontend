import React from "react";
import { Search, RotateCcw, Filter, UserCheck, Globe } from "lucide-react";
import type { AuditAction, AuditResourceType, AuditSeverity, AuditOutcome, AuditSource } from "../../../types/admin";
import { BORDER, SURFACE, TEXT, TEXT_SECONDARY, ACCENT } from "../../../constants";

export type AuditDateFilter = "all" | "today" | "7days" | "30days";
export type AuditSortOption = "newest" | "oldest" | "severity" | "outcome";

interface AuditFiltersProps {
  scope: "my_activity" | "global";
  onScopeChange: (scope: "my_activity" | "global") => void;
  canViewGlobal: boolean;

  search: string;
  onSearchChange: (search: string) => void;
  dateFilter: AuditDateFilter;
  onDateFilterChange: (date: AuditDateFilter) => void;
  actionFilter: string;
  onActionFilterChange: (action: string) => void;
  resourceFilter: string;
  onResourceFilterChange: (resource: string) => void;
  severityFilter: string;
  onSeverityFilterChange: (severity: string) => void;
  outcomeFilter: string;
  onOutcomeFilterChange: (outcome: string) => void;
  sourceFilter: string;
  onSourceFilterChange: (source: string) => void;
  actorFilter: string;
  onActorFilterChange: (actor: string) => void;
  actorOptions: { id: number; label: string }[];
  roleFilter: string;
  onRoleFilterChange: (role: string) => void;
  sortBy: AuditSortOption;
  onSortByChange: (sort: AuditSortOption) => void;

  onReset: () => void;
  isFiltered: boolean;
}

const ACTION_OPTIONS: { key: string; label: string }[] = [
  { key: "all", label: "Toutes les actions" },
  { key: "create", label: "Création" },
  { key: "update", label: "Mise à jour" },
  { key: "submit_review", label: "Soumission révision" },
  { key: "approve", label: "Approbation / Publication" },
  { key: "archive", label: "Archivage / Restauration" },
  { key: "delete", label: "Suppression" },
  { key: "profile_update", label: "Profil & Préférences" },
  { key: "password_change_simulation", label: "Mot de passe (Simulé)" },
  { key: "session_revoke_simulation", label: "Révocation de session" },
  { key: "export", label: "Exportation" },
  { key: "access_denied", label: "Accès refusé" },
  { key: "system", label: "Système" },
];

const RESOURCE_OPTIONS: { key: string; label: string }[] = [
  { key: "all", label: "Toutes les ressources" },
  { key: "service", label: "Services" },
  { key: "solution", label: "Solutions" },
  { key: "media", label: "Médiathèque" },
  { key: "profile", label: "Profil" },
  { key: "session", label: "Sessions" },
  { key: "notification", label: "Notifications" },
  { key: "post", label: "Articles" },
  { key: "lead", label: "Prospects" },
  { key: "settings", label: "Paramètres" },
  { key: "system", label: "Système" },
];

const SEVERITY_OPTIONS: { key: string; label: string }[] = [
  { key: "all", label: "Toutes les sévérités" },
  { key: "info", label: "Information (Info)" },
  { key: "warning", label: "Avertissement (Warning)" },
  { key: "critical", label: "Critique (Critical)" },
];

const OUTCOME_OPTIONS: { key: string; label: string }[] = [
  { key: "all", label: "Tous les résultats" },
  { key: "success", label: "Succès" },
  { key: "denied", label: "Refusé" },
  { key: "failed", label: "Échec" },
];

const SOURCE_OPTIONS: { key: string; label: string }[] = [
  { key: "all", label: "Toutes les sources" },
  { key: "demo_seed", label: "Données de démonstration" },
  { key: "current_session", label: "Session actuelle" },
];

const ROLE_OPTIONS: { key: string; label: string }[] = [
  { key: "all", label: "Tous les rôles" },
  { key: "super_admin", label: "Super Admin" },
  { key: "admin", label: "Administrateur" },
  { key: "editor", label: "Éditeur" },
  { key: "support", label: "Support" },
  { key: "viewer", label: "Observateur" },
  { key: "reader", label: "Lecteur" },
];

const DATE_OPTIONS: { key: AuditDateFilter; label: string }[] = [
  { key: "all", label: "Toutes les dates" },
  { key: "today", label: "Aujourd'hui" },
  { key: "7days", label: "7 derniers jours" },
  { key: "30days", label: "30 derniers jours" },
];

const SORT_OPTIONS: { key: AuditSortOption; label: string }[] = [
  { key: "newest", label: "Plus récents d'abord" },
  { key: "oldest", label: "Plus anciens d'abord" },
  { key: "severity", label: "Sévérité (Critique d'abord)" },
  { key: "outcome", label: "Résultat (Refusés/Échecs d'abord)" },
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
  minWidth: 0,
  maxWidth: "100%",
};

const filterFieldStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 6,
  flex: "1 1 180px",
  minWidth: 0,
};

const visibleFilterLabelStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  color: TEXT_SECONDARY,
  fontFamily: "var(--font-sans)",
  whiteSpace: "nowrap",
};

export default function AuditFilters({
  scope,
  onScopeChange,
  canViewGlobal,
  search,
  onSearchChange,
  dateFilter,
  onDateFilterChange,
  actionFilter,
  onActionFilterChange,
  resourceFilter,
  onResourceFilterChange,
  severityFilter,
  onSeverityFilterChange,
  outcomeFilter,
  onOutcomeFilterChange,
  sourceFilter,
  onSourceFilterChange,
  actorFilter,
  onActorFilterChange,
  actorOptions,
  roleFilter,
  onRoleFilterChange,
  sortBy,
  onSortByChange,
  onReset,
  isFiltered,
}: AuditFiltersProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Scope Selector Tabs + Search Bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
        {/* Scope Tabs */}
        <div style={{ display: "flex", gap: 4, borderBottom: `1px solid ${BORDER}` }}>
          <button
            onClick={() => onScopeChange("my_activity")}
            className={`admin-profile-tab${scope === "my_activity" ? " active" : ""}`}
            style={{ fontSize: 13, padding: "8px 14px", display: "inline-flex", alignItems: "center", gap: 6 }}
          >
            <UserCheck size={14} />
            <span>Mon activité</span>
          </button>
          {canViewGlobal && (
            <button
              onClick={() => onScopeChange("global")}
              className={`admin-profile-tab${scope === "global" ? " active" : ""}`}
              style={{ fontSize: 13, padding: "8px 14px", display: "inline-flex", alignItems: "center", gap: 6 }}
            >
              <Globe size={14} />
              <span>Journal global</span>
            </button>
          )}
        </div>

        {/* Search Bar */}
        <div style={{ position: "relative", minWidth: 220, flex: "1 1 240px", maxWidth: 400 }}>
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
            aria-label="Rechercher dans le journal d’activité"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Rechercher par ID, acteur, action, description, ressource..."
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

      {/* Detailed Filters & Sort Controls */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, color: TEXT_SECONDARY, fontFamily: "var(--font-sans)" }}>
          <Filter size={14} />
          <span>Filtres :</span>
        </div>

        {/* Date Filter */}
        <select aria-label="Date" value={dateFilter} onChange={(e) => onDateFilterChange(e.target.value as AuditDateFilter)} style={{ ...selectStyle, flex: "1 1 170px" }}>
          {DATE_OPTIONS.map((opt) => (
            <option key={opt.key} value={opt.key}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Action Filter */}
        <select aria-label="Action" value={actionFilter} onChange={(e) => onActionFilterChange(e.target.value)} style={{ ...selectStyle, flex: "1 1 170px" }}>
          {ACTION_OPTIONS.map((opt) => (
            <option key={opt.key} value={opt.key}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Resource Filter */}
        <select aria-label="Ressource" value={resourceFilter} onChange={(e) => onResourceFilterChange(e.target.value)} style={{ ...selectStyle, flex: "1 1 170px" }}>
          {RESOURCE_OPTIONS.map((opt) => (
            <option key={opt.key} value={opt.key}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Severity Filter */}
        <select aria-label="Sévérité" value={severityFilter} onChange={(e) => onSeverityFilterChange(e.target.value)} style={{ ...selectStyle, flex: "1 1 170px" }}>
          {SEVERITY_OPTIONS.map((opt) => (
            <option key={opt.key} value={opt.key}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Outcome Filter */}
        <label style={filterFieldStyle}>
          <span style={visibleFilterLabelStyle}>Résultat :</span>
          <select value={outcomeFilter} onChange={(e) => onOutcomeFilterChange(e.target.value)} style={{ ...selectStyle, flex: 1 }}>
            {OUTCOME_OPTIONS.map((opt) => (
              <option key={opt.key} value={opt.key}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>

        {/* Source Filter */}
        <label style={filterFieldStyle}>
          <span style={visibleFilterLabelStyle}>Source :</span>
          <select value={sourceFilter} onChange={(e) => onSourceFilterChange(e.target.value)} style={{ ...selectStyle, flex: 1 }}>
            {SOURCE_OPTIONS.map((opt) => (
              <option key={opt.key} value={opt.key}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>

        {/* Actor and role filters are relevant only to the authorized global scope. */}
        {canViewGlobal && scope === "global" && (
          <select aria-label="Acteur" value={actorFilter} onChange={(e) => onActorFilterChange(e.target.value)} style={{ ...selectStyle, flex: "1 1 170px" }}>
            <option value="all">Tous les acteurs</option>
            {actorOptions.map((actor) => (
              <option key={actor.id} value={String(actor.id)}>
                {actor.label}
              </option>
            ))}
          </select>
        )}

        {/* Role Filter (only if global scope) */}
        {canViewGlobal && scope === "global" && (
          <select aria-label="Rôle" value={roleFilter} onChange={(e) => onRoleFilterChange(e.target.value)} style={{ ...selectStyle, flex: "1 1 170px" }}>
            {ROLE_OPTIONS.map((opt) => (
              <option key={opt.key} value={opt.key}>
                {opt.label}
              </option>
            ))}
          </select>
        )}

        {/* Sort Select */}
        <label style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8, flex: "1 1 230px", minWidth: 0, justifyContent: "flex-end" }}>
          <span style={{ fontSize: 12, color: TEXT_SECONDARY, fontFamily: "var(--font-sans)" }}>Trier par :</span>
          <select value={sortBy} onChange={(e) => onSortByChange(e.target.value as AuditSortOption)} style={{ ...selectStyle, minWidth: 0 }}>
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.key} value={opt.key}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>

        {/* Reset Button */}
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
