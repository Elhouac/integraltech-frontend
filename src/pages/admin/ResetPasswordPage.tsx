import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, ShieldCheck, ArrowLeft, AlertCircle, CheckCircle } from "lucide-react";
import { ACCENT, BORDER, TEXT, TEXT_SECONDARY, SURFACE } from "../../constants";

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

    if (!password.trim()) {
      setError("Le mot de passe est requis.");
      return;
    }
    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setIsReset(true);
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 16px 12px 44px",
    border: `1px solid ${BORDER}`,
    borderRadius: "var(--radius-md)",
    background: "var(--background)",
    color: TEXT,
    fontSize: 14,
    fontFamily: "var(--font-sans)",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
    paddingRight: 44,
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

  // ── Invalid token state ──
  if (!token) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
          background: "var(--background)",
          fontFamily: "var(--font-sans)",
        }}
      >
        <div
          style={{
            background: SURFACE,
            border: `1px solid ${BORDER}`,
            borderRadius: "var(--radius-xl)",
            padding: "40px 32px",
            boxShadow: "var(--shadow-xl)",
            maxWidth: 420,
            width: "100%",
            textAlign: "center",
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
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              color: ACCENT,
              textDecoration: "none",
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            Demander un nouveau lien
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        background: "var(--background)",
        fontFamily: "var(--font-sans)",
      }}
    >
      {/* Background decoration */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: `radial-gradient(ellipse at 30% 20%, rgba(249,115,22,0.06) 0%, transparent 60%),
                       radial-gradient(ellipse at 70% 80%, rgba(59,130,246,0.05) 0%, transparent 60%)`,
          pointerEvents: "none",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        style={{ width: "100%", maxWidth: 420, position: "relative", zIndex: 1 }}
      >
        <div
          style={{
            background: SURFACE,
            border: `1px solid ${BORDER}`,
            borderRadius: "var(--radius-xl)",
            padding: "40px 32px",
            boxShadow: "var(--shadow-xl)",
          }}
        >
          {/* Logo */}
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "var(--radius-md)",
                background: `linear-gradient(135deg, var(--primary), ${ACCENT})`,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: 18,
                fontWeight: 800,
                fontFamily: "var(--font-display)",
                marginBottom: 16,
              }}
            >
              IT
            </div>
            <h1
              style={{
                fontSize: 20,
                fontWeight: 700,
                fontFamily: "var(--font-display)",
                color: TEXT,
                margin: 0,
              }}
            >
              Nouveau mot de passe
            </h1>
            <p style={{ fontSize: 13, color: TEXT_SECONDARY, marginTop: 8, margin: "8px 0 0" }}>
              {isReset ? "Votre mot de passe a été réinitialisé." : "Choisissez un nouveau mot de passe sécurisé."}
            </p>
          </div>

          {isReset ? (
            /* ── Success ── */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ textAlign: "center" }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  background: "rgba(34,197,94,0.1)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 16,
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
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "12px 24px",
                  borderRadius: "var(--radius-md)",
                  background: ACCENT,
                  color: "#fff",
                  textDecoration: "none",
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                <ShieldCheck size={16} />
                Se connecter
              </Link>
            </motion.div>
          ) : (
            /* ── Form ── */
            <>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "10px 14px",
                    marginBottom: 20,
                    borderRadius: "var(--radius-md)",
                    background: "rgba(239,68,68,0.08)",
                    border: "1px solid rgba(239,68,68,0.2)",
                    color: "var(--danger)",
                    fontSize: 13,
                  }}
                >
                  <AlertCircle size={16} style={{ flexShrink: 0 }} />
                  {error}
                </motion.div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                {/* New password */}
                <div style={{ marginBottom: 8 }}>
                  <label
                    htmlFor="reset-password"
                    style={{ display: "block", fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}
                  >
                    Nouveau mot de passe
                  </label>
                  <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                    <Lock size={16} style={{ position: "absolute", left: 14, color: "var(--muted)", pointerEvents: "none" }} />
                    <input
                      id="reset-password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min. 8 caractères"
                      autoComplete="new-password"
                      autoFocus
                      disabled={isSubmitting}
                      style={inputStyle}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = ACCENT;
                        e.currentTarget.style.boxShadow = `0 0 0 3px rgba(249,115,22,0.1)`;
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = BORDER;
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((p) => !p)}
                      aria-label={showPassword ? "Masquer" : "Afficher"}
                      style={{
                        position: "absolute",
                        right: 12,
                        background: "none",
                        border: "none",
                        color: "var(--muted)",
                        cursor: "pointer",
                        padding: 2,
                        display: "flex",
                      }}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Strength bar */}
                {password.length > 0 && (
                  <div style={{ marginBottom: 16 }}>
                    <div
                      style={{
                        height: 3,
                        borderRadius: 2,
                        background: "var(--border)",
                        overflow: "hidden",
                        marginBottom: 4,
                      }}
                    >
                      <motion.div
                        animate={{ width: strength.width }}
                        style={{
                          height: "100%",
                          background: strength.color,
                          borderRadius: 2,
                        }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                    <span style={{ fontSize: 11, color: strength.color, fontWeight: 600 }}>
                      {strength.label}
                    </span>
                  </div>
                )}

                {/* Confirm password */}
                <div style={{ marginBottom: 24 }}>
                  <label
                    htmlFor="reset-confirm"
                    style={{ display: "block", fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}
                  >
                    Confirmer le mot de passe
                  </label>
                  <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                    <Lock size={16} style={{ position: "absolute", left: 14, color: "var(--muted)", pointerEvents: "none" }} />
                    <input
                      id="reset-confirm"
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Répétez le mot de passe"
                      autoComplete="new-password"
                      disabled={isSubmitting}
                      style={{ ...inputStyle, paddingRight: 16 }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = ACCENT;
                        e.currentTarget.style.boxShadow = `0 0 0 3px rgba(249,115,22,0.1)`;
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = BORDER;
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    width: "100%",
                    padding: "12px 24px",
                    border: "none",
                    borderRadius: "var(--radius-md)",
                    background: isSubmitting ? "var(--muted)" : ACCENT,
                    color: "#fff",
                    fontSize: 14,
                    fontWeight: 600,
                    fontFamily: "var(--font-sans)",
                    cursor: isSubmitting ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    transition: "background 0.2s",
                  }}
                >
                  {isSubmitting ? (
                    <div
                      style={{
                        width: 18,
                        height: 18,
                        border: "2px solid rgba(255,255,255,0.3)",
                        borderTopColor: "#fff",
                        borderRadius: "50%",
                        animation: "admin-spin 0.8s linear infinite",
                      }}
                    />
                  ) : (
                    <>
                      <ShieldCheck size={15} />
                      Réinitialiser
                    </>
                  )}
                </button>
              </form>

              <div style={{ textAlign: "center", marginTop: 20 }}>
                <Link
                  to="/admin/login"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    color: TEXT_SECONDARY,
                    textDecoration: "none",
                    fontSize: 13,
                  }}
                >
                  <ArrowLeft size={14} />
                  Retour à la connexion
                </Link>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
