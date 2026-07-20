import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "react-router-dom";
import SEO from "../components/seo/SEO";
import { ShieldCheck, Cloud, Server, Layers, Zap, BarChart3, ArrowRight } from "lucide-react";
import { DARK, LIGHT_GRAY, NAVY, ORANGE, BODY_TEXT, BORDER, CARD_BG } from "../constants";
import { usePageTransitionEffect } from "../hooks/usePageTransitionEffect";
import { useTranslation } from "../context/LanguageContext";

gsap.registerPlugin(ScrollTrigger);

function ensureVisible(elements: HTMLElement[]) {
  elements.forEach((element) => {
    element.style.opacity = "1";
    element.style.transform = "none";
    element.style.removeProperty("translate");
    element.style.removeProperty("rotate");
    element.style.removeProperty("scale");
  });
}

interface SolutionItem {
  id: string;
  Icon: any;
  badge: string;
  title: string;
  desc: string;
  points: readonly string[];
  gradient: string;
  accent: string;
}

function SolutionCard({ s, index }: { s: SolutionItem; index: number }) {
  const t = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  const isEven = index % 2 === 0;

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const visual = el.querySelector<HTMLElement>(".sol-visual");
    const content = el.querySelector<HTMLElement>(".sol-content");
    const points = Array.from(el.querySelectorAll<HTMLElement>(".sol-point"));
    if (!visual || !content) return;

    const targets = [visual, content, ...points];
    const completeReveal = () => ensureVisible(targets);
    const media = gsap.matchMedia();

    try {
      media.add(
        {
          compact: "(max-width: 1024px) and (prefers-reduced-motion: no-preference)",
          desktop: "(min-width: 1025px) and (prefers-reduced-motion: no-preference)",
          reduceMotion: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const conditions = context.conditions as {
            compact: boolean;
            desktop: boolean;
            reduceMotion: boolean;
          };

          if (conditions.reduceMotion) {
            completeReveal();
            return;
          }

          const primaryFrom = conditions.compact
            ? { opacity: 0, x: 0, y: 24 }
            : { opacity: 0, x: isEven ? -50 : 50, y: 0 };
          const pointFrom = conditions.compact
            ? { opacity: 0, x: 0, y: 12 }
            : { opacity: 0, x: -20, y: 0 };

          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: el,
              start: "top 78%",
              once: true,
              onLeave: (self) => {
                self.animation?.progress(1);
                completeReveal();
              },
              onRefresh: (self) => {
                if (self.progress === 1) {
                  self.animation?.progress(1);
                  completeReveal();
                }
              },
            },
            defaults: { ease: "power3.out" },
            onComplete: completeReveal,
            onInterrupt: completeReveal,
          });

          timeline
            .fromTo(visual, primaryFrom, { opacity: 1, x: 0, y: 0, duration: 0.9 })
            .fromTo(content, primaryFrom, { opacity: 1, x: 0, y: 0, duration: 0.9 }, "<0.15")
            .fromTo(points, pointFrom, { opacity: 1, x: 0, y: 0, duration: 0.5, stagger: 0.08 }, "<0.3");
        },
      );
    } catch {
      completeReveal();
    }

    return () => {
      media.revert();
      completeReveal();
    };
  }, [isEven]);

  return (
    <div
      id={s.id}
      ref={ref}
      style={{
        display: "flex",
        flexDirection: isEven ? "row" : "row-reverse",
        gap: 72,
        alignItems: "center",
        marginBottom: 96,
      }}
      className="solution-card-row"
    >
      {/* Visual */}
      <div
        className="sol-visual"
        style={{
          flex: "0 0 420px",
          height: 320,
          borderRadius: 22,
          background: s.gradient,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 24px 56px rgba(0,0,0,0.15)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{
          position: "absolute", inset: 0, opacity: 0.06,
          backgroundImage: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4) 0%, transparent 60%)",
        }} />
        <s.Icon size={72} color={s.accent} strokeWidth={1.2} />
      </div>

      {/* Content */}
      <div className="sol-content" style={{ flex: 1 }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: `${ORANGE}0D`, border: `1px solid ${ORANGE}1A`,
          padding: "5px 14px", borderRadius: "99px",
          color: ORANGE, fontWeight: 600, fontSize: 11, fontFamily: "Outfit, sans-serif",
          textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 16,
        }}>
          {s.badge}
        </div>
        <h2 style={{
          fontFamily: "Outfit, sans-serif", fontWeight: 800,
          fontSize: "clamp(22px, 2.5vw, 30px)", color: DARK,
          lineHeight: 1.25, margin: "0 0 16px", letterSpacing: "-0.3px",
        }}>
          {s.title}
        </h2>
        <p style={{
          fontFamily: "Open Sans, sans-serif", color: BODY_TEXT,
          fontSize: 15, lineHeight: 1.8, margin: "0 0 24px",
        }}>
          {s.desc}
        </p>
        <ul style={{ listStyle: "none", padding: 0, margin: "0 0 28px", display: "flex", flexDirection: "column", gap: 10 }}>
          {s.points.map((pt) => (
            <li key={pt} className="sol-point" style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{
                width: 6, height: 6, borderRadius: "50%", background: ORANGE,
                flexShrink: 0, display: "inline-block",
              }} />
              <span style={{ fontFamily: "Open Sans, sans-serif", color: DARK, fontSize: 14 }}>{pt}</span>
            </li>
          ))}
        </ul>
        <Link
          to="/contact"
          style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: ORANGE, color: "#fff",
            fontFamily: "Outfit, sans-serif", fontWeight: 600, fontSize: 14,
            padding: "13px 26px", borderRadius: 10, textDecoration: "none",
            boxShadow: "0 4px 14px rgba(249,115,22,0.2)",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 6px 18px rgba(249,115,22,0.35)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "none";
            e.currentTarget.style.boxShadow = "0 4px 14px rgba(249,115,22,0.2)";
          }}
        >
          {t.solutionsPage.demoBtn}
          <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  );
}

