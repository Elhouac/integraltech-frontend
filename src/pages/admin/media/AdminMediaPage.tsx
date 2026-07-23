import { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Image as ImageIcon, FileText, Video, Plus, Trash2, Edit, Copy, Archive, RotateCcw, Eye, Link2, Grid3x3, List, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Pagination from "../../../components/admin/shared/Pagination";
import type { PaginationMeta } from "../../../components/admin/shared/Pagination";
import SearchInput from "../../../components/admin/shared/SearchInput";
import StatusBadge from "../../../components/admin/shared/StatusBadge";
import EmptyState from "../../../components/admin/shared/EmptyState";
import ConfirmDialog from "../../../components/admin/shared/ConfirmDialog";
import MediaPreviewDialog from "../../../components/admin/media/MediaPreviewDialog";
import { MEDIA_STATUS_CONFIG, MEDIA_TYPE_CONFIG } from "../../../data/admin-mocks";
import { adminService } from "../../../services/adminService";
import type { MediaAsset, MediaType, MediaStatus } from "../../../types/admin";
import { useAuth } from "../../../context/AuthContext";
import { hasPermission } from "../../../utils/permissions";
import { ACCENT, BORDER, SURFACE, TEXT, TEXT_SECONDARY, DANGER } from "../../../constants";

const PER_PAGE = 12;
const mediaIcons = { image: ImageIcon, document: FileText, video: Video };

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} Ko`;
  return `${(bytes / 1048576).toFixed(1)} Mo`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
}

type ViewMode = "grid" | "list";
type SortMode = "newest" | "oldest" | "name_asc" | "name_desc" | "largest" | "smallest";
type UsageFilter = "all" | "used" | "unused";

export default function AdminMediaPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const role = user?.role ?? "viewer";
  const canCreate = hasPermission(role, "media", "create");
  const canEdit = hasPermission(role, "media", "edit");
  const canDelete = hasPermission(role, "media", "delete");

  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  // Filters
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<MediaType | "all">("all");
  const [statusFilter, setStatusFilter] = useState<MediaStatus | "all">("all");
  const [folderFilter, setFolderFilter] = useState<string | "all">("all");
  const [usageFilter, setUsageFilter] = useState<UsageFilter>("all");
  const [sortMode, setSortMode] = useState<SortMode>("newest");

  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [preview, setPreview] = useState<MediaAsset | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // Delete
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: number | null; usageCount: number }>({ open: false, id: null, usageCount: 0 });
  const [bulkDeleteDialog, setBulkDeleteDialog] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setLoadError(false);
    try {
      const data = await adminService.getMediaAssets(role);
      setAssets(data);
    } catch {
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }, [role]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Available folders
  const folders = useMemo(() => [...new Set(assets.map((a) => a.folder).filter(Boolean))].sort(), [assets]);

  // Filtered & sorted
  const filtered = useMemo(() => {
    let result = [...assets];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter((a) =>
        a.name.toLowerCase().includes(q) ||
        a.originalName.toLowerCase().includes(q) ||
        a.title.fr.toLowerCase().includes(q) ||
        a.title.en.toLowerCase().includes(q) ||
        a.title.ar.toLowerCase().includes(q) ||
        a.altText.fr.toLowerCase().includes(q) ||
        a.altText.en.toLowerCase().includes(q) ||
        a.altText.ar.toLowerCase().includes(q) ||
        a.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    if (typeFilter !== "all") result = result.filter((a) => a.mediaType === typeFilter);
    if (statusFilter !== "all") result = result.filter((a) => a.status === statusFilter);
    if (folderFilter !== "all") result = result.filter((a) => a.folder === folderFilter);
    if (usageFilter === "used") result = result.filter((a) => a.usageReferences.length > 0);
    else if (usageFilter === "unused") result = result.filter((a) => a.usageReferences.length === 0);

    // Sort
    switch (sortMode) {
      case "newest": result.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)); break;
      case "oldest": result.sort((a, b) => a.updatedAt.localeCompare(b.updatedAt)); break;
      case "name_asc": result.sort((a, b) => a.name.localeCompare(b.name)); break;
      case "name_desc": result.sort((a, b) => b.name.localeCompare(a.name)); break;
      case "largest": result.sort((a, b) => b.sizeBytes - a.sizeBytes); break;
      case "smallest": result.sort((a, b) => a.sizeBytes - b.sizeBytes); break;
    }
    return result;
  }, [assets, search, typeFilter, statusFilter, folderFilter, usageFilter, sortMode]);

  const paginated = useMemo(() => {
    const start = (page - 1) * PER_PAGE;
    return filtered.slice(start, start + PER_PAGE);
  }, [filtered, page]);

  const paginationMeta: PaginationMeta = { page, perPage: PER_PAGE, total: filtered.length };

  // Selection
  const toggleSelect = (id: number) => setSelected((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const selectCurrentPage = () => {
    const ids = paginated.map((a) => a.id);
    setSelected((prev) => { const n = new Set(prev); ids.forEach((id) => n.add(id)); return n; });
  };
  const clearSelection = () => setSelected(new Set());

  // Actions
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const handleDuplicate = async (id: number) => {
    try { await adminService.duplicateMediaAsset(id, role); await fetchData(); showToast("Média dupliqué."); } catch { showToast("Action non autorisée ou indisponible."); }
  };

  const handleArchive = async (id: number) => {
    try { await adminService.archiveMediaAsset(id, role); await fetchData(); showToast("Média archivé."); } catch { showToast("Action non autorisée ou indisponible."); }
  };

  const handleRestore = async (id: number) => {
    try { await adminService.restoreMediaAsset(id, role); await fetchData(); showToast("Média restauré."); } catch { showToast("Action non autorisée ou indisponible."); }
  };

  const handleCopyUrl = (url: string) => {
    if (!url) { showToast("Pas d'URL disponible."); return; }
    navigator.clipboard.writeText(url).then(() => showToast("URL copiée.")).catch(() => showToast("Erreur de copie."));
  };

  const handleDelete = async () => {
    const mediaId = deleteDialog.id;
    if (mediaId !== null) {
      try {
        await adminService.deleteMediaAsset(mediaId, role);
        setSelected((prev) => { const n = new Set(prev); n.delete(mediaId); return n; });
        await fetchData();
        showToast("Média supprimé.");
      } catch {
        showToast("Suppression refusée : média utilisé ou action non autorisée.");
      }
    }
    setDeleteDialog({ open: false, id: null, usageCount: 0 });
  };

  const confirmDelete = (asset: MediaAsset) => {
    if (asset.usageReferences.length > 0) {
      showToast("Suppression impossible : ce média est encore utilisé.");
      return;
    }
    setDeleteDialog({ open: true, id: asset.id, usageCount: asset.usageReferences.length });
  };

  const handleBulkArchive = async () => {
    try {
      await adminService.bulkArchiveMediaAssets([...selected], role);
      clearSelection(); await fetchData(); showToast(`${selected.size} média(s) archivé(s).`);
    } catch {
      showToast("Archivage non autorisé.");
    }
  };

  const handleBulkDelete = async () => {
    try {
      await adminService.bulkDeleteMediaAssets([...selected], role);
      clearSelection(); await fetchData(); showToast(`${selected.size} média(s) supprimé(s).`);
    } catch {
      showToast("Suppression refusée : la sélection contient un média utilisé ou non autorisé.");
    }
    setBulkDeleteDialog(false);
  };

  const canDeleteAsset = (a: MediaAsset) => {
    if (!canDelete) return false;
    return a.usageReferences.length === 0;
  };

  const selectedHasUsedAsset = assets.some((asset) => selected.has(asset.id) && asset.usageReferences.length > 0);

  // Styles
  const selectStyle: React.CSSProperties = {
    padding: "9px 14px", fontSize: 13, fontFamily: "var(--font-sans)", color: TEXT,
    background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: "var(--radius-md)", cursor: "pointer", appearance: "auto" as const,
  };
  const iconBtnStyle: React.CSSProperties = {
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    width: 28, height: 28, borderRadius: "var(--radius-sm)", border: `1px solid ${BORDER}`,
    background: "transparent", cursor: "pointer", color: TEXT_SECONDARY, padding: 0, flexShrink: 0,
  };
  const viewToggleBtnStyle = (active: boolean): React.CSSProperties => ({
    ...iconBtnStyle, width: 34, height: 34,
    background: active ? `${ACCENT}15` : "transparent",
    borderColor: active ? ACCENT : BORDER,
    color: active ? ACCENT : TEXT_SECONDARY,
  });

  // ── Render card ──
  const renderCard = (asset: MediaAsset) => {
    const Icon = mediaIcons[asset.mediaType];
    const typeCfg = MEDIA_TYPE_CONFIG[asset.mediaType];
    const isSelected = selected.has(asset.id);
    const hasThumb = asset.mediaType === "image" && (asset.thumbnailUrl || asset.url);

    return (
      <div key={asset.id} className={`admin-media-card${isSelected ? " selected" : ""}`} onClick={() => setPreview(asset)}>
        <div className="admin-media-card-check" onClick={(e) => e.stopPropagation()}>
          <input type="checkbox" checked={isSelected} onChange={() => toggleSelect(asset.id)}
            aria-label={`Sélectionner ${asset.name}`}
            style={{ width: 16, height: 16, accentColor: ACCENT, cursor: "pointer" }}
          />
        </div>
        <div className="admin-media-card-thumb">
          {hasThumb ? (
            <img src={asset.thumbnailUrl || asset.url} alt={asset.altText.fr || asset.name}
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; const fb = (e.target as HTMLImageElement).nextElementSibling; if (fb) (fb as HTMLElement).style.display = "flex"; }}
            />
          ) : null}
          <div className="fallback-icon" style={hasThumb ? { display: "none" } : {}}>
            <Icon size={32} style={{ color: typeCfg.color, opacity: 0.5 }} />
            <span>{typeCfg.label}</span>
          </div>
        </div>
        <div className="admin-media-card-body">
          <div className="admin-media-card-name">{asset.name}</div>
          <div className="admin-media-card-meta">
            <span style={{ color: typeCfg.color }}>{typeCfg.label}</span>
            <span>·</span>
            <span>{formatBytes(asset.sizeBytes)}</span>
            {asset.usageReferences.length > 0 && (
              <><span>·</span><span style={{ color: ACCENT }}>{asset.usageReferences.length} réf.</span></>
            )}
          </div>

          {/* Card actions */}
          <div style={{ display: "flex", gap: 4, marginTop: 8 }} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setPreview(asset)} title="Aperçu" style={iconBtnStyle}><Eye size={13} /></button>
            {canEdit && <button onClick={() => navigate(`/admin/media/${asset.id}/edit`)} title="Modifier" style={iconBtnStyle}><Edit size={13} /></button>}
            {canCreate && <button onClick={() => handleDuplicate(asset.id)} title="Dupliquer" style={iconBtnStyle}><Copy size={13} /></button>}
            {asset.url && <button onClick={() => handleCopyUrl(asset.url)} title="Copier URL" style={iconBtnStyle}><Link2 size={13} /></button>}
            {canEdit && asset.status === "active" && <button onClick={() => handleArchive(asset.id)} title="Archiver" style={{ ...iconBtnStyle, color: "#F59E0B" }}><Archive size={13} /></button>}
            {canEdit && asset.status === "archived" && <button onClick={() => handleRestore(asset.id)} title="Restaurer" style={{ ...iconBtnStyle, color: "#22C55E" }}><RotateCcw size={13} /></button>}
            {canDeleteAsset(asset) && <button onClick={() => confirmDelete(asset)} title="Supprimer" style={{ ...iconBtnStyle, color: DANGER }}><Trash2 size={13} /></button>}
          </div>
        </div>
      </div>
    );
  };

  // ── Render list row ──
  const renderListRow = (asset: MediaAsset) => {
    const Icon = mediaIcons[asset.mediaType];
    const typeCfg = MEDIA_TYPE_CONFIG[asset.mediaType];
    const isSelected = selected.has(asset.id);

    return (
      <div key={asset.id}
        style={{
          display: "flex", alignItems: "center", gap: 12, padding: "10px 16px",
          borderBottom: `1px solid ${BORDER}`, background: isSelected ? `${ACCENT}08` : "transparent",
          cursor: "pointer", transition: "background 0.15s",
        }}
        onClick={() => setPreview(asset)}
      >
        <div onClick={(e) => e.stopPropagation()}>
          <input type="checkbox" checked={isSelected} onChange={() => toggleSelect(asset.id)}
            aria-label={`Sélectionner ${asset.name}`}
            style={{ width: 16, height: 16, accentColor: ACCENT, cursor: "pointer" }}
          />
        </div>
        <div style={{
          width: 40, height: 40, borderRadius: "var(--radius-sm)", flexShrink: 0,
          background: `${typeCfg.color}15`, display: "flex", alignItems: "center", justifyContent: "center",
          overflow: "hidden",
        }}>
          {asset.mediaType === "image" && (asset.thumbnailUrl || asset.url) && (
            <img src={asset.thumbnailUrl || asset.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }}
              onError={(e) => {
                e.currentTarget.style.display = "none";
                const fallback = e.currentTarget.nextElementSibling;
                if (fallback instanceof HTMLElement) fallback.style.display = "flex";
              }}
            />
          )}
          <span
            aria-hidden="true"
            style={{ width: "100%", height: "100%", display: asset.mediaType === "image" && (asset.thumbnailUrl || asset.url) ? "none" : "flex", alignItems: "center", justifyContent: "center" }}
          >
            <Icon size={18} style={{ color: typeCfg.color }} />
          </span>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: TEXT, fontFamily: "var(--font-sans)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{asset.name}</div>
          <div style={{ fontSize: 11, color: TEXT_SECONDARY, fontFamily: "var(--font-sans)" }}>{asset.originalName}</div>
        </div>
        <span style={{ fontSize: 12, color: typeCfg.color, fontWeight: 600, fontFamily: "var(--font-sans)", minWidth: 70 }}>{typeCfg.label}</span>
        <span style={{ fontSize: 12, color: TEXT_SECONDARY, fontFamily: "var(--font-sans)", minWidth: 60 }}>{formatBytes(asset.sizeBytes)}</span>
        <StatusBadge variant={MEDIA_STATUS_CONFIG[asset.status]} size="sm" />
        <span style={{ fontSize: 12, color: TEXT_SECONDARY, fontFamily: "var(--font-sans)", minWidth: 90 }}>{formatDate(asset.updatedAt)}</span>
        <div style={{ display: "flex", gap: 4, flexShrink: 0 }} onClick={(e) => e.stopPropagation()}>
          <button onClick={() => setPreview(asset)} title="Aperçu" style={iconBtnStyle}><Eye size={13} /></button>
          {canEdit && <button onClick={() => navigate(`/admin/media/${asset.id}/edit`)} title="Modifier" style={iconBtnStyle}><Edit size={13} /></button>}
          {canDeleteAsset(asset) && <button onClick={() => confirmDelete(asset)} title="Supprimer" style={{ ...iconBtnStyle, color: DANGER }}><Trash2 size={13} /></button>}
        </div>
      </div>
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, fontFamily: "var(--font-display)", color: TEXT, margin: 0 }}>Médiathèque</h1>
          <p style={{ fontSize: 14, color: TEXT_SECONDARY, fontFamily: "var(--font-sans)", margin: "4px 0 0" }}>Gérez les fichiers et médias du site.</p>
        </div>
        {canCreate && (
          <button onClick={() => navigate("/admin/media/create")}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 20px", borderRadius: "var(--radius-md)", border: "none", background: ACCENT, color: "#fff", fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
          >
            <Plus size={16} /> Ajouter un média
          </button>
        )}
      </motion.div>

      {/* Demo notice */}
      <div className="admin-settings-demo-notice" role="status">
        <Info size={16} style={{ flexShrink: 0, marginTop: 1, color: ACCENT }} />
        <span>Mode démonstration : les modifications sont temporaires et seront réinitialisées après actualisation.</span>
      </div>

      {/* Toolbar */}
      <div className="admin-media-toolbar">
        <div style={{ flex: "1 1 250px", minWidth: 200 }}>
          <SearchInput value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Rechercher (nom, titre, tags)..." />
        </div>
        <select value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value as MediaType | "all"); setPage(1); }} style={selectStyle}>
          <option value="all">Tous les types</option>
          {Object.entries(MEDIA_TYPE_CONFIG).map(([k, c]) => <option key={k} value={k}>{c.label}</option>)}
        </select>
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value as MediaStatus | "all"); setPage(1); }} style={selectStyle}>
          <option value="all">Tous les statuts</option>
          {Object.entries(MEDIA_STATUS_CONFIG).map(([k, c]) => <option key={k} value={k}>{c.label}</option>)}
        </select>
        {folders.length > 0 && (
          <select value={folderFilter} onChange={(e) => { setFolderFilter(e.target.value); setPage(1); }} style={selectStyle}>
            <option value="all">Tous les dossiers</option>
            {folders.map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
        )}
        <select value={usageFilter} onChange={(e) => { setUsageFilter(e.target.value as UsageFilter); setPage(1); }} style={selectStyle}>
          <option value="all">Utilisation</option>
          <option value="used">Utilisé</option>
          <option value="unused">Non utilisé</option>
        </select>
        <select value={sortMode} onChange={(e) => { setSortMode(e.target.value as SortMode); setPage(1); }} style={selectStyle}>
          <option value="newest">Plus récent</option>
          <option value="oldest">Plus ancien</option>
          <option value="name_asc">Nom A–Z</option>
          <option value="name_desc">Nom Z–A</option>
          <option value="largest">Plus lourd</option>
          <option value="smallest">Plus léger</option>
        </select>
        <div style={{ display: "flex", gap: 4 }}>
          <button onClick={() => setViewMode("grid")} title="Vue grille" style={viewToggleBtnStyle(viewMode === "grid")}><Grid3x3 size={16} /></button>
          <button onClick={() => setViewMode("list")} title="Vue liste" style={viewToggleBtnStyle(viewMode === "list")}><List size={16} /></button>
        </div>
      </div>

      {/* Bulk actions */}
      {selected.size > 0 && (
        <div className="admin-media-bulk-bar">
          <span style={{ fontSize: 13, fontWeight: 600, color: TEXT, fontFamily: "var(--font-sans)" }}>{selected.size} sélectionné(s)</span>
          <button onClick={selectCurrentPage} style={{ fontSize: 12, color: ACCENT, background: "transparent", border: "none", cursor: "pointer", fontFamily: "var(--font-sans)", textDecoration: "underline" }}>Sélectionner la page</button>
          <button onClick={clearSelection} style={{ fontSize: 12, color: TEXT_SECONDARY, background: "transparent", border: "none", cursor: "pointer", fontFamily: "var(--font-sans)", textDecoration: "underline" }}>Effacer</button>
          {canEdit && (
            <button onClick={handleBulkArchive}
              style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "6px 12px", borderRadius: "var(--radius-sm)", border: `1px solid ${BORDER}`, background: SURFACE, color: TEXT, fontSize: 12, fontWeight: 600, fontFamily: "var(--font-sans)", cursor: "pointer" }}
            >
              <Archive size={13} /> Archiver
            </button>
          )}
          {canDelete && (
            <button
              type="button"
              onClick={() => setBulkDeleteDialog(true)}
              disabled={selectedHasUsedAsset}
              title={selectedHasUsedAsset ? "Retirez les médias utilisés de la sélection avant de supprimer." : "Supprimer la sélection"}
              style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "6px 12px", borderRadius: "var(--radius-sm)", border: "none", background: DANGER, color: "#fff", fontSize: 12, fontWeight: 600, fontFamily: "var(--font-sans)", cursor: selectedHasUsedAsset ? "not-allowed" : "pointer", opacity: selectedHasUsedAsset ? 0.55 : 1 }}
            >
              <Trash2 size={13} /> Supprimer
            </button>
          )}
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="admin-media-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="admin-media-card" style={{ opacity: 0.5, pointerEvents: "none" }}>
              <div className="admin-media-card-thumb" style={{ background: "var(--background)" }} />
              <div className="admin-media-card-body">
                <div style={{ width: "60%", height: 14, background: "var(--border)", borderRadius: 4 }} />
                <div style={{ width: "40%", height: 10, background: "var(--border)", borderRadius: 4, marginTop: 8 }} />
              </div>
            </div>
          ))}
        </div>
      ) : loadError ? (
        <div className="admin-alert admin-alert-error" role="alert">
          <span>Impossible de charger la médiathèque de démonstration.</span>
          <button type="button" onClick={() => void fetchData()}>Réessayer</button>
        </div>
      ) : paginated.length === 0 ? (
        <EmptyState
          icon={ImageIcon}
          title="Aucun média trouvé"
          description={search || typeFilter !== "all" || statusFilter !== "all" ? "Essayez de modifier vos filtres." : "Commencez par ajouter un nouveau média."}
        />
      ) : viewMode === "grid" ? (
        <div className="admin-media-grid">{paginated.map(renderCard)}</div>
      ) : (
        <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: "var(--radius-lg)", overflowX: "auto" }}>
          <div style={{ minWidth: 760 }}>
            {/* List header */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 16px", borderBottom: `1px solid ${BORDER}`, background: "var(--background)", fontSize: 11, fontWeight: 700, color: TEXT_SECONDARY, fontFamily: "var(--font-sans)" }}>
              <div style={{ width: 16 }} />
              <div style={{ width: 40 }} />
              <div style={{ flex: 1 }}>Nom</div>
              <div style={{ minWidth: 70 }}>Type</div>
              <div style={{ minWidth: 60 }}>Taille</div>
              <div style={{ minWidth: 60 }}>Statut</div>
              <div style={{ minWidth: 90 }}>Modifié</div>
              <div style={{ minWidth: 80 }}>Actions</div>
            </div>
            {paginated.map(renderListRow)}
          </div>
        </div>
      )}

      <Pagination meta={paginationMeta} onPageChange={setPage} />

      {/* Preview */}
      <MediaPreviewDialog asset={preview} onClose={() => setPreview(null)} />

      {/* Delete confirm */}
      <ConfirmDialog
        open={deleteDialog.open}
        title="Supprimer le média"
        message={deleteDialog.usageCount > 0
          ? `Ce média est utilisé dans ${deleteDialog.usageCount} référence(s). Êtes-vous sûr de vouloir le supprimer ?`
          : "Êtes-vous sûr de vouloir supprimer ce média ? Cette action est irréversible."}
        confirmLabel="Supprimer"
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialog({ open: false, id: null, usageCount: 0 })}
      />

      <ConfirmDialog
        open={bulkDeleteDialog}
        title="Suppression en masse"
        message={`Êtes-vous sûr de vouloir supprimer ${selected.size} média(s) ? Cette action est irréversible.`}
        confirmLabel="Supprimer tout"
        onConfirm={handleBulkDelete}
        onCancel={() => setBulkDeleteDialog(false)}
      />

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div className="admin-settings-toast" role="status" aria-live="polite"
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
