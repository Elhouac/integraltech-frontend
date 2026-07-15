import { useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { Mail, UserX, UserCheck, Trash2, Download } from "lucide-react";
import DataTable from "../../components/admin/shared/DataTable";
import type { Column, SortState } from "../../components/admin/shared/DataTable";
import Pagination from "../../components/admin/shared/Pagination";
import type { PaginationMeta } from "../../components/admin/shared/Pagination";
import SearchInput from "../../components/admin/shared/SearchInput";
import StatusBadge from "../../components/admin/shared/StatusBadge";
import EmptyState from "../../components/admin/shared/EmptyState";
import ConfirmDialog from "../../components/admin/shared/ConfirmDialog";
import { MOCK_SUBSCRIBERS } from "../../data/admin-mocks";
import type { Subscriber } from "../../data/admin-mocks";
import { ACCENT, BORDER, SURFACE, TEXT, TEXT_SECONDARY } from "../../constants";
import { safeSort } from "../../utils/sort";

const PER_PAGE = 10;

const STATUS_VARIANTS = {
  active: { label: "Actif", color: "#22C55E", bg: "rgba(34,197,94,0.1)" },
  inactive: { label: "Inactif", color: "#64748B", bg: "rgba(100,116,139,0.1)" },
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function escapeCsv(val: unknown): string {
  const str = String(val ?? "").replace(/"/g, '""');
  return `"${str}"`;
}

export default function SubscribersPage() {
  // ── Data state (mock — replace with API) ──
  const [subscribers, setSubscribers] = useState<Subscriber[]>(MOCK_SUBSCRIBERS);

  // ── Filters ──
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");

  // ── Pagination + Sort ──
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<SortState>({ key: "subscribed_at", direction: "desc" });

  // ── Selection ──
  const [selected, setSelected] = useState<Set<number>>(new Set());

  // ── Confirm dialog ──
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    action: "activate" | "deactivate" | "delete";
  }>({ open: false, action: "delete" });

  const handleSort = (key: string) => {
    setSort((prev) =>
      prev.key === key
        ? { key, direction: prev.direction === "asc" ? "desc" : "asc" }
        : { key, direction: "desc" }
    );
    setPage(1);
  };

  // ── Filtered & sorted ──
  const filtered = useMemo(() => {
    let result = [...subscribers];

    if (statusFilter === "active") result = result.filter((s) => s.is_active);
    else if (statusFilter === "inactive") result = result.filter((s) => !s.is_active);

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((s) => s.email.toLowerCase().includes(q));
    }

    return safeSort(result, sort.key, sort.direction);
  }, [subscribers, search, statusFilter, sort]);

  const paginationMeta: PaginationMeta = { page, perPage: PER_PAGE, total: filtered.length };
  const paged = useMemo(
    () => filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE),
    [filtered, page]
  );

  const handleSearchChange = (val: string) => { setSearch(val); setPage(1); };
  const handleStatusFilter = (val: "all" | "active" | "inactive") => { setStatusFilter(val); setPage(1); setSelected(new Set()); };

  // ── Selection helpers ──
  const allPageSelected = paged.length > 0 && paged.every((s) => selected.has(s.id));

  const toggleAll = () => {
    if (allPageSelected) {
      setSelected((prev) => {
        const next = new Set(prev);
        paged.forEach((s) => next.delete(s.id));
        return next;
      });
    } else {
      setSelected((prev) => {
        const next = new Set(prev);
        paged.forEach((s) => next.add(s.id));
        return next;
      });
    }
  };

  const toggleOne = (id: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  // ── Bulk actions ──
  const executeBulkAction = useCallback(() => {
    const ids = selected;
    if (confirmDialog.action === "delete") {
      setSubscribers((prev) => prev.filter((s) => !ids.has(s.id)));
    } else {
      const active = confirmDialog.action === "activate";
      setSubscribers((prev) =>
        prev.map((s) => (ids.has(s.id) ? { ...s, is_active: active } : s))
      );
    }
    setSelected(new Set());
    setConfirmDialog({ open: false, action: "delete" });
  }, [selected, confirmDialog.action]);

  // ── CSV Export ──
  const handleExport = () => {
    const activeEmails = filtered.filter((s) => s.is_active);
    const headers = ["Email", "Statut", "Date d'inscription"];
    const rows = activeEmails.map((s) => [s.email, "Actif", formatDate(s.subscribed_at)]);
    const csv = [headers, ...rows].map((r) => r.map(escapeCsv).join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `subscribers_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const dialogMessages: Record<string, { title: string; message: string }> = {
    activate: { title: "Activer les abonnés", message: `Voulez-vous réactiver ${selected.size} abonné(s) sélectionné(s) ?` },
    deactivate: { title: "Désactiver les abonnés", message: `Voulez-vous désactiver ${selected.size} abonné(s) sélectionné(s) ?` },
    delete: { title: "Supprimer les abonnés", message: `Voulez-vous supprimer définitivement ${selected.size} abonné(s) sélectionné(s) ? Cette action est irréversible.` },
  };

  // ── Columns ──
  const columns: Column<Subscriber>[] = [
    {
      key: "checkbox",
      label: "",
      width: 40,
      render: (sub) => (
        <input
          type="checkbox"
          checked={selected.has(sub.id)}
          onChange={() => toggleOne(sub.id)}
          onClick={(e) => e.stopPropagation()}
          aria-label={`Sélectionner ${sub.email}`}
          style={{ accentColor: ACCENT, width: 15, height: 15, cursor: "pointer" }}
        />
      ),
    },
    {
      key: "email",
      label: "Email",
      sortable: true,
      render: (sub) => (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: "50%",
              background: sub.is_active ? "rgba(34,197,94,0.08)" : "rgba(100,116,139,0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Mail size={13} color={sub.is_active ? "#22C55E" : "#64748B"} />
          </div>
          <span style={{ fontWeight: 500 }}>{sub.email}</span>
        </div>
      ),
    },
    {
      key: "is_active",
      label: "Statut",
      width: 110,
      render: (sub) => (
        <StatusBadge variant={sub.is_active ? STATUS_VARIANTS.active : STATUS_VARIANTS.inactive} size="sm" />
      ),
    },
    {
      key: "subscribed_at",
      label: "Inscrit le",
      sortable: true,
      width: 120,
      render: (sub) => (
        <span style={{ fontSize: 12, color: TEXT_SECONDARY, whiteSpace: "nowrap" }}>
          {formatDate(sub.subscribed_at)}
        </span>
      ),
    },
  ];

  const activeCount = subscribers.filter((s) => s.is_active).length;

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
            Abonnés Newsletter
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "#22C55E",
                background: "rgba(34,197,94,0.1)",
                borderRadius: 999,
                padding: "2px 8px",
                marginLeft: 10,
                verticalAlign: "middle",
              }}
            >
              {activeCount} actifs
            </span>
          </h1>
          <p
            style={{
              fontSize: 13,
              color: TEXT_SECONDARY,
              fontFamily: "var(--font-sans)",
              margin: "4px 0 0",
            }}
          >
            Gérez les abonnés à la newsletter du site.
          </p>
        </div>
        <button
          onClick={handleExport}
          aria-label="Exporter les emails actifs en CSV"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "8px 14px",
            border: `1px solid ${BORDER}`,
            borderRadius: "var(--radius-md)",
            background: SURFACE,
            color: TEXT,
            fontSize: 13,
            fontWeight: 600,
            fontFamily: "var(--font-sans)",
            cursor: "pointer",
            transition: "background 0.15s",
            whiteSpace: "nowrap",
          }}
        >
          <Download size={14} />
          Export CSV
        </button>
      </motion.div>

      {/* ── Filters + Bulk Actions ── */}
      <div
        className="admin-lead-filters"
        style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}
      >
        <div style={{ flex: "1 1 240px", minWidth: 200 }}>
          <SearchInput value={search} onChange={handleSearchChange} placeholder="Rechercher un email…" />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => handleStatusFilter(e.target.value as "all" | "active" | "inactive")}
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
          }}
        >
          <option value="all">Tous les statuts</option>
          <option value="active">Actifs</option>
          <option value="inactive">Inactifs</option>
        </select>

        {/* Bulk action buttons */}
        {selected.size > 0 && (
          <div style={{ display: "flex", gap: 6, marginLeft: "auto" }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: ACCENT, alignSelf: "center", marginRight: 4 }}>
              {selected.size} sélectionné{selected.size > 1 ? "s" : ""}
            </span>
            <button
              onClick={() => setConfirmDialog({ open: true, action: "activate" })}
              title="Activer"
              style={{
                padding: "6px 10px",
                border: `1px solid ${BORDER}`,
                borderRadius: "var(--radius-sm)",
                background: SURFACE,
                color: "#22C55E",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 4,
                fontSize: 12,
                fontWeight: 600,
                fontFamily: "var(--font-sans)",
              }}
            >
              <UserCheck size={13} /> Activer
            </button>
            <button
              onClick={() => setConfirmDialog({ open: true, action: "deactivate" })}
              title="Désactiver"
              style={{
                padding: "6px 10px",
                border: `1px solid ${BORDER}`,
                borderRadius: "var(--radius-sm)",
                background: SURFACE,
                color: "#F59E0B",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 4,
                fontSize: 12,
                fontWeight: 600,
                fontFamily: "var(--font-sans)",
              }}
            >
              <UserX size={13} /> Désactiver
            </button>
            <button
              onClick={() => setConfirmDialog({ open: true, action: "delete" })}
              title="Supprimer"
              style={{
                padding: "6px 10px",
                border: `1px solid ${BORDER}`,
                borderRadius: "var(--radius-sm)",
                background: SURFACE,
                color: "var(--danger)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 4,
                fontSize: 12,
                fontWeight: 600,
                fontFamily: "var(--font-sans)",
              }}
            >
              <Trash2 size={13} /> Supprimer
            </button>
          </div>
        )}
      </div>

      {/* ── Table ── */}
      <div
        style={{
          background: SURFACE,
          border: `1px solid ${BORDER}`,
          borderRadius: "var(--radius-lg)",
          overflow: "hidden",
        }}
      >
        {/* Select all header */}
        {paged.length > 0 && (
          <div
            style={{
              padding: "8px 16px",
              borderBottom: `1px solid ${BORDER}`,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <input
              type="checkbox"
              checked={allPageSelected}
              onChange={toggleAll}
              aria-label="Tout sélectionner"
              style={{ accentColor: ACCENT, width: 15, height: 15, cursor: "pointer" }}
            />
            <span style={{ fontSize: 11, color: TEXT_SECONDARY, fontFamily: "var(--font-sans)" }}>
              {allPageSelected ? "Tout désélectionner" : "Tout sélectionner"}
            </span>
          </div>
        )}

        <DataTable
          columns={columns}
          data={paged}
          sort={sort}
          onSort={handleSort}
          getRowKey={(s) => s.id}
          emptyContent={
            <EmptyState
              icon={Mail}
              title="Aucun abonné trouvé"
              description={
                search || statusFilter !== "all"
                  ? "Essayez de modifier vos filtres."
                  : "Aucun abonné à la newsletter pour le moment."
              }
            />
          }
        />

        <div style={{ padding: "0 16px 16px" }}>
          <Pagination meta={paginationMeta} onPageChange={setPage} />
        </div>
      </div>

      {/* ── Confirm Dialog ── */}
      <ConfirmDialog
        open={confirmDialog.open}
        title={dialogMessages[confirmDialog.action]?.title ?? ""}
        message={dialogMessages[confirmDialog.action]?.message ?? ""}
        confirmLabel={confirmDialog.action === "delete" ? "Supprimer" : "Confirmer"}
        variant={confirmDialog.action === "delete" ? "danger" : "warning"}
        onConfirm={executeBulkAction}
        onCancel={() => setConfirmDialog({ open: false, action: "delete" })}
      />
    </div>
  );
}
