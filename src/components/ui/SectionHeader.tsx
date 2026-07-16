import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface SectionHeaderProps {
  badge: string;
  title: string;
  subtitle?: string;
  /** Center-align text — defaults to true */
  centered?: boolean;
  /** Light text for dark backgrounds */
  light?: boolean;
}

/**
 * Reusable animated section header with badge, title, and optional subtitle.
 * Supports light/dark backgrounds via the `light` prop.
 */
export default function SectionHeader({
  badge,
  title,
  subtitle,
  centered = true,
  light = false,
}: SectionHeaderProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <div
      ref={ref}
      className="section-header"
      style={{
        textAlign: centered ? "center" : "left",
        marginBottom: 64,
        maxWidth: centered ? 680 : undefined,
        margin: centered ? "0 auto 64px" : undefined,
      }}
    >
      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        style={{
          color: "var(--accent)",
          fontWeight: 700,
          fontSize: 13,
          letterSpacing: 2,
          textTransform: "uppercase",
          marginBottom: 14,
          fontFamily: "var(--font-display)",
        }}
      >
        {badge}
      </motion.div>

      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.1 }}
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 800,
          fontSize: "clamp(28px, 4vw, 42px)",
          color: light ? "#fff" : "var(--text)",
          margin: 0,
          letterSpacing: "-0.5px",
          lineHeight: 1.2,
        }}
      >
        {title}
      </motion.h2>

      {/* Subtitle */}
      {subtitle && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            fontFamily: "var(--font-sans)",
            color: light ? "rgba(255,255,255,0.7)" : "var(--text-secondary)",
            fontSize: 16,
            lineHeight: 1.7,
            marginTop: 16,
            marginBottom: 0,
          }}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}
