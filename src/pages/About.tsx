import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "react-router-dom";
import SEO from "../components/seo/SEO";
import {
  Trophy, Lightbulb, ShieldCheck, TrendingUp,
  Users, Clock, Award, Globe,
  CheckCircle, Cpu, Database, Wifi,
  ArrowRight
} from "lucide-react";
import { DARK, LIGHT_GRAY, NAVY, ORANGE, BODY_TEXT, BORDER, CARD_BG } from "../constants";
import { usePageTransitionEffect } from "../hooks/usePageTransitionEffect";
import { useTranslation } from "../context/LanguageContext";

gsap.registerPlugin(ScrollTrigger);

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function ensureVisible(elements: HTMLElement[]) {
  elements.forEach((element) => {
    element.style.opacity = "1";
    element.style.transform = "none";
    element.style.removeProperty("translate");
    element.style.removeProperty("rotate");
    element.style.removeProperty("scale");
  });
}

function useGsapReveal(ref: React.RefObject<HTMLElement | null>, start = "top 80%") {
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const targets = Array.from(el.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (targets.length === 0) return;

    const completeReveal = () => ensureVisible(targets);
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      completeReveal();
      return;
    }

    let ctx: gsap.Context | undefined;
    try {
      ctx = gsap.context(() => {
        gsap.fromTo(
          targets,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.12,
            immediateRender: false,
            onComplete: completeReveal,
            onInterrupt: completeReveal,
            scrollTrigger: {
              trigger: el,
              start,
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
          },
        );
      }, el);
    } catch {
      completeReveal();
    }

    return () => {
      ctx?.revert();
      completeReveal();
    };
  }, [ref, start]);
}

