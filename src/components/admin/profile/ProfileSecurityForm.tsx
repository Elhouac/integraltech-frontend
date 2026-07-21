import { useState, useMemo } from "react";
import { Eye, EyeOff, Shield, ShieldAlert, Lock, Check, X, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { adminService } from "../../../services/adminService";
import type { AdminProfile } from "../../../types/admin";
import { ACCENT, BORDER, SURFACE, TEXT, TEXT_SECONDARY, DANGER } from "../../../constants";

const sectionStyle: React.CSSProperties = { background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: "var(--radius-lg)", overflow: "hidden" };
const sectionHeaderStyle: React.CSSProperties = { padding: "18px 24px", borderBottom: `1px solid ${BORDER}` };
const sectionTitleStyle: React.CSSProperties = { margin: 0, fontSize: 15, fontWeight: 700, fontFamily: "var(--font-display)", color: TEXT };
const sectionBodyStyle: React.CSSProperties = { padding: 24 };
const labelStyle: React.CSSProperties = { display: "block", fontSize: 13, fontWeight: 600, color: TEXT, fontFamily: "var(--font-sans)", marginBottom: 6 };
const errStyle: React.CSSProperties = { fontSize: 12, color: DANGER, marginTop: 4, fontFamily: "var(--font-sans)" };
const btnBase: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 16px",
  borderRadius: "var(--radius-md)", fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600, cursor: "pointer",
};

const ROLE_LABELS: Record<string, string> = {
  super_admin: "Super Admin", admin: "Administrateur", editor: "Éditeur",
  support: "Support", viewer: "Observateur", reader: "Lecteur",
};

