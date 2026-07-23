import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { Plus, Edit2, Trash2, Folder } from "lucide-react";
import { motion } from "framer-motion";
import DataTable from "../../components/admin/shared/DataTable";
import type { Column } from "../../components/admin/shared/DataTable";
import EmptyState from "../../components/admin/shared/EmptyState";
import ConfirmDialog from "../../components/admin/shared/ConfirmDialog";
import { useAuth } from "../../context/AuthContext";
import { adminService } from "../../services/adminService";
import type { Category } from "../../types/admin";
import { ACCENT, BORDER, SURFACE, TEXT, TEXT_SECONDARY, OVERLAY } from "../../constants";
import { hasPermission } from "../../utils/permissions";

export default function CategoriesPage() {
  const { user } = useAuth();
  const role = user?.role ?? "reader";
  const canCreate = user ? hasPermission(user.role, "categories", "create") : false;
  const canEdit = user ? hasPermission(user.role, "categories", "edit") : false;
  const canDelete = user ? hasPermission(user.role, "categories", "delete") : false;
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    setLoadError(false);
    try {
      const res = await adminService.getCategories(role);
      setCategories(res);
    } catch (err) {
      console.error(err);
      setLoadError(true);
    } finally {
      setIsLoading(false);
    }
  }, [role]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!modalOpen) return;
    const returnTarget = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    firstFieldRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setModalOpen(false);
        return;
      }
      if (event.key !== "Tab" || !modalRef.current) return;
      const focusable = Array.from(modalRef.current.querySelectorAll<HTMLElement>("input, select, textarea, button:not([disabled])"));
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault(); last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault(); first?.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => { document.removeEventListener("keydown", handleKeyDown); returnTarget?.focus(); };
  }, [modalOpen]);

  // Form State
  const [nameFr, setNameFr] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [nameAr, setNameAr] = useState("");
  const [slug, setSlug] = useState("");
  const [order, setOrder] = useState(1);

  // Confirm Delete Dialog
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; categoryId: number | null }>({
    open: false,
    categoryId: null,
  });

  const handleOpenCreate = () => {
    if (!canCreate) return;
    setEditingCategory(null);
    setNameFr("");
    setNameEn("");
    setNameAr("");
    setSlug("");
    setOrder(categories.length + 1);
    setModalOpen(true);
  };

  const handleOpenEdit = (cat: Category) => {
    if (!canEdit) return;
    setEditingCategory(cat);
    setNameFr(cat.name.fr);
    setNameEn(cat.name.en);
    setNameAr(cat.name.ar);
    setSlug(cat.slug);
    setOrder(cat.order);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !nameFr.trim()) return;
    if ((editingCategory && !canEdit) || (!editingCategory && !canCreate)) return;

    const newSlug = slug.trim() || nameFr.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");

    try {
      const catPayload = {
        id: editingCategory?.id,
        name: { fr: nameFr, en: nameEn, ar: nameAr },
        slug: newSlug,
        order,
      };
      await adminService.saveCategory(catPayload, user.role);
      await fetchCategories();
    } catch (err) {
      console.error(err);
    }

    setModalOpen(false);
  };

  const handleDelete = async () => {
    if (user && canDelete && deleteDialog.categoryId !== null) {
      try {
        await adminService.deleteCategory(deleteDialog.categoryId, user.role);
        await fetchCategories();
      } catch (err) {
        console.error(err);
      }
    }
    setDeleteDialog({ open: false, categoryId: null });
  };

  // Sort categories by order
  const sortedCategories = useMemo(() => {
    return [...categories].sort((a, b) => a.order - b.order);
  }, [categories]);

  const columns: Column<Category>[] = [
    {
      key: "order",
      label: "Ordre",
      width: 80,
      render: (cat) => (
        <span style={{ fontWeight: 600, color: TEXT_SECONDARY }}>{cat.order}</span>
      ),
    },
    {
      key: "name",
      label: "Nom (FR / EN / AR)",
      render: (cat) => (
        <div>
          <div style={{ fontWeight: 600, color: TEXT }}>{cat.name.fr}</div>
          <div style={{ fontSize: 11, color: TEXT_SECONDARY }}>
            {cat.name.en || "—"} / <span dir="rtl">{cat.name.ar || "—"}</span>
          </div>
        </div>
      ),
    },
    {
      key: "slug",
      label: "Slug",
      render: (cat) => <code style={{ fontSize: 12, color: ACCENT }}>{cat.slug}</code>,
    },
    {
      key: "actions",
      label: "Actions",
      width: 100,
      render: (cat) => (
        <div style={{ display: "flex", gap: 8 }}>
          {canEdit && <button
            onClick={() => handleOpenEdit(cat)}
            title="Modifier la catégorie"
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
            <Edit2 size={14} />
          </button>}
          {canDelete && <button
            onClick={() => setDeleteDialog({ open: true, categoryId: cat.id })}
            title="Supprimer la catégorie"
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
        <span>Impossible de charger les catégories de démonstration.</span>
        <button type="button" onClick={() => void fetchCategories()}>Réessayer</button>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
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
            Catégories
          </h1>
          <p style={{ fontSize: 13, color: TEXT_SECONDARY, fontFamily: "var(--font-sans)", margin: "4px 0 0" }}>
            Gérez les catégories d'articles du blog.
          </p>
        </div>
        {canCreate && <button
          onClick={handleOpenCreate}
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
          Ajouter une catégorie
        </button>}
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
          data={sortedCategories}
          getRowKey={(cat) => cat.id}
          emptyContent={
            <EmptyState
              icon={Folder}
              title="Aucune catégorie"
              description="Créez une catégorie pour classer vos articles de blog."
              actionLabel={canCreate ? "Ajouter une catégorie" : undefined}
              onAction={canCreate ? handleOpenCreate : undefined}
            />
          }
        />
      </div>

      {/* Inline Create/Edit Modal */}
      {modalOpen && (
        <>
          <div
            onClick={() => setModalOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: OVERLAY,
              zIndex: 998,
            }}
          />
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "90%",
              maxWidth: 450,
              background: SURFACE,
              border: `1px solid ${BORDER}`,
              borderRadius: "var(--radius-lg)",
              padding: 24,
              boxShadow: "var(--shadow-xl)",
              zIndex: 999,
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="category-dialog-title"
          >
            <h3 id="category-dialog-title" style={{ fontSize: 16, fontWeight: 700, fontFamily: "var(--font-display)", color: TEXT, margin: "0 0 16px" }}>
              {editingCategory ? "Modifier la catégorie" : "Ajouter une catégorie"}
            </h3>
            <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {/* FR Name */}
              <div>
                <label htmlFor="category-name-fr" style={{ display: "block", fontSize: 12, fontWeight: 600, color: TEXT_SECONDARY, marginBottom: 4 }}>
                  Nom (Français) *
                </label>
                <input
                  ref={firstFieldRef}
                  id="category-name-fr"
                  type="text"
                  required
                  value={nameFr}
                  onChange={(e) => setNameFr(e.target.value)}
                  placeholder="ex: Transformation Numérique"
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: `1px solid ${BORDER}`,
                    borderRadius: "var(--radius-md)",
                    background: SURFACE,
                    color: TEXT,
                    fontSize: 13,
                    outline: "none",
                  }}
                />
              </div>

              {/* EN Name */}
              <div>
                <label htmlFor="category-name-en" style={{ display: "block", fontSize: 12, fontWeight: 600, color: TEXT_SECONDARY, marginBottom: 4 }}>
                  Nom (Anglais)
                </label>
                <input
                  id="category-name-en"
                  type="text"
                  value={nameEn}
                  onChange={(e) => setNameEn(e.target.value)}
                  placeholder="ex: Digital Transformation"
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: `1px solid ${BORDER}`,
                    borderRadius: "var(--radius-md)",
                    background: SURFACE,
                    color: TEXT,
                    fontSize: 13,
                    outline: "none",
                  }}
                />
              </div>

              {/* AR Name */}
              <div>
                <label htmlFor="category-name-ar" style={{ display: "block", fontSize: 12, fontWeight: 600, color: TEXT_SECONDARY, marginBottom: 4 }}>
                  Nom (Arabe)
                </label>
                <input
                  id="category-name-ar"
                  type="text"
                  value={nameAr}
                  onChange={(e) => setNameAr(e.target.value)}
                  dir="rtl"
                  placeholder="ex: التحول الرقمي"
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: `1px solid ${BORDER}`,
                    borderRadius: "var(--radius-md)",
                    background: SURFACE,
                    color: TEXT,
                    fontSize: 13,
                    outline: "none",
                  }}
                />
              </div>

              {/* Slug */}
              <div>
                <label htmlFor="category-slug" style={{ display: "block", fontSize: 12, fontWeight: 600, color: TEXT_SECONDARY, marginBottom: 4 }}>
                  Slug (Optionnel)
                </label>
                <input
                  id="category-slug"
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="ex: transformation-numerique"
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: `1px solid ${BORDER}`,
                    borderRadius: "var(--radius-md)",
                    background: SURFACE,
                    color: TEXT,
                    fontSize: 13,
                    outline: "none",
                  }}
                />
              </div>

              {/* Order */}
              <div>
                <label htmlFor="category-order" style={{ display: "block", fontSize: 12, fontWeight: 600, color: TEXT_SECONDARY, marginBottom: 4 }}>
                  Ordre d'affichage
                </label>
                <input
                  id="category-order"
                  type="number"
                  min={1}
                  value={order}
                  onChange={(e) => setOrder(Number(e.target.value))}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: `1px solid ${BORDER}`,
                    borderRadius: "var(--radius-md)",
                    background: SURFACE,
                    color: TEXT,
                    fontSize: 13,
                    outline: "none",
                  }}
                />
              </div>

              {/* Buttons */}
              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 12 }}>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  style={{
                    padding: "8px 16px",
                    border: `1px solid ${BORDER}`,
                    borderRadius: "var(--radius-md)",
                    background: SURFACE,
                    color: TEXT,
                    fontSize: 13,
                    cursor: "pointer",
                  }}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "8px 16px",
                    border: "none",
                    borderRadius: "var(--radius-md)",
                    background: ACCENT,
                    color: "#fff",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteDialog.open}
        title="Supprimer la catégorie ?"
        message="Attention, cette action supprimera la catégorie. Les articles associés ne seront pas supprimés mais n'auront plus de catégorie."
        confirmLabel="Supprimer"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialog({ open: false, categoryId: null })}
      />
    </div>
  );
}
