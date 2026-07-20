import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { RotateCcw, Upload } from "lucide-react";
import type { SettingsTabProps } from "../../../pages/admin/SettingsPage";
import { ACCENT, BORDER, SURFACE, TEXT, TEXT_SECONDARY, DANGER } from "../../../constants";

/* ── Types ── */
interface GeneralState {
  companyName: string;
  websiteName: string;
  shortDescription: string;
  defaultLanguage: string;
  timezone: string;
  copyrightText: string;
  blogNewArticleDays: number;
}

/* ── Defaults ── */
const DEFAULTS: GeneralState = {
  companyName: "IntegralTech",
  websiteName: "IntegralTech",
  shortDescription: "Solutions technologiques intégrales pour les entreprises marocaines.",
  defaultLanguage: "fr",
  timezone: "Africa/Casablanca",
  copyrightText: "© 2025 IntegralTech",
  blogNewArticleDays: 7,
};

const LANGUAGES = [
  { value: "fr", label: "Français" },
  { value: "en", label: "English" },
  { value: "ar", label: "العربية" },
];

const TIMEZONES = [
  "Africa/Casablanca",
  "Europe/Paris",
  "Europe/London",
  "America/New_York",
  "Asia/Dubai",
];

/* ── Shared field styles ── */
const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 13,
  fontWeight: 600,
  color: TEXT,
  fontFamily: "var(--font-sans)",
  marginBottom: 6,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 14px",
  fontSize: 14,
  fontFamily: "var(--font-sans)",
  color: TEXT,
  background: SURFACE,
  border: `1px solid ${BORDER}`,
  borderRadius: "var(--radius-md)",
  outline: "none",
};

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  cursor: "pointer",
  appearance: "auto" as const,
};

const errorMsgStyle: React.CSSProperties = {
  fontSize: 12,
  color: DANGER,
  marginTop: 4,
  fontFamily: "var(--font-sans)",
};

const helperMsgStyle: React.CSSProperties = {
  fontSize: 12,
  color: TEXT_SECONDARY,
  marginTop: 4,
  fontFamily: "var(--font-sans)",
};

