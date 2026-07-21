import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Send, Plus, Trash2, ChevronUp, ChevronDown, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import MultiLangInput from "../shared/MultiLangInput";
import { SERVICE_STATUS_CONFIG } from "../../../data/admin-mocks";
import { adminService } from "../../../services/adminService";
import StatusBadge from "../shared/StatusBadge";
import type { Service, ServiceStatus, MultiLang } from "../../../types/admin";
import { useAuth } from "../../../context/AuthContext";
import { ACCENT, BORDER, SURFACE, TEXT, TEXT_SECONDARY, DANGER } from "../../../constants";

/* ── Helpers ── */
const EMPTY_ML: MultiLang = { fr: "", en: "", ar: "" };

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/* ── Styles ── */
const labelStyle: React.CSSProperties = {
  display: "block", fontSize: 13, fontWeight: 600, color: TEXT, fontFamily: "var(--font-sans)", marginBottom: 6,
};
const inputStyle: React.CSSProperties = {
  width: "100%", padding: "10px 14px", fontSize: 14, fontFamily: "var(--font-sans)", color: TEXT,
  background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: "var(--radius-md)", outline: "none",
};
const selectStyle: React.CSSProperties = { ...inputStyle, cursor: "pointer", appearance: "auto" as const };
const errStyle: React.CSSProperties = { fontSize: 12, color: DANGER, marginTop: 4, fontFamily: "var(--font-sans)" };
const helperStyle: React.CSSProperties = { fontSize: 12, color: TEXT_SECONDARY, marginTop: 4, fontFamily: "var(--font-sans)" };

const sectionStyle: React.CSSProperties = {
  background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: "var(--radius-lg)", overflow: "hidden",
};
const sectionHeaderStyle: React.CSSProperties = { padding: "18px 24px", borderBottom: `1px solid ${BORDER}` };
const sectionTitleStyle: React.CSSProperties = { margin: 0, fontSize: 15, fontWeight: 700, fontFamily: "var(--font-display)", color: TEXT };
const sectionBodyStyle: React.CSSProperties = { padding: 24 };

const btnBase: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 16px",
  borderRadius: "var(--radius-md)", fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600, cursor: "pointer",
};

const iconBtnStyle: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", justifyContent: "center",
  width: 32, height: 32, borderRadius: "var(--radius-sm)", border: `1px solid ${BORDER}`,
  background: "transparent", cursor: "pointer", color: TEXT_SECONDARY, flexShrink: 0,
};

/* ── Props ── */
interface ServiceFormProps {
  mode: "create" | "edit";
  service?: Service;
  existingSlugs: string[];
}

