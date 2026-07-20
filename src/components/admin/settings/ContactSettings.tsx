import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { RotateCcw, MapPin, Phone as PhoneIcon, Mail, Clock, ExternalLink } from "lucide-react";
import type { SettingsTabProps } from "../../../pages/admin/SettingsPage";
import { ACCENT, BORDER, SURFACE, TEXT, TEXT_SECONDARY, DANGER } from "../../../constants";

/* ── Types ── */
interface ContactState {
  address: string;
  city: string;
  country: string;
  displayPhone: string;
  canonicalPhone: string;
  whatsapp: string;
  mainEmail: string;
  supportEmail: string;
  workingHours: string;
  googleMapsUrl: string;
}

/* ── Defaults ── */
const DEFAULTS: ContactState = {
  address: "Av. Mohammed VI, Guéliz",
  city: "Marrakech",
  country: "Maroc",
  displayPhone: "+212 (0) 688 164 547",
  canonicalPhone: "+212688164547",
  whatsapp: "+212688164547",
  mainEmail: "contact@integraltech.ma",
  supportEmail: "support@integraltech.ma",
  workingHours: "Lun-Ven 9h-18h",
  googleMapsUrl: "",
};

/* ── Validators ── */
const isValidEmail = (v: string) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const isValidPhone = (v: string) => !v || /^\+?[\d\s()-]{7,20}$/.test(v);
const isValidUrl = (v: string) => {
  if (!v) return true;
  try { new URL(v); return true; } catch { return false; }
};

/* ── Shared styles ── */
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

const errorMsgStyle: React.CSSProperties = {
  fontSize: 12,
  color: DANGER,
  marginTop: 4,
  fontFamily: "var(--font-sans)",
};

