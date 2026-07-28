import { useLayoutEffect, useRef, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SEO from "../components/seo/SEO";
import { ArrowRight, ExternalLink } from "lucide-react";
import { NAVY, ORANGE, CARD_BG } from "../constants";
import { usePageTransitionEffect } from "../hooks/usePageTransitionEffect";
import { useTranslation } from "../context/LanguageContext";
import { integratedSolutions } from "../data/integratedSolutionsData";
import type { IntegratedSolution } from "../data/integratedSolutionsData";

gsap.registerPlugin(ScrollTrigger);

// ── Logo with fallback ────────────────────────────────────

function SolutionLogo({ solution }: { solution: IntegratedSolution }) {
  const [hasError, setHasError] = useState(false);
  const FallbackIcon = solution.icon;

  const handleError = useCallback(() => {
    setHasError(true);
  }, []);

  if (hasError) {
    return (
      <div
        className="integrated-solution-logo-fallback"
        role="img"
        aria-label={`Logo ${solution.officialName}`}
      >
        <FallbackIcon size={36} strokeWidth={1.4} aria-hidden="true" />
        <span>{solution.shortName}</span>
      </div>
    );
  }

  return (
    <img
      src={solution.logo}
      alt={`Logo ${solution.officialName}`}
      loading="lazy"
      onError={handleError}
      className="integrated-solution-logo-img"
    />
  );
}

// ── Solution card ─────────────────────────────────────────

function IntegratedSolutionCard({
  solution,
  ctaLabel,
}: {
  solution: IntegratedSolution;
  ctaLabel: string;
}) {
  const t = useTranslation();
  const desc = (t.solutionsPage as Record<string, string>)[solution.descKey] || "";

  return (
    <article
      className="integrated-solution-card"
      id={solution.id}
      aria-labelledby={`${solution.id}-title`}
    >
      {/* Logo container */}
      <div className="integrated-solution-logo">
        <SolutionLogo solution={solution} />
      </div>

      {/* Content */}
      <div className="integrated-solution-content">
        <h3
          id={`${solution.id}-title`}
          className="integrated-solution-name"
        >
          {solution.officialName}
        </h3>
        <p className="integrated-solution-desc">{desc}</p>
      </div>

      {/* CTA */}
      <div className="integrated-solution-cta-wrap">
        <a
          href={solution.detailUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="integrated-solution-cta"
        >
          {ctaLabel}
          <ExternalLink size={14} aria-hidden="true" />
        </a>
      </div>
    </article>
  );
}

// ── Solutions Page ────────────────────────────────────────

export default function SolutionsPage() {
  const t = useTranslation();
  usePageTransitionEffect();
  const heroRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // Hero animation
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

  // Grid stagger animation
  useLayoutEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const cards = Array.from(el.querySelectorAll<HTMLElement>(".integrated-solution-card"));
    if (cards.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cards,
        { opacity: 0, y: 32 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
            once: true,
          },
        },
      );
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
        className="solutions-hero"
        style={{
          background: `linear-gradient(135deg, ${NAVY} 0%, #0f1b3d 50%, #1a2a5e 100%)`,
          color: "#fff", padding: "120px 0 96px", textAlign: "center",
          position: "relative", overflow: "hidden",
        }}
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

          {/* Anchor nav chips */}
          <div data-hero style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
            {integratedSolutions.map((s) => (
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
                {s.shortName}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ── Solutions Grid ── */}
      <div style={{ background: CARD_BG, padding: "80px 0 96px" }} className="solutions-body">
        <div style={{ width: "90%", maxWidth: 1200, margin: "0 auto" }}>
          <div
            ref={gridRef}
            className="integrated-solutions-grid"
          >
            {integratedSolutions.map((s) => (
              <IntegratedSolutionCard
                key={s.id}
                solution={s}
                ctaLabel={t.solutionsPage.ctaLabel}
              />
            ))}
          </div>
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
