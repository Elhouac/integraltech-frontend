import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, ShieldCheck, ArrowLeft, AlertCircle, CheckCircle } from "lucide-react";
import { ACCENT, BORDER, TEXT, TEXT_SECONDARY, SURFACE } from "../../constants";
import {
  AuthPageLayout,
  AuthLogo,
  AuthError,
  AuthInput,
  AuthSubmit,
} from "../../components/admin/auth/AuthPrimitives";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReset, setIsReset] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!password.trim()) { setError("Le mot de passe est requis."); return; }
    if (password.length < 8) { setError("Le mot de passe doit contenir au moins 8 caractères."); return; }
    if (password !== confirmPassword) { setError("Les mots de passe ne correspondent pas."); return; }

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setIsReset(true);
  };

  // ── Password strength indicator ──
  const getStrength = (pwd: string): { label: string; color: string; width: string } => {
    if (pwd.length === 0) return { label: "", color: "transparent", width: "0%" };
    if (pwd.length < 6) return { label: "Faible", color: "var(--danger)", width: "25%" };
    if (pwd.length < 8) return { label: "Moyen", color: "var(--warning)", width: "50%" };
    const hasUpper = /[A-Z]/.test(pwd);
    const hasNumber = /[0-9]/.test(pwd);
    const hasSpecial = /[^A-Za-z0-9]/.test(pwd);
    const score = [hasUpper, hasNumber, hasSpecial].filter(Boolean).length;
    if (score >= 2) return { label: "Fort", color: "var(--success)", width: "100%" };
    return { label: "Correct", color: "var(--info)", width: "75%" };
  };

  const strength = getStrength(password);

  const passwordToggle = (
    <button
      type="button"
      onClick={() => setShowPassword((p) => !p)}
      aria-label={showPassword ? "Masquer" : "Afficher"}
      style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", padding: 2, display: "flex" }}
    >
      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
    </button>
  );

  // ── Invalid token state ──
  if (!token) {
    return (
      <div
        style={{
          minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
          padding: 24, background: "var(--background)", fontFamily: "var(--font-sans)",
        }}
      >
        <div
          style={{
            background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: "var(--radius-xl)",
            padding: "40px 32px", boxShadow: "var(--shadow-xl)", maxWidth: 420, width: "100%", textAlign: "center",
          }}
        >
          <AlertCircle size={40} color="var(--danger)" style={{ marginBottom: 16 }} />
          <h1 style={{ fontSize: 20, fontWeight: 700, fontFamily: "var(--font-display)", color: TEXT, margin: "0 0 8px" }}>
            Lien invalide
          </h1>
          <p style={{ fontSize: 13, color: TEXT_SECONDARY, marginBottom: 24 }}>
            Ce lien de réinitialisation est invalide ou a expiré.
          </p>
          <Link
            to="/admin/forgot-password"
            style={{ display: "inline-flex", alignItems: "center", gap: 6, color: ACCENT, textDecoration: "none", fontSize: 14, fontWeight: 600 }}
          >
            Demander un nouveau lien
          </Link>
        </div>
      </div>
    );
  }

  return (
    <AuthPageLayout>
      <AuthLogo
        title="Nouveau mot de passe"
        subtitle={isReset ? "Votre mot de passe a été réinitialisé." : "Choisissez un nouveau mot de passe sécurisé."}
      />

      {isReset ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ textAlign: "center" }}
        >
          <div
            style={{
              width: 56, height: 56, borderRadius: "50%", background: "rgba(34,197,94,0.1)",
              display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 16,
            }}
          >
            <CheckCircle size={28} color="var(--success)" />
          </div>
          <p style={{ fontSize: 14, color: TEXT_SECONDARY, marginBottom: 24 }}>
            Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.
          </p>
          <Link
            to="/admin/login"
            style={{
              display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 24px",
              borderRadius: "var(--radius-md)", background: ACCENT, color: "#fff",
              textDecoration: "none", fontSize: 14, fontWeight: 600,
            }}
          >
            <ShieldCheck size={16} />
            Se connecter
          </Link>
        </motion.div>
      ) : (
        <>
          <AuthError message={error} />

          <form onSubmit={handleSubmit} noValidate>
            <div style={{ marginBottom: 8 }}>
              <AuthInput
                id="reset-password"
                label="Nouveau mot de passe"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={setPassword}
                placeholder="Min. 8 caractères"
                autoComplete="new-password"
                autoFocus
                disabled={isSubmitting}
                icon={<Lock size={16} />}
                rightElement={passwordToggle}
              />
            </div>

            {/* Strength bar */}
            {password.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ height: 3, borderRadius: 2, background: "var(--border)", overflow: "hidden", marginBottom: 4 }}>
                  <motion.div
                    animate={{ width: strength.width }}
                    style={{ height: "100%", background: strength.color, borderRadius: 2 }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <span style={{ fontSize: 11, color: strength.color, fontWeight: 600 }}>
                  {strength.label}
                </span>
              </div>
            )}

            <div style={{ marginBottom: 24 }}>
              <AuthInput
                id="reset-confirm"
                label="Confirmer le mot de passe"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={setConfirmPassword}
                placeholder="Répétez le mot de passe"
                autoComplete="new-password"
                disabled={isSubmitting}
                icon={<Lock size={16} />}
              />
            </div>

            <AuthSubmit label="Réinitialiser" icon={<ShieldCheck size={15} />} isSubmitting={isSubmitting} />
          </form>

          <div style={{ textAlign: "center", marginTop: 20 }}>
            <Link
              to="/admin/login"
              style={{ display: "inline-flex", alignItems: "center", gap: 6, color: TEXT_SECONDARY, textDecoration: "none", fontSize: 13 }}
            >
              <ArrowLeft size={14} />
              Retour à la connexion
            </Link>
          </div>
        </>
      )}
    </AuthPageLayout>
  );
}
