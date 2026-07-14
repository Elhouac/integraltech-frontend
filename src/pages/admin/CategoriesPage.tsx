import { useState, useMemo } from "react";
import { Plus, Edit2, Trash2, Folder } from "lucide-react";
import { motion } from "framer-motion";
import DataTable from "../../components/admin/shared/DataTable";
import type { Column } from "../../components/admin/shared/DataTable";
import EmptyState from "../../components/admin/shared/EmptyState";
import ConfirmDialog from "../../components/admin/shared/ConfirmDialog";
import { MOCK_CATEGORIES } from "../../data/admin-mocks";
import type { Category } from "../../data/admin-mocks";
import { ACCENT, BORDER, SURFACE, TEXT, TEXT_SECONDARY, OVERLAY } from "../../constants";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

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
    setEditingCategory(null);
    setNameFr("");
    setNameEn("");
    setNameAr("");
    setSlug("");
    setOrder(categories.length + 1);
    setModalOpen(true);
  };

  const handleOpenEdit = (cat: Category) => {
    setEditingCategory(cat);
    setNameFr(cat.name.fr);
    setNameEn(cat.name.en);
    setNameAr(cat.name.ar);
    setSlug(cat.slug);
    setOrder(cat.order);
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameFr.trim()) return;

    const newSlug = slug.trim() || nameFr.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");

    if (editingCategory) {
      // Edit in-place for persistence
      const index = MOCK_CATEGORIES.findIndex((c) => c.id === editingCategory.id);
      if (index !== -1) {
        MOCK_CATEGORIES[index] = {
          ...MOCK_CATEGORIES[index],
          name: { fr: nameFr, en: nameEn, ar: nameAr },
          slug: newSlug,
          order,
        };
      }
      setCategories([...MOCK_CATEGORIES]);
    } else {
      // Create in-place
      const newCat: Category = {
        id: Date.now(),
        name: { fr: nameFr, en: nameEn, ar: nameAr },
        slug: newSlug,
        order,
      };
      MOCK_CATEGORIES.push(newCat);
      setCategories([...MOCK_CATEGORIES]);
    }

    setModalOpen(false);
  };

  const handleDelete = () => {
    if (deleteDialog.categoryId !== null) {
      const index = MOCK_CATEGORIES.findIndex((c) => c.id === deleteDialog.categoryId);
      if (index !== -1) {
        MOCK_CATEGORIES.splice(index, 1);
      }
      setCategories([...MOCK_CATEGORIES]);
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
          <button
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
          </button>
          <button
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
          </button>
        </div>
      ),
    },
  ];

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
        <button
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
        </button>
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
              actionLabel="Ajouter une catégorie"
              onAction={handleOpenCreate}
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
          >
            <h3 style={{ fontSize: 16, fontWeight: 700, fontFamily: "var(--font-display)", color: TEXT, margin: "0 0 16px" }}>
              {editingCategory ? "Modifier la catégorie" : "Ajouter une catégorie"}
            </h3>
            <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {/* FR Name */}
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: TEXT_SECONDARY, marginBottom: 4 }}>
                  Nom (Français) *
                </label>
                <input
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
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: TEXT_SECONDARY, marginBottom: 4 }}>
                  Nom (Anglais)
                </label>
                <input
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
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: TEXT_SECONDARY, marginBottom: 4 }}>
                  Nom (Arabe)
                </label>
                <input
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
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: TEXT_SECONDARY, marginBottom: 4 }}>
                  Slug (Optionnel)
                </label>
                <input
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
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: TEXT_SECONDARY, marginBottom: 4 }}>
                  Ordre d'affichage
                </label>
                <input
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