export default function ContactSettings({ onDirtyChange, onSaveSuccess }: SettingsTabProps) {
  const [state, setState] = useState<ContactState>({ ...DEFAULTS });
  const [savedState, setSavedState] = useState<ContactState>({ ...DEFAULTS });
  const [errors, setErrors] = useState<Partial<Record<keyof ContactState, string>>>({});
  const [saving, setSaving] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => () => { mountedRef.current = false; }, []);

  const isDirty = useMemo(() => JSON.stringify(state) !== JSON.stringify(savedState), [state, savedState]);

  useEffect(() => {
    onDirtyChange(isDirty);
  }, [isDirty, onDirtyChange]);

  const update = useCallback(<K extends keyof ContactState>(key: K, value: ContactState[K]) => {
    setState((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }, []);

  const validate = (): boolean => {
    const errs: Partial<Record<keyof ContactState, string>> = {};
    if (!state.city.trim()) errs.city = "La ville est requise.";
    if (!state.displayPhone.trim()) errs.displayPhone = "Le téléphone affiché est requis.";
    if (!isValidPhone(state.displayPhone)) errs.displayPhone = "Format de téléphone invalide.";
    if (!state.canonicalPhone.trim()) errs.canonicalPhone = "Le téléphone canonique est requis.";
    if (!isValidPhone(state.canonicalPhone)) errs.canonicalPhone = "Format de téléphone invalide.";
    if (state.whatsapp && !isValidPhone(state.whatsapp)) errs.whatsapp = "Format de téléphone invalide.";
    if (!state.mainEmail.trim()) errs.mainEmail = "L'email principal est requis.";
    if (!isValidEmail(state.mainEmail)) errs.mainEmail = "Format d'email invalide.";
    if (state.supportEmail && !isValidEmail(state.supportEmail)) errs.supportEmail = "Format d'email invalide.";
    if (state.googleMapsUrl && !isValidUrl(state.googleMapsUrl)) errs.googleMapsUrl = "URL invalide.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 400));
    if (!mountedRef.current) return;
    setSavedState({ ...state });
    setSaving(false);
    onSaveSuccess();
  };

  const handleCancel = () => { setState({ ...savedState }); setErrors({}); };
  const handleReset = () => { setState({ ...DEFAULTS }); setErrors({}); };

  const errBorder = (key: keyof ContactState) =>
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
        <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, fontFamily: "var(--font-display)", color: TEXT }}>
          Informations de contact
        </h2>
        <p style={{ margin: "4px 0 0", fontSize: 13, color: TEXT_SECONDARY, fontFamily: "var(--font-sans)" }}>
          Coordonnées affichées sur le site public.
        </p>
      </div>

      <div style={{ padding: 24 }}>
        <div className="admin-settings-form-grid">
          {/* Address */}
          <div className="full-width">
            <label style={labelStyle} htmlFor="cs-address">Adresse</label>
            <input id="cs-address" type="text" value={state.address} onChange={(e) => update("address", e.target.value)} style={inputStyle} />
          </div>

          {/* City */}
          <div>
            <label style={labelStyle} htmlFor="cs-city">Ville <span style={{ color: ACCENT }}>*</span></label>
            <input id="cs-city" type="text" value={state.city} onChange={(e) => update("city", e.target.value)} style={{ ...inputStyle, ...errBorder("city") }} />
            {errors.city && <div style={errorMsgStyle}>{errors.city}</div>}
          </div>

          {/* Country */}
          <div>
            <label style={labelStyle} htmlFor="cs-country">Pays</label>
            <input id="cs-country" type="text" value={state.country} onChange={(e) => update("country", e.target.value)} style={inputStyle} />
          </div>

          {/* Display phone */}
          <div>
            <label style={labelStyle} htmlFor="cs-display-phone">Téléphone affiché <span style={{ color: ACCENT }}>*</span></label>
            <input id="cs-display-phone" type="tel" value={state.displayPhone} onChange={(e) => update("displayPhone", e.target.value)} style={{ ...inputStyle, ...errBorder("displayPhone") }} />
            {errors.displayPhone && <div style={errorMsgStyle}>{errors.displayPhone}</div>}
          </div>

          {/* Canonical phone */}
          <div>
            <label style={labelStyle} htmlFor="cs-canonical-phone">Téléphone canonique <span style={{ color: ACCENT }}>*</span></label>
            <input id="cs-canonical-phone" type="tel" value={state.canonicalPhone} onChange={(e) => update("canonicalPhone", e.target.value)} style={{ ...inputStyle, ...errBorder("canonicalPhone") }} />
            {errors.canonicalPhone && <div style={errorMsgStyle}>{errors.canonicalPhone}</div>}
            <div style={{ fontSize: 12, color: TEXT_SECONDARY, marginTop: 4, fontFamily: "var(--font-sans)" }}>
              Valeur utilisée dans les liens tel:
            </div>
          </div>

          {/* WhatsApp */}
          <div>
            <label style={labelStyle} htmlFor="cs-whatsapp">WhatsApp</label>
            <input id="cs-whatsapp" type="tel" value={state.whatsapp} onChange={(e) => update("whatsapp", e.target.value)} style={{ ...inputStyle, ...errBorder("whatsapp") }} />
            {errors.whatsapp && <div style={errorMsgStyle}>{errors.whatsapp}</div>}
          </div>

          {/* Main email */}
          <div>
            <label style={labelStyle} htmlFor="cs-email">Email principal <span style={{ color: ACCENT }}>*</span></label>
            <input id="cs-email" type="email" value={state.mainEmail} onChange={(e) => update("mainEmail", e.target.value)} style={{ ...inputStyle, ...errBorder("mainEmail") }} />
            {errors.mainEmail && <div style={errorMsgStyle}>{errors.mainEmail}</div>}
          </div>

          {/* Support email */}
          <div>
            <label style={labelStyle} htmlFor="cs-support-email">Email support</label>
            <input id="cs-support-email" type="email" value={state.supportEmail} onChange={(e) => update("supportEmail", e.target.value)} style={{ ...inputStyle, ...errBorder("supportEmail") }} />
            {errors.supportEmail && <div style={errorMsgStyle}>{errors.supportEmail}</div>}
          </div>

          {/* Working hours */}
          <div>
            <label style={labelStyle} htmlFor="cs-hours">Horaires de travail</label>
            <input id="cs-hours" type="text" value={state.workingHours} onChange={(e) => update("workingHours", e.target.value)} style={inputStyle} />
          </div>

          {/* Google Maps URL */}
          <div>
            <label style={labelStyle} htmlFor="cs-maps">URL Google Maps</label>
            <input id="cs-maps" type="url" value={state.googleMapsUrl} onChange={(e) => update("googleMapsUrl", e.target.value)} style={{ ...inputStyle, ...errBorder("googleMapsUrl") }} />
            {errors.googleMapsUrl && <div style={errorMsgStyle}>{errors.googleMapsUrl}</div>}
          </div>
        </div>

        {/* ── Contact Preview ── */}
        <div style={{ marginTop: 28 }}>
          <h3
            style={{
              fontSize: 14,
              fontWeight: 700,
              fontFamily: "var(--font-display)",
              color: TEXT,
              margin: "0 0 12px",
            }}
          >
            Aperçu du rendu public
          </h3>
          <div className="admin-settings-preview">
            <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 13, fontFamily: "var(--font-sans)", color: TEXT_SECONDARY }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <MapPin size={15} style={{ flexShrink: 0, marginTop: 2, color: ACCENT }} />
                <span>{[state.address, state.city, state.country].filter(Boolean).join(", ")}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <PhoneIcon size={15} style={{ flexShrink: 0, color: ACCENT }} />
                <span>{state.displayPhone || "—"}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Mail size={15} style={{ flexShrink: 0, color: ACCENT }} />
                <span>{state.mainEmail || "—"}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Clock size={15} style={{ flexShrink: 0, color: ACCENT }} />
                <span>{state.workingHours || "—"}</span>
              </div>
              {state.googleMapsUrl && (
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <ExternalLink size={15} style={{ flexShrink: 0, color: ACCENT }} />
                  <span style={{ wordBreak: "break-all" }}>{state.googleMapsUrl}</span>
                </div>
              )}
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
          <button type="button" onClick={handleReset} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 16px", borderRadius: "var(--radius-md)", border: `1px solid ${BORDER}`, background: "transparent", color: TEXT_SECONDARY, fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>
            <RotateCcw size={14} />
            Réinitialiser
          </button>
          <button type="button" onClick={handleCancel} disabled={!isDirty} style={{ padding: "9px 20px", borderRadius: "var(--radius-md)", border: `1px solid ${BORDER}`, background: SURFACE, color: TEXT, fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600, cursor: isDirty ? "pointer" : "not-allowed", opacity: isDirty ? 1 : 0.5 }}>
            Annuler
          </button>
          <button type="button" onClick={handleSave} disabled={saving || !isDirty} style={{ padding: "9px 24px", borderRadius: "var(--radius-md)", border: "none", background: ACCENT, color: "#fff", fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600, cursor: saving || !isDirty ? "not-allowed" : "pointer", opacity: saving || !isDirty ? 0.6 : 1 }}>
            {saving ? "Enregistrement…" : "Enregistrer"}
          </button>
        </div>
      </div>
    </div>
  );
}
