import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, Send, CheckCircle, AlertCircle } from "lucide-react";
import { ACCENT, BORDER, TEXT, TEXT_SECONDARY, SURFACE } from "../../constants";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("L'email est requis.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Veuillez entrer un email valide.");
      return;
    }

    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setIsSubmitting(false);
    setIsSent(true);
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
              Mot de passe oublié
            </h1>
            <p style={{ fontSize: 13, color: TEXT_SECONDARY, marginTop: 8, margin: "8px 0 0" }}>
              {isSent
                ? "Vérifiez votre boîte de réception."
                : "Entrez votre email pour recevoir un lien de réinitialisation."}
            </p>
          </div>

          {isSent ? (
            /* ── Success state ── */
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
              <p style={{ fontSize: 14, color: TEXT_SECONDARY, marginBottom: 24, lineHeight: 1.6 }}>
                Si un compte est associé à <strong style={{ color: TEXT }}>{email}</strong>,
                vous recevrez un email avec les instructions.
              </p>
              <Link
                to="/admin/login"
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
                <ArrowLeft size={15} />
                Retour à la connexion
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
                <div style={{ marginBottom: 24 }}>
                  <label
                    htmlFor="forgot-email"
                    style={{ display: "block", fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 6 }}
                  >
                    Adresse email
                  </label>
                  <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                    <Mail
                      size={16}
                      style={{ position: "absolute", left: 14, color: "var(--muted)", pointerEvents: "none" }}
                    />
                    <input
                      id="forgot-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="votre@email.com"
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
                      <Send size={15} />
                      Envoyer le lien
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
                    transition: "color 0.2s",
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
