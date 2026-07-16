import { useRef, useState, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { statsData } from "../../data/homeData";
import StatsCard from "../ui/StatsCard";
import { useTranslation } from "../../context/LanguageContext";

gsap.registerPlugin(ScrollTrigger);

// i18n lookup (fully replaced in Batch 6)

export default function StatsBar() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [triggerCount, setTriggerCount] = useState(false);
  const t = useTranslation();

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
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

  return (
    <div
      ref={containerRef}
      className="statsbar"
      style={{
        background: "var(--surface)",
        borderTop: "1px solid var(--border)",
        borderBottom: "1px solid var(--border)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div className="statsbar-grid">
        {statsData.map((s) => (
          <StatsCard
            key={s.labelKey}
            value={s.value}
            suffix={s.suffix}
            label={t.stats[s.labelKey as keyof typeof t.stats] ?? s.labelKey}
            icon={s.icon}
            trigger={triggerCount}
          />
        ))}
      </div>
    </div>
  );
}
