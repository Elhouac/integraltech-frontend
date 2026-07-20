import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { RotateCcw, Eye, EyeOff, Send, Shield, Lock } from "lucide-react";
import type { SettingsTabProps } from "../../../pages/admin/SettingsPage";
import { ACCENT, BORDER, SURFACE, TEXT, TEXT_SECONDARY, DANGER } from "../../../constants";

/* ── Types ── */
interface SmtpState {
  mailDriver: string;
  smtpHost: string;
  smtpPort: number;
  encryption: string;
  smtpUsername: string;
  fromName: string;
  fromEmail: string;
  replyToEmail: string;
  notificationEmail: string;
}

/* ── Defaults (no sensitive data) ── */
const DEFAULTS: SmtpState = {
  mailDriver: "smtp",
  smtpHost: "",
  smtpPort: 587,
  encryption: "tls",
  smtpUsername: "",
  fromName: "IntegralTech",
  fromEmail: "",
  replyToEmail: "",
  notificationEmail: "",
};

const DRIVERS = [
  { value: "smtp", label: "SMTP" },
  { value: "sendmail", label: "Sendmail" },
  { value: "log", label: "Log (développement)" },
];

const ENCRYPTIONS = [
  { value: "tls", label: "TLS" },
  { value: "ssl", label: "SSL" },
  { value: "none", label: "Aucun" },
];

/* ── Validators ── */
const isValidEmail = (v: string) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

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

const selectStyle: React.CSSProperties = { ...inputStyle, cursor: "pointer", appearance: "auto" as const };

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

