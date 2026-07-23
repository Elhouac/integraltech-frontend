import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Inbox, Circle } from "lucide-react";
import DataTable from "../../components/admin/shared/DataTable";
import type { Column, SortState } from "../../components/admin/shared/DataTable";
import Pagination from "../../components/admin/shared/Pagination";
import type { PaginationMeta } from "../../components/admin/shared/Pagination";
import EmptyState from "../../components/admin/shared/EmptyState";
import LeadFilters from "../../components/admin/leads/LeadFilters";
import LeadStatusBadge from "../../components/admin/leads/LeadStatusBadge";
import LeadExportButton from "../../components/admin/leads/LeadExportButton";
import { useAuth } from "../../context/AuthContext";
import { adminService } from "../../services/adminService";
import type { Lead, LeadStatus } from "../../types/admin";
import { ACCENT, BORDER, SURFACE, TEXT, TEXT_SECONDARY } from "../../constants";
import { safeSort } from "../../utils/sort";
import { hasPermission } from "../../utils/permissions";

const PER_PAGE = 8;

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function LeadsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const role = user?.role ?? "reader";
  const canExport = user ? hasPermission(user.role, "leads", "export") : false;

  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let active = true;
    async function fetchLeads() {
      setIsLoading(true);
      setLoadError(false);
      try {
        const res = await adminService.getLeads(role);
        if (active) {
          setLeads(res);
        }
      } catch (err) {
        console.error(err);
        if (active) setLoadError(true);
      } finally {
        if (active) setIsLoading(false);
      }
    }
    fetchLeads();
    return () => { active = false; };
  }, [role, reloadToken]);

  // ── Filters ──
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "all">("all");

  // ── Pagination ──
  const [page, setPage] = useState(1);

  // ── Sort ──
  const [sort, setSort] = useState<SortState>({ key: "created_at", direction: "desc" });

  const handleSort = (key: string) => {
    setSort((prev) =>
      prev.key === key
        ? { key, direction: prev.direction === "asc" ? "desc" : "asc" }
        : { key, direction: "desc" }
    );
    setPage(1);
  };

  // ── Filtered & sorted data ──
  const filteredLeads = useMemo(() => {
    let result = [...leads];

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter((l) => l.status === statusFilter);
    }

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          l.email.toLowerCase().includes(q) ||
          l.subject.toLowerCase().includes(q)
      );
    }

    return safeSort(result, sort.key, sort.direction);
  }, [leads, search, statusFilter, sort]);

  // ── Pagination slice ──
  const paginationMeta: PaginationMeta = {
    page,
    perPage: PER_PAGE,
    total: filteredLeads.length,
  };

  const pagedLeads = useMemo(
    () => filteredLeads.slice((page - 1) * PER_PAGE, page * PER_PAGE),
    [filteredLeads, page]
  );

  // Reset page on filter change
  const handleSearchChange = (val: string) => { setSearch(val); setPage(1); };
  const handleStatusChange = (val: LeadStatus | "all") => { setStatusFilter(val); setPage(1); };

  // ── Columns ──
  const columns: Column<Lead>[] = [
    {
      key: "name",
      label: "Nom",
      sortable: true,
      render: (lead) => (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {!lead.is_read && (
            <Circle size={7} fill={ACCENT} color={ACCENT} style={{ flexShrink: 0 }} />
          )}
          <div>
            <div style={{ fontWeight: 600, color: TEXT }}>{lead.name}</div>
            <div style={{ fontSize: 11, color: TEXT_SECONDARY }}>{lead.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: "subject",
      label: "Sujet",
      sortable: true,
      render: (lead) => (
        <span style={{ color: TEXT, fontWeight: lead.is_read ? 400 : 600 }}>
          {lead.subject}
        </span>
      ),
    },
    {
      key: "status",
      label: "Statut",
      width: 130,
      render: (lead) => <LeadStatusBadge status={lead.status} />,
    },
    {
      key: "created_at",
      label: "Date",
      sortable: true,
      width: 120,
      render: (lead) => (
        <span style={{ fontSize: 12, color: TEXT_SECONDARY, whiteSpace: "nowrap" }}>
          {formatDate(lead.created_at)}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      width: 80,
      render: (lead) => (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            navigate(`/admin/leads/${lead.id}`);
          }}
          aria-label={`Voir le lead de ${lead.name}`}
          style={{ border: `1px solid ${BORDER}`, borderRadius: "var(--radius-sm)", background: SURFACE, color: TEXT, padding: "5px 10px", cursor: "pointer", fontSize: 12 }}
        >
          Voir
        </button>
      ),
    },
  ];

  const unreadCount = leads.filter((l) => !l.is_read).length;

  if (loadError) {
    return (
      <div className="admin-alert admin-alert-error" role="alert">
        <span>Impossible de charger les leads de démonstration.</span>
        <button type="button" onClick={() => setReloadToken((value) => value + 1)}>Réessayer</button>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <h1
            style={{
              fontSize: 22,
              fontWeight: 800,
              fontFamily: "var(--font-display)",
              color: TEXT,
              margin: 0,
            }}
          >
            Leads
            {unreadCount > 0 && (
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#fff",
                  background: ACCENT,
                  borderRadius: 999,
                  padding: "2px 8px",
                  marginLeft: 10,
                  verticalAlign: "middle",
                }}
              >
                {unreadCount} nouveau{unreadCount > 1 ? "x" : ""}
              </span>
            )}
          </h1>
          <p
            style={{
              fontSize: 13,
              color: TEXT_SECONDARY,
              fontFamily: "var(--font-sans)",
              margin: "4px 0 0",
            }}
          >
            Gérez les demandes de contact reçues.
          </p>
        </div>
        {canExport && <LeadExportButton leads={filteredLeads} />}
      </motion.div>

      {/* ── Filters ── */}
      <LeadFilters
        search={search}
        onSearchChange={handleSearchChange}
        statusFilter={statusFilter}
        onStatusChange={handleStatusChange}
      />

      {/* ── Table ── */}
      <div
        style={{
          background: SURFACE,
          border: `1px solid ${BORDER}`,
          borderRadius: "var(--radius-lg)",
          overflow: "hidden",
        }}
      >
        <DataTable
          columns={columns}
          data={pagedLeads}
          sort={sort}
          onSort={handleSort}
          getRowKey={(lead) => lead.id}
          onRowClick={(lead) => navigate(`/admin/leads/${lead.id}`)}
          emptyContent={
            <EmptyState
              icon={Inbox}
              title="Aucun lead trouvé"
              description={
                search || statusFilter !== "all"
                  ? "Essayez de modifier vos filtres."
                  : "Aucune demande de contact pour le moment."
              }
            />
          }
        />

        {/* Pagination */}
        <div style={{ padding: "0 16px 16px" }}>
          <Pagination meta={paginationMeta} onPageChange={setPage} />
        </div>
      </div>
    </div>
  );
}