const PASSWORD_REQS = [
  { key: "length", label: "Au moins 10 caractères", test: (p: string) => p.length >= 10 },
  { key: "upper", label: "Au moins une majuscule", test: (p: string) => /[A-Z]/.test(p) },
  { key: "lower", label: "Au moins une minuscule", test: (p: string) => /[a-z]/.test(p) },
  { key: "digit", label: "Au moins un chiffre", test: (p: string) => /\d/.test(p) },
  { key: "special", label: "Au moins un caractère spécial", test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

function getStrength(password: string): { score: number; label: string; color: string } {
  const passed = PASSWORD_REQS.filter((r) => r.test(password)).length;
  if (passed <= 1) return { score: 1, label: "Très faible", color: DANGER };
  if (passed === 2) return { score: 2, label: "Faible", color: "#EF4444" };
  if (passed === 3) return { score: 3, label: "Moyen", color: "#F59E0B" };
  if (passed === 4) return { score: 4, label: "Fort", color: "#22C55E" };
  return { score: 5, label: "Très fort", color: "#16A34A" };
}

interface ProfileSecurityFormProps {
  profile: AdminProfile;
  userId: number;
}

export default function ProfileSecurityForm({ profile, userId }: ProfileSecurityFormProps) {
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const strength = useMemo(() => getStrength(newPw), [newPw]);

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!currentPw) e.currentPw = "Mot de passe actuel requis.";
    if (!newPw) e.newPw = "Nouveau mot de passe requis.";
    if (!confirmPw) e.confirmPw = "Confirmation requise.";
    if (newPw && confirmPw && newPw !== confirmPw) e.confirmPw = "Les mots de passe ne correspondent pas.";
    if (newPw && currentPw && newPw === currentPw) e.newPw = "Le nouveau mot de passe doit différer de l'actuel.";
    if (newPw && newPw !== newPw.trim()) e.newPw = "Le mot de passe ne doit pas contenir d'espaces en début ou fin.";
    if (newPw && PASSWORD_REQS.some((r) => !r.test(newPw))) e.newPw = e.newPw || "Le mot de passe ne remplit pas tous les critères.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      await adminService.changeMockAccountPassword(userId, { currentPassword: currentPw, newPassword: newPw, confirmPassword: confirmPw });
      // Clear immediately — never retain password values
      setCurrentPw(""); setNewPw(""); setConfirmPw("");
      setShowCurrent(false); setShowNew(false); setShowConfirm(false);
      setErrors({});
      setToast("Mode démonstration : le mot de passe de connexion n'a pas été modifié. Cette action nécessite l'intégration du backend.");
      setTimeout(() => setToast(null), 6000);
    } catch { /* */ }
    setSaving(false);
  };

  const handleReset = () => {
    setCurrentPw(""); setNewPw(""); setConfirmPw("");
    setShowCurrent(false); setShowNew(false); setShowConfirm(false);
    setErrors({});
  };

  const inputWrapStyle: React.CSSProperties = { position: "relative" };
  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "10px 40px 10px 14px", fontSize: 14, fontFamily: "var(--font-sans)", color: TEXT,
    background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: "var(--radius-md)", outline: "none",
  };
  const toggleStyle: React.CSSProperties = {
    position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)",
    display: "flex", padding: 4, border: "none", background: "transparent", cursor: "pointer", color: TEXT_SECONDARY,
  };



  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Password form */}
      <div style={sectionStyle}>
        <div style={sectionHeaderStyle}><h2 style={sectionTitleStyle}>Modifier le mot de passe</h2></div>
        <div style={sectionBodyStyle}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "10px 14px", borderRadius: "var(--radius-md)", background: `${ACCENT}08`, border: `1px solid ${ACCENT}30`, marginBottom: 20 }}>
            <Info size={14} style={{ flexShrink: 0, marginTop: 2, color: ACCENT }} />
            <span style={{ fontSize: 12, color: TEXT_SECONDARY, fontFamily: "var(--font-sans)" }}>
              La validation réelle du mot de passe et sa modification seront effectuées par le backend Laravel.
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 440 }}>
            <div>
              <label style={labelStyle} htmlFor="pw-current">Mot de passe actuel</label>
              <div style={inputWrapStyle}>
                <input id="pw-current"
                  type={showCurrent ? "text" : "password"}
                  value={currentPw} onChange={(e) => { setCurrentPw(e.target.value); setErrors((p) => ({ ...p, currentPw: "" })); }}
                  autoComplete="current-password"
                  style={{ ...inputStyle, ...(errors.currentPw ? { borderColor: DANGER } : {}) }}
                />
                <button type="button" onClick={() => setShowCurrent((v) => !v)} style={toggleStyle}
                  aria-label={showCurrent ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                >
                  {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.currentPw && <div style={errStyle}>{errors.currentPw}</div>}
            </div>

            <div>
              <label style={labelStyle} htmlFor="pw-new">Nouveau mot de passe</label>
              <div style={inputWrapStyle}>
                <input id="pw-new"
                  type={showNew ? "text" : "password"}
                  value={newPw} onChange={(e) => { setNewPw(e.target.value); setErrors((p) => ({ ...p, newPw: "" })); }}
                  autoComplete="new-password"
                  style={{ ...inputStyle, ...(errors.newPw ? { borderColor: DANGER } : {}) }}
                />
                <button type="button" onClick={() => setShowNew((v) => !v)} style={toggleStyle}
                  aria-label={showNew ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                >
                  {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.newPw && <div style={errStyle}>{errors.newPw}</div>}

              {/* Strength bar */}
              {newPw && (
                <div style={{ marginTop: 8 }}>
                  <div className="admin-profile-strength-bar">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <div key={s} className="admin-profile-strength-segment"
                        style={{ background: s <= strength.score ? strength.color : undefined }}
                      />
                    ))}
                  </div>
                  <div style={{ fontSize: 12, color: strength.color, fontWeight: 600, fontFamily: "var(--font-sans)", marginTop: 4 }}>
                    {strength.label}
                  </div>
                </div>
              )}

              {/* Requirements checklist */}
              {newPw && (
                <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 4 }}>
                  {PASSWORD_REQS.map((r) => {
                    const passed = r.test(newPw);
                    return (
                      <div key={r.key} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontFamily: "var(--font-sans)", color: passed ? "#22C55E" : TEXT_SECONDARY }}>
                        {passed ? <Check size={13} /> : <X size={13} />}
                        <span>{r.label}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div>
              <label style={labelStyle} htmlFor="pw-confirm">Confirmer le nouveau mot de passe</label>
              <div style={inputWrapStyle}>
                <input id="pw-confirm"
                  type={showConfirm ? "text" : "password"}
                  value={confirmPw} onChange={(e) => { setConfirmPw(e.target.value); setErrors((p) => ({ ...p, confirmPw: "" })); }}
                  autoComplete="new-password"
                  style={{ ...inputStyle, ...(errors.confirmPw ? { borderColor: DANGER } : {}) }}
                />
                <button type="button" onClick={() => setShowConfirm((v) => !v)} style={toggleStyle}
                  aria-label={showConfirm ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.confirmPw && <div style={errStyle}>{errors.confirmPw}</div>}
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 20, flexWrap: "wrap" }}>
            <button onClick={handleSubmit} disabled={saving}
              style={{ ...btnBase, border: "none", background: ACCENT, color: "#fff", opacity: saving ? 0.5 : 1 }}
            >
              <Lock size={14} /> Modifier le mot de passe
            </button>
            {(currentPw || newPw || confirmPw) && (
              <button onClick={handleReset} style={{ ...btnBase, border: `1px solid ${BORDER}`, background: SURFACE, color: TEXT_SECONDARY }}>
                Annuler
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2FA */}
      <div style={sectionStyle}>
        <div style={sectionHeaderStyle}><h2 style={sectionTitleStyle}>Authentification à deux facteurs</h2></div>
        <div style={sectionBodyStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <ShieldAlert size={20} style={{ color: TEXT_SECONDARY }} />
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: TEXT, fontFamily: "var(--font-sans)" }}>Indisponible en mode démonstration</div>
              <div style={{ fontSize: 12, color: TEXT_SECONDARY, fontFamily: "var(--font-sans)", marginTop: 2 }}>
                L'authentification à deux facteurs nécessite l'intégration du backend Laravel pour générer les codes de récupération et les secrets TOTP.
              </div>
            </div>
          </div>
          <button disabled
            style={{ ...btnBase, border: `1px solid ${BORDER}`, background: SURFACE, color: TEXT_SECONDARY, opacity: 0.5, cursor: "not-allowed" }}
          >
            <Shield size={14} /> Activer après intégration backend
          </button>
          <span style={{ display: "inline-flex", marginLeft: 10, padding: "3px 10px", borderRadius: "var(--radius-sm)", background: "var(--background)", fontSize: 11, fontWeight: 600, color: TEXT_SECONDARY, fontFamily: "var(--font-sans)" }}>
            Backend requis
          </span>
        </div>
      </div>

      {/* Security summary */}
      <div style={sectionStyle}>
        <div style={sectionHeaderStyle}><h2 style={sectionTitleStyle}>Résumé de sécurité</h2></div>
        <div style={sectionBodyStyle}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { label: "Adresse de connexion", value: profile.loginEmail },
              { label: "Rôle", value: ROLE_LABELS[profile.role] || profile.role },
              { label: "Dernier changement de mot de passe", value: profile.lastPasswordChangeAt ? new Date(profile.lastPasswordChangeAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }) : "Information non disponible (mock)" },
              { label: "Authentification à deux facteurs", value: "Indisponible (mode démo)" },
            ].map((row) => (
              <div key={row.label} style={{ display: "flex", padding: "8px 0", borderBottom: `1px solid ${BORDER}`, gap: 12 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: TEXT_SECONDARY, fontFamily: "var(--font-sans)", minWidth: 200, flexShrink: 0 }}>{row.label}</span>
                <span style={{ fontSize: 13, color: TEXT, fontFamily: "var(--font-sans)" }}>{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

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
