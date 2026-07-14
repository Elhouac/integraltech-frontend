import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { DARK, NAVY, ORANGE } from "../../constants";

// Static client logos (text-based badges — no external images needed)
const clients = [
  { name: "Maroc Telecom", sector: "Télécoms" },
  { name: "Attijariwafa Bank", sector: "Finance" },
  { name: "OCP Group", sector: "Industrie" },
  { name: "Lydec", sector: "Services publics" },
  { name: "BMCE Bank", sector: "Finance" },
  { name: "Centrale Danone", sector: "Agroalimentaire" },
  { name: "Inwi", sector: "Télécoms" },
  { name: "CIH Bank", sector: "Finance" },
  { name: "Samir", sector: "Énergie" },
  { name: "Managem", sector: "Mines" },
  { name: "Al Barid Bank", sector: "Finance" },
  { name: "ONCF", sector: "Transport" },
];

// Duplicate for infinite loop
const TRACK = [...clients, ...clients];

export default function TrustedBy() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      // ─── Section reveal ───
      gsap.from([badgeRef.current, titleRef.current], {
        opacity: 0,
        y: 30,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.15,
        scrollTrigger: { trigger: section, start: "top 80%", once: true },
      });

      if (prefersReduced) return;

      // ─── Infinite horizontal scroll ───
      const totalWidth = track.scrollWidth / 2; // half = one set of logos

      const scrollTween = gsap.to(track, {
        x: -totalWidth,
        duration: 28,
        ease: "none",
        repeat: -1,
        modifiers: {
          x: gsap.utils.unitize((x) => parseFloat(x) % totalWidth),
        },
      });

      // Pause on hover
      const pause = () => scrollTween.pause();
      const resume = () => scrollTween.play();
      track.addEventListener("mouseenter", pause);
      track.addEventListener("mouseleave", resume);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label="Ils nous font confiance"
      style={{ background: "var(--background)", padding: "72px 0 64px", overflow: "hidden" }}
      className="trustedby-section"
    >
      <div style={{ textAlign: "center", marginBottom: 48, padding: "0 80px" }}>
        <div
          ref={badgeRef}
          style={{ color: ORANGE, fontWeight: 700, fontSize: 13, letterSpacing: 3, textTransform: "uppercase", marginBottom: 12, fontFamily: "Open Sans, sans-serif" }}
        >
          ILS NOUS FONT CONFIANCE
        </div>
        <h2
          ref={titleRef}
          style={{ fontFamily: "Outfit, sans-serif", fontWeight: 800, fontSize: 36, color: "var(--text)", margin: 0 }}
        >
          Plus de 500 entreprises nous font confiance
        </h2>
      </div>

      {/* Scrolling track */}
      <div style={{ overflow: "hidden", position: "relative" }}>
        {/* Left / right gradient fades */}
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 120, background: "linear-gradient(to right, var(--background), transparent)", zIndex: 2, pointerEvents: "none" }} />
        <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 120, background: "linear-gradient(to left, var(--background), transparent)", zIndex: 2, pointerEvents: "none" }} />

        <div
          ref={trackRef}
          style={{ display: "flex", gap: 24, width: "max-content", paddingBottom: 4 }}
        >
          {TRACK.map((c, i) => (
            <div
              key={i}
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 12,
                padding: "20px 28px",
                minWidth: 180,
                textAlign: "center",
                flexShrink: 0,
                backdropFilter: "blur(4px)",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <div style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: 15, color: "var(--text)", marginBottom: 4 }}>
                {c.name}
              </div>
              <div style={{ fontFamily: "Open Sans, sans-serif", fontSize: 11, color: ORANGE, textTransform: "uppercase", letterSpacing: 1 }}>
                {c.sector}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
