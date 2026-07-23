import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Info, ShieldCheck, Lock } from "lucide-react";
import AuditSummaryCards from "../../../components/admin/audit/AuditSummaryCards";
import AuditFilters, { AuditDateFilter, AuditSortOption } from "../../../components/admin/audit/AuditFilters";
import AuditEventList from "../../../components/admin/audit/AuditEventList";
import AuditEventDetailsDialog from "../../../components/admin/audit/AuditEventDetailsDialog";
import AuditExportDialog from "../../../components/admin/audit/AuditExportDialog";
import Pagination from "../../../components/admin/shared/Pagination";
import type { PaginationMeta } from "../../../components/admin/shared/Pagination";
import { adminService } from "../../../services/adminService";
import { useAuth } from "../../../context/AuthContext";
import type { AdminAuditEvent, AuditSeverity, AuditOutcome } from "../../../types/admin";
import { ACCENT, BORDER, SURFACE, TEXT, TEXT_SECONDARY, DANGER } from "../../../constants";

const ITEMS_PER_PAGE = 10;

export default function AdminAuditLogPage() {
  const { user } = useAuth();
  const userId = user?.id || 1;
  const role = user?.role || "reader";

  const canViewGlobal = role === "super_admin" || role === "admin";

  const [scope, setScope] = useState<"my_activity" | "global">(canViewGlobal ? "global" : "my_activity");
  const [events, setEvents] = useState<AdminAuditEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Filters State
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState<AuditDateFilter>("all");
  const [actionFilter, setActionFilter] = useState("all");
  const [resourceFilter, setResourceFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [outcomeFilter, setOutcomeFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [actorFilter, setActorFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [sortBy, setSortBy] = useState<AuditSortOption>("newest");
  const [currentPage, setCurrentPage] = useState(1);

  // Dialog States
  const [selectedEventDetails, setSelectedEventDetails] = useState<AdminAuditEvent | null>(null);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);

  const fetchAuditEvents = useCallback(async () => {
    setLoading(true);
    setLoadError(false);
    try {
      const data = await adminService.getCurrentUserAuditEvents(userId, role, scope);
      setEvents(data);
    } catch {
      setEvents([]);
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }, [userId, role, scope]);

  useEffect(() => {
    fetchAuditEvents();
  }, [fetchAuditEvents]);

  useEffect(() => {
    if (!canViewGlobal && scope !== "my_activity") {
      setScope("my_activity");
      setActorFilter("all");
      setRoleFilter("all");
      setExportDialogOpen(false);
    }
  }, [canViewGlobal, scope]);

  const showToast = (msg: string) => {
    setToast(msg);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => () => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
  }, []);

  // Filter & Search Logic
  const filteredEvents = useMemo(() => {
    return events.filter((item) => {
      // Date filter
      if (dateFilter !== "all") {
        const itemDate = new Date(item.createdAt).getTime();
        const now = Date.now();
        if (dateFilter === "today") {
          const startOfDay = new Date();
          startOfDay.setHours(0, 0, 0, 0);
          if (itemDate < startOfDay.getTime()) return false;
        } else if (dateFilter === "7days") {
          if (now - itemDate > 7 * 24 * 60 * 60 * 1000) return false;
        } else if (dateFilter === "30days") {
          if (now - itemDate > 30 * 24 * 60 * 60 * 1000) return false;
        }
      }

      // Action filter
      if (actionFilter !== "all" && item.action !== actionFilter) return false;

      // Resource filter
      if (resourceFilter !== "all" && item.resourceType !== resourceFilter) return false;

      // Severity filter
      if (severityFilter !== "all" && item.severity !== severityFilter) return false;

      // Outcome filter
      if (outcomeFilter !== "all" && item.outcome !== outcomeFilter) return false;

      // Source filter
      if (sourceFilter !== "all" && item.source !== sourceFilter) return false;

      // Actor and role filters are available only in the authorized global scope
      if (canViewGlobal && scope === "global" && actorFilter !== "all" && String(item.actorUserId) !== actorFilter) return false;

      // Role filter (only relevant if scope === global)
      if (canViewGlobal && scope === "global" && roleFilter !== "all" && item.actorRole !== roleFilter) return false;

      // Search query
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchId = String(item.id).includes(q);
        const matchActor = item.actorDisplayName.toLowerCase().includes(q);
        const matchDesc = item.description.toLowerCase().includes(q);
        const matchResource = item.resourceLabel.toLowerCase().includes(q);
        const matchResourceType = item.resourceType.toLowerCase().includes(q);
        const matchAction = item.action.toLowerCase().includes(q);

        if (!matchId && !matchActor && !matchDesc && !matchResource && !matchResourceType && !matchAction) {
          return false;
        }
      }

      return true;
    });
  }, [events, dateFilter, actionFilter, resourceFilter, severityFilter, outcomeFilter, sourceFilter, actorFilter, roleFilter, search, scope, canViewGlobal]);

  const actorOptions = useMemo(() => {
    const actors = new Map<number, string>();
    events.forEach((event) => actors.set(event.actorUserId, event.actorDisplayName));
    return Array.from(actors, ([id, label]) => ({ id, label })).sort((a, b) => a.label.localeCompare(b.label, "fr"));
  }, [events]);

  // Sort Logic
  const sortedEvents = useMemo(() => {
    const list = [...filteredEvents];

    const severityWeight: Record<AuditSeverity, number> = {
      critical: 3,
      warning: 2,
      info: 1,
    };

    const outcomeWeight: Record<AuditOutcome, number> = {
      failed: 3,
      denied: 2,
      success: 1,
    };

    return list.sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === "oldest") {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      if (sortBy === "severity") {
        return severityWeight[b.severity] - severityWeight[a.severity];
      }
      if (sortBy === "outcome") {
        return outcomeWeight[b.outcome] - outcomeWeight[a.outcome];
      }
      return 0;
    });
  }, [filteredEvents, sortBy]);

  // Reset pagination on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, dateFilter, actionFilter, resourceFilter, severityFilter, outcomeFilter, sourceFilter, actorFilter, roleFilter, sortBy, scope]);

  // Pagination calculation
  const totalItems = sortedEvents.length;
  const paginatedEvents = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedEvents.slice(start, start + ITEMS_PER_PAGE);
  }, [sortedEvents, currentPage]);

  const paginationMeta: PaginationMeta = {
    page: currentPage,
    perPage: ITEMS_PER_PAGE,
    total: totalItems,
  };

  // Metrics summary
  const summaryMetrics = useMemo(() => {
    const todayStr = new Date().toISOString().slice(0, 10);
    return {
      total: filteredEvents.length,
      today: filteredEvents.filter((e) => e.createdAt.startsWith(todayStr)).length,
      success: filteredEvents.filter((e) => e.outcome === "success").length,
      deniedFailed: filteredEvents.filter((e) => e.outcome === "denied" || e.outcome === "failed").length,
      highCritical: filteredEvents.filter((e) => e.severity === "warning" || e.severity === "critical").length,
      currentSession: filteredEvents.filter((e) => e.source === "current_session").length,
    };
  }, [filteredEvents]);

  const isFiltered =
    search !== "" ||
    dateFilter !== "all" ||
    actionFilter !== "all" ||
    resourceFilter !== "all" ||
    severityFilter !== "all" ||
    outcomeFilter !== "all" ||
    sourceFilter !== "all" ||
    actorFilter !== "all" ||
    roleFilter !== "all" ||
    sortBy !== "newest";

  const handleResetFilters = () => {
    setSearch("");
    setDateFilter("all");
    setActionFilter("all");
    setResourceFilter("all");
    setSeverityFilter("all");
    setOutcomeFilter("all");
    setSourceFilter("all");
    setActorFilter("all");
    setRoleFilter("all");
    setSortBy("newest");
    setCurrentPage(1);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Page Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, fontFamily: "var(--font-display)", color: TEXT, margin: 0 }}>
            Journal d’activité
          </h1>
          <p style={{ fontSize: 13, color: TEXT_SECONDARY, fontFamily: "var(--font-sans)", margin: "4px 0 0" }}>
            Historique des actions d'administration, événements système et modifications de contenu.
          </p>
        </div>

        {/* Export Button */}
        {canViewGlobal && (
          <button
            onClick={() => setExportDialogOpen(true)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 16px",
              border: `1px solid ${BORDER}`,
              borderRadius: "var(--radius-md)",
              background: SURFACE,
              color: TEXT,
              fontSize: 13,
              fontWeight: 600,
              fontFamily: "var(--font-sans)",
              cursor: "pointer",
            }}
          >
            <Download size={14} style={{ color: ACCENT }} />
            <span>Exporter le journal</span>
          </button>
        )}
      </div>

      {/* Demonstration Warning Banner */}
      <div className="admin-settings-demo-notice" role="status">
        <Info size={16} style={{ flexShrink: 0, marginTop: 1, color: ACCENT }} />
        <span>Mode démonstration : ce journal est temporaire, non persistant et ne constitue pas un journal d’audit serveur certifié.</span>
      </div>

      {/* Scope Access Notice */}
      <div
        style={{
          padding: "10px 14px",
          borderRadius: "var(--radius-md)",
          background: "var(--background)",
          border: `1px solid ${BORDER}`,
          fontSize: 12,
          color: TEXT_SECONDARY,
          fontFamily: "var(--font-sans)",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <Lock size={14} style={{ color: ACCENT, flexShrink: 0 }} />
        <span>
          {canViewGlobal
            ? "Accès étendu (Administrateur) : Vous pouvez basculer entre votre activité personnelle et le journal global de l'organisation."
            : "Accès restreint (Rôle limité) : Conformément au modèle de sécurité, vous ne pouvez consulter que votre propre historique d'activité."}
        </span>
      </div>

      {/* Summary Metrics Cards */}
      <AuditSummaryCards summary={summaryMetrics} />

      {/* Search & Filters */}
      <AuditFilters
        scope={scope}
        onScopeChange={setScope}
        canViewGlobal={canViewGlobal}
        search={search}
        onSearchChange={setSearch}
        dateFilter={dateFilter}
        onDateFilterChange={setDateFilter}
        actionFilter={actionFilter}
        onActionFilterChange={setActionFilter}
        resourceFilter={resourceFilter}
        onResourceFilterChange={setResourceFilter}
        severityFilter={severityFilter}
        onSeverityFilterChange={setSeverityFilter}
        outcomeFilter={outcomeFilter}
        onOutcomeFilterChange={setOutcomeFilter}
        sourceFilter={sourceFilter}
        onSourceFilterChange={setSourceFilter}
        actorFilter={actorFilter}
        onActorFilterChange={setActorFilter}
        actorOptions={actorOptions}
        roleFilter={roleFilter}
        onRoleFilterChange={setRoleFilter}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        onReset={handleResetFilters}
        isFiltered={isFiltered}
      />

      {/* Main Audit Event List / Table */}
      {loading ? (
        <div role="status" aria-live="polite" style={{ padding: 48, textAlign: "center", fontSize: 14, color: TEXT_SECONDARY, fontFamily: "var(--font-sans)" }}>
          Chargement du journal d'audit...
        </div>
      ) : loadError ? (
        <div className="admin-alert admin-alert-error" role="alert">
          <span>Impossible de charger le journal d'audit de démonstration.</span>
          <button type="button" onClick={() => void fetchAuditEvents()}>Réessayer</button>
        </div>
      ) : (
        <div>
          <AuditEventList
            events={paginatedEvents}
            onViewDetails={(e) => setSelectedEventDetails(e)}
            showActor={canViewGlobal && scope === "global"}
          />

          {/* Pagination */}
          <div style={{ marginTop: 16 }}>
            <Pagination
              meta={paginationMeta}
              onPageChange={(p) => {
                setCurrentPage(p);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          </div>
        </div>
      )}

      {/* Audit Integrity & Informational Card */}
      <div
        style={{
          padding: 20,
          background: SURFACE,
          border: `1px solid ${BORDER}`,
          borderRadius: "var(--radius-lg)",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <ShieldCheck size={18} style={{ color: ACCENT }} />
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, fontFamily: "var(--font-display)", color: TEXT }}>
            Information sur la traçabilité & l'intégrité
          </h3>
        </div>
        <p style={{ margin: 0, fontSize: 13, color: TEXT_SECONDARY, fontFamily: "var(--font-sans)", lineHeight: 1.5 }}>
          Le journal frontend est temporaire et conservé uniquement en mémoire. Une actualisation réinitialise les événements de la session courante. Il n’existe ici ni signature cryptographique, ni horodatage serveur faisant autorité, ni enregistrement dans une base de données Laravel. En production, l’autorisation doit être contrôlée par le backend et les événements doivent être conservés dans un stockage persistant protégé.
        </p>
      </div>

      {/* Event Details Dialog */}
      <AuditEventDetailsDialog
        event={selectedEventDetails}
        onClose={() => setSelectedEventDetails(null)}
      />

      {/* Export Dialog */}
      {canViewGlobal && (
        <AuditExportDialog
          open={exportDialogOpen}
          events={sortedEvents}
          userId={userId}
          userDisplayName={user?.name || "Utilisateur"}
          userRole={role}
          onClose={() => setExportDialogOpen(false)}
          onExportSuccess={(count, fmt) => {
            showToast(`Export de ${count} enregistrement(s) (${fmt.toUpperCase()}) effectué avec succès.`);
            fetchAuditEvents();
          }}
        />
      )}

      {/* Toast Feedback */}
      <AnimatePresence>
        {toast && (
          <motion.div
            className="admin-settings-toast"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
