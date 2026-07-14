import { motion } from "framer-motion";
import { Inbox, FileText, Users, Mail, Settings } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { BORDER, SURFACE, TEXT, TEXT_SECONDARY } from "../../../constants";

interface ActivityItem {
  id: number;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  title: string;
  description: string;
  time: string;
}

// ── Mock activity data (replaced by API in Phase 2) ──
const ACTIVITIES: ActivityItem[] = [
  {
    id: 1,
    icon: Inbox,
    iconColor: "#F97316",
    iconBg: "rgba(249,115,22,0.08)",
    title: "Nouveau lead",
    description: "Ahmed Benali a soumis une demande de contact",
    time: "Il y a 12 min",
  },
  {
    id: 2,
    icon: FileText,
    iconColor: "#22C55E",
    iconBg: "rgba(34,197,94,0.08)",
    title: "Article publié",
    description: '"Sécurité cloud en 2026" est maintenant en ligne',
    time: "Il y a 1h",
  },
  {
    id: 3,
    icon: Users,
    iconColor: "#3B82F6",
    iconBg: "rgba(59,130,246,0.08)",
    title: "Nouvel utilisateur",
    description: "Karim Idrissi a été ajouté comme éditeur",
    time: "Il y a 3h",
  },
  {
    id: 4,
    icon: Mail,
    iconColor: "#8B5CF6",
    iconBg: "rgba(139,92,246,0.08)",
    title: "Newsletter envoyée",
    description: "Campagne \"Offre été 2026\" envoyée à 1,240 abonnés",
    time: "Hier, 16:30",
  },
  {
    id: 5,
    icon: Settings,
    iconColor: "#64748B",
    iconBg: "rgba(100,116,139,0.08)",
    title: "Configuration mise à jour",
    description: "Les paramètres SEO ont été modifiés",
    time: "Hier, 09:15",
  },
];

export default function RecentActivity() {
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
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
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
          Activité récente
        </h3>
        <button
          style={{
            background: "none",
            border: "none",
            color: "var(--accent)",
            fontSize: 12,
            fontWeight: 600,
            fontFamily: "var(--font-sans)",
            cursor: "pointer",
            padding: "4px 8px",
            borderRadius: "var(--radius-sm)",
            transition: "background 0.2s",
          }}
        >
          Voir tout
        </button>
      </div>

      {/* Activity list */}
      <div style={{ padding: "8px 0" }}>
        {ACTIVITIES.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.3 + index * 0.06 }}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 14,
              padding: "12px 24px",
              transition: "background 0.15s",
              cursor: "pointer",
            }}
          >
            {/* Icon */}
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "var(--radius-sm)",
                background: activity.iconBg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                marginTop: 2,
              }}
            >
              <activity.icon size={16} color={activity.iconColor} strokeWidth={2} />
            </div>

            {/* Text */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: TEXT,
                  fontFamily: "var(--font-sans)",
                  marginBottom: 2,
                }}
              >
                {activity.title}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: TEXT_SECONDARY,
                  fontFamily: "var(--font-sans)",
                  lineHeight: 1.4,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {activity.description}
              </div>
            </div>

            {/* Time */}
            <div
              style={{
                fontSize: 11,
                color: "var(--muted)",
                fontFamily: "var(--font-sans)",
                whiteSpace: "nowrap",
                flexShrink: 0,
                marginTop: 2,
              }}
            >
              {activity.time}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
