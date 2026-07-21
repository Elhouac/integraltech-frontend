import { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Wrench, Plus, Trash2, Edit, Copy, Archive, Star, Info } from "lucide-react";
import { motion } from "framer-motion";
import DataTable from "../../../components/admin/shared/DataTable";
import type { Column, SortState } from "../../../components/admin/shared/DataTable";
import Pagination from "../../../components/admin/shared/Pagination";
import type { PaginationMeta } from "../../../components/admin/shared/Pagination";
import SearchInput from "../../../components/admin/shared/SearchInput";
import StatusBadge from "../../../components/admin/shared/StatusBadge";
import EmptyState from "../../../components/admin/shared/EmptyState";
import ConfirmDialog from "../../../components/admin/shared/ConfirmDialog";
import { SERVICE_STATUS_CONFIG } from "../../../data/admin-mocks";
import { adminService } from "../../../services/adminService";
import type { Service, ServiceStatus } from "../../../types/admin";
import { useAuth } from "../../../context/AuthContext";
import { hasPermission } from "../../../utils/permissions";
import { ACCENT, BORDER, SURFACE, TEXT, TEXT_SECONDARY } from "../../../constants";
import { safeSort } from "../../../utils/sort";

const PER_PAGE = 8;

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
}

export default function ServicesPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const role = user?.role ?? "viewer";
  const isAdmin = role === "super_admin" || role === "admin";
  const canCreate = hasPermission(role, "services", "create");
  const canDelete = hasPermission(role, "services", "delete");

  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchServices = useCallback(async () => {
    try {
      const res = await adminService.getServices();
      setServices(res);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => { fetchServices(); }, [fetchServices]);

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ServiceStatus | "all">("all");
  const [featuredFilter, setFeaturedFilter] = useState<"all" | "featured" | "not_featured">("all");

  // Pagination & Sort
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<SortState>({ key: "order", direction: "asc" });

  // Delete Confirm
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; serviceId: number | null }>({ open: false, serviceId: null });

  const handleSort = (key: string) => {
    setSort((prev) => prev.key === key ? { key, direction: prev.direction === "asc" ? "desc" : "asc" } : { key, direction: "asc" });
    setPage(1);
  };

  // Filtered data
  const filtered = useMemo(() => {
    let result = [...services];

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

    // Sort
    if (sort.key === "title") {
      result = safeSort(result, sort.key, sort.direction, (s) => s.title.fr);
    } else if (sort.key === "order") {
      result = [...result].sort((a, b) => sort.direction === "asc" ? a.order - b.order : b.order - a.order);
    } else if (sort.key === "updatedAt") {
      result = [...result].sort((a, b) => sort.direction === "asc" ? a.updatedAt.localeCompare(b.updatedAt) : b.updatedAt.localeCompare(a.updatedAt));
    }

    return result;
  }, [services, search, statusFilter, featuredFilter, sort]);

  // Paginated data
  const paginatedData = useMemo(() => {
    const start = (page - 1) * PER_PAGE;
    return filtered.slice(start, start + PER_PAGE);
  }, [filtered, page]);

  const paginationMeta: PaginationMeta = { page, perPage: PER_PAGE, total: filtered.length };

  // Actions
  const handleDelete = async () => {
    if (deleteDialog.serviceId !== null) {
      try {
        await adminService.deleteService(deleteDialog.serviceId);
        await fetchServices();
      } catch (err) { console.error(err); }
      setDeleteDialog({ open: false, serviceId: null });
    }
  };

  const handleDuplicate = async (id: number) => {
    try {
      await adminService.duplicateService(id);
      await fetchServices();
    } catch (err) { console.error(err); }
  };

  const handleArchive = async (id: number) => {
    try {
      await adminService.archiveService(id);
      await fetchServices();
    } catch (err) { console.error(err); }
  };

  // Can delete rules: admin can delete anything except published; editor can delete only their drafts
  const canDeleteService = (s: Service) => {
    if (!canDelete) return false;
    if (s.status === "published" || s.status === "approved") return false;
    return true;
  };

  const canArchiveService = (s: Service) => {
    if (!isAdmin) return false;
    return s.status === "published";
  };

  // Table columns
  const columns: Column<Service>[] = [
    {
      key: "title",
      label: "Service",
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
      render: (s) => <StatusBadge variant={SERVICE_STATUS_CONFIG[s.status]} size="sm" />,
    },
    {
      key: "featured",
      label: "Vedette",
      width: 80,
      render: (s) => s.featured ? <Star size={16} style={{ color: "#F59E0B" }} fill="#F59E0B" /> : <Star size={16} style={{ color: BORDER }} />,
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
          <button onClick={() => navigate(`/admin/services/${s.id}/edit`)} title="Modifier"
            style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 30, height: 30, borderRadius: "var(--radius-sm)", border: `1px solid ${BORDER}`, background: "transparent", cursor: "pointer", color: TEXT_SECONDARY }}
          ><Edit size={14} /></button>
          <button onClick={() => handleDuplicate(s.id)} title="Dupliquer"
            style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 30, height: 30, borderRadius: "var(--radius-sm)", border: `1px solid ${BORDER}`, background: "transparent", cursor: "pointer", color: TEXT_SECONDARY }}
          ><Copy size={14} /></button>
          {canArchiveService(s) && (
            <button onClick={() => handleArchive(s.id)} title="Archiver"
              style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 30, height: 30, borderRadius: "var(--radius-sm)", border: `1px solid ${BORDER}`, background: "transparent", cursor: "pointer", color: "#F59E0B" }}
            ><Archive size={14} /></button>
          )}
          {canDeleteService(s) && (
            <button onClick={() => setDeleteDialog({ open: true, serviceId: s.id })} title="Supprimer"
              style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 30, height: 30, borderRadius: "var(--radius-sm)", border: `1px solid ${BORDER}`, background: "transparent", cursor: "pointer", color: "var(--danger)" }}
            ><Trash2 size={14} /></button>
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
          <h1 style={{ fontSize: 24, fontWeight: 800, fontFamily: "var(--font-display)", color: TEXT, margin: 0 }}>Services</h1>
          <p style={{ fontSize: 14, color: TEXT_SECONDARY, fontFamily: "var(--font-sans)", margin: "4px 0 0" }}>
            Gérez les services proposés par IntegralTech.
          </p>
        </div>
        {canCreate && (
          <button onClick={() => navigate("/admin/services/create")}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 20px", borderRadius: "var(--radius-md)", border: "none", background: ACCENT, color: "#fff", fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
          >
            <Plus size={16} /> Nouveau service
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

        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value as ServiceStatus | "all"); setPage(1); }}
          style={{ padding: "9px 14px", fontSize: 13, fontFamily: "var(--font-sans)", color: TEXT, background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: "var(--radius-md)", cursor: "pointer", appearance: "auto" as const }}
        >
          <option value="all">Tous les statuts</option>
          {Object.entries(SERVICE_STATUS_CONFIG).map(([key, cfg]) => (
            <option key={key} value={key}>{cfg.label}</option>
          ))}
        </select>

        <select value={featuredFilter} onChange={(e) => { setFeaturedFilter(e.target.value as "all" | "featured" | "not_featured"); setPage(1); }}
          style={{ padding: "9px 14px", fontSize: 13, fontFamily: "var(--font-sans)", color: TEXT, background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: "var(--radius-md)", cursor: "pointer", appearance: "auto" as const }}
        >
          <option value="all">Tous</option>
          <option value="featured">Mis en avant</option>
          <option value="not_featured">Non mis en avant</option>
        </select>
      </div>

      {/* Data Table */}
      <DataTable<Service>
        columns={columns}
        data={paginatedData}
        loading={isLoading}
        sort={sort}
        onSort={handleSort}
        getRowKey={(s) => s.id}
        onRowClick={(s) => navigate(`/admin/services/${s.id}/edit`)}
        emptyContent={
          <EmptyState
            icon={Wrench}
            title="Aucun service trouvé"
            description={search || statusFilter !== "all" ? "Essayez de modifier vos filtres." : "Commencez par créer un nouveau service."}
          />
        }
      />

      {/* Pagination */}
      <Pagination meta={paginationMeta} onPageChange={setPage} />

      {/* Delete Confirm */}
      <ConfirmDialog
        open={deleteDialog.open}
        title="Supprimer le service"
        message="Êtes-vous sûr de vouloir supprimer ce service ? Cette action est irréversible."
        confirmLabel="Supprimer"
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialog({ open: false, serviceId: null })}
      />
    </div>
  );
}
