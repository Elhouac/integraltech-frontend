import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import type { UserRole } from "../../../context/AuthContext";
import { ACCENT, TEXT_SECONDARY } from "../../../constants";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
}

export default function ProtectedRoute({ children, requiredRole = "reader" }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, hasRole } = useAuth();
  const location = useLocation();

  // ── Show loading state while restoring session ──
  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          background: "var(--background)",
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            border: `3px solid var(--border)`,
            borderTopColor: ACCENT,
            borderRadius: "50%",
            animation: "admin-spin 0.8s linear infinite",
          }}
        />
      </div>
    );
  }

  // ── Not authenticated → redirect to login ──
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // ── Insufficient role → show 403 ──
  if (!hasRole(requiredRole)) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 60,
          textAlign: "center",
          fontFamily: "var(--font-sans)",
        }}
      >
        <div
          style={{
            fontSize: 64,
            fontWeight: 800,
            fontFamily: "var(--font-display)",
            color: ACCENT,
            lineHeight: 1,
          }}
        >
          403
        </div>
        <h2
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: "var(--text)",
            margin: "16px 0 8px",
            fontFamily: "var(--font-display)",
          }}
        >
          Accès refusé
        </h2>
        <p style={{ color: TEXT_SECONDARY, fontSize: 14, maxWidth: 360 }}>
          Vous n'avez pas les permissions nécessaires pour accéder à cette page.
          Contactez votre administrateur.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