export default function GeneralSettings({ onDirtyChange, onSaveSuccess }: SettingsTabProps) {
  const [state, setState] = useState<GeneralState>({ ...DEFAULTS });
  const [savedState, setSavedState] = useState<GeneralState>({ ...DEFAULTS });
  const [errors, setErrors] = useState<Partial<Record<keyof GeneralState, string>>>({});
  const [saving, setSaving] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => () => { mountedRef.current = false; }, []);

  /* ── Dirty tracking ── */
  const isDirty = useMemo(() => JSON.stringify(state) !== JSON.stringify(savedState), [state, savedState]);

  useEffect(() => {
    onDirtyChange(isDirty);
  }, [isDirty, onDirtyChange]);

  /* ── Updater ── */
  const update = useCallback(<K extends keyof GeneralState>(key: K, value: GeneralState[K]) => {
    setState((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }, []);

  /* ── Validation ── */
  const validate = (): boolean => {
    const errs: Partial<Record<keyof GeneralState, string>> = {};
    if (!state.companyName.trim()) errs.companyName = "Le nom de l'entreprise est requis.";
    if (!state.websiteName.trim()) errs.websiteName = "Le nom du site est requis.";
    if (!state.defaultLanguage) errs.defaultLanguage = "La langue par défaut est requise.";
    if (!state.timezone) errs.timezone = "Le fuseau horaire est requis.";
    if (state.blogNewArticleDays < 1 || state.blogNewArticleDays > 90) {
      errs.blogNewArticleDays = "La durée doit être entre 1 et 90 jours.";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  /* ── Actions ── */
  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 400));
    if (!mountedRef.current) return;
    setSavedState({ ...state });
    setSaving(false);
    onSaveSuccess();
  };

  const handleCancel = () => {
    setState({ ...savedState });
    setErrors({});
  };

  const handleReset = () => {
    setState({ ...DEFAULTS });
    setErrors({});
  };

  const errBorder = (key: keyof GeneralState) =>
    errors[key] ? { borderColor: DANGER } : {};

  return (
    <div
      style={{
        background: SURFACE,
        border: `1px solid ${BORDER}`,
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div style={{ padding: "20px 24px", borderBottom: `1px solid ${BORDER}` }}>
        <h2
          style={{
            margin: 0,
            fontSize: 16,
            fontWeight: 700,
            fontFamily: "var(--font-display)",
            color: TEXT,
          }}
        >
          Paramètres généraux
        </h2>
        <p style={{ margin: "4px 0 0", fontSize: 13, color: TEXT_SECONDARY, fontFamily: "var(--font-sans)" }}>
          Informations de base de votre plateforme.
        </p>
      </div>

      {/* Form */}
      <div style={{ padding: 24 }}>
        <div className="admin-settings-form-grid">
          {/* Company name */}
          <div>
            <label style={labelStyle} htmlFor="gs-company">
              Nom de l'entreprise <span style={{ color: ACCENT }}>*</span>
            </label>
            <input
              id="gs-company"
              type="text"
              value={state.companyName}
              onChange={(e) => update("companyName", e.target.value)}
              style={{ ...inputStyle, ...errBorder("companyName") }}
            />
            {errors.companyName && <div style={errorMsgStyle}>{errors.companyName}</div>}
          </div>

          {/* Website name */}
          <div>
            <label style={labelStyle} htmlFor="gs-website">
              Nom du site <span style={{ color: ACCENT }}>*</span>
            </label>
            <input
              id="gs-website"
              type="text"
              value={state.websiteName}
              onChange={(e) => update("websiteName", e.target.value)}
              style={{ ...inputStyle, ...errBorder("websiteName") }}
            />
            {errors.websiteName && <div style={errorMsgStyle}>{errors.websiteName}</div>}
          </div>

          {/* Short description */}
          <div className="full-width">
            <label style={labelStyle} htmlFor="gs-description">
              Description courte
            </label>
            <textarea
              id="gs-description"
              value={state.shortDescription}
              onChange={(e) => update("shortDescription", e.target.value)}
              rows={3}
              style={{ ...inputStyle, resize: "vertical" as const }}
            />
          </div>

          {/* Language */}
          <div>
            <label style={labelStyle} htmlFor="gs-language">
              Langue par défaut <span style={{ color: ACCENT }}>*</span>
            </label>
            <select
              id="gs-language"
              value={state.defaultLanguage}
              onChange={(e) => update("defaultLanguage", e.target.value)}
              style={{ ...selectStyle, ...errBorder("defaultLanguage") }}
            >
              {LANGUAGES.map((l) => (
                <option key={l.value} value={l.value}>
                  {l.label}
                </option>
              ))}
            </select>
            {errors.defaultLanguage && <div style={errorMsgStyle}>{errors.defaultLanguage}</div>}
          </div>

          {/* Timezone */}
          <div>
            <label style={labelStyle} htmlFor="gs-timezone">
              Fuseau horaire <span style={{ color: ACCENT }}>*</span>
            </label>
            <select
              id="gs-timezone"
              value={state.timezone}
              onChange={(e) => update("timezone", e.target.value)}
              style={{ ...selectStyle, ...errBorder("timezone") }}
            >
              {TIMEZONES.map((tz) => (
                <option key={tz} value={tz}>
                  {tz}
                </option>
              ))}
            </select>
            {errors.timezone && <div style={errorMsgStyle}>{errors.timezone}</div>}
          </div>

          {/* Logo placeholders */}
          <div>
            <label style={labelStyle}>Logo clair</label>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                padding: "24px 16px",
                border: `2px dashed ${BORDER}`,
                borderRadius: "var(--radius-md)",
                color: TEXT_SECONDARY,
                fontSize: 13,
                fontFamily: "var(--font-sans)",
                cursor: "not-allowed",
                opacity: 0.6,
              }}
            >
              <Upload size={16} />
              Télécharger
            </div>
            <div style={helperMsgStyle}>Le téléchargement sera activé après l'intégration backend.</div>
          </div>

          <div>
            <label style={labelStyle}>Logo sombre</label>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                padding: "24px 16px",
                border: `2px dashed ${BORDER}`,
                borderRadius: "var(--radius-md)",
                color: TEXT_SECONDARY,
                fontSize: 13,
                fontFamily: "var(--font-sans)",
                cursor: "not-allowed",
                opacity: 0.6,
              }}
            >
              <Upload size={16} />
              Télécharger
            </div>
            <div style={helperMsgStyle}>Le téléchargement sera activé après l'intégration backend.</div>
          </div>

          {/* Favicon */}
          <div>
            <label style={labelStyle}>Favicon</label>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                padding: "24px 16px",
                border: `2px dashed ${BORDER}`,
                borderRadius: "var(--radius-md)",
                color: TEXT_SECONDARY,
                fontSize: 13,
                fontFamily: "var(--font-sans)",
                cursor: "not-allowed",
                opacity: 0.6,
              }}
            >
              <Upload size={16} />
              Télécharger
            </div>
            <div style={helperMsgStyle}>Le téléchargement sera activé après l'intégration backend.</div>
          </div>

          {/* Copyright */}
          <div>
            <label style={labelStyle} htmlFor="gs-copyright">
              Texte copyright
            </label>
            <input
              id="gs-copyright"
              type="text"
              value={state.copyrightText}
              onChange={(e) => update("copyrightText", e.target.value)}
              style={inputStyle}
            />
          </div>

          {/* Blog new article duration */}
          <div>
            <label style={labelStyle} htmlFor="gs-blog-days">
              Durée « nouvel article » (jours) <span style={{ color: ACCENT }}>*</span>
            </label>
            <input
              id="gs-blog-days"
              type="number"
              min={1}
              max={90}
              value={state.blogNewArticleDays}
              onChange={(e) => update("blogNewArticleDays", Number(e.target.value) || 1)}
              style={{ ...inputStyle, maxWidth: 140, ...errBorder("blogNewArticleDays") }}
            />
            {errors.blogNewArticleDays && <div style={errorMsgStyle}>{errors.blogNewArticleDays}</div>}
            <div style={helperMsgStyle}>
              Les articles publiés depuis moins de {state.blogNewArticleDays} jour{state.blogNewArticleDays > 1 ? "s" : ""} afficheront le badge « Nouveau ».
            </div>
          </div>
        </div>

        {/* ── Action bar ── */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 12,
            marginTop: 28,
            paddingTop: 20,
            borderTop: `1px solid ${BORDER}`,
            flexWrap: "wrap",
          }}
        >
          <button
            type="button"
            onClick={handleReset}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "9px 16px",
              borderRadius: "var(--radius-md)",
              border: `1px solid ${BORDER}`,
              background: "transparent",
              color: TEXT_SECONDARY,
              fontFamily: "var(--font-sans)",
              fontSize: 13,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            <RotateCcw size={14} />
            Réinitialiser
          </button>

          <button
            type="button"
            onClick={handleCancel}
            disabled={!isDirty}
            style={{
              padding: "9px 20px",
              borderRadius: "var(--radius-md)",
              border: `1px solid ${BORDER}`,
              background: SURFACE,
              color: TEXT,
              fontFamily: "var(--font-sans)",
              fontSize: 13,
              fontWeight: 600,
              cursor: isDirty ? "pointer" : "not-allowed",
              opacity: isDirty ? 1 : 0.5,
            }}
          >
            Annuler
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving || !isDirty}
            style={{
              padding: "9px 24px",
              borderRadius: "var(--radius-md)",
              border: "none",
              background: ACCENT,
              color: "#fff",
              fontFamily: "var(--font-sans)",
              fontSize: 13,
              fontWeight: 600,
              cursor: saving || !isDirty ? "not-allowed" : "pointer",
              opacity: saving || !isDirty ? 0.6 : 1,
            }}
          >
            {saving ? "Enregistrement…" : "Enregistrer"}
          </button>
        </div>
      </div>
    </div>
  );
}
