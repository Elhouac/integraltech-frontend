import { motion, type Variants } from "framer-motion";
import { NavLink } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
  ctaLabel: string;
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
 * Professional service card with icon, title, description, CTA link.
 * Orange top-accent line reveals on hover.
 */
export default function ServiceCard({
  icon: Icon,
  title,
  description,
  href,
  ctaLabel,
}: ServiceCardProps) {
  return (
    <motion.div
      className="service-card"
      variants={cardVariants}
      whileHover="hover"
      style={{
        background: "var(--card)",
        borderRadius: 16,
        padding: "36px 28px",
        border: "1px solid var(--border)",
        boxShadow: "var(--shadow-sm)",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        position: "relative",
        overflow: "hidden",
        cursor: "pointer",
        boxSizing: "border-box",
        transition: "border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = "translateY(-6px)";
        el.style.boxShadow = "var(--shadow-lg)";
        el.style.borderColor = "rgba(249, 115, 22, 0.3)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = "none";
        el.style.boxShadow = "var(--shadow-sm)";
        el.style.borderColor = "var(--border)";
      }}
    >
      {/* Top accent line */}
      <div
        className="service-card-accent"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: "var(--accent)",
          transform: "scaleX(0)",
          transformOrigin: "left",
          transition: "transform 0.35s ease",
        }}
      />

      {/* Icon */}
      <div
        className="service-card-icon"
        style={{
          width: 52,
          height: 52,
          borderRadius: 12,
          background: "rgba(30, 58, 138, 0.06)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--primary)",
          marginBottom: 20,
          transition: "background 0.3s ease, color 0.3s ease",
        }}
      >
        <Icon size={24} />
      </div>

      {/* Title */}
      <h3
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          fontSize: 18,
          color: "var(--text)",
          marginBottom: 10,
          marginTop: 0,
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
          lineHeight: 1.7,
          margin: "0 0 24px",
          flex: 1,
        }}
      >
        {description}
      </p>

      {/* CTA Link */}
      <NavLink
        to={href}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          color: "var(--accent)",
          fontWeight: 600,
          fontSize: 14,
          textDecoration: "none",
          fontFamily: "var(--font-display)",
          transition: "gap 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.gap = "10px";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.gap = "6px";
        }}
      >
        {ctaLabel}
        <ArrowRight size={14} />
      </NavLink>
    </motion.div>
  );
}
