import { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Lightbulb, Plus, Trash2, Edit, Copy, Archive, Star, Info, Link2 } from "lucide-react";
import { motion } from "framer-motion";
import DataTable from "../../../components/admin/shared/DataTable";
import type { Column, SortState } from "../../../components/admin/shared/DataTable";
import Pagination from "../../../components/admin/shared/Pagination";
import type { PaginationMeta } from "../../../components/admin/shared/Pagination";
import SearchInput from "../../../components/admin/shared/SearchInput";
import StatusBadge from "../../../components/admin/shared/StatusBadge";
import EmptyState from "../../../components/admin/shared/EmptyState";
import ConfirmDialog from "../../../components/admin/shared/ConfirmDialog";
import { SOLUTION_STATUS_CONFIG } from "../../../data/admin-mocks";
import { adminService } from "../../../services/adminService";
import type { Solution, SolutionStatus, Service } from "../../../types/admin";
import { useAuth } from "../../../context/AuthContext";
import { hasPermission } from "../../../utils/permissions";
import { ACCENT, BORDER, SURFACE, TEXT, TEXT_SECONDARY } from "../../../constants";
import { safeSort } from "../../../utils/sort";

const PER_PAGE = 8;

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
}

export default function AdminSolutionsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const role = user?.role ?? "viewer";
  const isAdmin = role === "super_admin" || role === "admin";
  const canCreate = hasPermission(role, "solutions", "create");
  const canDelete = hasPermission(role, "solutions", "delete");

  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [sols, svcs] = await Promise.all([
        adminService.getSolutions(),
        adminService.getServices(),
      ]);
      setSolutions(sols);
      setServices(svcs);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Service lookup map
  const serviceMap = useMemo(() => {
    const map = new Map<number, string>();
    services.forEach((s) => map.set(s.id, s.title.fr));
    return map;
  }, [services]);

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<SolutionStatus | "all">("all");
  const [featuredFilter, setFeaturedFilter] = useState<"all" | "featured" | "not_featured">("all");
  const [serviceFilter, setServiceFilter] = useState<number | "all">("all");

  // Pagination & Sort
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<SortState>({ key: "order", direction: "asc" });

  // Delete Confirm
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; solutionId: number | null }>({ open: false, solutionId: null });

  const handleSort = (key: string) => {
    setSort((prev) => prev.key === key ? { key, direction: prev.direction === "asc" ? "desc" : "asc" } : { key, direction: "asc" });
    setPage(1);
  };

  // Filtered data
  const filtered = useMemo(() => {
    let result = [...solutions];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter((s) =>
        s.title.fr.toLowerCase().includes(q) ||
        s.title.en.toLowerCase().includes(q) ||
        s.title.ar.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((s) => s.status === statusFilter);
    }

    if (featuredFilter === "featured") {
      result = result.filter((s) => s.featured);
    } else if (featuredFilter === "not_featured") {
      result = result.filter((s) => !s.featured);
    }

    if (serviceFilter !== "all") {
      result = result.filter((s) => s.relatedServiceIds.includes(serviceFilter));
    }

    // Sort
    if (sort.key === "title") {
      result = safeSort(result, sort.key, sort.direction, (s) => s.title.fr);
    } else if (sort.key === "order") {
      result = [...result].sort((a, b) => sort.direction === "asc" ? a.order - b.order : b.order - a.order);
    } else if (sort.key === "updatedAt") {
      result = [...result].sort((a, b) => sort.direction === "asc" ? a.updatedAt.localeCompare(b.updatedAt) : b.updatedAt.localeCompare(a.updatedAt));
    }

    return result;
  }, [solutions, search, statusFilter, featuredFilter, serviceFilter, sort]);

  // Paginated data
  const paginatedData = useMemo(() => {
    const start = (page - 1) * PER_PAGE;
    return filtered.slice(start, start + PER_PAGE);
  }, [filtered, page]);

  const paginationMeta: PaginationMeta = { page, perPage: PER_PAGE, total: filtered.length };

  // Actions
  const handleDelete = async () => {
    if (deleteDialog.solutionId !== null) {
      try {
        await adminService.deleteSolution(deleteDialog.solutionId);
        await fetchData();
      } catch (err) { console.error(err); }
      setDeleteDialog({ open: false, solutionId: null });
    }
  };

  const handleDuplicate = async (id: number) => {
    try {
      await adminService.duplicateSolution(id);
      await fetchData();
    } catch (err) { console.error(err); }
  };

  const handleArchive = async (id: number) => {
    try {
      await adminService.archiveSolution(id);
      await fetchData();
    } catch (err) { console.error(err); }
  };

  const canDeleteSolution = (s: Solution) => {
    if (!canDelete) return false;
    if (s.status === "published" || s.status === "approved") return false;
    return true;
  };

  const canArchiveSolution = (s: Solution) => {
    if (!isAdmin) return false;
    return s.status === "published";
  };

  const actionBtnStyle: React.CSSProperties = {
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    width: 30, height: 30, borderRadius: "var(--radius-sm)",
    border: `1px solid ${BORDER}`, background: "transparent", cursor: "pointer", color: TEXT_SECONDARY,
  };

  // Table columns
  const columns: Column<Solution>[] = [
    {
      key: "title",
      label: "Solution",
      sortable: true,
      render: (s) => (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: "var(--radius-sm)", flexShrink: 0,
            background: `${s.accentColor}15`, display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 14, fontWeight: 700, color: s.accentColor,
          }}>
            {s.icon ? s.icon.charAt(0) : "S"}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: TEXT, fontFamily: "var(--font-sans)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {s.title.fr}
            </div>
            <div style={{ fontSize: 12, color: TEXT_SECONDARY, fontFamily: "var(--font-sans)" }}>/{s.slug}</div>
          </div>
        </div>
      ),
    },
    {
      key: "status",
      label: "Statut",
      width: 140,
      render: (s) => <StatusBadge variant={SOLUTION_STATUS_CONFIG[s.status]} size="sm" />,
    },
    {
      key: "featured",
      label: "Vedette",
      width: 80,
      render: (s) => s.featured ? <Star size={16} style={{ color: "#F59E0B" }} fill="#F59E0B" /> : <Star size={16} style={{ color: BORDER }} />,
    },
    {
      key: "relatedServices",
      label: "Services",
      width: 120,
      render: (s) => {
        if (s.relatedServiceIds.length === 0) return <span style={{ fontSize: 12, color: TEXT_SECONDARY }}>—</span>;
        return (
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <Link2 size={13} style={{ color: ACCENT, flexShrink: 0 }} />
            <span style={{ fontSize: 12, color: TEXT_SECONDARY, fontFamily: "var(--font-sans)" }}>
              {s.relatedServiceIds.length} service{s.relatedServiceIds.length > 1 ? "s" : ""}
            </span>
          </div>
        );
      },
    },
    {
      key: "order",
      label: "Ordre",
      sortable: true,
      width: 80,
      render: (s) => <span style={{ fontSize: 13, fontFamily: "var(--font-sans)", color: TEXT }}>{s.order}</span>,
    },
    {
      key: "updatedAt",
      label: "Mis à jour",
      sortable: true,
      width: 130,
      render: (s) => <span style={{ fontSize: 13, fontFamily: "var(--font-sans)", color: TEXT_SECONDARY }}>{formatDate(s.updatedAt)}</span>,
    },
    {
      key: "actions",
      label: "Actions",
      width: 140,
      render: (s) => (
        <div style={{ display: "flex", gap: 6 }} onClick={(e) => e.stopPropagation()}>
          <button onClick={() => navigate(`/admin/solutions/${s.id}/edit`)} title="Modifier" style={actionBtnStyle}><Edit size={14} /></button>
          <button onClick={() => handleDuplicate(s.id)} title="Dupliquer" style={actionBtnStyle}><Copy size={14} /></button>
          {canArchiveSolution(s) && (
            <button onClick={() => handleArchive(s.id)} title="Archiver" style={{ ...actionBtnStyle, color: "#F59E0B" }}><Archive size={14} /></button>
          )}
          {canDeleteSolution(s) && (
            <button onClick={() => setDeleteDialog({ open: true, solutionId: s.id })} title="Supprimer" style={{ ...actionBtnStyle, color: "var(--danger)" }}><Trash2 size={14} /></button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, fontFamily: "var(--font-display)", color: TEXT, margin: 0 }}>Solutions</h1>
          <p style={{ fontSize: 14, color: TEXT_SECONDARY, fontFamily: "var(--font-sans)", margin: "4px 0 0" }}>
            Gérez les solutions proposées par IntegralTech.
          </p>
        </div>
        {canCreate && (
          <button onClick={() => navigate("/admin/solutions/create")}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 20px", borderRadius: "var(--radius-md)", border: "none", background: ACCENT, color: "#fff", fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
          >
            <Plus size={16} /> Nouvelle solution
          </button>
        )}
      </motion.div>

      {/* Demo notice */}
      <div className="admin-settings-demo-notice" role="status">
        <Info size={16} style={{ flexShrink: 0, marginTop: 1, color: ACCENT }} />
        <span>Mode démonstration : les modifications sont temporaires et seront réinitialisées après actualisation.</span>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ flex: "1 1 250px", minWidth: 200 }}>
          <SearchInput value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Rechercher (FR, EN, AR)..." />
        </div>

        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value as SolutionStatus | "all"); setPage(1); }}
          style={{ padding: "9px 14px", fontSize: 13, fontFamily: "var(--font-sans)", color: TEXT, background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: "var(--radius-md)", cursor: "pointer", appearance: "auto" as const }}
        >
          <option value="all">Tous les statuts</option>
          {Object.entries(SOLUTION_STATUS_CONFIG).map(([key, cfg]) => (
            <option key={key} value={key}>{cfg.label}</option>
          ))}
        </select>

        <select value={featuredFilter} onChange={(e) => { setFeaturedFilter(e.target.value as "all" | "featured" | "not_featured"); setPage(1); }}
          style={{ padding: "9px 14px", fontSize: 13, fontFamily: "var(--font-sans)", color: TEXT, background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: "var(--radius-md)", cursor: "pointer", appearance: "auto" as const }}
        >
          <option value="all">Tous</option>
          <option value="featured">Mise en avant</option>
          <option value="not_featured">Non mise en avant</option>
        </select>

        {services.length > 0 && (
          <select value={serviceFilter === "all" ? "all" : String(serviceFilter)}
            onChange={(e) => { setServiceFilter(e.target.value === "all" ? "all" : Number(e.target.value)); setPage(1); }}
            style={{ padding: "9px 14px", fontSize: 13, fontFamily: "var(--font-sans)", color: TEXT, background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: "var(--radius-md)", cursor: "pointer", appearance: "auto" as const }}
          >
            <option value="all">Tous les services</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>{s.title.fr}</option>
            ))}
          </select>
        )}
      </div>

      {/* Data Table */}
      <DataTable<Solution>
        columns={columns}
        data={paginatedData}
        loading={isLoading}
        sort={sort}
        onSort={handleSort}
        getRowKey={(s) => s.id}
        onRowClick={(s) => navigate(`/admin/solutions/${s.id}/edit`)}
        emptyContent={
          <EmptyState
            icon={Lightbulb}
            title="Aucune solution trouvée"
            description={search || statusFilter !== "all" || serviceFilter !== "all" ? "Essayez de modifier vos filtres." : "Commencez par créer une nouvelle solution."}
          />
        }
      />

      {/* Pagination */}
      <Pagination meta={paginationMeta} onPageChange={setPage} />

      {/* Delete Confirm */}
      <ConfirmDialog
        open={deleteDialog.open}
        title="Supprimer la solution"
        message="Êtes-vous sûr de vouloir supprimer cette solution ? Cette action est irréversible."
        confirmLabel="Supprimer"
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialog({ open: false, solutionId: null })}
      />
    </div>
  );
}
