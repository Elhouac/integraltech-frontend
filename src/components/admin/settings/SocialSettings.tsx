import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { RotateCcw, AlertTriangle } from "lucide-react";
import type { SettingsTabProps } from "../../../pages/admin/SettingsPage";
import { ACCENT, BORDER, SURFACE, TEXT, TEXT_SECONDARY, DANGER, WARNING } from "../../../constants";

/* ── Types ── */
interface SocialNetwork {
  url: string;
  active: boolean;
  newTab: boolean;
}

interface SocialState {
  linkedin: SocialNetwork;
  facebook: SocialNetwork;
  instagram: SocialNetwork;
  youtube: SocialNetwork;
  twitter: SocialNetwork;
}

type NetworkKey = keyof SocialState;

/* ── Defaults ── */
const EMPTY_NETWORK: SocialNetwork = { url: "", active: false, newTab: true };

const DEFAULTS: SocialState = {
  linkedin: { ...EMPTY_NETWORK },
  facebook: { ...EMPTY_NETWORK },
  instagram: { ...EMPTY_NETWORK },
  youtube: { ...EMPTY_NETWORK },
  twitter: { ...EMPTY_NETWORK },
};

const NETWORK_LABELS: Record<NetworkKey, string> = {
  linkedin: "LinkedIn",
  facebook: "Facebook",
  instagram: "Instagram",
  youtube: "YouTube",
  twitter: "X / Twitter",
};

/* ── Validator ── */
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

export default function SocialSettings({ onDirtyChange, onSaveSuccess }: SettingsTabProps) {
  const [state, setState] = useState<SocialState>(JSON.parse(JSON.stringify(DEFAULTS)));
  const [savedState, setSavedState] = useState<SocialState>(JSON.parse(JSON.stringify(DEFAULTS)));
  const [errors, setErrors] = useState<Partial<Record<NetworkKey, string>>>({});
  const [saving, setSaving] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => () => { mountedRef.current = false; }, []);

  const isDirty = useMemo(() => JSON.stringify(state) !== JSON.stringify(savedState), [state, savedState]);

  useEffect(() => { onDirtyChange(isDirty); }, [isDirty, onDirtyChange]);

  const updateNetwork = useCallback((key: NetworkKey, field: keyof SocialNetwork, value: string | boolean) => {
    setState((prev) => ({ ...prev, [key]: { ...prev[key], [field]: value } }));
    if (field === "url") setErrors((prev) => ({ ...prev, [key]: undefined }));
  }, []);

  /* ── Validation ── */
  const validate = (): boolean => {
    const errs: Partial<Record<NetworkKey, string>> = {};
    for (const key of Object.keys(state) as NetworkKey[]) {
      const net = state[key];
      if (net.url && !isValidUrl(net.url)) errs[key] = "URL invalide.";
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
    setSavedState(JSON.parse(JSON.stringify(state)));
    setSaving(false);
    onSaveSuccess();
  };

  const handleCancel = () => { setState(JSON.parse(JSON.stringify(savedState))); setErrors({}); };
  const handleReset = () => { setState(JSON.parse(JSON.stringify(DEFAULTS))); setErrors({}); };

  const networkKeys = Object.keys(state) as NetworkKey[];

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
          Réseaux sociaux
        </h2>
        <p style={{ margin: "4px 0 0", fontSize: 13, color: TEXT_SECONDARY, fontFamily: "var(--font-sans)" }}>
          Configurez les liens vers vos profils sur les réseaux sociaux.
        </p>
      </div>

      <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 20 }}>
        {networkKeys.map((key) => {
          const net = state[key];
          const hasWarning = net.active && !net.url.trim();
          const hasError = !!errors[key];

          return (
            <div
              key={key}
              style={{
                padding: 20,
                border: `1px solid ${hasWarning ? WARNING : BORDER}`,
                borderRadius: "var(--radius-md)",
                background: "var(--background)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 14,
                  flexWrap: "wrap",
                  gap: 10,
                }}
              >
                <h3
                  style={{
                    margin: 0,
                    fontSize: 14,
                    fontWeight: 700,
                    fontFamily: "var(--font-display)",
                    color: TEXT,
                  }}
                >
                  {NETWORK_LABELS[key]}
                </h3>

                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  {/* Active toggle */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 12, color: TEXT_SECONDARY, fontFamily: "var(--font-sans)" }}>Actif</span>
                    <label className="admin-toggle" aria-label={`${NETWORK_LABELS[key]} actif`}>
                      <input
                        type="checkbox"
                        checked={net.active}
                        onChange={(e) => updateNetwork(key, "active", e.target.checked)}
                      />
                      <span className="admin-toggle-track" />
                      <span className="admin-toggle-thumb" />
                    </label>
                  </div>

                  {/* New tab toggle */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 12, color: TEXT_SECONDARY, fontFamily: "var(--font-sans)" }}>Nouvel onglet</span>
                    <label className="admin-toggle" aria-label={`${NETWORK_LABELS[key]} nouvel onglet`}>
                      <input
                        type="checkbox"
                        checked={net.newTab}
                        onChange={(e) => updateNetwork(key, "newTab", e.target.checked)}
                      />
                      <span className="admin-toggle-track" />
                      <span className="admin-toggle-thumb" />
                    </label>
                  </div>
                </div>
              </div>

              {/* URL */}
              <label style={labelStyle} htmlFor={`social-${key}`}>URL</label>
              <input
                id={`social-${key}`}
                type="url"
                placeholder={`https://${key === "twitter" ? "x" : key}.com/...`}
                value={net.url}
                onChange={(e) => updateNetwork(key, "url", e.target.value)}
                style={{ ...inputStyle, ...(hasError ? { borderColor: DANGER } : {}) }}
              />
              {hasError && <div style={errorMsgStyle}>{errors[key]}</div>}

              {/* Warning when active without URL */}
              {hasWarning && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    marginTop: 8,
                    fontSize: 12,
                    color: WARNING,
                    fontFamily: "var(--font-sans)",
                  }}
                >
                  <AlertTriangle size={13} />
                  Ce réseau est actif mais n'a pas d'URL valide.
                </div>
              )}
            </div>
          );
        })}

        {/* ── Action bar ── */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 12,
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
