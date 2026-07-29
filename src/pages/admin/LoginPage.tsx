import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { ACCENT, TEXT_SECONDARY } from "../../constants";
import {
  AuthPageLayout,
  AuthLogo,
  AuthError,
  AuthInput,
  AuthSubmit,
} from "../../components/admin/auth/AuthPrimitives";

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

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || "/admin/dashboard";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) { setError("L'email est requis."); return; }
    if (!password.trim()) { setError("Le mot de passe est requis."); return; }

    setIsSubmitting(true);
    const result = await login(email, password, remember);
    setIsSubmitting(false);

    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.error || "Erreur de connexion.");
    }
  };

  return (
    <AuthPageLayout>
      <AuthLogo
        title="IntegralTech Admin"
        subtitle="Connectez-vous pour accéder au panneau d'administration"
      />

      <AuthError message={error} />

      <form onSubmit={handleSubmit} noValidate>
        <div style={{ marginBottom: 16 }}>
          <AuthInput
            id="login-email"
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="admin@integraltech.ma"
            autoComplete="email"
            autoFocus
            disabled={isSubmitting}
            icon={<Mail size={16} />}
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <AuthInput
            id="login-password"
            label="Mot de passe"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={setPassword}
            placeholder="••••••••"
            autoComplete="current-password"
            disabled={isSubmitting}
            icon={<Lock size={16} />}
            rightElement={
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", padding: 2, display: "flex" }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
          />
        </div>

        {/* Remember + Forgot */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, fontSize: 13 }}>
          <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", color: TEXT_SECONDARY }}>
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

        <AuthSubmit label="Se connecter" icon={<LogIn size={16} />} isSubmitting={isSubmitting} />
      </form>

      {/* Footer */}
      <div style={{ textAlign: "center", marginTop: 32 }}>
        <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 12 }}>
          © {new Date().getFullYear()} IntegralTech — Panneau d'administration
        </div>
        <button
          onClick={toggleTheme}
          aria-label={theme === "dark" ? "Mode clair" : "Mode sombre"}
          style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: 12, fontFamily: "var(--font-sans)", textDecoration: "underline", textUnderlineOffset: 2 }}
        >
          {theme === "dark" ? "☀ Mode clair" : "☾ Mode sombre"}
        </button>
      </div>
    </AuthPageLayout>
  );
}