export default function SolutionsPage() {
  const t = useTranslation();
  usePageTransitionEffect();
  const heroRef = useRef<HTMLDivElement>(null);

  const solutions: SolutionItem[] = [
    {
      id: "cybersecurite",
      Icon: ShieldCheck,
      badge: t.solutionsPage.cybersecurityBadge,
      title: t.solutionsPage.cybersecurityTitle,
      desc: t.solutionsPage.cybersecurityDesc,
      points: t.solutionsPage.cybersecurityPoints,
      gradient: `linear-gradient(135deg, ${NAVY} 0%, #0f1b3d 100%)`,
      accent: ORANGE,
    },
    {
      id: "cloud",
      Icon: Cloud,
      badge: t.solutionsPage.cloudBadge,
      title: t.solutionsPage.cloudTitle,
      desc: t.solutionsPage.cloudDesc,
      points: t.solutionsPage.cloudPoints,
      gradient: `linear-gradient(135deg, #0f2744 0%, #1e3a5f 100%)`,
      accent: "#4FC3F7",
    },
    {
      id: "infrastructure",
      Icon: Server,
      badge: t.solutionsPage.infraBadge,
      title: t.solutionsPage.infraTitle,
      desc: t.solutionsPage.infraDesc,
      points: t.solutionsPage.infraPoints,
      gradient: `linear-gradient(135deg, #0f2744 0%, #223355 100%)`,
      accent: "#81C784",
    },
    {
      id: "erp",
      Icon: Layers,
      badge: t.solutionsPage.erpBadge,
      title: t.solutionsPage.erpTitle,
      desc: t.solutionsPage.erpDesc,
      points: t.solutionsPage.erpPoints,
      gradient: `linear-gradient(135deg, #1a2a3a 0%, #2c3e50 100%)`,
      accent: "#CE93D8",
    },
    {
      id: "transformation",
      Icon: Zap,
      badge: t.solutionsPage.transformBadge,
      title: t.solutionsPage.transformTitle,
      desc: t.solutionsPage.transformDesc,
      points: t.solutionsPage.transformPoints,
      gradient: `linear-gradient(135deg, #0f2744 0%, #1f3456 100%)`,
      accent: "#FFB74D",
    },
    {
      id: "consulting",
      Icon: BarChart3,
      badge: t.solutionsPage.consultingBadge,
      title: t.solutionsPage.consultingTitle,
      desc: t.solutionsPage.consultingDesc,
      points: t.solutionsPage.consultingPoints,
      gradient: `linear-gradient(135deg, #14243b 0%, #1d3050 100%)`,
      accent: "#4DB6AC",
    },
  ];

  useLayoutEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(el.querySelectorAll<HTMLElement>("[data-hero]"), {
        opacity: 0, y: 30, duration: 0.7, stagger: 0.15,
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <div id="solutions">
      <SEO
        title={t.solutionsPage.seoTitle}
        description={t.solutionsPage.seoDesc}
        path="/solutions"
      />
      {/* ── Hero ── */}
      <div
        ref={heroRef}
        style={{
          background: `linear-gradient(135deg, ${NAVY} 0%, #0f1b3d 50%, #1a2a5e 100%)`,
          color: "#fff", padding: "120px 0 96px", textAlign: "center",
          position: "relative", overflow: "hidden",
        }}
        className="solutions-hero"
      >
        <div style={{
          position: "absolute", top: "20%", left: "50%", transform: "translate(-50%, -50%)",
          width: 700, height: 350, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(249,115,22,0.1) 0%, transparent 70%)",
          filter: "blur(60px)", pointerEvents: "none",
        }} />
        <div style={{ width: "90%", maxWidth: 780, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div data-hero style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(249,115,22,0.12)", border: "1px solid rgba(249,115,22,0.2)",
            padding: "6px 16px", borderRadius: "99px",
            color: ORANGE, fontWeight: 600, fontSize: 12, fontFamily: "Outfit, sans-serif",
            textTransform: "uppercase", letterSpacing: "1px", marginBottom: 24,
          }}>
            {t.solutionsPage.badge}
          </div>
          <h1 data-hero style={{
            fontFamily: "Outfit, sans-serif", fontWeight: 800,
            fontSize: "clamp(32px, 5vw, 48px)", lineHeight: 1.15,
            maxWidth: 720, margin: "0 auto 20px", letterSpacing: "-0.5px",
          }}>
            {t.solutionsPage.title}
          </h1>
          <p data-hero style={{
            fontFamily: "Open Sans, sans-serif", color: "rgba(255,255,255,0.7)",
            fontSize: 17, lineHeight: 1.8, maxWidth: 640, margin: "0 auto 40px",
          }}>
            {t.solutionsPage.desc}
          </p>

          {/* Anchor nav */}
          <div data-hero style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
            {solutions.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                style={{
                  padding: "8px 18px", borderRadius: 10,
                  border: "1px solid rgba(255,255,255,0.15)",
                  color: "rgba(255,255,255,0.8)",
                  fontFamily: "Outfit, sans-serif", fontSize: 12, fontWeight: 600,
                  textDecoration: "none", background: "rgba(255,255,255,0.05)",
                  transition: "all 0.2s", letterSpacing: "0.5px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = ORANGE;
                  e.currentTarget.style.color = ORANGE;
                  e.currentTarget.style.background = "rgba(249,115,22,0.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
                  e.currentTarget.style.color = "rgba(255,255,255,0.8)";
                  e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                }}
              >
                {s.badge}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ── Solution cards ── */}
      <div style={{ background: CARD_BG, padding: "100px 0 16px" }} className="solutions-body">
        <div style={{ width: "90%", maxWidth: 1200, margin: "0 auto" }}>
          {solutions.map((s, i) => (
            <SolutionCard key={s.id} s={s} index={i} />
          ))}
        </div>
      </div>

      {/* ── CTA ── */}
      <div style={{
        background: `linear-gradient(135deg, ${NAVY} 0%, #0f1b3d 100%)`,
        padding: "96px 0", textAlign: "center", position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: "40%", left: "50%", transform: "translate(-50%, -50%)",
          width: 500, height: 300, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(249,115,22,0.08) 0%, transparent 70%)",
          filter: "blur(50px)", pointerEvents: "none",
        }} />
        <div style={{ width: "90%", maxWidth: 700, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <h2 style={{
            fontFamily: "Outfit, sans-serif", fontWeight: 800,
            fontSize: "clamp(28px, 4vw, 38px)", color: "#fff",
            margin: "0 0 18px", letterSpacing: "-0.5px",
          }}>
            {t.solutionsPage.ctaTitle}
          </h2>
          <p style={{
            fontFamily: "Open Sans, sans-serif", color: "rgba(255,255,255,0.65)",
            fontSize: 16, lineHeight: 1.7, margin: "0 auto 40px", maxWidth: 560,
          }}>
            {t.solutionsPage.ctaDesc}
          </p>
          <Link
            to="/contact"
            style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              background: ORANGE, color: "#fff",
              fontFamily: "Outfit, sans-serif", fontWeight: 600, fontSize: 15,
              padding: "16px 36px", borderRadius: 12, textDecoration: "none",
              boxShadow: "0 4px 16px rgba(249,115,22,0.3)",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(249,115,22,0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = "0 4px 16px rgba(249,115,22,0.3)";
            }}
          >
            {t.solutionsPage.ctaBtn}
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