// ─── SECTION HERO ─────────────────────────────────────────────────────────────
function AboutHero() {
  const t = useTranslation();
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const targets = Array.from(el.querySelectorAll<HTMLElement>("[data-hero]"));
    if (targets.length === 0) return;

    const completeReveal = () => ensureVisible(targets);
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      completeReveal();
      return;
    }

    let ctx: gsap.Context | undefined;
    try {
      ctx = gsap.context(() => {
        gsap.fromTo(
          targets,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
            stagger: 0.15,
            immediateRender: false,
            onComplete: completeReveal,
            onInterrupt: completeReveal,
          },
        );
      }, el);
    } catch {
      completeReveal();
    }

    return () => {
      ctx?.revert();
      completeReveal();
    };
  }, []);

  return (
    <section
      ref={ref}
      style={{
        background: `linear-gradient(135deg, ${NAVY} 0%, #0f1b3d 50%, #1a2a5e 100%)`,
        color: "#fff",
        padding: "120px 0 96px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}
      className="about-hero-section"
    >
      {/* Radial glow */}
      <div style={{
        position: "absolute", top: "20%", left: "50%", transform: "translate(-50%, -50%)",
        width: 800, height: 400, borderRadius: "50%",
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
          {t.about.badge}
        </div>

        <h1 data-hero style={{
          fontFamily: "Outfit, sans-serif", fontWeight: 800,
          fontSize: "clamp(32px, 5vw, 48px)", lineHeight: 1.15,
          marginBottom: 20, maxWidth: 720, margin: "0 auto 20px",
          letterSpacing: "-0.5px",
        }}>
          {t.about.title}
        </h1>

        <p data-hero style={{
          fontFamily: "Open Sans, sans-serif", color: "rgba(255,255,255,0.7)",
          fontSize: 17, lineHeight: 1.8, maxWidth: 640, margin: "0 auto 40px",
        }}>
          {t.about.heroDesc}
        </p>

        <Link
          data-hero
          to="/contact"
          style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            background: ORANGE, color: "#fff",
            fontFamily: "Outfit, sans-serif", fontWeight: 600, fontSize: 15,
            padding: "16px 32px", borderRadius: 12, textDecoration: "none",
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
          {t.about.contactBtn}
          <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}

// ─── SECTION HISTOIRE ─────────────────────────────────────────────────────────
function AboutHistory() {
  const t = useTranslation();
  const ref = useRef<HTMLElement>(null);
  useGsapReveal(ref);

  const timeline = [
    { year: "2014", title: t.about.timeline.foundingTitle, desc: t.about.timeline.foundingDesc },
    { year: "2017", title: t.about.timeline.expansionTitle, desc: t.about.timeline.expansionDesc },
    { year: "2020", title: t.about.timeline.leadershipTitle, desc: t.about.timeline.leadershipDesc },
    { year: "2024", title: t.about.timeline.innovationTitle, desc: t.about.timeline.innovationDesc },
  ];

  return (
    <section ref={ref} style={{ background: CARD_BG, padding: "100px 0" }} className="about-history-section">
      <div style={{ width: "90%", maxWidth: 1200, margin: "0 auto", display: "flex", gap: 80, alignItems: "flex-start", flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 400px", minWidth: 320 }}>
          <div data-reveal style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: `${ORANGE}0D`, border: `1px solid ${ORANGE}1A`,
            padding: "6px 14px", borderRadius: "99px",
            color: ORANGE, fontWeight: 600, fontSize: 12, fontFamily: "Outfit, sans-serif",
            textTransform: "uppercase", letterSpacing: "1px", marginBottom: 16,
          }}>
            {t.about.historyBadge}
          </div>
          <h2 data-reveal style={{
            fontFamily: "Outfit, sans-serif", fontWeight: 800,
            fontSize: "clamp(26px, 3.5vw, 38px)", color: DARK,
            marginBottom: 24, lineHeight: 1.2, letterSpacing: "-0.5px", margin: "0 0 24px",
          }}>
            {t.about.historyTitle}
          </h2>
          <p data-reveal style={{ fontFamily: "Open Sans, sans-serif", color: BODY_TEXT, fontSize: 16, lineHeight: 1.8, marginBottom: 16 }}>
            {t.about.historyP1}
          </p>
          <p data-reveal style={{ fontFamily: "Open Sans, sans-serif", color: BODY_TEXT, fontSize: 16, lineHeight: 1.8, marginBottom: 16 }}>
            {t.about.historyP2}
          </p>
          <p data-reveal style={{ fontFamily: "Open Sans, sans-serif", color: BODY_TEXT, fontSize: 16, lineHeight: 1.8 }}>
            {t.about.historyP3}
          </p>
        </div>

        {/* Timeline */}
        <div style={{ flex: "1 1 340px", minWidth: 300 }}>
          {timeline.map((item, i) => (
            <div
              key={i}
              data-reveal
              style={{
                display: "flex", gap: 20,
                marginBottom: i < timeline.length - 1 ? 24 : 0,
                alignItems: "flex-start",
              }}
            >
              <div style={{
                minWidth: 56, height: 56, borderRadius: "14px",
                background: `linear-gradient(135deg, ${NAVY}, ${ORANGE})`,
                color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "Outfit, sans-serif", fontWeight: 800, fontSize: 13, flexShrink: 0,
                boxShadow: "0 4px 12px rgba(30,58,138,0.2)",
              }}>
                {item.year}
              </div>
              <div>
                <div style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: 17, color: DARK, marginBottom: 4 }}>{item.title}</div>
                <div style={{ fontFamily: "Open Sans, sans-serif", color: BODY_TEXT, fontSize: 14, lineHeight: 1.7 }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── SECTION STATS ─────────────────────────────────────────────────────────────
function AboutStats() {
  const t = useTranslation();
  const ref = useRef<HTMLElement>(null);

  const stats = [
    { value: "500+", label: t.stats.satisfaction, Icon: Users },
    { value: "10+",  label: t.stats.experience, Icon: Clock },
    { value: "50+",  label: t.stats.experts,   Icon: Award },
    { value: "24/7", label: t.stats.support,   Icon: Globe },
  ];

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      gsap.from(el.querySelectorAll<HTMLElement>("[data-stat]"), {
        opacity: 0,
        y: 30,
        scale: 0.9,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: { trigger: el, start: "top 80%", once: true },
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} style={{
      background: `linear-gradient(135deg, ${NAVY} 0%, #0f1b3d 100%)`,
      padding: "72px 0",
    }} className="about-stats-section">
      <div style={{
        width: "90%", maxWidth: 1200, margin: "0 auto",
        display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24, textAlign: "center",
      }} className="about-stats-grid">
        {stats.map((s) => (
          <div key={s.label} data-stat style={{
            padding: "32px 20px", borderRadius: 16,
            background: "rgba(255,255,255,0.06)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}>
            <s.Icon size={28} color={ORANGE} style={{ marginBottom: 14 }} />
            <div style={{ fontFamily: "Outfit, sans-serif", fontWeight: 800, fontSize: 32, color: "#fff", marginBottom: 6 }}>{s.value}</div>
            <div style={{ fontFamily: "Open Sans, sans-serif", color: "rgba(255,255,255,0.65)", fontSize: 14 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── SECTION MISSION / VISION ─────────────────────────────────────────────────
function AboutMissionVision() {
  const t = useTranslation();
  const ref = useRef<HTMLElement>(null);
  useGsapReveal(ref);

  const mvItems = [
    {
      label: t.about.missionVision.missionLabel, color: ORANGE,
      title: t.about.missionVision.missionTitle,
      desc: t.about.missionVision.missionDesc,
    },
    {
      label: t.about.missionVision.visionLabel, color: NAVY,
      title: t.about.missionVision.visionTitle,
      desc: t.about.missionVision.visionDesc,
    },
  ];

  return (
    <section ref={ref} style={{ background: LIGHT_GRAY, padding: "100px 0" }} className="about-mv-section">
      <div style={{ width: "90%", maxWidth: 1200, margin: "0 auto" }}>
        <div data-reveal style={{ textAlign: "center", marginBottom: 64 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: `${NAVY}0D`, border: `1px solid ${NAVY}1A`,
            padding: "6px 14px", borderRadius: "99px",
            color: NAVY, fontWeight: 600, fontSize: 12, fontFamily: "Outfit, sans-serif",
            textTransform: "uppercase", letterSpacing: "1px", marginBottom: 16,
          }}>
            {t.about.missionVision.badge}
          </div>
          <h2 style={{
            fontFamily: "Outfit, sans-serif", fontWeight: 800,
            fontSize: "clamp(28px, 4vw, 38px)", color: DARK,
            margin: 0, letterSpacing: "-0.5px",
          }}>
            {t.about.missionVision.title}
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }} className="about-mv-grid">
          {mvItems.map((item) => (
            <div
              key={item.label}
              data-reveal
              style={{
                background: CARD_BG, borderRadius: 18, padding: "44px 36px",
                borderTop: `4px solid ${item.color}`,
                boxShadow: "0 4px 20px rgba(15,23,42,0.06)",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 12px 28px rgba(15,23,42,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow = "0 4px 20px rgba(15,23,42,0.06)";
              }}
            >
              <div style={{
                color: item.color, fontWeight: 700, fontSize: 12, letterSpacing: 2,
                textTransform: "uppercase", marginBottom: 14, fontFamily: "Outfit, sans-serif",
              }}>
                {item.label}
              </div>
              <h3 style={{
                fontFamily: "Outfit, sans-serif", fontWeight: 800, fontSize: 22,
                color: DARK, marginBottom: 16, lineHeight: 1.3, margin: "0 0 16px",
              }}>
                {item.title}
              </h3>
              <p style={{ fontFamily: "Open Sans, sans-serif", color: BODY_TEXT, fontSize: 15, lineHeight: 1.8, margin: 0 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── SECTION VALEURS ─────────────────────────────────────────────────────────
function AboutValues() {
  const t = useTranslation();
  const ref = useRef<HTMLElement>(null);
  useGsapReveal(ref);

  const values = [
    { Icon: Trophy,       title: t.about.values.excellence,  desc: t.about.values.excellenceDesc, color: ORANGE },
    { Icon: Lightbulb,   title: t.about.values.innovation,  desc: t.about.values.innovationDesc, color: NAVY },
    { Icon: ShieldCheck, title: t.about.values.security,    desc: t.about.values.securityDesc, color: "#22C55E" },
    { Icon: TrendingUp,  title: t.about.values.growth,      desc: t.about.values.growthDesc, color: "#8B5CF6" },
  ];

  return (
    <section ref={ref} style={{ background: CARD_BG, padding: "100px 0" }} className="about-values-section">
      <div style={{ width: "90%", maxWidth: 1200, margin: "0 auto" }}>
        <div data-reveal style={{ textAlign: "center", marginBottom: 64 }}>
          <div style={{
            color: ORANGE, fontWeight: 700, fontSize: 12, letterSpacing: 2,
            textTransform: "uppercase", marginBottom: 14, fontFamily: "Outfit, sans-serif",
          }}>
            {t.about.values.badge}
          </div>
          <h2 style={{
            fontFamily: "Outfit, sans-serif", fontWeight: 800,
            fontSize: "clamp(28px, 4vw, 38px)", color: DARK,
            margin: 0, letterSpacing: "-0.5px",
          }}>
            {t.about.values.title}
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }} className="about-values-grid">
          {values.map((v) => (
            <div
              key={v.title}
              data-reveal
              style={{
                background: LIGHT_GRAY, borderRadius: 16, padding: "36px 24px",
                textAlign: "center", border: `1px solid ${BORDER}`,
                transition: "transform 0.2s, border-color 0.2s, box-shadow 0.2s",
                cursor: "default",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.borderColor = `${v.color}40`;
                e.currentTarget.style.boxShadow = "0 12px 24px rgba(15,23,42,0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.borderColor = BORDER;
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div style={{
                width: 56, height: 56, borderRadius: "14px",
                background: `${v.color}12`, display: "flex", alignItems: "center",
                justifyContent: "center", margin: "0 auto 20px",
              }}>
                <v.Icon size={26} color={v.color} />
              </div>
              <div style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: 17, color: DARK, marginBottom: 10 }}>{v.title}</div>
              <p style={{ fontFamily: "Open Sans, sans-serif", color: BODY_TEXT, fontSize: 14, lineHeight: 1.7, margin: 0 }}>{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── SECTION CERTIFICATIONS ───────────────────────────────────────────────────
function AboutCertifications() {
  const t = useTranslation();
  const ref = useRef<HTMLElement>(null);
  useGsapReveal(ref);

  const certifications = [
    "Microsoft Gold Partner",
    "Cisco Certified Partner",
    t.about.certifications.isoCertified,
    "Oracle Partner Network",
    "AWS Consulting Partner",
    "VMware Partner",
  ];

  return (
    <section ref={ref} style={{ background: LIGHT_GRAY, padding: "100px 0" }} className="about-cert-section">
      <div style={{ width: "90%", maxWidth: 1200, margin: "0 auto" }}>
        <div data-reveal style={{ textAlign: "center", marginBottom: 56 }}>
          <div style={{
            color: ORANGE, fontWeight: 700, fontSize: 12, letterSpacing: 2,
            textTransform: "uppercase", marginBottom: 14, fontFamily: "Outfit, sans-serif",
          }}>
            {t.about.certifications.badge}
          </div>
          <h2 style={{
            fontFamily: "Outfit, sans-serif", fontWeight: 800,
            fontSize: "clamp(28px, 4vw, 38px)", color: DARK,
            margin: "0 0 16px", letterSpacing: "-0.5px",
          }}>
            {t.about.certifications.title}
          </h2>
          <p style={{ fontFamily: "Open Sans, sans-serif", color: BODY_TEXT, fontSize: 16, maxWidth: 560, margin: "0 auto", lineHeight: 1.7 }}>
            {t.about.certifications.desc}
          </p>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "center" }}>
          {certifications.map((cert) => (
            <div
              key={cert}
              data-reveal
              style={{
                background: CARD_BG, borderRadius: 12, padding: "14px 22px",
                border: `1px solid ${BORDER}`, display: "flex", alignItems: "center", gap: 10,
                transition: "all 0.2s", cursor: "default",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = `${ORANGE}40`;
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(249,115,22,0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = BORDER;
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <CheckCircle size={16} color={ORANGE} />
              <span style={{ fontFamily: "Open Sans, sans-serif", fontWeight: 600, fontSize: 14, color: DARK }}>{cert}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── SECTION TECHNOLOGIES ─────────────────────────────────────────────────────
function AboutTechnologies() {
  const t = useTranslation();
  const ref = useRef<HTMLElement>(null);
  useGsapReveal(ref);

  const technologies = [
    { Icon: Cpu,      label: t.about.technologies.ai },
    { Icon: Database, label: t.about.technologies.cloud },
    { Icon: Wifi,     label: t.about.technologies.infra },
    { Icon: ShieldCheck, label: t.about.technologies.cyber },
  ];

  return (
    <section ref={ref} style={{ background: CARD_BG, padding: "100px 0" }} className="about-tech-section">
      <div style={{ width: "90%", maxWidth: 1200, margin: "0 auto" }}>
        <div data-reveal style={{ textAlign: "center", marginBottom: 56 }}>
          <div style={{
            color: ORANGE, fontWeight: 700, fontSize: 12, letterSpacing: 2,
            textTransform: "uppercase", marginBottom: 14, fontFamily: "Outfit, sans-serif",
          }}>
            {t.about.technologies.badge}
          </div>
          <h2 style={{
            fontFamily: "Outfit, sans-serif", fontWeight: 800,
            fontSize: "clamp(28px, 4vw, 38px)", color: DARK,
            margin: 0, letterSpacing: "-0.5px",
          }}>
            {t.about.technologies.title}
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24, textAlign: "center" }} className="about-tech-grid">
          {technologies.map((tech) => (
            <div
              key={tech.label}
              data-reveal
              style={{
                padding: "36px 20px", borderRadius: 16,
                border: `1px solid ${BORDER}`, background: LIGHT_GRAY,
                transition: "all 0.2s", cursor: "default",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.borderColor = `${ORANGE}40`;
                e.currentTarget.style.boxShadow = "0 8px 20px rgba(15,23,42,0.06)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.borderColor = BORDER;
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div style={{
                width: 56, height: 56, borderRadius: "14px",
                background: `${ORANGE}12`, display: "flex", alignItems: "center",
                justifyContent: "center", margin: "0 auto 16px",
              }}>
                <tech.Icon size={28} color={ORANGE} />
              </div>
              <div style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: 16, color: DARK }}>{tech.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── SECTION CTA ──────────────────────────────────────────────────────────────
function AboutCTA() {
  const t = useTranslation();
  const ref = useRef<HTMLElement>(null);
  useGsapReveal(ref, "top 85%");

  return (
    <section ref={ref} style={{
      background: `linear-gradient(135deg, ${NAVY} 0%, #0f1b3d 100%)`,
      padding: "96px 0", textAlign: "center", position: "relative", overflow: "hidden",
    }} className="about-cta-section">
      <div style={{
        position: "absolute", top: "40%", left: "50%", transform: "translate(-50%, -50%)",
        width: 600, height: 300, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(249,115,22,0.1) 0%, transparent 70%)",
        filter: "blur(50px)", pointerEvents: "none",
      }} />
      <div style={{ width: "90%", maxWidth: 700, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div data-reveal style={{
          color: ORANGE, fontWeight: 700, fontSize: 12, letterSpacing: 2,
          textTransform: "uppercase", marginBottom: 14, fontFamily: "Outfit, sans-serif",
        }}>
          {t.about.cta.badge}
        </div>
        <h2 data-reveal style={{
          fontFamily: "Outfit, sans-serif", fontWeight: 800,
          fontSize: "clamp(28px, 4vw, 40px)", color: "#fff",
          margin: "0 0 18px", letterSpacing: "-0.5px",
        }}>
          {t.about.cta.title}
        </h2>
        <p data-reveal style={{
          fontFamily: "Open Sans, sans-serif", color: "rgba(255,255,255,0.65)",
          fontSize: 16, lineHeight: 1.8, maxWidth: 560, margin: "0 auto 40px",
        }}>
          {t.about.cta.desc}
        </p>
        <Link
          data-reveal
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
          {t.about.cta.btn}
          <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}

// ─── PAGE PRINCIPALE ──────────────────────────────────────────────────────────
export default function AboutPage() {
  const t = useTranslation();
  usePageTransitionEffect();

  return (
    <div id="about">
      <SEO
        title={t.about.seoTitle}
        description={t.about.seoDesc}
        path="/about"
      />
      <AboutHero />
      <AboutHistory />
      <AboutStats />
      <AboutMissionVision />
      <AboutValues />
      <AboutCertifications />
      <AboutTechnologies />
      <AboutCTA />
    </div>
  );
}
