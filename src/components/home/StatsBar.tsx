import { useRef, useEffect, useState, useLayoutEffect } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslation } from "../../context/LanguageContext";
import { ORANGE, NAVY, DARK, BODY_TEXT, BORDER, CARD_BG } from "../../constants";
import { Award, Users, ShieldCheck, Clock } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

function useCountUp(target: number, duration = 1.8, start = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      setValue(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return value;
}

function StatItem({
  value,
  suffix,
  label,
  icon,
  trigger,
}: {
  value: number;
  suffix: string;
  label: string;
  icon: React.ReactNode;
  trigger: boolean;
}) {
  const count = useCountUp(value, 1.6, trigger);

  return (
    <motion.div
      className="stat-card"
      whileHover={{
        y: -6,
        boxShadow: "var(--shadow-xl)",
        borderColor: "var(--accent)",
      }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        padding: "36px 24px",
        borderRadius: "24px",
        background: "var(--glass-bg)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: "1px solid var(--glass-border)",
        boxShadow: "var(--shadow-lg)",
        flex: "1 1 0",
        transition: "border-color 0.3s ease, box-shadow 0.3s ease",
      }}
    >
      {/* Premium Glowing Icon Container */}
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: "14px",
          background: "rgba(249, 115, 22, 0.08)",
          border: "1px solid rgba(249, 115, 22, 0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: ORANGE,
          marginBottom: 20,
          boxShadow: "0 0 16px rgba(249, 115, 22, 0.06)",
        }}
      >
        {icon}
      </div>

      {/* Large Impactful Stat Number */}
      <div
        style={{
          fontFamily: "Outfit, sans-serif",
          fontWeight: 800,
          fontSize: "clamp(34px, 4vw, 44px)",
          color: ORANGE,
          lineHeight: 1.1,
          marginBottom: 8,
          textShadow: "0 0 24px rgba(249, 115, 22, 0.15)",
        }}
      >
        {count}
        {suffix}
      </div>

      {/* Centered Metric Label */}
      <div
        style={{
          fontFamily: "Open Sans, sans-serif",
          fontSize: 14,
          color: "var(--text-secondary)",
          fontWeight: 600,
          letterSpacing: "0.3px",
          lineHeight: 1.4,
          maxWidth: "180px",
        }}
      >
        {label}
      </div>
    </motion.div>
  );
}

export default function StatsBar() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [triggerCount, setTriggerCount] = useState(false);
  const t = useTranslation();

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      // Staggered reveal layout
      gsap.fromTo(
        el.querySelectorAll(".stat-card"),
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.15,
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            once: true,
            onEnter: () => setTriggerCount(true),
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, []);

  const stats = [
    { value: 10, suffix: "+", label: t.stats.experience, icon: <Award size={22} /> },
    { value: 500, suffix: "+", label: t.stats.clients, icon: <Users size={22} /> },
    { value: 50, suffix: "+", label: t.stats.experts, icon: <ShieldCheck size={22} /> },
    { value: 24, suffix: "/7", label: t.stats.support, icon: <Clock size={22} /> },
  ];

  return (
    <div
      ref={containerRef}
      className="statsbar"
      style={{
        background: "var(--background)",
        borderBottom: "1px solid var(--border)",
        padding: "64px 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        className="statsbar-grid"
        style={{
          width: "90%",
          maxWidth: 1400,
          margin: "0 auto",
          position: "relative",
          zIndex: 1,
        }}
      >
        {stats.map((s, i) => (
          <StatItem
            key={i}
            value={s.value}
            suffix={s.suffix}
            label={s.label}
            icon={s.icon}
            trigger={triggerCount}
          />
        ))}
      </div>
    </div>
  );
}