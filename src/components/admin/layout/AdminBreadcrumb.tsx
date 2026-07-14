import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { TEXT, TEXT_SECONDARY, ACCENT } from "../../../constants";

// ── Route segment → display label mapping ──
const SEGMENT_LABELS: Record<string, string> = {
  admin: "Admin",
  dashboard: "Dashboard",
  leads: "Leads",
  subscribers: "Newsletter",
  posts: "Articles",
  categories: "Catégories",
  media: "Médiathèque",
  services: "Services",
  solutions: "Solutions",
  users: "Utilisateurs",
  settings: "Paramètres",
  profile: "Profil",
  general: "Général",
  seo: "SEO",
  email: "Email",
  create: "Nouveau",
  edit: "Modifier",
  login: "Connexion",
  "forgot-password": "Mot de passe oublié",
  "reset-password": "Réinitialisation",
};

function getLabel(segment: string): string {
  // Check mapping first, then fallback to capitalized segment
  if (SEGMENT_LABELS[segment]) return SEGMENT_LABELS[segment];
  // If it looks like an ID (number), show it with #
  if (/^\d+$/.test(segment)) return `#${segment}`;
  return segment.charAt(0).toUpperCase() + segment.slice(1);
}

export default function AdminBreadcrumb() {
  const location = useLocation();
  const segments = location.pathname
    .replace(/^\/admin\/?/, "")
    .split("/")
    .filter(Boolean);

  return (
    <nav aria-label="Fil d'Ariane" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontFamily: "var(--font-sans)" }}>
      <Link
        to="/admin/dashboard"
        style={{ display: "flex", alignItems: "center", color: TEXT_SECONDARY, textDecoration: "none", transition: "color 0.2s" }}
        aria-label="Dashboard"
      >
        <Home size={14} strokeWidth={2} />
      </Link>

      {segments.map((segment, index) => {
        const path = `/admin/${segments.slice(0, index + 1).join("/")}`;
        const isLast = index === segments.length - 1;

        return (
          <span key={path} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <ChevronRight size={12} color="var(--muted)" style={{ flexShrink: 0 }} />
            {isLast ? (
              <span style={{ color: TEXT, fontWeight: 600 }}>
                {getLabel(segment)}
              </span>
            ) : (
              <Link
                to={path}
                style={{ color: TEXT_SECONDARY, textDecoration: "none", transition: "color 0.2s" }}
              >
                {getLabel(segment)}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
