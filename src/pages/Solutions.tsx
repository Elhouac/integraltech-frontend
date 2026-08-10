import { useLayoutEffect, useRef, useState, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SEO from "../components/seo/SEO";
import { ArrowRight, ExternalLink, Loader2 } from "lucide-react";
import { NAVY, ORANGE, CARD_BG } from "../constants";
import { usePageTransitionEffect } from "../hooks/usePageTransitionEffect";
import { useLanguage, useTranslation } from "../context/LanguageContext";
import { integratedSolutions } from "../data/integratedSolutionsData";
import type { IntegratedSolution } from "../data/integratedSolutionsData";
import { publicApi, SolutionDto } from "../api/publicApi";

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
  customDesc,
}: {
  solution: IntegratedSolution;
  ctaLabel: string;
  customDesc?: string;
}) {
  const t = useTranslation();
  const desc = customDesc || (t.solutionsPage as Record<string, string>)[solution.descKey] || "";

  return (
    <Link
      className="integrated-solution-card"
      id={solution.id}
      to={solution.route}
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
        <span className="integrated-solution-cta">
          {ctaLabel}
          <ExternalLink
            className="integrated-solution-cta-icon"
            size={14}
            aria-hidden="true"
          />
        </span>
      </div>
    </Link>
  );
}

// ── Solutions Page ────────────────────────────────────────

export default function SolutionsPage() {
  const t = useTranslation();
  const { language } = useLanguage();
  usePageTransitionEffect();
  const heroRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState(true);
  const [apiSolutions, setApiSolutions] = useState<SolutionDto[]>([]);

  useEffect(() => {
    let active = true;
    publicApi.fetchSolutions()
      .then((res) => {
        if (active && res.data) {
          setApiSolutions(res.data);
        }
      })
      .catch(() => {
        // Fallback gracefully on network error
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  // Merge API data with official solutions
  const mergedSolutions: { solution: IntegratedSolution; customDesc?: string }[] = integratedSolutions.map((item) => {
    const match = apiSolutions.find((apiItem) => apiItem.slug === item.id || apiItem.slug.includes(item.id));
    let customDesc: string | undefined = undefined;
    if (match) {
      customDesc = match.shortDescription?.[language] || match.shortDescription?.fr;
    }
    return { solution: item, customDesc };
  });

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

    const cards = Array.from(el.querySelectorAll<HTMLElement>(".integrated-solution-entry"));
    if (cards.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cards,
        { autoAlpha: 0, y: 22, scale: 0.985 },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.55,
          stagger: 0.075,
          ease: "power3.out",
          clearProps: "opacity,visibility,transform",
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
            once: true,
          },
        },
      );
    }, el);

    return () => ctx.revert();
  }, [loading]);

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
                  e.currentTarget.style.background = "rgba(249, 115, 22, 0.1)";
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

      {/* ── Main Grid Section ── */}
      <section className="integrated-solutions-section">
        <div className="integrated-solutions-container">
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <h2 className="integrated-solutions-grid-title">
              {t.solutionsPage.gridTitle}
            </h2>
            <p className="integrated-solutions-grid-desc">
              {t.solutionsPage.gridDesc}
            </p>
          </div>

          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "60px 0", gap: 12 }}>
              <Loader2 size={24} className="animate-spin" color={ORANGE} />
              <span style={{ fontFamily: "Open Sans, sans-serif" }}>Chargement des solutions...</span>
            </div>
          ) : (
            <div ref={gridRef} className="integrated-solutions-grid">
              {mergedSolutions.map(({ solution, customDesc }) => (
                <div className="integrated-solution-entry" key={solution.id}>
                  <IntegratedSolutionCard
                    solution={solution}
                    ctaLabel={t.solutionsPage.discoverBtn}
                    customDesc={customDesc}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section
        style={{
          background: `linear-gradient(135deg, ${NAVY} 0%, #0f1b3d 100%)`,
          padding: "96px 0", textAlign: "center", position: "relative",
          overflow: "hidden",
        }}
      >
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
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  );
}
