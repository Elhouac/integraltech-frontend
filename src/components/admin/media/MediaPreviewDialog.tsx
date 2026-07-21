import { useEffect, useCallback } from "react";
import { X, ExternalLink, Image as ImageIcon, FileText, Video, Link2, Tag } from "lucide-react";
import type { MediaAsset } from "../../../types/admin";
import { MEDIA_STATUS_CONFIG, MEDIA_TYPE_CONFIG } from "../../../data/admin-mocks";
import StatusBadge from "../shared/StatusBadge";
import { TEXT, TEXT_SECONDARY, BORDER, SURFACE, ACCENT } from "../../../constants";

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

const mediaIcons = { image: ImageIcon, document: FileText, video: Video };

interface MediaPreviewDialogProps {
  asset: MediaAsset | null;
  onClose: () => void;
}

export default function MediaPreviewDialog({ asset, onClose }: MediaPreviewDialogProps) {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") onClose();
  }, [onClose]);

  useEffect(() => {
    if (!asset) return;
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [asset, handleKeyDown]);

  if (!asset) return null;

  const Icon = mediaIcons[asset.mediaType];
  const typeCfg = MEDIA_TYPE_CONFIG[asset.mediaType];

  const metaRows: { label: string; value: string }[] = [
    { label: "Nom", value: asset.name },
    { label: "Fichier original", value: asset.originalName },
    { label: "Type MIME", value: asset.mimeType },
    { label: "Taille", value: formatBytes(asset.sizeBytes) },
  ];
  if (asset.width && asset.height) metaRows.push({ label: "Dimensions", value: `${asset.width} × ${asset.height} px` });
  if (asset.durationSeconds) metaRows.push({ label: "Durée", value: formatDuration(asset.durationSeconds) });
  metaRows.push({ label: "Dossier", value: asset.folder || "—" });
  metaRows.push({ label: "Source", value: asset.source.replace("_", " ") });
  metaRows.push({ label: "Ajouté par", value: asset.uploadedBy });
  metaRows.push({ label: "Créé le", value: new Date(asset.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }) });

  return (
    <div className="admin-media-preview-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label={`Aperçu : ${asset.name}`}>
      <div className="admin-media-preview-panel" onClick={(e) => e.stopPropagation()}>
        <div className="admin-media-preview-header">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Icon size={18} style={{ color: typeCfg.color }} />
            <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, fontFamily: "var(--font-display)", color: TEXT }}>{asset.name}</h2>
          </div>
          <button onClick={onClose} aria-label="Fermer l'aperçu"
            style={{ display: "inline-flex", padding: 6, border: "none", background: "transparent", cursor: "pointer", color: TEXT_SECONDARY, borderRadius: "var(--radius-sm)" }}
          >
            <X size={20} />
          </button>
        </div>

        <div className="admin-media-preview-body">
          {/* Preview area */}
          {asset.mediaType === "image" && asset.url ? (
            <img src={asset.url} alt={asset.altText.fr || asset.name} className="admin-media-preview-image"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          ) : asset.mediaType === "video" && asset.url ? (
            <video controls style={{ width: "100%", maxHeight: 400, borderRadius: "var(--radius-md)", background: "var(--background)" }}>
              <source src={asset.url} type={asset.mimeType} />
              Votre navigateur ne supporte pas la lecture vidéo.
            </video>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 48, background: "var(--background)", borderRadius: "var(--radius-md)", gap: 12 }}>
              <Icon size={48} style={{ color: typeCfg.color, opacity: 0.6 }} />
              <span style={{ fontSize: 14, color: TEXT_SECONDARY, fontFamily: "var(--font-sans)" }}>
                {asset.mediaType === "video" ? "Aperçu vidéo non disponible (fichier mock)" : "Aperçu non disponible"}
              </span>
              {asset.url && (
                <a href={asset.url} target="_blank" rel="noopener noreferrer"
                  style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: ACCENT, textDecoration: "none", fontFamily: "var(--font-sans)" }}
                >
                  <ExternalLink size={14} /> Ouvrir le fichier
                </a>
              )}
            </div>
          )}

          {/* Status & type badges */}
          <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap", alignItems: "center" }}>
            <StatusBadge variant={MEDIA_STATUS_CONFIG[asset.status]} size="sm" />
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, padding: "3px 10px", borderRadius: "var(--radius-sm)", background: `${typeCfg.color}15`, color: typeCfg.color, fontWeight: 600, fontFamily: "var(--font-sans)" }}>
              <Icon size={12} /> {typeCfg.label}
            </span>
          </div>

          {/* Alt text */}
          {asset.altText.fr && (
            <div style={{ marginTop: 16, padding: 12, background: "var(--background)", borderRadius: "var(--radius-md)" }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: TEXT_SECONDARY, fontFamily: "var(--font-sans)", marginBottom: 4 }}>Texte alternatif (FR)</div>
              <div style={{ fontSize: 13, color: TEXT, fontFamily: "var(--font-sans)" }}>{asset.altText.fr}</div>
            </div>
          )}

          {/* Metadata table */}
          <div style={{ marginTop: 16 }}>
            {metaRows.map((r) => (
              <div key={r.label} style={{ display: "flex", padding: "8px 0", borderBottom: `1px solid ${BORDER}`, gap: 12 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: TEXT_SECONDARY, fontFamily: "var(--font-sans)", minWidth: 120, flexShrink: 0 }}>{r.label}</span>
                <span style={{ fontSize: 13, color: TEXT, fontFamily: "var(--font-sans)", wordBreak: "break-all" }}>{r.value}</span>
              </div>
            ))}
          </div>

          {/* Tags */}
          {asset.tags.length > 0 && (
            <div style={{ marginTop: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                <Tag size={14} style={{ color: TEXT_SECONDARY }} />
                <span style={{ fontSize: 12, fontWeight: 600, color: TEXT_SECONDARY, fontFamily: "var(--font-sans)" }}>Tags</span>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {asset.tags.map((tag) => (
                  <span key={tag} style={{ fontSize: 11, padding: "3px 10px", borderRadius: "var(--radius-sm)", background: "var(--background)", border: `1px solid ${BORDER}`, color: TEXT, fontFamily: "var(--font-sans)" }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Usage references */}
          {asset.usageReferences.length > 0 && (
            <div style={{ marginTop: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                <Link2 size={14} style={{ color: ACCENT }} />
                <span style={{ fontSize: 12, fontWeight: 600, color: TEXT_SECONDARY, fontFamily: "var(--font-sans)" }}>
                  Utilisé dans ({asset.usageReferences.length})
                </span>
              </div>
              {asset.usageReferences.map((ref, i) => (
                <div key={i} style={{ fontSize: 13, color: TEXT, fontFamily: "var(--font-sans)", padding: "4px 0" }}>
                  <span style={{ color: TEXT_SECONDARY }}>{ref.resourceType}</span> — {ref.resourceLabel}
                </div>
              ))}
            </div>
          )}

          {/* Copy URL */}
          {asset.url && (
            <div style={{ marginTop: 16 }}>
              <button onClick={() => { navigator.clipboard.writeText(asset.url); }}
                style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: "var(--radius-md)", border: `1px solid ${BORDER}`, background: SURFACE, color: TEXT, fontSize: 13, fontFamily: "var(--font-sans)", fontWeight: 600, cursor: "pointer" }}
              >
                <Link2 size={14} /> Copier l'URL
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