export default function ServiceForm({ mode, service, existingSlugs }: ServiceFormProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === "super_admin" || user?.role === "admin";
  const mountedRef = useRef(true);

  useEffect(() => () => { mountedRef.current = false; }, []);

  // ── Form state ──
  const [title, setTitle] = useState<MultiLang>(service?.title ?? { ...EMPTY_ML });
  const [slug, setSlug] = useState(service?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(mode === "edit");
  const [shortDesc, setShortDesc] = useState<MultiLang>(service?.shortDescription ?? { ...EMPTY_ML });
  const [fullDesc, setFullDesc] = useState<MultiLang>(service?.fullDescription ?? { ...EMPTY_ML });
  const [features, setFeatures] = useState<MultiLang[]>(service?.features ? JSON.parse(JSON.stringify(service.features)) : []);
  const [benefits, setBenefits] = useState<MultiLang[]>(service?.benefits ? JSON.parse(JSON.stringify(service.benefits)) : []);
  const [icon, setIcon] = useState(service?.icon ?? "");
  const [imageUrl, setImageUrl] = useState(service?.imageUrl ?? "");
  const [imageAlt, setImageAlt] = useState<MultiLang>(service?.imageAlt ?? { ...EMPTY_ML });
  const [accentColor, setAccentColor] = useState(service?.accentColor ?? "#3B82F6");
  const [ctaLabel, setCtaLabel] = useState<MultiLang>(service?.ctaLabel ?? { ...EMPTY_ML });
  const [ctaUrl, setCtaUrl] = useState(service?.ctaUrl ?? "");
  const [order, setOrder] = useState(service?.order ?? 1);
  const [featured, setFeatured] = useState(service?.featured ?? false);
  const [status] = useState<ServiceStatus>(service?.status ?? "draft");
  const [seoTitle, setSeoTitle] = useState<MultiLang>(service?.seoTitle ?? { ...EMPTY_ML });
  const [seoDesc, setSeoDesc] = useState<MultiLang>(service?.seoDescription ?? { ...EMPTY_ML });

  // Workflow
  const [reviewNote, setReviewNote] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Auto-slug from French title
  useEffect(() => {
    if (!slugTouched && mode === "create") {
      setSlug(slugify(title.fr));
    }
  }, [title.fr, slugTouched, mode]);

  // Dirty tracking
  const initialRef = useRef(JSON.stringify({
    title: service?.title ?? EMPTY_ML, slug: service?.slug ?? "", shortDesc: service?.shortDescription ?? EMPTY_ML,
    fullDesc: service?.fullDescription ?? EMPTY_ML, features: service?.features ?? [], benefits: service?.benefits ?? [],
    icon: service?.icon ?? "", imageUrl: service?.imageUrl ?? "", imageAlt: service?.imageAlt ?? EMPTY_ML,
    accentColor: service?.accentColor ?? "#3B82F6", ctaLabel: service?.ctaLabel ?? EMPTY_ML, ctaUrl: service?.ctaUrl ?? "",
    order: service?.order ?? 1, featured: service?.featured ?? false, seoTitle: service?.seoTitle ?? EMPTY_ML,
    seoDesc: service?.seoDescription ?? EMPTY_ML,
  }));

  const currentSnapshot = useMemo(() => JSON.stringify({
    title, slug, shortDesc, fullDesc, features, benefits, icon, imageUrl, imageAlt,
    accentColor, ctaLabel, ctaUrl, order, featured, seoTitle, seoDesc,
  }), [title, slug, shortDesc, fullDesc, features, benefits, icon, imageUrl, imageAlt, accentColor, ctaLabel, ctaUrl, order, featured, seoTitle, seoDesc]);

  const isDirty = currentSnapshot !== initialRef.current;

  // Unsaved changes guard
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (isDirty) { e.preventDefault(); }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  // ── Validation ──
  const validate = useCallback((): boolean => {
    const errs: Record<string, string> = {};
    if (!title.fr.trim()) errs.title = "Le titre français est requis.";
    if (!shortDesc.fr.trim()) errs.shortDesc = "La description courte française est requise.";
    if (!slug.trim()) errs.slug = "Le slug est requis.";
    else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) errs.slug = "Format de slug invalide (lettres, chiffres, tirets).";
    else {
      const taken = existingSlugs.filter((s) => s !== service?.slug).includes(slug);
      if (taken) errs.slug = "Ce slug est déjà utilisé par un autre service.";
    }
    if (order < 1) errs.order = "L'ordre doit être un entier positif.";
    if (imageUrl && !isValidUrl(imageUrl)) errs.imageUrl = "URL d'image invalide.";
    if (ctaUrl && !ctaUrl.startsWith("/") && !isValidUrl(ctaUrl)) errs.ctaUrl = "URL du CTA invalide.";
    if (accentColor && !/^#[0-9A-Fa-f]{6}$/.test(accentColor)) errs.accentColor = "Couleur hexadécimale invalide (ex: #3B82F6).";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }, [title.fr, shortDesc.fr, slug, order, imageUrl, ctaUrl, accentColor, existingSlugs, service?.slug]);

  function isValidUrl(v: string): boolean {
    try { new URL(v); return true; } catch { return false; }
  }

  // ── Save ──
  const handleSave = async (submitStatus?: ServiceStatus) => {
    if (!validate()) return;
    setSaving(true);
    try {
      const payload = {
        title, slug, shortDescription: shortDesc, fullDescription: fullDesc,
        features, benefits, icon, imageUrl, imageAlt, accentColor, ctaLabel, ctaUrl,
        order, featured, status: submitStatus ?? status,
        seoTitle, seoDescription: seoDesc,
        submittedBy: submitStatus === "pending_review" ? (user?.name ?? null) : (service?.submittedBy ?? null),
        submittedAt: submitStatus === "pending_review" ? new Date().toISOString() : (service?.submittedAt ?? null),
        reviewedBy: service?.reviewedBy ?? null,
        reviewedAt: service?.reviewedAt ?? null,
        reviewNote: service?.reviewNote ?? null,
        publishedAt: service?.publishedAt ?? null,
      };

      if (mode === "create") {
        await adminService.createService(payload);
      } else if (service) {
        await adminService.updateService(service.id, { ...payload, status: submitStatus ?? status });
      }

      showToast(mode === "create" ? "Service créé avec succès." : "Service mis à jour avec succès.");
      setTimeout(() => navigate("/admin/services"), 800);
    } catch (err) {
      console.error(err);
    } finally {
      if (mountedRef.current) setSaving(false);
    }
  };

  // Workflow actions (admin only)
  const handleApprove = async () => {
    if (!service || !isAdmin) return;
    await adminService.updateServiceStatus(service.id, "approved", { reviewedBy: user?.name });
    showToast("Service approuvé.");
    setTimeout(() => navigate("/admin/services"), 800);
  };

  const handleRequestChanges = async () => {
    if (!service || !isAdmin || !reviewNote.trim()) return;
    await adminService.updateServiceStatus(service.id, "changes_requested", { reviewedBy: user?.name, reviewNote: reviewNote.trim() });
    showToast("Modifications demandées.");
    setTimeout(() => navigate("/admin/services"), 800);
  };

  const handlePublish = async () => {
    if (!service || !isAdmin) return;
    await adminService.updateServiceStatus(service.id, "published", { reviewedBy: user?.name });
    showToast("Service publié.");
    setTimeout(() => navigate("/admin/services"), 800);
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // ── List item helpers ──
  const addItem = (list: MultiLang[], setter: (v: MultiLang[]) => void) => {
    setter([...list, { ...EMPTY_ML }]);
  };

  const removeItem = (list: MultiLang[], setter: (v: MultiLang[]) => void, index: number) => {
    setter(list.filter((_, i) => i !== index));
  };

  const updateItem = (list: MultiLang[], setter: (v: MultiLang[]) => void, index: number, value: MultiLang) => {
    const next = [...list];
    next[index] = value;
    setter(next);
  };

  const moveItem = (list: MultiLang[], setter: (v: MultiLang[]) => void, from: number, direction: "up" | "down") => {
    const to = direction === "up" ? from - 1 : from + 1;
    if (to < 0 || to >= list.length) return;
    const next = [...list];
    [next[from], next[to]] = [next[to], next[from]];
    setter(next);
  };

  // ── Can submit ──
  const canSubmit = status === "draft" || status === "changes_requested";
  const canApprove = isAdmin && status === "pending_review";
  const canPublish = isAdmin && status === "approved";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* ── Header ── */}
      <div>
        <button onClick={() => {
          if (isDirty && !window.confirm("Quitter sans enregistrer ?")) return;
          navigate("/admin/services");
        }}
          style={{ ...btnBase, border: "none", background: "transparent", color: TEXT_SECONDARY, padding: "6px 0", marginBottom: 8 }}
        >
          <ArrowLeft size={16} />
          Retour aux services
        </button>
        <motion.h1
          initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          style={{ fontSize: 24, fontWeight: 800, fontFamily: "var(--font-display)", color: TEXT, margin: 0 }}
        >
          {mode === "create" ? "Nouveau service" : `Modifier : ${service?.title.fr ?? ""}`}
        </motion.h1>
        {service && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8 }}>
            <StatusBadge variant={SERVICE_STATUS_CONFIG[service.status]} size="sm" />
            {service.reviewNote && (
              <span style={{ fontSize: 12, color: DANGER, fontFamily: "var(--font-sans)" }}>
                Note : {service.reviewNote}
              </span>
            )}
          </div>
        )}
      </div>

      {/* ── Demo notice ── */}
      <div className="admin-settings-demo-notice" role="status">
        <Info size={16} style={{ flexShrink: 0, marginTop: 1, color: ACCENT }} />
        <span>Mode démonstration : les modifications sont temporaires et seront réinitialisées après actualisation.</span>
      </div>

      {/* ═══ SECTION 1: Basic Info ═══ */}
      <div style={sectionStyle}>
        <div style={sectionHeaderStyle}><h2 style={sectionTitleStyle}>Informations de base</h2></div>
        <div style={sectionBodyStyle}>
          <div className="admin-service-form-grid">
            <div className="full-width">
              <MultiLangInput label="Titre" value={title} onChange={setTitle} required />
              {errors.title && <div style={errStyle}>{errors.title}</div>}
            </div>
            <div>
              <label style={labelStyle} htmlFor="svc-slug">Slug <span style={{ color: ACCENT }}>*</span></label>
              <input id="svc-slug" type="text" value={slug}
                onChange={(e) => { setSlug(e.target.value); setSlugTouched(true); setErrors((p) => ({ ...p, slug: "" })); }}
                style={{ ...inputStyle, ...(errors.slug ? { borderColor: DANGER } : {}) }}
              />
              {errors.slug && <div style={errStyle}>{errors.slug}</div>}
              <div style={helperStyle}>Généré automatiquement depuis le titre français. Modifiable manuellement.</div>
            </div>
            <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
              <div>
                <label style={labelStyle} htmlFor="svc-order">Ordre <span style={{ color: ACCENT }}>*</span></label>
                <input id="svc-order" type="number" min={1} value={order}
                  onChange={(e) => { setOrder(Number(e.target.value) || 1); setErrors((p) => ({ ...p, order: "" })); }}
                  style={{ ...inputStyle, maxWidth: 100, ...(errors.order ? { borderColor: DANGER } : {}) }}
                />
                {errors.order && <div style={errStyle}>{errors.order}</div>}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, paddingTop: 24 }}>
                <label className="admin-toggle" aria-label="Service mis en avant">
                  <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
                  <span className="admin-toggle-track" /><span className="admin-toggle-thumb" />
                </label>
                <span style={{ fontSize: 13, fontWeight: 600, color: TEXT, fontFamily: "var(--font-sans)" }}>Mis en avant</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ SECTION 2: Descriptions ═══ */}
      <div style={sectionStyle}>
        <div style={sectionHeaderStyle}><h2 style={sectionTitleStyle}>Contenu multilingue</h2></div>
        <div style={sectionBodyStyle}>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div>
              <MultiLangInput label="Description courte" value={shortDesc} onChange={setShortDesc} required />
              {errors.shortDesc && <div style={errStyle}>{errors.shortDesc}</div>}
            </div>
            <MultiLangInput label="Description complète" value={fullDesc} onChange={setFullDesc} type="textarea" />
          </div>
        </div>
      </div>

      {/* ═══ SECTION 3: Features ═══ */}
      <div style={sectionStyle}>
        <div style={sectionHeaderStyle}><h2 style={sectionTitleStyle}>Fonctionnalités</h2></div>
        <div style={sectionBodyStyle}>
          <div className="admin-service-items-list">
            {features.map((item, i) => (
              <div key={i} className="admin-service-item-row">
                <MultiLangInput label={`Fonctionnalité ${i + 1}`} value={item} onChange={(v) => updateItem(features, setFeatures, i, v)} />
                <div style={{ display: "flex", flexDirection: "column", gap: 4, paddingTop: 26 }}>
                  <button type="button" onClick={() => moveItem(features, setFeatures, i, "up")} disabled={i === 0} style={{ ...iconBtnStyle, opacity: i === 0 ? 0.3 : 1 }} aria-label="Monter"><ChevronUp size={14} /></button>
                  <button type="button" onClick={() => moveItem(features, setFeatures, i, "down")} disabled={i === features.length - 1} style={{ ...iconBtnStyle, opacity: i === features.length - 1 ? 0.3 : 1 }} aria-label="Descendre"><ChevronDown size={14} /></button>
                  <button type="button" onClick={() => removeItem(features, setFeatures, i)} style={{ ...iconBtnStyle, color: DANGER }} aria-label="Supprimer"><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
          <button type="button" onClick={() => addItem(features, setFeatures)}
            style={{ ...btnBase, marginTop: 14, border: `1px dashed ${BORDER}`, background: "transparent", color: ACCENT }}
          >
            <Plus size={14} /> Ajouter une fonctionnalité
          </button>
        </div>
      </div>

      {/* ═══ SECTION 4: Benefits ═══ */}
      <div style={sectionStyle}>
        <div style={sectionHeaderStyle}><h2 style={sectionTitleStyle}>Avantages</h2></div>
        <div style={sectionBodyStyle}>
          <div className="admin-service-items-list">
            {benefits.map((item, i) => (
              <div key={i} className="admin-service-item-row">
                <MultiLangInput label={`Avantage ${i + 1}`} value={item} onChange={(v) => updateItem(benefits, setBenefits, i, v)} />
                <div style={{ display: "flex", flexDirection: "column", gap: 4, paddingTop: 26 }}>
                  <button type="button" onClick={() => moveItem(benefits, setBenefits, i, "up")} disabled={i === 0} style={{ ...iconBtnStyle, opacity: i === 0 ? 0.3 : 1 }} aria-label="Monter"><ChevronUp size={14} /></button>
                  <button type="button" onClick={() => moveItem(benefits, setBenefits, i, "down")} disabled={i === benefits.length - 1} style={{ ...iconBtnStyle, opacity: i === benefits.length - 1 ? 0.3 : 1 }} aria-label="Descendre"><ChevronDown size={14} /></button>
                  <button type="button" onClick={() => removeItem(benefits, setBenefits, i)} style={{ ...iconBtnStyle, color: DANGER }} aria-label="Supprimer"><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
          <button type="button" onClick={() => addItem(benefits, setBenefits)}
            style={{ ...btnBase, marginTop: 14, border: `1px dashed ${BORDER}`, background: "transparent", color: ACCENT }}
          >
            <Plus size={14} /> Ajouter un avantage
          </button>
        </div>
      </div>

      {/* ═══ SECTION 5: Visual ═══ */}
      <div style={sectionStyle}>
        <div style={sectionHeaderStyle}><h2 style={sectionTitleStyle}>Paramètres visuels</h2></div>
        <div style={sectionBodyStyle}>
          <div className="admin-service-form-grid">
            <div>
              <label style={labelStyle} htmlFor="svc-icon">Icône (nom Lucide)</label>
              <input id="svc-icon" type="text" value={icon} onChange={(e) => setIcon(e.target.value)} placeholder="Code, Shield, Cloud..." style={inputStyle} />
              <div style={helperStyle}>Nom d'icône Lucide React (ex: Code, Shield, Cloud, Zap).</div>
            </div>
            <div>
              <label style={labelStyle} htmlFor="svc-accent">Couleur d'accent</label>
              <div className="admin-service-color-swatch">
                <input id="svc-accent" type="text" value={accentColor}
                  onChange={(e) => { setAccentColor(e.target.value); setErrors((p) => ({ ...p, accentColor: "" })); }}
                  placeholder="#3B82F6" style={{ ...inputStyle, maxWidth: 140, ...(errors.accentColor ? { borderColor: DANGER } : {}) }}
                />
                <span style={{ background: /^#[0-9A-Fa-f]{6}$/.test(accentColor) ? accentColor : "transparent" }} />
              </div>
              {errors.accentColor && <div style={errStyle}>{errors.accentColor}</div>}
            </div>
            <div className="full-width">
              <label style={labelStyle} htmlFor="svc-image-url">URL de l'image</label>
              <input id="svc-image-url" type="url" value={imageUrl}
                onChange={(e) => { setImageUrl(e.target.value); setErrors((p) => ({ ...p, imageUrl: "" })); }}
                placeholder="https://..." style={{ ...inputStyle, ...(errors.imageUrl ? { borderColor: DANGER } : {}) }}
              />
              {errors.imageUrl && <div style={errStyle}>{errors.imageUrl}</div>}
              <div style={helperStyle}>Téléchargement direct disponible après intégration de la médiathèque.</div>
              {imageUrl && !errors.imageUrl && (
                <div className="admin-service-image-preview">
                  <img src={imageUrl} alt={imageAlt.fr || "Aperçu"} onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                </div>
              )}
            </div>
            <div className="full-width">
              <MultiLangInput label="Texte alternatif de l'image" value={imageAlt} onChange={setImageAlt} />
            </div>
          </div>
        </div>
      </div>

      {/* ═══ SECTION 6: CTA ═══ */}
      <div style={sectionStyle}>
        <div style={sectionHeaderStyle}><h2 style={sectionTitleStyle}>Appel à l'action (CTA)</h2></div>
        <div style={sectionBodyStyle}>
          <div className="admin-service-form-grid">
            <div className="full-width">
              <MultiLangInput label="Libellé du CTA" value={ctaLabel} onChange={setCtaLabel} />
            </div>
            <div>
              <label style={labelStyle} htmlFor="svc-cta-url">URL du CTA</label>
              <input id="svc-cta-url" type="text" value={ctaUrl}
                onChange={(e) => { setCtaUrl(e.target.value); setErrors((p) => ({ ...p, ctaUrl: "" })); }}
                placeholder="/contact" style={{ ...inputStyle, ...(errors.ctaUrl ? { borderColor: DANGER } : {}) }}
              />
              {errors.ctaUrl && <div style={errStyle}>{errors.ctaUrl}</div>}
            </div>
          </div>
        </div>
      </div>

      {/* ═══ SECTION 7: Workflow (edit only) ═══ */}
      {mode === "edit" && service && (
        <div style={sectionStyle}>
          <div style={sectionHeaderStyle}><h2 style={sectionTitleStyle}>Workflow de publication</h2></div>
          <div style={sectionBodyStyle}>
            <div className="admin-service-form-grid">
              <div>
                <label style={labelStyle}>Statut actuel</label>
                <StatusBadge variant={SERVICE_STATUS_CONFIG[status]} />
              </div>
              {service.reviewNote && (
                <div>
                  <label style={labelStyle}>Dernière note de révision</label>
                  <p style={{ margin: 0, fontSize: 13, color: DANGER, fontFamily: "var(--font-sans)" }}>{service.reviewNote}</p>
                </div>
              )}
              {service.reviewedBy && (
                <div>
                  <label style={labelStyle}>Révisé par</label>
                  <p style={{ margin: 0, fontSize: 13, color: TEXT_SECONDARY, fontFamily: "var(--font-sans)" }}>
                    {service.reviewedBy}{service.reviewedAt ? ` — ${new Date(service.reviewedAt).toLocaleDateString("fr-FR")}` : ""}
                  </p>
                </div>
              )}
              {service.publishedAt && (
                <div>
                  <label style={labelStyle}>Publié le</label>
                  <p style={{ margin: 0, fontSize: 13, color: TEXT_SECONDARY, fontFamily: "var(--font-sans)" }}>
                    {new Date(service.publishedAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                </div>
              )}
            </div>

            {/* Admin review actions */}
            {canApprove && (
              <div style={{ marginTop: 20, paddingTop: 20, borderTop: `1px solid ${BORDER}` }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <label style={labelStyle} htmlFor="svc-review-note">Note de révision (obligatoire pour demander des modifications)</label>
                  <textarea id="svc-review-note" value={reviewNote} onChange={(e) => setReviewNote(e.target.value)} rows={3}
                    placeholder="Décrivez les modifications nécessaires..." style={{ ...inputStyle, resize: "vertical" as const }}
                  />
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <button type="button" onClick={handleApprove} style={{ ...btnBase, border: "none", background: "#22C55E", color: "#fff" }}>
                      Approuver
                    </button>
                    <button type="button" onClick={handleRequestChanges} disabled={!reviewNote.trim()}
                      style={{ ...btnBase, border: "none", background: "#EF4444", color: "#fff", opacity: reviewNote.trim() ? 1 : 0.5, cursor: reviewNote.trim() ? "pointer" : "not-allowed" }}
                    >
                      Demander des modifications
                    </button>
                  </div>
                </div>
              </div>
            )}

            {canPublish && (
              <div style={{ marginTop: 20, paddingTop: 20, borderTop: `1px solid ${BORDER}` }}>
                <button type="button" onClick={handlePublish} style={{ ...btnBase, border: "none", background: "#22C55E", color: "#fff" }}>
                  Publier le service
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══ SECTION 8: SEO ═══ */}
      <div style={sectionStyle}>
        <div style={sectionHeaderStyle}><h2 style={sectionTitleStyle}>SEO</h2></div>
        <div style={sectionBodyStyle}>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div>
              <MultiLangInput label="Titre SEO" value={seoTitle} onChange={setSeoTitle} />
              <div className={`admin-service-seo-counter ${seoTitle.fr.length > 60 ? "warn" : ""}`}>
                {seoTitle.fr.length}/60 caractères (FR)
              </div>
            </div>
            <div>
              <MultiLangInput label="Description SEO" value={seoDesc} onChange={setSeoDesc} type="textarea" />
              <div className={`admin-service-seo-counter ${seoDesc.fr.length > 160 ? "warn" : ""}`}>
                {seoDesc.fr.length}/160 caractères (FR)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ Action Bar ═══ */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, flexWrap: "wrap", paddingBottom: 32 }}>
        <button type="button"
          onClick={() => { if (isDirty && !window.confirm("Quitter sans enregistrer ?")) return; navigate("/admin/services"); }}
          style={{ ...btnBase, border: `1px solid ${BORDER}`, background: SURFACE, color: TEXT }}
        >
          Annuler
        </button>
        <button type="button" onClick={() => handleSave("draft")} disabled={saving}
          style={{ ...btnBase, border: `1px solid ${BORDER}`, background: SURFACE, color: TEXT, opacity: saving ? 0.6 : 1 }}
        >
          <Save size={14} /> Enregistrer brouillon
        </button>
        {canSubmit && (
          <button type="button" onClick={() => handleSave("pending_review")} disabled={saving}
            style={{ ...btnBase, border: "none", background: ACCENT, color: "#fff", opacity: saving ? 0.6 : 1 }}
          >
            <Send size={14} /> Soumettre pour révision
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
