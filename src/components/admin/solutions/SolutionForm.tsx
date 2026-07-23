import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Send, Plus, Trash2, ChevronUp, ChevronDown, Info, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import MultiLangInput from "../shared/MultiLangInput";
import { SOLUTION_STATUS_CONFIG } from "../../../data/admin-mocks";
import { adminService } from "../../../services/adminService";
import StatusBadge from "../shared/StatusBadge";
import type { Solution, SolutionStatus, MultiLang, Service } from "../../../types/admin";
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
interface SolutionFormProps {
  mode: "create" | "edit";
  solution?: Solution;
  existingSlugs: string[];
}

export default function SolutionForm({ mode, solution, existingSlugs }: SolutionFormProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const role = user?.role ?? "reader";
  const isAdmin = user?.role === "super_admin" || user?.role === "admin";
  const mountedRef = useRef(true);

  useEffect(() => () => { mountedRef.current = false; }, []);

  // ── Available services for related-services picker ──
  const [availableServices, setAvailableServices] = useState<Service[]>([]);
  useEffect(() => {
    adminService.getServices(role).then(setAvailableServices).catch(() => {});
  }, [role]);

  // ── Form state ──
  const [title, setTitle] = useState<MultiLang>(solution?.title ?? { ...EMPTY_ML });
  const [slug, setSlug] = useState(solution?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(mode === "edit");
  const [shortDesc, setShortDesc] = useState<MultiLang>(solution?.shortDescription ?? { ...EMPTY_ML });
  const [fullDesc, setFullDesc] = useState<MultiLang>(solution?.fullDescription ?? { ...EMPTY_ML });
  const [problem, setProblem] = useState<MultiLang>(solution?.problem ?? { ...EMPTY_ML });
  const [approach, setApproach] = useState<MultiLang>(solution?.approach ?? { ...EMPTY_ML });
  const [features, setFeatures] = useState<MultiLang[]>(solution?.features ? JSON.parse(JSON.stringify(solution.features)) : []);
  const [benefits, setBenefits] = useState<MultiLang[]>(solution?.benefits ? JSON.parse(JSON.stringify(solution.benefits)) : []);
  const [targetAudience, setTargetAudience] = useState<MultiLang[]>(solution?.targetAudience ? JSON.parse(JSON.stringify(solution.targetAudience)) : []);
  const [industries, setIndustries] = useState<MultiLang[]>(solution?.industries ? JSON.parse(JSON.stringify(solution.industries)) : []);
  const [relatedServiceIds, setRelatedServiceIds] = useState<number[]>(solution?.relatedServiceIds ?? []);
  const [icon, setIcon] = useState(solution?.icon ?? "");
  const [imageUrl, setImageUrl] = useState(solution?.imageUrl ?? "");
  const [imageAlt, setImageAlt] = useState<MultiLang>(solution?.imageAlt ?? { ...EMPTY_ML });
  const [accentColor, setAccentColor] = useState(solution?.accentColor ?? "#3B82F6");
  const [ctaLabel, setCtaLabel] = useState<MultiLang>(solution?.ctaLabel ?? { ...EMPTY_ML });
  const [ctaUrl, setCtaUrl] = useState(solution?.ctaUrl ?? "");
  const [order, setOrder] = useState(solution?.order ?? 1);
  const [featured, setFeatured] = useState(solution?.featured ?? false);
  const [status] = useState<SolutionStatus>(solution?.status ?? "draft");
  const [seoTitle, setSeoTitle] = useState<MultiLang>(solution?.seoTitle ?? { ...EMPTY_ML });
  const [seoDesc, setSeoDesc] = useState<MultiLang>(solution?.seoDescription ?? { ...EMPTY_ML });

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
    title: solution?.title ?? EMPTY_ML, slug: solution?.slug ?? "", shortDesc: solution?.shortDescription ?? EMPTY_ML,
    fullDesc: solution?.fullDescription ?? EMPTY_ML, problem: solution?.problem ?? EMPTY_ML, approach: solution?.approach ?? EMPTY_ML,
    features: solution?.features ?? [], benefits: solution?.benefits ?? [], targetAudience: solution?.targetAudience ?? [],
    industries: solution?.industries ?? [], relatedServiceIds: solution?.relatedServiceIds ?? [],
    icon: solution?.icon ?? "", imageUrl: solution?.imageUrl ?? "", imageAlt: solution?.imageAlt ?? EMPTY_ML,
    accentColor: solution?.accentColor ?? "#3B82F6", ctaLabel: solution?.ctaLabel ?? EMPTY_ML, ctaUrl: solution?.ctaUrl ?? "",
    order: solution?.order ?? 1, featured: solution?.featured ?? false, seoTitle: solution?.seoTitle ?? EMPTY_ML,
    seoDesc: solution?.seoDescription ?? EMPTY_ML,
  }));

  const currentSnapshot = useMemo(() => JSON.stringify({
    title, slug, shortDesc, fullDesc, problem, approach, features, benefits, targetAudience, industries,
    relatedServiceIds, icon, imageUrl, imageAlt, accentColor, ctaLabel, ctaUrl, order, featured, seoTitle, seoDesc,
  }), [title, slug, shortDesc, fullDesc, problem, approach, features, benefits, targetAudience, industries, relatedServiceIds, icon, imageUrl, imageAlt, accentColor, ctaLabel, ctaUrl, order, featured, seoTitle, seoDesc]);

  const isDirty = currentSnapshot !== initialRef.current;

  // Unsaved changes guard
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => { if (isDirty) e.preventDefault(); };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  // ── Validation ──
  const validate = useCallback((): boolean => {
    const errs: Record<string, string> = {};
    if (!title.fr.trim()) errs.title = "Le titre français est requis.";
    if (!shortDesc.fr.trim()) errs.shortDesc = "La description courte française est requise.";
    if (!problem.fr.trim()) errs.problem = "La problématique française est requise.";
    if (!approach.fr.trim()) errs.approach = "L'approche française est requise.";
    if (!slug.trim()) errs.slug = "Le slug est requis.";
    else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) errs.slug = "Format de slug invalide (lettres, chiffres, tirets).";
    else {
      const taken = existingSlugs.filter((s) => s !== solution?.slug).includes(slug);
      if (taken) errs.slug = "Ce slug est déjà utilisé par une autre solution.";
    }
    if (order < 1) errs.order = "L'ordre doit être un entier positif.";
    if (imageUrl && !isSafeHttpUrl(imageUrl)) errs.imageUrl = "URL d'image invalide. Utilisez HTTP ou HTTPS.";
    if (ctaUrl && !isSafeCtaUrl(ctaUrl)) errs.ctaUrl = "URL du CTA invalide.";
    if (accentColor && !/^#[0-9A-Fa-f]{6}$/.test(accentColor)) errs.accentColor = "Couleur hexadécimale invalide (ex: #3B82F6).";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }, [title.fr, shortDesc.fr, problem.fr, approach.fr, slug, order, imageUrl, ctaUrl, accentColor, existingSlugs, solution?.slug]);

  function isSafeHttpUrl(v: string): boolean {
    try {
      const parsed = new URL(v);
      return (parsed.protocol === "http:" || parsed.protocol === "https:") && !parsed.username && !parsed.password;
    } catch {
      return false;
    }
  }

  function isSafeCtaUrl(v: string): boolean {
    return (/^\/(?![\\/])/.test(v) && !/[\\\u0000-\u001F]/.test(v) && !/%5c/i.test(v)) || isSafeHttpUrl(v);
  }

  // ── Save ──
  const handleSave = async (submitStatus?: SolutionStatus) => {
    if (!user || !validate()) return;
    setSaving(true);
    try {
      const payload = {
        title, slug, shortDescription: shortDesc, fullDescription: fullDesc, problem, approach,
        features, benefits, targetAudience, industries, relatedServiceIds,
        icon, imageUrl, imageAlt, accentColor, ctaLabel, ctaUrl,
        order, featured, status: submitStatus ?? status,
        seoTitle, seoDescription: seoDesc,
        submittedBy: isAdmin && submitStatus === "pending_review" ? user.name : (solution?.submittedBy ?? null),
        submittedAt: isAdmin && submitStatus === "pending_review" ? new Date().toISOString() : (solution?.submittedAt ?? null),
        reviewedBy: solution?.reviewedBy ?? null,
        reviewedAt: solution?.reviewedAt ?? null,
        reviewNote: solution?.reviewNote ?? null,
        publishedAt: solution?.publishedAt ?? null,
      };

      if (mode === "create") {
        await adminService.createSolution(payload, user.role);
      } else if (solution) {
        await adminService.updateSolution(solution.id, { ...payload, status: submitStatus ?? status }, user.role);
      }

      showToast(mode === "create" ? "Solution créée avec succès." : "Solution mise à jour avec succès.");
      setTimeout(() => navigate("/admin/solutions"), 800);
    } catch (err) {
      console.error(err);
    } finally {
      if (mountedRef.current) setSaving(false);
    }
  };

  // Workflow actions
  const handleApprove = async () => {
    if (!solution || !isAdmin) return;
    await adminService.updateSolutionStatus(solution.id, "approved", user.role, { reviewedBy: user.name });
    showToast("Solution approuvée.");
    setTimeout(() => navigate("/admin/solutions"), 800);
  };

  const handleRequestChanges = async () => {
    if (!solution || !isAdmin || !reviewNote.trim()) return;
    await adminService.updateSolutionStatus(solution.id, "changes_requested", user.role, { reviewedBy: user.name, reviewNote: reviewNote.trim() });
    showToast("Modifications demandées.");
    setTimeout(() => navigate("/admin/solutions"), 800);
  };

  const handlePublish = async () => {
    if (!solution || !isAdmin) return;
    await adminService.updateSolutionStatus(solution.id, "published", user.role, { reviewedBy: user.name });
    showToast("Solution publiée.");
    setTimeout(() => navigate("/admin/solutions"), 800);
  };

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  // ── List item helpers ──
  const addItem = (list: MultiLang[], setter: (v: MultiLang[]) => void) => setter([...list, { ...EMPTY_ML }]);
  const removeItem = (list: MultiLang[], setter: (v: MultiLang[]) => void, i: number) => setter(list.filter((_, idx) => idx !== i));
  const updateItem = (list: MultiLang[], setter: (v: MultiLang[]) => void, i: number, v: MultiLang) => { const n = [...list]; n[i] = v; setter(n); };
  const moveItem = (list: MultiLang[], setter: (v: MultiLang[]) => void, from: number, dir: "up" | "down") => {
    const to = dir === "up" ? from - 1 : from + 1;
    if (to < 0 || to >= list.length) return;
    const n = [...list]; [n[from], n[to]] = [n[to], n[from]]; setter(n);
  };

  // ── Related services helpers ──
  const unselectedServices = useMemo(() => availableServices.filter((s) => !relatedServiceIds.includes(s.id)), [availableServices, relatedServiceIds]);
  const addRelatedService = (id: number) => setRelatedServiceIds((prev) => [...prev, id]);
  const removeRelatedService = (id: number) => setRelatedServiceIds((prev) => prev.filter((sid) => sid !== id));

  const canSubmit = status === "draft" || status === "changes_requested";
  const canApprove = isAdmin && status === "pending_review";
  const canPublish = isAdmin && status === "approved";
  const workflowStatusLocked = mode === "edit" && !isAdmin && !canSubmit;
  const safeDraftStatus = workflowStatusLocked ? status : "draft";

  // ── Render list section helper ──
  const renderListSection = (
    title: string,
    items: MultiLang[],
    setter: (v: MultiLang[]) => void,
    labelPrefix: string,
    addLabel: string,
  ) => (
    <div style={sectionStyle}>
      <div style={sectionHeaderStyle}><h2 style={sectionTitleStyle}>{title}</h2></div>
      <div style={sectionBodyStyle}>
        <div className="admin-service-items-list">
          {items.map((item, i) => (
            <div key={i} className="admin-service-item-row">
              <MultiLangInput label={`${labelPrefix} ${i + 1}`} value={item} onChange={(v) => updateItem(items, setter, i, v)} />
              <div style={{ display: "flex", flexDirection: "column", gap: 4, paddingTop: 26 }}>
                <button type="button" onClick={() => moveItem(items, setter, i, "up")} disabled={i === 0} style={{ ...iconBtnStyle, opacity: i === 0 ? 0.3 : 1 }} aria-label="Monter"><ChevronUp size={14} /></button>
                <button type="button" onClick={() => moveItem(items, setter, i, "down")} disabled={i === items.length - 1} style={{ ...iconBtnStyle, opacity: i === items.length - 1 ? 0.3 : 1 }} aria-label="Descendre"><ChevronDown size={14} /></button>
                <button type="button" onClick={() => removeItem(items, setter, i)} style={{ ...iconBtnStyle, color: DANGER }} aria-label="Supprimer"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
        <button type="button" onClick={() => addItem(items, setter)}
          style={{ ...btnBase, marginTop: 14, border: `1px dashed ${BORDER}`, background: "transparent", color: ACCENT }}
        >
          <Plus size={14} /> {addLabel}
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* ── Header ── */}
      <div>
        <button type="button" onClick={() => {
          if (isDirty && !window.confirm("Quitter sans enregistrer ?")) return;
          navigate("/admin/solutions");
        }}
          style={{ ...btnBase, border: "none", background: "transparent", color: TEXT_SECONDARY, padding: "6px 0", marginBottom: 8 }}
        >
          <ArrowLeft size={16} /> Retour aux solutions
        </button>
        <motion.h1
          initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          style={{ fontSize: 24, fontWeight: 800, fontFamily: "var(--font-display)", color: TEXT, margin: 0 }}
        >
          {mode === "create" ? "Nouvelle solution" : `Modifier : ${solution?.title.fr ?? ""}`}
        </motion.h1>
        {solution && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8 }}>
            <StatusBadge variant={SOLUTION_STATUS_CONFIG[solution.status]} size="sm" />
            {solution.reviewNote && (
              <span style={{ fontSize: 12, color: DANGER, fontFamily: "var(--font-sans)" }}>
                Note : {solution.reviewNote}
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
              <label style={labelStyle} htmlFor="sol-slug">Slug <span style={{ color: ACCENT }}>*</span></label>
              <input id="sol-slug" type="text" value={slug}
                onChange={(e) => { setSlug(e.target.value); setSlugTouched(true); setErrors((p) => ({ ...p, slug: "" })); }}
                style={{ ...inputStyle, ...(errors.slug ? { borderColor: DANGER } : {}) }}
              />
              {errors.slug && <div style={errStyle}>{errors.slug}</div>}
              <div style={helperStyle}>Généré automatiquement depuis le titre français. Modifiable manuellement.</div>
            </div>
            <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
              <div>
                <label style={labelStyle} htmlFor="sol-order">Ordre <span style={{ color: ACCENT }}>*</span></label>
                <input id="sol-order" type="number" min={1} value={order}
                  onChange={(e) => { setOrder(Number(e.target.value) || 1); setErrors((p) => ({ ...p, order: "" })); }}
                  style={{ ...inputStyle, maxWidth: 100, ...(errors.order ? { borderColor: DANGER } : {}) }}
                />
                {errors.order && <div style={errStyle}>{errors.order}</div>}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, paddingTop: 24 }}>
                <label className="admin-toggle" aria-label="Solution mise en avant">
                  <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
                  <span className="admin-toggle-track" /><span className="admin-toggle-thumb" />
                </label>
                <span style={{ fontSize: 13, fontWeight: 600, color: TEXT, fontFamily: "var(--font-sans)" }}>Mise en avant</span>
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

      {/* ═══ SECTION 3: Problem & Approach ═══ */}
      <div style={sectionStyle}>
        <div style={sectionHeaderStyle}><h2 style={sectionTitleStyle}>Problématique et approche</h2></div>
        <div style={sectionBodyStyle}>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div>
              <MultiLangInput label="Problématique" value={problem} onChange={setProblem} type="textarea" required />
              {errors.problem && <div style={errStyle}>{errors.problem}</div>}
            </div>
            <div>
              <MultiLangInput label="Notre approche" value={approach} onChange={setApproach} type="textarea" required />
              {errors.approach && <div style={errStyle}>{errors.approach}</div>}
            </div>
          </div>
        </div>
      </div>

      {/* ═══ SECTION 4-7: Dynamic lists ═══ */}
      {renderListSection("Fonctionnalités", features, setFeatures, "Fonctionnalité", "Ajouter une fonctionnalité")}
      {renderListSection("Avantages", benefits, setBenefits, "Avantage", "Ajouter un avantage")}
      {renderListSection("Public cible", targetAudience, setTargetAudience, "Cible", "Ajouter un public cible")}
      {renderListSection("Industries", industries, setIndustries, "Industrie", "Ajouter une industrie")}

      {/* ═══ SECTION 8: Related Services ═══ */}
      <div style={sectionStyle}>
        <div style={sectionHeaderStyle}><h2 style={sectionTitleStyle}>Services associés</h2></div>
        <div style={sectionBodyStyle}>
          {/* Selected services */}
          {relatedServiceIds.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
              {relatedServiceIds.map((sid) => {
                const svc = availableServices.find((s) => s.id === sid);
                return (
                  <span key={sid} style={{
                    display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 12px",
                    borderRadius: "var(--radius-sm)", background: `${ACCENT}12`, border: `1px solid ${ACCENT}30`,
                    fontSize: 13, fontFamily: "var(--font-sans)", color: TEXT,
                  }}>
                    {svc?.title.fr ?? `Service #${sid}`}
                    <button type="button" onClick={() => removeRelatedService(sid)}
                      style={{ display: "inline-flex", padding: 0, border: "none", background: "transparent", cursor: "pointer", color: TEXT_SECONDARY }}
                      aria-label={`Retirer ${svc?.title.fr ?? ""}`}
                    ><X size={14} /></button>
                  </span>
                );
              })}
            </div>
          )}

          {/* Add selector */}
          {unselectedServices.length > 0 ? (
            <select
              value=""
              onChange={(e) => { if (e.target.value) addRelatedService(Number(e.target.value)); }}
              style={{ ...inputStyle, maxWidth: 350, cursor: "pointer", appearance: "auto" as const }}
              aria-label="Ajouter un service associé"
            >
              <option value="">— Ajouter un service associé —</option>
              {unselectedServices.map((s) => (
                <option key={s.id} value={s.id}>{s.title.fr}</option>
              ))}
            </select>
          ) : (
            <div style={helperStyle}>
              {availableServices.length === 0
                ? "Aucun service disponible. Créez d'abord des services."
                : "Tous les services disponibles ont été sélectionnés."}
            </div>
          )}
        </div>
      </div>

      {/* ═══ SECTION 9: Visual ═══ */}
      <div style={sectionStyle}>
        <div style={sectionHeaderStyle}><h2 style={sectionTitleStyle}>Paramètres visuels</h2></div>
        <div style={sectionBodyStyle}>
          <div className="admin-service-form-grid">
            <div>
              <label style={labelStyle} htmlFor="sol-icon">Icône (nom Lucide)</label>
              <input id="sol-icon" type="text" value={icon} onChange={(e) => setIcon(e.target.value)} placeholder="Cloud, Shield, Zap..." style={inputStyle} />
              <div style={helperStyle}>Nom d'icône Lucide React (ex: Cloud, Shield, Zap, Users).</div>
            </div>
            <div>
              <label style={labelStyle} htmlFor="sol-accent">Couleur d'accent</label>
              <div className="admin-service-color-swatch">
                <input id="sol-accent" type="text" value={accentColor}
                  onChange={(e) => { setAccentColor(e.target.value); setErrors((p) => ({ ...p, accentColor: "" })); }}
                  placeholder="#3B82F6" style={{ ...inputStyle, maxWidth: 140, ...(errors.accentColor ? { borderColor: DANGER } : {}) }}
                />
                <span style={{ background: /^#[0-9A-Fa-f]{6}$/.test(accentColor) ? accentColor : "transparent" }} />
              </div>
              {errors.accentColor && <div style={errStyle}>{errors.accentColor}</div>}
            </div>
            <div className="full-width">
              <label style={labelStyle} htmlFor="sol-image-url">URL de l'image</label>
              <input id="sol-image-url" type="url" value={imageUrl}
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

      {/* ═══ SECTION 10: CTA ═══ */}
      <div style={sectionStyle}>
        <div style={sectionHeaderStyle}><h2 style={sectionTitleStyle}>Appel à l'action (CTA)</h2></div>
        <div style={sectionBodyStyle}>
          <div className="admin-service-form-grid">
            <div className="full-width">
              <MultiLangInput label="Libellé du CTA" value={ctaLabel} onChange={setCtaLabel} />
            </div>
            <div>
              <label style={labelStyle} htmlFor="sol-cta-url">URL du CTA</label>
              <input id="sol-cta-url" type="text" value={ctaUrl}
                onChange={(e) => { setCtaUrl(e.target.value); setErrors((p) => ({ ...p, ctaUrl: "" })); }}
                placeholder="/contact" style={{ ...inputStyle, ...(errors.ctaUrl ? { borderColor: DANGER } : {}) }}
              />
              {errors.ctaUrl && <div style={errStyle}>{errors.ctaUrl}</div>}
            </div>
          </div>
        </div>
      </div>

      {/* ═══ SECTION 11: Workflow (edit only) ═══ */}
      {mode === "edit" && solution && (
        <div style={sectionStyle}>
          <div style={sectionHeaderStyle}><h2 style={sectionTitleStyle}>Workflow de publication</h2></div>
          <div style={sectionBodyStyle}>
            <div className="admin-service-form-grid">
              <div>
                <label style={labelStyle}>Statut actuel</label>
                <StatusBadge variant={SOLUTION_STATUS_CONFIG[status]} />
              </div>
              {solution.reviewNote && (
                <div>
                  <label style={labelStyle}>Dernière note de révision</label>
                  <p style={{ margin: 0, fontSize: 13, color: DANGER, fontFamily: "var(--font-sans)" }}>{solution.reviewNote}</p>
                </div>
              )}
              {solution.reviewedBy && (
                <div>
                  <label style={labelStyle}>Révisé par</label>
                  <p style={{ margin: 0, fontSize: 13, color: TEXT_SECONDARY, fontFamily: "var(--font-sans)" }}>
                    {solution.reviewedBy}{solution.reviewedAt ? ` — ${new Date(solution.reviewedAt).toLocaleDateString("fr-FR")}` : ""}
                  </p>
                </div>
              )}
              {solution.publishedAt && (
                <div>
                  <label style={labelStyle}>Publié le</label>
                  <p style={{ margin: 0, fontSize: 13, color: TEXT_SECONDARY, fontFamily: "var(--font-sans)" }}>
                    {new Date(solution.publishedAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                </div>
              )}
            </div>

            {canApprove && (
              <div style={{ marginTop: 20, paddingTop: 20, borderTop: `1px solid ${BORDER}` }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <label style={labelStyle} htmlFor="sol-review-note">Note de révision (obligatoire pour demander des modifications)</label>
                  <textarea id="sol-review-note" value={reviewNote} onChange={(e) => setReviewNote(e.target.value)} rows={3}
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
                  Publier la solution
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══ SECTION 12: SEO ═══ */}
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
          onClick={() => { if (isDirty && !window.confirm("Quitter sans enregistrer ?")) return; navigate("/admin/solutions"); }}
          style={{ ...btnBase, border: `1px solid ${BORDER}`, background: SURFACE, color: TEXT }}
        >
          Annuler
        </button>
        <button type="button" onClick={() => handleSave(safeDraftStatus)} disabled={saving}
          style={{ ...btnBase, border: `1px solid ${BORDER}`, background: SURFACE, color: TEXT, opacity: saving ? 0.6 : 1 }}
        >
          <Save size={14} /> {workflowStatusLocked ? "Enregistrer les modifications" : "Enregistrer brouillon"}
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
