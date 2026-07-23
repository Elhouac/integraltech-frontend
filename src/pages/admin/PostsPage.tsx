import { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Plus, Trash2, Edit } from "lucide-react";
import { motion } from "framer-motion";
import DataTable from "../../components/admin/shared/DataTable";
import type { Column, SortState } from "../../components/admin/shared/DataTable";
import Pagination from "../../components/admin/shared/Pagination";
import type { PaginationMeta } from "../../components/admin/shared/Pagination";
import SearchInput from "../../components/admin/shared/SearchInput";
import StatusBadge from "../../components/admin/shared/StatusBadge";
import EmptyState from "../../components/admin/shared/EmptyState";
import ConfirmDialog from "../../components/admin/shared/ConfirmDialog";
import { useAuth } from "../../context/AuthContext";
import { MOCK_CATEGORIES, POST_STATUS_CONFIG } from "../../data/admin-mocks";
import { adminService } from "../../services/adminService";
import type { Post, PostStatus } from "../../types/admin";
import { ACCENT, BORDER, SURFACE, TEXT, TEXT_SECONDARY } from "../../constants";
import { safeSort, getSafeValue } from "../../utils/sort";
import { hasPermission } from "../../utils/permissions";

const PER_PAGE = 8;

function formatDate(iso: string | null): string {
  if (!iso) return "Non publié";
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function PostsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const role = user?.role ?? "reader";
  const canCreate = user ? hasPermission(user.role, "blog", "create") : false;
  const canEdit = user ? hasPermission(user.role, "blog", "edit") : false;
  const canDelete = user ? hasPermission(user.role, "blog", "delete") : false;
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    setLoadError(false);
    try {
      const res = await adminService.getPosts(role);
      setPosts(res);
    } catch (err) {
      console.error(err);
      setLoadError(true);
    } finally {
      setIsLoading(false);
    }
  }, [role]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<PostStatus | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState<number | "all">("all");

  // Pagination & Sort
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<SortState>({ key: "created_at", direction: "desc" });

  // Delete Confirm State
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; postId: number | null }>({
    open: false,
    postId: null,
  });

  const handleSort = (key: string) => {
    setSort((prev) =>
      prev.key === key
        ? { key, direction: prev.direction === "asc" ? "desc" : "asc" }
        : { key, direction: "desc" }
    );
    setPage(1);
  };

  const handleDelete = async () => {
    if (user && canDelete && deleteDialog.postId !== null) {
      try {
        await adminService.deletePost(deleteDialog.postId, user.role);
        await fetchPosts();
      } catch (err) {
        console.error(err);
      }
    }
    setDeleteDialog({ open: false, postId: null });
  };

  const handleSearchChange = (val: string) => { setSearch(val); setPage(1); };
  const handleStatusChange = (val: PostStatus | "all") => { setStatusFilter(val); setPage(1); };
  const handleCategoryChange = (val: number | "all") => { setCategoryFilter(val); setPage(1); };

  // Filtered & Sorted Data
  const filteredPosts = useMemo(() => {
    let result = [...posts];

    if (statusFilter !== "all") {
      result = result.filter((p) => p.status === statusFilter);
    }

    if (categoryFilter !== "all") {
      result = result.filter((p) => p.category_id === Number(categoryFilter));
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.fr.toLowerCase().includes(q) ||
          p.title.en.toLowerCase().includes(q) ||
          p.title.ar.toLowerCase().includes(q)
      );
    }

    return safeSort(result, sort.key, sort.direction, (item) => {
      if (sort.key === "title") {
        return item.title.fr;
      }
      return String(getSafeValue(item, sort.key) ?? "");
    });
  }, [posts, search, statusFilter, categoryFilter, sort]);

  const paginationMeta: PaginationMeta = {
    page,
    perPage: PER_PAGE,
    total: filteredPosts.length,
  };

  const pagedPosts = useMemo(
    () => filteredPosts.slice((page - 1) * PER_PAGE, page * PER_PAGE),
    [filteredPosts, page]
  );

  const columns: Column<Post>[] = [
    {
      key: "title",
      label: "Titre",
      sortable: true,
      render: (post) => (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontWeight: 600, color: TEXT }}>{post.title.fr}</span>
          <span style={{ fontSize: 11, color: TEXT_SECONDARY }}>/{post.slug}</span>
        </div>
      ),
    },
    {
      key: "category",
      label: "Catégorie",
      render: (post) => {
        const cat = MOCK_CATEGORIES.find((c) => c.id === post.category_id);
        return <span style={{ color: TEXT_SECONDARY }}>{cat ? cat.name.fr : "—"}</span>;
      },
    },
    {
      key: "status",
      label: "Statut",
      width: 120,
      render: (post) => <StatusBadge variant={POST_STATUS_CONFIG[post.status]} size="sm" />,
    },
    {
      key: "created_at",
      label: "Publié le",
      sortable: true,
      width: 120,
      render: (post) => (
        <span style={{ fontSize: 12, color: TEXT_SECONDARY }}>
          {formatDate(post.published_at || post.created_at)}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      width: 100,
      render: (post) => (
        <div style={{ display: "flex", gap: 8 }} onClick={(e) => e.stopPropagation()}>
          {canEdit && <button
            onClick={() => navigate(`/admin/posts/${post.id}/edit`)}
            title="Modifier l'article"
            style={{
              padding: 6,
              background: "none",
              border: "none",
              color: TEXT_SECONDARY,
              cursor: "pointer",
              borderRadius: "var(--radius-sm)",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "var(--hover)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "none"; }}
          >
            <Edit size={14} />
          </button>}
          {canDelete && <button
            onClick={() => setDeleteDialog({ open: true, postId: post.id })}
            title="Supprimer l'article"
            style={{
              padding: 6,
              background: "none",
              border: "none",
              color: "var(--danger)",
              cursor: "pointer",
              borderRadius: "var(--radius-sm)",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "var(--hover)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "none"; }}
          >
            <Trash2 size={14} />
          </button>}
        </div>
      ),
    },
  ];

  if (loadError) {
    return (
      <div className="admin-alert admin-alert-error" role="alert">
        <span>Impossible de charger les articles de démonstration.</span>
        <button type="button" onClick={() => void fetchPosts()}>Réessayer</button>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
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
            Articles
          </h1>
          <p style={{ fontSize: 13, color: TEXT_SECONDARY, fontFamily: "var(--font-sans)", margin: "4px 0 0" }}>
            Gérez les publications et articles de blog.
          </p>
        </div>
        {canCreate && <button
          onClick={() => navigate("/admin/posts/create")}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "8px 14px",
            border: "none",
            borderRadius: "var(--radius-md)",
            background: ACCENT,
            color: "#fff",
            fontSize: 13,
            fontWeight: 600,
            fontFamily: "var(--font-sans)",
            cursor: "pointer",
          }}
        >
          <Plus size={15} />
          Créer un article
        </button>}
      </motion.div>

      {/* Filters bar */}
      <div className="admin-lead-filters" style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 240px", minWidth: 200 }}>
          <SearchInput value={search} onChange={handleSearchChange} placeholder="Rechercher un article…" />
        </div>

        {/* Category filter */}
        <select
          value={categoryFilter}
          onChange={(e) => handleCategoryChange(e.target.value === "all" ? "all" : Number(e.target.value))}
          aria-label="Filtrer par catégorie"
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
          <option value="all">Toutes les catégories</option>
          {MOCK_CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name.fr}
            </option>
          ))}
        </select>

        {/* Status filter */}
        <select
          value={statusFilter}
          onChange={(e) => handleStatusChange(e.target.value as PostStatus | "all")}
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
          {Object.entries(POST_STATUS_CONFIG).map(([key, config]) => (
            <option key={key} value={key}>
              {config.label}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
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
          data={pagedPosts}
          sort={sort}
          onSort={handleSort}
          getRowKey={(post) => post.id}
          onRowClick={canEdit ? (post) => navigate(`/admin/posts/${post.id}/edit`) : undefined}
          emptyContent={
            <EmptyState
              icon={FileText}
              title="Aucun article trouvé"
              description={
                search || statusFilter !== "all" || categoryFilter !== "all"
                  ? "Essayez de modifier vos filtres."
                  : "Aucun article rédigé pour le moment."
              }
              actionLabel={canCreate ? "Créer un article" : undefined}
              onAction={canCreate ? () => navigate("/admin/posts/create") : undefined}
            />
          }
        />

        <div style={{ padding: "0 16px 16px" }}>
          <Pagination meta={paginationMeta} onPageChange={setPage} />
        </div>
      </div>

      {/* Delete confirmation */}
      <ConfirmDialog
        open={deleteDialog.open}
        title="Supprimer l'article ?"
        message="Voulez-vous vraiment supprimer cet article ? Cette action est irréversible."
        confirmLabel="Supprimer"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialog({ open: false, postId: null })}
      />
    </div>
  );
}
