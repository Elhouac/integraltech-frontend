import { motion, type Variants } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface TrustCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

const cardVariants: Variants = {
  initial: { opacity: 0, y: 24, scale: 0.97 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

/**
 * "Why choose us" trust card with icon, title, and description.
 * Clean border with colored hover state.
 */
export default function TrustCard({
  icon: Icon,
  title,
  description,
}: TrustCardProps) {
  return (
    <motion.div
      className="trust-card"
      variants={cardVariants}
      style={{
        background: "var(--card)",
        borderRadius: 16,
        padding: "32px 26px",
        border: "1px solid var(--border)",
        boxShadow: "var(--shadow-sm)",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        cursor: "default",
        boxSizing: "border-box",
        transition: "border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = "translateY(-4px)";
        el.style.boxShadow = "var(--shadow-md)";
        el.style.borderColor = "rgba(249, 115, 22, 0.25)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = "none";
        el.style.boxShadow = "var(--shadow-sm)";
        el.style.borderColor = "var(--border)";
      }}
    >
      {/* Icon container */}
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 12,
          background: "rgba(249, 115, 22, 0.06)",
          border: "1px solid rgba(249, 115, 22, 0.12)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--accent)",
          marginBottom: 18,
        }}
      >
        <Icon size={22} />
      </div>

      {/* Title */}
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

      {/* Description */}
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
    </motion.div>
  );
}
