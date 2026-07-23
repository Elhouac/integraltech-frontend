import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { BORDER, SURFACE, TEXT, TEXT_SECONDARY } from "../../../constants";

export interface QuickActionItem {
  icon: LucideIcon;
  label: string;
  description: string;
  to: string;
  color: string;
  bg: string;
}

interface QuickActionsProps {
  actions: QuickActionItem[];
}

export default function QuickActions({ actions }: QuickActionsProps) {
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
        {actions.map((action, index) => (
          <motion.button
            key={action.label}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25, delay: 0.3 + index * 0.05 }}
            onClick={() => navigate(action.to)}
            type="button"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "16px 20px",
              background: SURFACE,
              border: "none",
              cursor: "pointer",
              textAlign: "start",
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
