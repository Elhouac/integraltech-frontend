import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Info, Image as ImageIcon, FileText, Video } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import MultiLangInput from "../../../components/admin/shared/MultiLangInput";
import StatusBadge from "../../../components/admin/shared/StatusBadge";
import { MEDIA_STATUS_CONFIG, MEDIA_TYPE_CONFIG } from "../../../data/admin-mocks";
import { adminService } from "../../../services/adminService";
import type { MediaAsset, MultiLang, MediaStatus } from "../../../types/admin";
import { useAuth } from "../../../context/AuthContext";
import { hasPermission } from "../../../utils/permissions";
import { ACCENT, BORDER, SURFACE, TEXT, TEXT_SECONDARY, DANGER } from "../../../constants";

const EMPTY_ML: MultiLang = { fr: "", en: "", ar: "" };

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} Ko`;
  return `${(bytes / 1048576).toFixed(1)} Mo`;
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

const labelStyle: React.CSSProperties = { display: "block", fontSize: 13, fontWeight: 600, color: TEXT, fontFamily: "var(--font-sans)", marginBottom: 6 };
const inputStyle: React.CSSProperties = {
  width: "100%", padding: "10px 14px", fontSize: 14, fontFamily: "var(--font-sans)", color: TEXT,
  background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: "var(--radius-md)", outline: "none",
};
const readOnlyStyle: React.CSSProperties = { ...inputStyle, background: "var(--background)", cursor: "not-allowed", opacity: 0.7 };
const errStyle: React.CSSProperties = { fontSize: 12, color: DANGER, marginTop: 4, fontFamily: "var(--font-sans)" };
const helperStyle: React.CSSProperties = { fontSize: 12, color: TEXT_SECONDARY, marginTop: 4, fontFamily: "var(--font-sans)" };
const sectionStyle: React.CSSProperties = { background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: "var(--radius-lg)", overflow: "hidden" };
const sectionHeaderStyle: React.CSSProperties = { padding: "18px 24px", borderBottom: `1px solid ${BORDER}` };
const sectionTitleStyle: React.CSSProperties = { margin: 0, fontSize: 15, fontWeight: 700, fontFamily: "var(--font-display)", color: TEXT };
const sectionBodyStyle: React.CSSProperties = { padding: 24 };
const btnBase: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 16px",
  borderRadius: "var(--radius-md)", fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600, cursor: "pointer",
};

export default function MediaEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const role = user?.role ?? "viewer";
  const canEdit = hasPermission(role, "media", "edit");
  const isAdmin = role === "super_admin" || role === "admin";

  const [asset, setAsset] = useState<MediaAsset | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Editable fields
  const [name, setName] = useState("");
  const [title, setTitle] = useState<MultiLang>({ ...EMPTY_ML });
  const [altText, setAltText] = useState<MultiLang>({ ...EMPTY_ML });
  const [caption, setCaption] = useState<MultiLang>({ ...EMPTY_ML });
  const [description, setDescription] = useState<MultiLang>({ ...EMPTY_ML });
  const [folder, setFolder] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [status, setStatus] = useState<MediaStatus>("active");

  // Load
  useEffect(() => {
    const load = async () => {
      const numId = Number(id);
      if (!numId || isNaN(numId)) { setNotFound(true); setPageLoading(false); return; }
      const a = await adminService.getMediaAssetById(numId);
      if (!a) { setNotFound(true); } else {
        setAsset(a);
        setName(a.name);
        setTitle(JSON.parse(JSON.stringify(a.title)));
        setAltText(JSON.parse(JSON.stringify(a.altText)));
        setCaption(JSON.parse(JSON.stringify(a.caption)));
        setDescription(JSON.parse(JSON.stringify(a.description)));
        setFolder(a.folder);
        setTagsInput(a.tags.join(", "));
        setThumbnailUrl(a.thumbnailUrl);
        setStatus(a.status);
      }
      setPageLoading(false);
    };
    load();
  }, [id]);

  // Dirty tracking
  const initialRef = useRef("");
  useEffect(() => {
    if (asset) {
      initialRef.current = JSON.stringify({ name: asset.name, title: asset.title, altText: asset.altText, caption: asset.caption, description: asset.description, folder: asset.folder, tags: asset.tags.join(", "), thumbnailUrl: asset.thumbnailUrl, status: asset.status });
    }
  }, [asset]);

  const currentSnapshot = useMemo(() => JSON.stringify({ name, title, altText, caption, description, folder, tags: tagsInput, thumbnailUrl, status }), [name, title, altText, caption, description, folder, tagsInput, thumbnailUrl, status]);
  const isDirty = initialRef.current !== "" && currentSnapshot !== initialRef.current;

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => { if (isDirty) e.preventDefault(); };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  // Validation
  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Le nom est requis.";
    if (thumbnailUrl.trim()) {
      try { new URL(thumbnailUrl); } catch { errs.thumbnailUrl = "URL de miniature invalide."; }
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async () => {
    if (!validate() || !asset) return;
    setSaving(true);
    try {
      const tags = tagsInput.split(",").map((t) => t.trim()).filter(Boolean);
      const uniqueTags = [...new Set(tags)];
      await adminService.updateMediaAsset(asset.id, {
        name: name.trim(),
        title, altText, caption, description,
        folder: folder.trim().toLowerCase().replace(/\s+/g, "-"),
        tags: uniqueTags,
        thumbnailUrl: thumbnailUrl.trim(),
        status,
      });
      setToast("Média mis à jour avec succès.");
      setTimeout(() => navigate("/admin/media"), 800);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  // Loading
  if (pageLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 300 }}>
        <div style={{ fontSize: 14, color: TEXT_SECONDARY, fontFamily: "var(--font-sans)" }}>Chargement…</div>
      </div>
    );
  }

  // Not found
  if (notFound || !asset) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 400, gap: 16, textAlign: "center" }}>
        <div style={{ width: 64, height: 64, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: `${ACCENT}15`, fontSize: 28, color: ACCENT }}>?</div>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, fontFamily: "var(--font-display)", color: TEXT }}>Média introuvable</h2>
        <p style={{ margin: 0, fontSize: 14, color: TEXT_SECONDARY, fontFamily: "var(--font-sans)", maxWidth: 400 }}>Le média demandé n'existe pas ou a été supprimé.</p>
        <button onClick={() => navigate("/admin/media")} style={{ marginTop: 8, padding: "10px 24px", borderRadius: "var(--radius-md)", border: `1px solid ${BORDER}`, background: "transparent", color: TEXT, fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Retour à la médiathèque</button>
      </div>
    );
  }

  const Icon = { image: ImageIcon, document: FileText, video: Video }[asset.mediaType];
  const typeCfg = MEDIA_TYPE_CONFIG[asset.mediaType];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header */}
      <div>
        <button onClick={() => { if (isDirty && !window.confirm("Quitter sans enregistrer ?")) return; navigate("/admin/media"); }}
          style={{ ...btnBase, border: "none", background: "transparent", color: TEXT_SECONDARY, padding: "6px 0", marginBottom: 8 }}
        >
          <ArrowLeft size={16} /> Retour à la médiathèque
        </button>
        <motion.h1 initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          style={{ fontSize: 24, fontWeight: 800, fontFamily: "var(--font-display)", color: TEXT, margin: 0 }}
        >
          Modifier : {asset.name}
        </motion.h1>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8 }}>
          <StatusBadge variant={MEDIA_STATUS_CONFIG[asset.status]} size="sm" />
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, padding: "3px 10px", borderRadius: "var(--radius-sm)", background: `${typeCfg.color}15`, color: typeCfg.color, fontWeight: 600, fontFamily: "var(--font-sans)" }}>
            <Icon size={12} /> {typeCfg.label}
          </span>
        </div>
      </div>

      {/* Demo notice */}
      <div className="admin-settings-demo-notice" role="status">
        <Info size={16} style={{ flexShrink: 0, marginTop: 1, color: ACCENT }} />
        <span>Mode démonstration : les modifications sont temporaires et seront réinitialisées après actualisation.</span>
      </div>

      {/* ═══ SECTION 1: General Info ═══ */}
      <div style={sectionStyle}>
        <div style={sectionHeaderStyle}><h2 style={sectionTitleStyle}>Informations générales</h2></div>
        <div style={sectionBodyStyle}>
          <div className="admin-service-form-grid">
            <div>
              <label style={labelStyle} htmlFor="edit-name">Nom <span style={{ color: ACCENT }}>*</span></label>
              <input id="edit-name" type="text" value={name} disabled={!canEdit}
                onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: "" })); }}
                style={{ ...inputStyle, ...(errors.name ? { borderColor: DANGER } : {}), ...(!canEdit ? readOnlyStyle : {}) }}
              />
              {errors.name && <div style={errStyle}>{errors.name}</div>}
            </div>
            <div>
              <label style={labelStyle}>ID</label>
              <input type="text" value={String(asset.id)} readOnly style={readOnlyStyle} />
            </div>
            <div>
              <label style={labelStyle}>Fichier original</label>
              <input type="text" value={asset.originalName} readOnly style={readOnlyStyle} />
            </div>
            <div>
              <label style={labelStyle}>Type MIME</label>
              <input type="text" value={asset.mimeType} readOnly style={readOnlyStyle} />
            </div>
            <div>
              <label style={labelStyle}>Source</label>
              <input type="text" value={asset.source.replace("_", " ")} readOnly style={readOnlyStyle} />
            </div>
            <div>
              <label style={labelStyle}>Taille</label>
              <input type="text" value={formatBytes(asset.sizeBytes)} readOnly style={readOnlyStyle} />
            </div>
            {asset.width && asset.height && (
              <div>
                <label style={labelStyle}>Dimensions</label>
                <input type="text" value={`${asset.width} × ${asset.height} px`} readOnly style={readOnlyStyle} />
              </div>
            )}
            {asset.durationSeconds && (
              <div>
                <label style={labelStyle}>Durée</label>
                <input type="text" value={formatDuration(asset.durationSeconds)} readOnly style={readOnlyStyle} />
              </div>
            )}
            <div>
              <label style={labelStyle}>Ajouté par</label>
              <input type="text" value={asset.uploadedBy} readOnly style={readOnlyStyle} />
            </div>
            <div>
              <label style={labelStyle}>Créé le</label>
              <input type="text" value={new Date(asset.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })} readOnly style={readOnlyStyle} />
            </div>
          </div>
        </div>
      </div>

      {/* ═══ SECTION 2: Multilingual Metadata ═══ */}
      <div style={sectionStyle}>
        <div style={sectionHeaderStyle}><h2 style={sectionTitleStyle}>Métadonnées multilingues</h2></div>
        <div style={sectionBodyStyle}>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <MultiLangInput label="Titre" value={title} onChange={setTitle} />
            <div>
              <MultiLangInput label="Texte alternatif" value={altText} onChange={setAltText} />
              {!altText.fr && asset.mediaType === "image" && (
                <div style={{ ...helperStyle, color: "#F59E0B" }}>Recommandé pour l'accessibilité des images.</div>
              )}
            </div>
            <MultiLangInput label="Légende" value={caption} onChange={setCaption} />
            <MultiLangInput label="Description" value={description} onChange={setDescription} type="textarea" />
          </div>
        </div>
      </div>

      {/* ═══ SECTION 3: Classification ═══ */}
      <div style={sectionStyle}>
        <div style={sectionHeaderStyle}><h2 style={sectionTitleStyle}>Classification</h2></div>
        <div style={sectionBodyStyle}>
          <div className="admin-service-form-grid">
            <div>
              <label style={labelStyle} htmlFor="edit-folder">Dossier</label>
              <input id="edit-folder" type="text" value={folder} disabled={!canEdit}
                onChange={(e) => setFolder(e.target.value)}
                style={{ ...inputStyle, ...(!canEdit ? readOnlyStyle : {}) }}
              />
            </div>
            <div>
              <label style={labelStyle} htmlFor="edit-tags">Tags (séparés par des virgules)</label>
              <input id="edit-tags" type="text" value={tagsInput} disabled={!canEdit}
                onChange={(e) => setTagsInput(e.target.value)}
                style={{ ...inputStyle, ...(!canEdit ? readOnlyStyle : {}) }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ═══ SECTION 4: File / Thumbnail ═══ */}
      <div style={sectionStyle}>
        <div style={sectionHeaderStyle}><h2 style={sectionTitleStyle}>Fichier et miniature</h2></div>
        <div style={sectionBodyStyle}>
          {/* Current preview */}
          {asset.mediaType === "image" && (asset.url || asset.thumbnailUrl) && (
            <div style={{ marginBottom: 16 }}>
              <img src={asset.url || asset.thumbnailUrl} alt={asset.altText.fr || asset.name}
                style={{ maxWidth: "100%", maxHeight: 200, borderRadius: "var(--radius-md)", objectFit: "contain", background: "var(--background)" }}
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
            </div>
          )}
          <div className="admin-service-form-grid">
            <div className="full-width">
              <label style={labelStyle}>URL du fichier</label>
              <input type="text" value={asset.url || "(aucune URL — fichier mock)"} readOnly style={readOnlyStyle} />
            </div>
            <div className="full-width">
              <label style={labelStyle} htmlFor="edit-thumb-url">URL de la miniature</label>
              <input id="edit-thumb-url" type="url" value={thumbnailUrl} disabled={!canEdit}
                onChange={(e) => { setThumbnailUrl(e.target.value); setErrors((p) => ({ ...p, thumbnailUrl: "" })); }}
                placeholder="https://..." style={{ ...inputStyle, ...(errors.thumbnailUrl ? { borderColor: DANGER } : {}), ...(!canEdit ? readOnlyStyle : {}) }}
              />
              {errors.thumbnailUrl && <div style={errStyle}>{errors.thumbnailUrl}</div>}
            </div>
          </div>
        </div>
      </div>

      {/* ═══ SECTION 5: Usage References ═══ */}
      <div style={sectionStyle}>
        <div style={sectionHeaderStyle}><h2 style={sectionTitleStyle}>Utilisation ({asset.usageReferences.length})</h2></div>
        <div style={sectionBodyStyle}>
          {asset.usageReferences.length === 0 ? (
            <div style={{ fontSize: 13, color: TEXT_SECONDARY, fontFamily: "var(--font-sans)" }}>Ce média n'est actuellement référencé nulle part.</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {asset.usageReferences.map((ref, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", background: "var(--background)", borderRadius: "var(--radius-sm)" }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: TEXT_SECONDARY, fontFamily: "var(--font-sans)", textTransform: "uppercase" }}>{ref.resourceType}</span>
                  <span style={{ fontSize: 13, color: TEXT, fontFamily: "var(--font-sans)" }}>{ref.resourceLabel}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ═══ SECTION 6: Status ═══ */}
      {(canEdit || isAdmin) && (
        <div style={sectionStyle}>
          <div style={sectionHeaderStyle}><h2 style={sectionTitleStyle}>Statut</h2></div>
          <div style={sectionBodyStyle}>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                <input type="radio" name="media-status" value="active" checked={status === "active"}
                  onChange={() => setStatus("active")} style={{ accentColor: ACCENT }}
                />
                <StatusBadge variant={MEDIA_STATUS_CONFIG.active} size="sm" />
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                <input type="radio" name="media-status" value="archived" checked={status === "archived"}
                  onChange={() => setStatus("archived")} style={{ accentColor: ACCENT }}
                />
                <StatusBadge variant={MEDIA_STATUS_CONFIG.archived} size="sm" />
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Action Bar */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, flexWrap: "wrap", paddingBottom: 32 }}>
        <button onClick={() => { if (isDirty && !window.confirm("Quitter sans enregistrer ?")) return; navigate("/admin/media"); }}
          style={{ ...btnBase, border: `1px solid ${BORDER}`, background: SURFACE, color: TEXT }}
        >
          Annuler
        </button>
        {canEdit && (
          <button onClick={handleSave} disabled={saving}
            style={{ ...btnBase, border: "none", background: ACCENT, color: "#fff", opacity: saving ? 0.6 : 1 }}
          >
            <Save size={14} /> Enregistrer
          </button>
        )}
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div className="admin-settings-toast"
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
