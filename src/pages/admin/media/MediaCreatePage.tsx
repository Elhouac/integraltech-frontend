import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, Link2, Info, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import MultiLangInput from "../../../components/admin/shared/MultiLangInput";
import { adminService } from "../../../services/adminService";
import { useAuth } from "../../../context/AuthContext";
import type { MultiLang, MediaType, MediaSource } from "../../../types/admin";
import { ACCENT, BORDER, SURFACE, TEXT, TEXT_SECONDARY, DANGER } from "../../../constants";

const EMPTY_ML: MultiLang = { fr: "", en: "", ar: "" };
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_MIMES = ["image/jpeg", "image/png", "image/webp", "image/svg+xml", "application/pdf", "video/mp4", "video/webm"];

function mimeToMediaType(mime: string): MediaType {
  if (mime.startsWith("image/")) return "image";
  if (mime.startsWith("video/")) return "video";
  return "document";
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} Ko`;
  return `${(bytes / 1048576).toFixed(1)} Mo`;
}

type CreateMode = "file" | "url";

const labelStyle: React.CSSProperties = {
  display: "block", fontSize: 13, fontWeight: 600, color: TEXT, fontFamily: "var(--font-sans)", marginBottom: 6,
};
const inputStyle: React.CSSProperties = {
  width: "100%", padding: "10px 14px", fontSize: 14, fontFamily: "var(--font-sans)", color: TEXT,
  background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: "var(--radius-md)", outline: "none",
};
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

export default function MediaCreatePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mode, setMode] = useState<CreateMode>("file");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // File mode state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const [dragover, setDragover] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // URL mode state
  const [externalUrl, setExternalUrl] = useState("");
  const [externalName, setExternalName] = useState("");
  const [externalMediaType, setExternalMediaType] = useState<MediaType>("image");
  const [externalMimeType, setExternalMimeType] = useState("image/jpeg");
  const [externalThumbnailUrl, setExternalThumbnailUrl] = useState("");

  // Shared metadata
  const [name, setName] = useState("");
  const [title, setTitle] = useState<MultiLang>({ ...EMPTY_ML });
  const [altText, setAltText] = useState<MultiLang>({ ...EMPTY_ML });
  const [folder, setFolder] = useState("");
  const [tagsInput, setTagsInput] = useState("");

  // Cleanup object URLs
  useEffect(() => {
    return () => { if (filePreviewUrl) URL.revokeObjectURL(filePreviewUrl); };
  }, [filePreviewUrl]);

  const handleFileSelect = useCallback((file: File) => {
    // Validate
    if (!ALLOWED_MIMES.includes(file.type)) {
      setErrors((p) => ({ ...p, file: `Type de fichier non supporté : ${file.type}. Types autorisés : ${ALLOWED_MIMES.join(", ")}` }));
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setErrors((p) => ({ ...p, file: `Fichier trop volumineux (${formatBytes(file.size)}). Maximum : ${formatBytes(MAX_FILE_SIZE)}.` }));
      return;
    }
    setErrors((p) => ({ ...p, file: "" }));
    setSelectedFile(file);
    if (!name) setName(file.name.replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9\u00C0-\u024F\u0600-\u06FF]+/g, "-").toLowerCase());

    // Preview for images
    if (filePreviewUrl) URL.revokeObjectURL(filePreviewUrl);
    if (file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setFilePreviewUrl(url);
    } else {
      setFilePreviewUrl(null);
    }
  }, [name, filePreviewUrl]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragover(false);
    if (e.dataTransfer.files.length > 0) handleFileSelect(e.dataTransfer.files[0]);
  }, [handleFileSelect]);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    const effectiveName = mode === "file" ? name : externalName;
    if (!effectiveName.trim()) errs.name = "Le nom est requis.";
    if (mode === "file" && !selectedFile) errs.file = "Veuillez sélectionner un fichier.";
    if (mode === "url") {
      if (!externalUrl.trim()) errs.url = "L'URL est requise.";
      else {
        try { new URL(externalUrl); } catch { errs.url = "URL invalide."; }
      }
    }
    if (externalThumbnailUrl.trim() && mode === "url") {
      try { new URL(externalThumbnailUrl); } catch { errs.thumbnailUrl = "URL de miniature invalide."; }
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleCreate = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const tags = tagsInput.split(",").map((t) => t.trim()).filter(Boolean);
      const uniqueTags = [...new Set(tags)];
      const normalizedFolder = folder.trim().toLowerCase().replace(/\s+/g, "-");

      if (mode === "file" && selectedFile) {
        const mediaType = mimeToMediaType(selectedFile.type);
        await adminService.createMediaAsset({
          name: name.trim(),
          originalName: selectedFile.name,
          mediaType,
          mimeType: selectedFile.type,
          url: filePreviewUrl ?? "",
          thumbnailUrl: filePreviewUrl ?? "",
          source: "local_mock" as MediaSource,
          title, altText,
          caption: { ...EMPTY_ML },
          description: { ...EMPTY_ML },
          folder: normalizedFolder,
          tags: uniqueTags,
          sizeBytes: selectedFile.size,
          width: null, height: null, durationSeconds: null,
          status: "active",
          usageReferences: [],
          uploadedBy: user?.name ?? "Admin",
        });
      } else {
        await adminService.createMediaAsset({
          name: externalName.trim(),
          originalName: externalName.trim(),
          mediaType: externalMediaType,
          mimeType: externalMimeType,
          url: externalUrl.trim(),
          thumbnailUrl: externalThumbnailUrl.trim() || (externalMediaType === "image" ? externalUrl.trim() : ""),
          source: "external_url" as MediaSource,
          title, altText,
          caption: { ...EMPTY_ML },
          description: { ...EMPTY_ML },
          folder: normalizedFolder,
          tags: uniqueTags,
          sizeBytes: 0,
          width: null, height: null, durationSeconds: null,
          status: "active",
          usageReferences: [],
          uploadedBy: user?.name ?? "Admin",
        });
      }

      setToast("Média créé avec succès.");
      setTimeout(() => navigate("/admin/media"), 800);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };



  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header */}
      <div>
        <button onClick={() => navigate("/admin/media")}
          style={{ ...btnBase, border: "none", background: "transparent", color: TEXT_SECONDARY, padding: "6px 0", marginBottom: 8 }}
        >
          <ArrowLeft size={16} /> Retour à la médiathèque
        </button>
        <motion.h1 initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          style={{ fontSize: 24, fontWeight: 800, fontFamily: "var(--font-display)", color: TEXT, margin: 0 }}
        >
          Ajouter un média
        </motion.h1>
      </div>

      {/* Demo notice */}
      <div className="admin-settings-demo-notice" role="status">
        <Info size={16} style={{ flexShrink: 0, marginTop: 1, color: ACCENT }} />
        <span>Mode démonstration : aucun fichier n'est envoyé au serveur. Les changements sont réinitialisés après actualisation.</span>
      </div>

      {/* Mode toggle */}
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={() => setMode("file")}
          style={{ ...btnBase, border: `1px solid ${mode === "file" ? ACCENT : BORDER}`, background: mode === "file" ? `${ACCENT}15` : SURFACE, color: mode === "file" ? ACCENT : TEXT }}
        >
          <Upload size={14} /> Fichier local (mock)
        </button>
        <button onClick={() => setMode("url")}
          style={{ ...btnBase, border: `1px solid ${mode === "url" ? ACCENT : BORDER}`, background: mode === "url" ? `${ACCENT}15` : SURFACE, color: mode === "url" ? ACCENT : TEXT }}
        >
          <Link2 size={14} /> URL externe
        </button>
      </div>

      {/* ═══ FILE MODE ═══ */}
      {mode === "file" && (
        <div style={sectionStyle}>
          <div style={sectionHeaderStyle}><h2 style={sectionTitleStyle}>Sélection de fichier</h2></div>
          <div style={sectionBodyStyle}>
            <div
              className={`admin-media-dropzone${dragover ? " dragover" : ""}`}
              onDragOver={(e) => { e.preventDefault(); setDragover(true); }}
              onDragLeave={() => setDragover(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click(); }}
              aria-label="Zone de dépôt de fichier"
            >
              <input ref={fileInputRef} type="file" accept={ALLOWED_MIMES.join(",")}
                style={{ display: "none" }}
                onChange={(e) => { if (e.target.files?.[0]) handleFileSelect(e.target.files[0]); }}
              />
              {selectedFile ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                  {filePreviewUrl && (
                    <img src={filePreviewUrl} alt="Aperçu" style={{ maxWidth: 200, maxHeight: 150, borderRadius: "var(--radius-md)", objectFit: "contain" }} />
                  )}
                  <div style={{ fontSize: 14, fontWeight: 600, color: TEXT, fontFamily: "var(--font-sans)" }}>{selectedFile.name}</div>
                  <div style={{ fontSize: 12, color: TEXT_SECONDARY, fontFamily: "var(--font-sans)" }}>
                    {selectedFile.type} · {formatBytes(selectedFile.size)}
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); setSelectedFile(null); if (filePreviewUrl) { URL.revokeObjectURL(filePreviewUrl); setFilePreviewUrl(null); } }}
                    style={{ ...btnBase, border: `1px solid ${BORDER}`, background: SURFACE, color: TEXT_SECONDARY, marginTop: 4 }}
                  >
                    <X size={14} /> Changer de fichier
                  </button>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                  <Upload size={32} style={{ color: TEXT_SECONDARY, opacity: 0.5 }} />
                  <div style={{ fontSize: 14, color: TEXT, fontFamily: "var(--font-sans)", fontWeight: 600 }}>Glissez un fichier ici ou cliquez pour parcourir</div>
                  <div style={{ fontSize: 12, color: TEXT_SECONDARY, fontFamily: "var(--font-sans)" }}>
                    JPEG, PNG, WebP, SVG, PDF, MP4, WebM · Max {formatBytes(MAX_FILE_SIZE)}
                  </div>
                </div>
              )}
            </div>
            {errors.file && <div style={errStyle}>{errors.file}</div>}

            <div style={{ marginTop: 20 }}>
              <label style={labelStyle} htmlFor="media-name">Nom <span style={{ color: ACCENT }}>*</span></label>
              <input id="media-name" type="text" value={name}
                onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: "" })); }}
                style={{ ...inputStyle, ...(errors.name ? { borderColor: DANGER } : {}) }}
              />
              {errors.name && <div style={errStyle}>{errors.name}</div>}
            </div>
          </div>
        </div>
      )}

      {/* ═══ URL MODE ═══ */}
      {mode === "url" && (
        <div style={sectionStyle}>
          <div style={sectionHeaderStyle}><h2 style={sectionTitleStyle}>URL externe</h2></div>
          <div style={sectionBodyStyle}>
            <div className="admin-service-form-grid">
              <div className="full-width">
                <label style={labelStyle} htmlFor="media-ext-url">URL <span style={{ color: ACCENT }}>*</span></label>
                <input id="media-ext-url" type="url" value={externalUrl}
                  onChange={(e) => { setExternalUrl(e.target.value); setErrors((p) => ({ ...p, url: "" })); }}
                  placeholder="https://..." style={{ ...inputStyle, ...(errors.url ? { borderColor: DANGER } : {}) }}
                />
                {errors.url && <div style={errStyle}>{errors.url}</div>}
                {!externalUrl.startsWith("https") && externalUrl.length > 5 && (
                  <div style={{ ...helperStyle, color: "#F59E0B" }}>HTTPS recommandé.</div>
                )}
              </div>
              <div>
                <label style={labelStyle} htmlFor="media-ext-name">Nom <span style={{ color: ACCENT }}>*</span></label>
                <input id="media-ext-name" type="text" value={externalName}
                  onChange={(e) => { setExternalName(e.target.value); setErrors((p) => ({ ...p, name: "" })); }}
                  style={{ ...inputStyle, ...(errors.name ? { borderColor: DANGER } : {}) }}
                />
                {errors.name && <div style={errStyle}>{errors.name}</div>}
              </div>
              <div>
                <label style={labelStyle} htmlFor="media-ext-type">Type de média <span style={{ color: ACCENT }}>*</span></label>
                <select id="media-ext-type" value={externalMediaType}
                  onChange={(e) => setExternalMediaType(e.target.value as MediaType)}
                  style={{ ...inputStyle, cursor: "pointer", appearance: "auto" as const }}
                >
                  <option value="image">Image</option>
                  <option value="document">Document</option>
                  <option value="video">Vidéo</option>
                </select>
              </div>
              <div>
                <label style={labelStyle} htmlFor="media-ext-mime">Type MIME</label>
                <input id="media-ext-mime" type="text" value={externalMimeType}
                  onChange={(e) => setExternalMimeType(e.target.value)} placeholder="image/jpeg"
                  style={inputStyle}
                />
              </div>
              <div className="full-width">
                <label style={labelStyle} htmlFor="media-ext-thumb">URL de la miniature (optionnel)</label>
                <input id="media-ext-thumb" type="url" value={externalThumbnailUrl}
                  onChange={(e) => { setExternalThumbnailUrl(e.target.value); setErrors((p) => ({ ...p, thumbnailUrl: "" })); }}
                  placeholder="https://..." style={{ ...inputStyle, ...(errors.thumbnailUrl ? { borderColor: DANGER } : {}) }}
                />
                {errors.thumbnailUrl && <div style={errStyle}>{errors.thumbnailUrl}</div>}
              </div>
            </div>

            {/* URL Preview */}
            {externalMediaType === "image" && externalUrl && !errors.url && (
              <div className="admin-service-image-preview" style={{ marginTop: 16 }}>
                <img src={externalUrl} alt="Aperçu URL" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══ SHARED METADATA ═══ */}
      <div style={sectionStyle}>
        <div style={sectionHeaderStyle}><h2 style={sectionTitleStyle}>Métadonnées</h2></div>
        <div style={sectionBodyStyle}>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <MultiLangInput label="Titre" value={title} onChange={setTitle} />
            <div>
              <MultiLangInput label="Texte alternatif" value={altText} onChange={setAltText} />
              {!altText.fr && <div style={{ ...helperStyle, color: "#F59E0B" }}>Recommandé pour l'accessibilité. Laissez vide pour les images décoratives.</div>}
            </div>
            <div className="admin-service-form-grid">
              <div>
                <label style={labelStyle} htmlFor="media-folder">Dossier</label>
                <input id="media-folder" type="text" value={folder} onChange={(e) => setFolder(e.target.value)} placeholder="site, branding, solutions..." style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle} htmlFor="media-tags">Tags (séparés par des virgules)</label>
                <input id="media-tags" type="text" value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} placeholder="logo, hero, cloud..." style={inputStyle} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, flexWrap: "wrap", paddingBottom: 32 }}>
        <button onClick={() => navigate("/admin/media")}
          style={{ ...btnBase, border: `1px solid ${BORDER}`, background: SURFACE, color: TEXT }}
        >
          Annuler
        </button>
        <button onClick={handleCreate} disabled={saving}
          style={{ ...btnBase, border: "none", background: ACCENT, color: "#fff", opacity: saving ? 0.6 : 1 }}
        >
          <Upload size={14} /> Créer le média
        </button>
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
