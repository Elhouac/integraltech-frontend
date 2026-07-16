import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface StatsCardProps {
  value: number;
  suffix: string;
  label: string;
  icon: LucideIcon;
  /** Whether to start the count-up animation */
  trigger: boolean;
}

function useCountUp(target: number, duration = 1.6, start = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    let raf: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      setValue(Math.floor(progress * target));
      if (progress < 1) {
        raf = requestAnimationFrame(step);
      }
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [start, target, duration]);
  return value;
}

/**
 * Stats card with animated count-up number, icon, and label.
 * Glassmorphism style with hover elevation.
 */
export default function StatsCard({
  value,
  suffix,
  label,
  icon: Icon,
  trigger,
}: StatsCardProps) {
  const count = useCountUp(value, 1.6, trigger);

  return (
    <motion.div
      className="stat-card"
      whileHover={{
        y: -6,
        boxShadow: "var(--shadow-lg)",
        borderColor: "var(--accent)",
      }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "40px 24px",
        borderRadius: 28,
        background: "var(--surface)",
        border: "1px solid var(--border)",
        boxShadow: "var(--shadow-md)",
        height: "100%",
        boxSizing: "border-box",
        transition: "border-color 0.3s ease, box-shadow 0.3s ease",
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 14,
          background: "rgba(249, 115, 22, 0.08)",
          border: "1px solid rgba(249, 115, 22, 0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--accent)",
          marginBottom: 20,
        }}
      >
        <Icon size={22} />
      </div>

      {/* Number */}
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 800,
          fontSize: "40px",
          color: "var(--accent)",
          lineHeight: 1.1,
          marginBottom: 12,
        }}
      >
        {count}
        {suffix}
      </div>

      {/* Label */}
      <div
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: 14,
          color: "var(--text-secondary)",
          fontWeight: 600,
          letterSpacing: "0.3px",
          lineHeight: 1.5,
          maxWidth: 200,
        }}
      >
        {label}
      </div>
    </motion.div>
  );
}
