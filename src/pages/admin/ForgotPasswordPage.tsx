import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, Send, CheckCircle } from "lucide-react";
import { ACCENT, TEXT, TEXT_SECONDARY } from "../../constants";
import {
  AuthPageLayout,
  AuthLogo,
  AuthError,
  AuthInput,
  AuthSubmit,
} from "../../components/admin/auth/AuthPrimitives";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) { setError("L'email est requis."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("Veuillez entrer un email valide."); return; }

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setIsSubmitting(false);
    setIsSent(true);
  };

  return (
    <AuthPageLayout>
      <AuthLogo
        title="Mot de passe oublié"
        subtitle={isSent ? "Vérifiez votre boîte de réception." : "Entrez votre email pour recevoir un lien de réinitialisation."}
      />

      {isSent ? (
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
          <p style={{ fontSize: 14, color: TEXT_SECONDARY, marginBottom: 24, lineHeight: 1.6 }}>
            Si un compte est associé à <strong style={{ color: TEXT }}>{email}</strong>,
            vous recevrez un email avec les instructions.
          </p>
          <Link
            to="/admin/login"
            style={{ display: "inline-flex", alignItems: "center", gap: 6, color: ACCENT, textDecoration: "none", fontSize: 14, fontWeight: 600 }}
          >
            <ArrowLeft size={15} />
            Retour à la connexion
          </Link>
        </motion.div>
      ) : (
        <>
          <AuthError message={error} />

          <form onSubmit={handleSubmit} noValidate>
            <div style={{ marginBottom: 24 }}>
              <AuthInput
                id="forgot-email"
                label="Adresse email"
                type="email"
                value={email}
                onChange={setEmail}
                placeholder="votre@email.com"
                autoComplete="email"
                autoFocus
                disabled={isSubmitting}
                icon={<Mail size={16} />}
              />
            </div>

            <AuthSubmit label="Envoyer le lien" icon={<Send size={15} />} isSubmitting={isSubmitting} />
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
