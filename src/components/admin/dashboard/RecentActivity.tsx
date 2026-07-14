import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { BORDER, SURFACE, TEXT, TEXT_SECONDARY } from "../../../constants";

export interface ActivityItem {
  id: number;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  title: string;
  description: string;
  time: string;
}

interface RecentActivityProps {
  activities: ActivityItem[];
}

export default function RecentActivity({ activities }: RecentActivityProps) {
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
        {activities.map((activity, index) => (
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
