import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { ACCENT, BORDER, SURFACE, TEXT, TEXT_SECONDARY } from "../../../constants";

interface KpiCardProps {
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  label: string;
  value: string | number;
  trend?: {
    value: string;
    direction: "up" | "down" | "neutral";
  };
  index?: number;
}

export default function KpiCard({ icon: Icon, iconColor, iconBg, label, value, trend, index = 0 }: KpiCardProps) {
  const trendColor = trend?.direction === "up"
    ? "var(--success)"
    : trend?.direction === "down"
      ? "var(--danger)"
      : TEXT_SECONDARY;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.08, ease: "easeOut" }}
      style={{
        background: SURFACE,
        border: `1px solid ${BORDER}`,
        borderRadius: "var(--radius-lg)",
        padding: "24px",
        display: "flex",
        alignItems: "flex-start",
        gap: 16,
        boxShadow: "var(--shadow-sm)",
        transition: "box-shadow 0.2s, transform 0.2s",
        cursor: "default",
      }}
      whileHover={{
        boxShadow: "var(--shadow-md)",
        y: -2,
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: "var(--radius-md)",
          background: iconBg || "rgba(249,115,22,0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon size={20} color={iconColor || ACCENT} strokeWidth={2} />
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 12,
            fontWeight: 500,
            color: TEXT_SECONDARY,
            fontFamily: "var(--font-sans)",
            marginBottom: 4,
            textTransform: "uppercase",
            letterSpacing: "0.04em",
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontSize: 28,
            fontWeight: 800,
            color: TEXT,
            fontFamily: "var(--font-display)",
            lineHeight: 1.1,
          }}
        >
          {value}
        </div>

        {/* Trend */}
        {trend && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              marginTop: 8,
              fontSize: 12,
              fontWeight: 600,
              color: trendColor,
              fontFamily: "var(--font-sans)",
            }}
          >
            {trend.direction === "up" && <TrendingUp size={14} />}
            {trend.direction === "down" && <TrendingDown size={14} />}
            {trend.value}
          </div>
        )}
      </div>
    </motion.div>
  );
}
