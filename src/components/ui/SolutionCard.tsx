import { motion, type Variants } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface SolutionCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

const cardVariants: Variants = {
  initial: { opacity: 0, y: 30 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

/**
 * Solution card with icon, title, and description.
 * Slightly different visual treatment from ServiceCard — uses a left-side accent.
 */
export default function SolutionCard({
  icon: Icon,
  title,
  description,
}: SolutionCardProps) {
  return (
    <motion.div
      className="solution-card"
      variants={cardVariants}
      style={{
        background: "var(--card)",
        borderRadius: 16,
        padding: "32px 28px",
        border: "1px solid var(--border)",
        boxShadow: "var(--shadow-sm)",
        display: "flex",
        gap: 20,
        alignItems: "flex-start",
        position: "relative",
        overflow: "hidden",
        cursor: "default",
        boxSizing: "border-box",
        transition: "border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = "translateY(-4px)";
        el.style.boxShadow = "var(--shadow-lg)";
        el.style.borderColor = "rgba(30, 58, 138, 0.25)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = "none";
        el.style.boxShadow = "var(--shadow-sm)";
        el.style.borderColor = "var(--border)";
      }}
    >
      {/* Left accent bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          width: 3,
          background: "var(--primary)",
          opacity: 0,
          transition: "opacity 0.3s ease",
        }}
        className="solution-card-accent"
      />

      {/* Icon */}
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 12,
          background: "rgba(30, 58, 138, 0.06)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--primary)",
          flexShrink: 0,
          transition: "background 0.3s ease, color 0.3s ease",
        }}
      >
        <Icon size={22} />
      </div>

      {/* Text */}
      <div style={{ flex: 1 }}>
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: 17,
            color: "var(--text)",
            margin: "0 0 8px",
            lineHeight: 1.3,
          }}
        >
          {title}
        </h3>
        <p
          style={{
            fontFamily: "var(--font-sans)",
            color: "var(--text-secondary)",
            fontSize: 14,
            lineHeight: 1.65,
            margin: 0,
          }}
        >
          {description}
        </p>
      </div>
    </motion.div>
  );
}
