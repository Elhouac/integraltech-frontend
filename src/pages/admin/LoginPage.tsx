import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, LogIn, AlertCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { ACCENT, BORDER, TEXT, TEXT_SECONDARY, SURFACE } from "../../constants";

export default function LoginPage() {
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect target after login
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || "/admin/dashboard";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("L'email est requis.");
      return;
    }
    if (!password.trim()) {
      setError("Le mot de passe est requis.");
      return;
    }

    setIsSubmitting(true);
    const result = await login(email, password, remember);
    setIsSubmitting(false);

    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.error || "Erreur de connexion.");
    }
  };

  // ── Shared input styles ──
  const inputWrapperStyle: React.CSSProperties = {
    position: "relative",
    display: "flex",
    alignItems: "center",
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
  };

  const iconStyle: React.CSSProperties = {
    position: "absolute",
    left: 14,
    color: "var(--muted)",
    pointerEvents: "none",
  };

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
        style={{
          width: "100%",
          maxWidth: 420,
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Card */}
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
                fontSize: 22,
                fontWeight: 700,
                fontFamily: "var(--font-display)",
                color: TEXT,
                margin: 0,
              }}
            >
              IntegralTech Admin
            </h1>
            <p style={{ fontSize: 13, color: TEXT_SECONDARY, marginTop: 6, margin: "6px 0 0" }}>
              Connectez-vous pour accéder au panneau d'administration
            </p>
          </div>

          {/* Error message */}
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

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate>
            {/* Email */}
            <div style={{ marginBottom: 16 }}>
              <label
                htmlFor="login-email"
                style={{ display: "block", fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}
              >
                Email
              </label>
              <div style={inputWrapperStyle}>
                <Mail size={16} style={iconStyle} />
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@integraltech.ma"
                  autoComplete="email"
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
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: 20 }}>
              <label
                htmlFor="login-password"
                style={{ display: "block", fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}
              >
                Mot de passe
              </label>
              <div style={inputWrapperStyle}>
                <Lock size={16} style={iconStyle} />
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  disabled={isSubmitting}
                  style={{ ...inputStyle, paddingRight: 44 }}
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
                  aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
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

            {/* Remember + Forgot */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 24,
                fontSize: 13,
              }}
            >
              <label
                style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", color: TEXT_SECONDARY }}
              >
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  style={{ accentColor: ACCENT, width: 15, height: 15, cursor: "pointer" }}
                />
                Se souvenir de moi
              </label>
              <Link
                to="/admin/forgot-password"
                style={{ color: ACCENT, textDecoration: "none", fontWeight: 500, transition: "opacity 0.2s" }}
              >
                Mot de passe oublié ?
              </Link>
            </div>

            {/* Submit */}
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
                transition: "background 0.2s, transform 0.1s",
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
                  <LogIn size={16} />
                  Se connecter
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: 24, fontSize: 12, color: "var(--muted)" }}>
          © {new Date().getFullYear()} IntegralTech — Panneau d'administration
        </div>

        {/* Theme toggle */}
        <div style={{ textAlign: "center", marginTop: 12 }}>
          <button
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Mode clair" : "Mode sombre"}
            style={{
              background: "none",
              border: "none",
              color: "var(--muted)",
              cursor: "pointer",
              fontSize: 12,
              fontFamily: "var(--font-sans)",
              textDecoration: "underline",
              textUnderlineOffset: 2,
            }}
          >
            {theme === "dark" ? "☀ Mode clair" : "☾ Mode sombre"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
