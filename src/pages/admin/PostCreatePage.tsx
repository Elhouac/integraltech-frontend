import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Sparkles, X } from "lucide-react";
import { motion } from "framer-motion";
import MultiLangInput from "../../components/admin/shared/MultiLangInput";
import { MOCK_CATEGORIES, MOCK_TAGS, POST_STATUS_CONFIG } from "../../data/admin-mocks";
import type { Post, PostStatus } from "../../data/admin-mocks";
import { ACCENT, BORDER, SURFACE, TEXT, TEXT_SECONDARY } from "../../constants";

export default function PostCreatePage() {
  const navigate = useNavigate();

  // Multilingual values
  const [title, setTitle] = useState({ fr: "", en: "", ar: "" });
  const [excerpt, setExcerpt] = useState({ fr: "", en: "", ar: "" });
  const [content, setContent] = useState({ fr: "", en: "", ar: "" });

  // Metadata
  const [categoryId, setCategoryId] = useState<number>(MOCK_CATEGORIES[0]?.id || 1);
  const [status, setStatus] = useState<PostStatus>("draft");
  const [publishedAt, setPublishedAt] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");

  // Tags
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const val = tagInput.trim().replace(/,$/, "");
      if (val && !tags.includes(val)) {
        setTags([...tags, val]);
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.fr.trim()) return;

    const newPost: Post = {
      id: Date.now(),
      slug: title.fr.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      title,
      excerpt,
      content,
      category_id: categoryId,
      author: "Super Admin",
      cover_image: coverImage || null,
      seo_title: seoTitle || null,
      seo_description: seoDescription || null,
      status,
      published_at: status === "published" ? (publishedAt ? new Date(publishedAt).toISOString() : new Date().toISOString()) : null,
      created_at: new Date().toISOString(),
      tags,
    };

    MOCK_POSTS.push(newPost);
    console.log("Saving new post:", newPost);
    navigate("/admin/posts");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header */}
      <div>
        <button
          onClick={() => navigate("/admin/posts")}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: "none",
            border: "none",
            color: TEXT_SECONDARY,
            fontSize: 13,
            cursor: "pointer",
            padding: 0,
            marginBottom: 12,
          }}
        >
          <ArrowLeft size={15} />
          Retour aux articles
        </button>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <h1
            style={{
              fontSize: 22,
              fontWeight: 800,
              fontFamily: "var(--font-display)",
              color: TEXT,
              margin: 0,
            }}
          >
            Créer un article
          </h1>
          <button
            onClick={handleSubmit}
            disabled={!title.fr.trim()}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 16px",
              border: "none",
              borderRadius: "var(--radius-md)",
              background: title.fr.trim() ? ACCENT : "var(--hover)",
              color: title.fr.trim() ? "#fff" : "var(--muted)",
              fontSize: 13,
              fontWeight: 600,
              cursor: title.fr.trim() ? "pointer" : "not-allowed",
            }}
          >
            <Save size={15} />
            Enregistrer
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div
        className="admin-dashboard-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "3fr 2fr",
          gap: 20,
        }}
      >
        {/* Left Column: Multilingual Inputs */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              background: SURFACE,
              border: `1px solid ${BORDER}`,
              borderRadius: "var(--radius-lg)",
              padding: 24,
              display: "flex",
              flexDirection: "column",
              gap: 20,
            }}
          >
            <MultiLangInput
              label="Titre de l'article"
              required
              value={title}
              onChange={setTitle}
            />

            <MultiLangInput
              label="Extrait / Résumé"
              type="textarea"
              value={excerpt}
              onChange={setExcerpt}
            />

            <MultiLangInput
              label="Contenu de l'article"
              type="textarea"
              value={content}
              onChange={setContent}
            />
          </div>
        </div>

        {/* Right Column: Settings & SEO */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Status & Category Card */}
          <div
            style={{
              background: SURFACE,
              border: `1px solid ${BORDER}`,
              borderRadius: "var(--radius-lg)",
              padding: 20,
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            <h3 style={{ fontSize: 14, fontWeight: 700, fontFamily: "var(--font-display)", color: TEXT, margin: 0 }}>
              Publication
            </h3>

            {/* Status Select */}
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: TEXT_SECONDARY, marginBottom: 6 }}>
                Statut
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as PostStatus)}
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
              >
                {Object.entries(POST_STATUS_CONFIG).map(([key, config]) => (
                  <option key={key} value={key}>
                    {config.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Category Select */}
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: TEXT_SECONDARY, marginBottom: 6 }}>
                Catégorie
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(Number(e.target.value))}
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
              >
                {MOCK_CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name.fr}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Picker */}
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: TEXT_SECONDARY, marginBottom: 6 }}>
                Date de publication planifiée
              </label>
              <input
                type="datetime-local"
                value={publishedAt}
                onChange={(e) => setPublishedAt(e.target.value)}
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
          </div>

          {/* Media & Tags Card */}
          <div
            style={{
              background: SURFACE,
              border: `1px solid ${BORDER}`,
              borderRadius: "var(--radius-lg)",
              padding: 20,
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            <h3 style={{ fontSize: 14, fontWeight: 700, fontFamily: "var(--font-display)", color: TEXT, margin: 0 }}>
              Média & Tags
            </h3>

            {/* Cover Image URL */}
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: TEXT_SECONDARY, marginBottom: 6 }}>
                Image de couverture (URL)
              </label>
              <input
                type="text"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="ex: https://images.unsplash.com/..."
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

            {/* Tags Inputs */}
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: TEXT_SECONDARY, marginBottom: 6 }}>
                Tags (Appuyez sur Entrée)
              </label>
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="ex: Sécurité, Cloud"
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
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8 }}>
                {tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                      padding: "4px 8px",
                      background: "var(--hover)",
                      border: `1px solid ${BORDER}`,
                      borderRadius: "var(--radius-sm)",
                      fontSize: 11,
                      fontWeight: 600,
                      color: TEXT,
                    }}
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      style={{
                        background: "none",
                        border: "none",
                        padding: 0,
                        cursor: "pointer",
                        color: "var(--muted)",
                        display: "flex",
                      }}
                    >
                      <X size={10} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* SEO Card */}
          <div
            style={{
              background: SURFACE,
              border: `1px solid ${BORDER}`,
              borderRadius: "var(--radius-lg)",
              padding: 20,
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            <h3 style={{ fontSize: 14, fontWeight: 700, fontFamily: "var(--font-display)", color: TEXT, margin: 0 }}>
              Référencement (SEO)
            </h3>

            {/* SEO Title */}
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: TEXT_SECONDARY, marginBottom: 6 }}>
                Meta Titre
              </label>
              <input
                type="text"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                placeholder="Titre accrocheur pour Google"
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

            {/* SEO Description */}
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: TEXT_SECONDARY, marginBottom: 6 }}>
                Meta Description
              </label>
              <textarea
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                placeholder="Description courte de l'article"
                style={{
                  width: "100%",
                  minHeight: 60,
                  padding: "8px 12px",
                  border: `1px solid ${BORDER}`,
                  borderRadius: "var(--radius-md)",
                  background: SURFACE,
                  color: TEXT,
                  fontSize: 13,
                  outline: "none",
                  resize: "vertical",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