export default function EmailSmtpSettings({ onDirtyChange, onSaveSuccess }: SettingsTabProps) {
  const [state, setState] = useState<SmtpState>({ ...DEFAULTS });
  const [savedState, setSavedState] = useState<SmtpState>({ ...DEFAULTS });

  // Password is ephemeral — never stored, never pre-populated
  const [smtpPassword, setSmtpPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState<Partial<Record<keyof SmtpState | "smtpPassword", string>>>({});
  const [saving, setSaving] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => () => { mountedRef.current = false; }, []);

  const isDirty = useMemo(() => {
    return JSON.stringify(state) !== JSON.stringify(savedState) || smtpPassword.length > 0;
  }, [state, savedState, smtpPassword]);

  useEffect(() => { onDirtyChange(isDirty); }, [isDirty, onDirtyChange]);

  const update = useCallback(<K extends keyof SmtpState>(key: K, value: SmtpState[K]) => {
    setState((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }, []);

  /* ── Validation ── */
  const validate = (): boolean => {
    const errs: Partial<Record<keyof SmtpState | "smtpPassword", string>> = {};
    if (state.fromEmail && !isValidEmail(state.fromEmail)) errs.fromEmail = "Format d'email invalide.";
    if (state.replyToEmail && !isValidEmail(state.replyToEmail)) errs.replyToEmail = "Format d'email invalide.";
    if (state.notificationEmail && !isValidEmail(state.notificationEmail)) errs.notificationEmail = "Format d'email invalide.";
    if (state.smtpPort < 1 || state.smtpPort > 65535) errs.smtpPort = "Le port doit être entre 1 et 65535.";
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
    // SECURITY: Discard the password — never persist it
    setSmtpPassword("");
    setShowPassword(false);
    setSaving(false);
    onSaveSuccess("Configuration SMTP enregistrée (mode démonstration).");
  };

  const handleCancel = () => {
    setState({ ...savedState });
    setSmtpPassword("");
    setShowPassword(false);
    setErrors({});
  };

  const handleReset = () => {
    setState({ ...DEFAULTS });
    setSmtpPassword("");
    setShowPassword(false);
    setErrors({});
  };

  const errBorder = (key: keyof SmtpState | "smtpPassword") =>
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
          Email & SMTP
        </h2>
        <p style={{ margin: "4px 0 0", fontSize: 13, color: TEXT_SECONDARY, fontFamily: "var(--font-sans)" }}>
          Configuration de l'envoi d'emails.
        </p>
      </div>

      <div style={{ padding: 24 }}>
        {/* Security notice */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 10,
            padding: "12px 16px",
            marginBottom: 24,
            border: `1px solid ${BORDER}`,
            borderRadius: "var(--radius-md)",
            background: "var(--background)",
            fontSize: 13,
            color: TEXT_SECONDARY,
            fontFamily: "var(--font-sans)",
            lineHeight: 1.55,
          }}
        >
          <Shield size={16} style={{ flexShrink: 0, marginTop: 2, color: ACCENT }} />
          <span>La configuration SMTP sera sécurisée côté Laravel. Les mots de passe ne sont jamais stockés dans le navigateur.</span>
        </div>

        <div className="admin-settings-form-grid">
          {/* Mail driver */}
          <div>
            <label style={labelStyle} htmlFor="smtp-driver">Driver</label>
            <select
              id="smtp-driver"
              value={state.mailDriver}
              onChange={(e) => update("mailDriver", e.target.value)}
              style={selectStyle}
            >
              {DRIVERS.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
            </select>
          </div>

          {/* Encryption */}
          <div>
            <label style={labelStyle} htmlFor="smtp-encryption">Chiffrement</label>
            <select
              id="smtp-encryption"
              value={state.encryption}
              onChange={(e) => update("encryption", e.target.value)}
              style={selectStyle}
            >
              {ENCRYPTIONS.map((e) => <option key={e.value} value={e.value}>{e.label}</option>)}
            </select>
          </div>

          {/* SMTP Host */}
          <div>
            <label style={labelStyle} htmlFor="smtp-host">Hôte SMTP</label>
            <input
              id="smtp-host"
              type="text"
              placeholder="smtp.example.com"
              value={state.smtpHost}
              onChange={(e) => update("smtpHost", e.target.value)}
              style={inputStyle}
            />
          </div>

          {/* SMTP Port */}
          <div>
            <label style={labelStyle} htmlFor="smtp-port">Port SMTP</label>
            <input
              id="smtp-port"
              type="number"
              min={1}
              max={65535}
              value={state.smtpPort}
              onChange={(e) => update("smtpPort", Number(e.target.value) || 587)}
              style={{ ...inputStyle, maxWidth: 140, ...errBorder("smtpPort") }}
            />
            {errors.smtpPort && <div style={errorMsgStyle}>{errors.smtpPort}</div>}
          </div>

          {/* SMTP Username */}
          <div>
            <label style={labelStyle} htmlFor="smtp-username">Nom d'utilisateur SMTP</label>
            <input
              id="smtp-username"
              type="text"
              value={state.smtpUsername}
              onChange={(e) => update("smtpUsername", e.target.value)}
              style={inputStyle}
            />
          </div>

          {/* SMTP Password — ephemeral, never persisted */}
          <div>
            <label style={labelStyle} htmlFor="smtp-password">
              Mot de passe SMTP
              <Lock size={12} style={{ marginLeft: 6, verticalAlign: "middle", color: TEXT_SECONDARY }} />
            </label>
            <div style={{ position: "relative" }}>
              <input
                id="smtp-password"
                type={showPassword ? "text" : "password"}
                value={smtpPassword}
                onChange={(e) => {
                  setSmtpPassword(e.target.value);
                  setErrors((prev) => ({ ...prev, smtpPassword: undefined }));
                }}
                placeholder="••••••••"
                autoComplete="new-password"
                style={{ ...inputStyle, paddingRight: 44, ...errBorder("smtpPassword") }}
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                style={{
                  position: "absolute",
                  right: 10,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: TEXT_SECONDARY,
                  padding: 4,
                  display: "flex",
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <div style={helperMsgStyle}>
              Le mot de passe ne sera jamais stocké dans le navigateur.
            </div>
          </div>

          {/* From name */}
          <div>
            <label style={labelStyle} htmlFor="smtp-from-name">Nom de l'expéditeur</label>
            <input
              id="smtp-from-name"
              type="text"
              value={state.fromName}
              onChange={(e) => update("fromName", e.target.value)}
              style={inputStyle}
            />
          </div>

          {/* From email */}
          <div>
            <label style={labelStyle} htmlFor="smtp-from-email">Email de l'expéditeur</label>
            <input
              id="smtp-from-email"
              type="email"
              placeholder="noreply@integraltech.ma"
              value={state.fromEmail}
              onChange={(e) => update("fromEmail", e.target.value)}
              style={{ ...inputStyle, ...errBorder("fromEmail") }}
            />
            {errors.fromEmail && <div style={errorMsgStyle}>{errors.fromEmail}</div>}
          </div>

          {/* Reply-to email */}
          <div>
            <label style={labelStyle} htmlFor="smtp-reply-to">Email de réponse</label>
            <input
              id="smtp-reply-to"
              type="email"
              placeholder="contact@integraltech.ma"
              value={state.replyToEmail}
              onChange={(e) => update("replyToEmail", e.target.value)}
              style={{ ...inputStyle, ...errBorder("replyToEmail") }}
            />
            {errors.replyToEmail && <div style={errorMsgStyle}>{errors.replyToEmail}</div>}
          </div>

          {/* Notification email */}
          <div>
            <label style={labelStyle} htmlFor="smtp-notif-email">Email destinataire notifications</label>
            <input
              id="smtp-notif-email"
              type="email"
              placeholder="admin@integraltech.ma"
              value={state.notificationEmail}
              onChange={(e) => update("notificationEmail", e.target.value)}
              style={{ ...inputStyle, ...errBorder("notificationEmail") }}
            />
            {errors.notificationEmail && <div style={errorMsgStyle}>{errors.notificationEmail}</div>}
          </div>
        </div>

        {/* ── Test Email ── */}
        <div
          style={{
            marginTop: 28,
            padding: 20,
            border: `1px solid ${BORDER}`,
            borderRadius: "var(--radius-md)",
            background: "var(--background)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <div>
              <h3
                style={{
                  margin: 0,
                  fontSize: 14,
                  fontWeight: 700,
                  fontFamily: "var(--font-display)",
                  color: TEXT,
                }}
              >
                Envoyer un email de test
              </h3>
              <p style={{ margin: "4px 0 0", fontSize: 13, color: TEXT_SECONDARY, fontFamily: "var(--font-sans)" }}>
                L'envoi de test sera activé après l'intégration Laravel.
              </p>
            </div>

            <button
              type="button"
              disabled
              aria-disabled="true"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "9px 20px",
                borderRadius: "var(--radius-md)",
                border: `1px solid ${BORDER}`,
                background: SURFACE,
                color: TEXT_SECONDARY,
                fontFamily: "var(--font-sans)",
                fontSize: 13,
                fontWeight: 600,
                cursor: "not-allowed",
                opacity: 0.55,
              }}
            >
              <Send size={14} />
              Envoyer un email de test
              <span className="admin-coming-soon-badge">Backend requis</span>
            </button>
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
