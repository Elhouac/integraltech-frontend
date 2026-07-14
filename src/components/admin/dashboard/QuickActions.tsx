import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FilePlus, Inbox, Upload, BarChart3, Send, Settings } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { BORDER, SURFACE, TEXT, TEXT_SECONDARY } from "../../../constants";

interface QuickAction {
  icon: LucideIcon;
  label: string;
  description: string;
  to: string;
  color: string;
  bg: string;
}

const ACTIONS: QuickAction[] = [
  {
    icon: FilePlus,
    label: "Nouvel article",
    description: "Créer un article de blog",
    to: "/admin/posts/create",
    color: "#22C55E",
    bg: "rgba(34,197,94,0.08)",
  },
  {
    icon: Inbox,
    label: "Voir les leads",
    description: "Consulter les demandes",
    to: "/admin/leads",
    color: "#F97316",
    bg: "rgba(249,115,22,0.08)",
  },
  {
    icon: Upload,
    label: "Uploader un média",
    description: "Ajouter images ou fichiers",
    to: "/admin/media",
    color: "#3B82F6",
    bg: "rgba(59,130,246,0.08)",
  },
  {
    icon: BarChart3,
    label: "Statistiques",
    description: "Voir les performances",
    to: "/admin/dashboard",
    color: "#8B5CF6",
    bg: "rgba(139,92,246,0.08)",
  },
  {
    icon: Send,
    label: "Newsletter",
    description: "Gérer les abonnés",
    to: "/admin/subscribers",
    color: "#EC4899",
    bg: "rgba(236,72,153,0.08)",
  },
  {
    icon: Settings,
    label: "Paramètres",
    description: "Configuration du site",
    to: "/admin/settings/general",
    color: "#64748B",
    bg: "rgba(100,116,139,0.08)",
  },
];

export default function QuickActions() {
  const navigate = useNavigate();

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
      <div
        style={{
          padding: "18px 24px",
          borderBottom: `1px solid ${BORDER}`,
        }}
      >
        <h3
          style={{
            fontSize: 15,
            fontWeight: 700,
            color: TEXT,
            fontFamily: "var(--font-display)",
            margin: 0,
          }}
        >
          Actions rapides
        </h3>
      </div>

      {/* Actions grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 1,
          background: BORDER,
        }}
      >
        {ACTIONS.map((action, index) => (
          <motion.button
            key={action.label}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25, delay: 0.3 + index * 0.05 }}
            onClick={() => navigate(action.to)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "16px 20px",
              background: SURFACE,
              border: "none",
              cursor: "pointer",
              textAlign: "left",
              fontFamily: "var(--font-sans)",
              transition: "background 0.15s",
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "var(--radius-sm)",
                background: action.bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <action.icon size={16} color={action.color} strokeWidth={2} />
            </div>
            <div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: TEXT,
                  marginBottom: 1,
                }}
              >
                {action.label}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: TEXT_SECONDARY,
                }}
              >
                {action.description}
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
