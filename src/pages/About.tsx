import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "react-router-dom";
import {
  Trophy, Lightbulb, ShieldCheck, TrendingUp,
  Users, Clock, Award, Globe,
  CheckCircle, Cpu, Database, Wifi,
  ArrowRight
} from "lucide-react";
import { DARK, LIGHT_GRAY, NAVY, ORANGE, BODY_TEXT, BORDER, CARD_BG } from "../constants";
import { usePageTransitionEffect } from "../hooks/usePageTransitionEffect";

gsap.registerPlugin(ScrollTrigger);

// ─── DATA ────────────────────────────────────────────────────────────────────
const values = [
  { Icon: Trophy,       title: "Excellence",  desc: "Certifications internationales et standards de qualité élevés.", color: ORANGE },
  { Icon: Lightbulb,   title: "Innovation",  desc: "Technologies de pointe et veille technologique permanente.", color: NAVY },
  { Icon: ShieldCheck, title: "Sécurité",    desc: "Protection maximale de vos données et systèmes d'information.", color: "#22C55E" },
  { Icon: TrendingUp,  title: "Croissance",  desc: "Solutions évolutives qui grandissent avec votre entreprise.", color: "#8B5CF6" },
];

const stats = [
  { value: "500+", label: "Clients satisfaits", Icon: Users },
  { value: "10+",  label: "Années d'expérience", Icon: Clock },
  { value: "50+",  label: "Experts certifiés",   Icon: Award },
  { value: "24/7", label: "Support technique",   Icon: Globe },
];

const certifications = [
  "Microsoft Gold Partner",
  "Cisco Certified Partner",
  "ISO 27001 Certifié",
  "Oracle Partner Network",
  "AWS Consulting Partner",
  "VMware Partner",
];

const technologies = [
  { Icon: Cpu,      label: "Intelligence Artificielle" },
  { Icon: Database, label: "Cloud & Big Data" },
  { Icon: Wifi,     label: "Infrastructure IT" },
  { Icon: ShieldCheck, label: "Cybersécurité" },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function useGsapReveal(ref: React.RefObject<HTMLElement | null>, start = "top 80%") {
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      gsap.from(el.querySelectorAll<HTMLElement>("[data-reveal]"), {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: { trigger: el, start, once: true },
      });
    }, el);

    return () => ctx.revert();
  }, [ref, start]);
}

// ─── SECTION HERO ─────────────────────────────────────────────────────────────
function AboutHero() {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
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
          À PROPOS DE NOUS
        </div>

        <h1 data-hero style={{
          fontFamily: "Outfit, sans-serif", fontWeight: 800,
          fontSize: "clamp(32px, 5vw, 48px)", lineHeight: 1.15,
          marginBottom: 20, maxWidth: 720, margin: "0 auto 20px",
          letterSpacing: "-0.5px",
        }}>
          Votre Partenaire Digital De Confiance
        </h1>

        <p data-hero style={{
          fontFamily: "Open Sans, sans-serif", color: "rgba(255,255,255,0.7)",
          fontSize: 17, lineHeight: 1.8, maxWidth: 640, margin: "0 auto 40px",
        }}>
          Depuis plus de 10 ans, IntegralTech accompagne les entreprises marocaines dans leur transformation numérique avec expertise, fiabilité et innovation.
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
          Nous contacter
          <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}

// ─── SECTION HISTOIRE ─────────────────────────────────────────────────────────
function AboutHistory() {
  const ref = useRef<HTMLElement>(null);
  useGsapReveal(ref);

  const timeline = [
    { year: "2014", title: "Fondation", desc: "Création d'IntegralTech à Casablanca avec une équipe de 5 experts." },
    { year: "2017", title: "Expansion", desc: "Ouverture de nouvelles agences et obtention des premières certifications internationales." },
    { year: "2020", title: "Leadership", desc: "Devenu l'un des principaux partenaires IT du Maroc avec +200 clients." },
    { year: "2024", title: "Innovation", desc: "Lancement de notre pôle IA et cloud avec +500 clients satisfaits." },
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
            NOTRE HISTOIRE
          </div>
          <h2 data-reveal style={{
            fontFamily: "Outfit, sans-serif", fontWeight: 800,
            fontSize: "clamp(26px, 3.5vw, 38px)", color: DARK,
            marginBottom: 24, lineHeight: 1.2, letterSpacing: "-0.5px", margin: "0 0 24px",
          }}>
            Plus de 10 ans d'innovation au service des entreprises
          </h2>
          <p data-reveal style={{ fontFamily: "Open Sans, sans-serif", color: BODY_TEXT, fontSize: 16, lineHeight: 1.8, marginBottom: 16 }}>
            Fondée en 2014 à Casablanca, <strong style={{ color: DARK }}>Integral Progress Technology</strong> est née d'une vision claire : démocratiser l'accès aux technologies IT de pointe pour les entreprises marocaines, quelle que soit leur taille.
          </p>
          <p data-reveal style={{ fontFamily: "Open Sans, sans-serif", color: BODY_TEXT, fontSize: 16, lineHeight: 1.8, marginBottom: 16 }}>
            Au fil des années, nous avons bâti une équipe d'experts certifiés et développé des partenariats stratégiques avec les leaders mondiaux de la technologie.
          </p>
          <p data-reveal style={{ fontFamily: "Open Sans, sans-serif", color: BODY_TEXT, fontSize: 16, lineHeight: 1.8 }}>
            Aujourd'hui, plus de 500 entreprises nous font confiance pour sécuriser, optimiser et moderniser leur système d'information.
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
  const ref = useRef<HTMLElement>(null);

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
  const ref = useRef<HTMLElement>(null);
  useGsapReveal(ref);

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
            NOS FONDEMENTS
          </div>
          <h2 style={{
            fontFamily: "Outfit, sans-serif", fontWeight: 800,
            fontSize: "clamp(28px, 4vw, 38px)", color: DARK,
            margin: 0, letterSpacing: "-0.5px",
          }}>
            Mission & Vision
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }} className="about-mv-grid">
          {[
            {
              label: "Notre Mission", color: ORANGE,
              title: "Accélérer votre transformation digitale",
              desc: "Notre mission est d'accompagner chaque entreprise marocaine dans sa transformation numérique en lui fournissant des solutions IT sur mesure, fiables et sécurisées. Nous agissons comme un véritable partenaire technologique, engagé dans la réussite de nos clients sur le long terme.",
            },
            {
              label: "Notre Vision", color: NAVY,
              title: "Être le leader IT de référence en Afrique",
              desc: "Nous aspirons à devenir la référence incontournable de l'intégration de solutions IT en Afrique du Nord. En alliant expertise humaine et technologies d'avant-garde, nous construisons une économie numérique plus compétitive, résiliente et innovante pour les entreprises africaines.",
            },
          ].map((item) => (
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
  const ref = useRef<HTMLElement>(null);
  useGsapReveal(ref);

  return (
    <section ref={ref} style={{ background: CARD_BG, padding: "100px 0" }} className="about-values-section">
      <div style={{ width: "90%", maxWidth: 1200, margin: "0 auto" }}>
        <div data-reveal style={{ textAlign: "center", marginBottom: 64 }}>
          <div style={{
            color: ORANGE, fontWeight: 700, fontSize: 12, letterSpacing: 2,
            textTransform: "uppercase", marginBottom: 14, fontFamily: "Outfit, sans-serif",
          }}>
            NOS VALEURS
          </div>
          <h2 style={{
            fontFamily: "Outfit, sans-serif", fontWeight: 800,
            fontSize: "clamp(28px, 4vw, 38px)", color: DARK,
            margin: 0, letterSpacing: "-0.5px",
          }}>
            Ce qui nous guide au quotidien
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
  const ref = useRef<HTMLElement>(null);
  useGsapReveal(ref);

  return (
    <section ref={ref} style={{ background: LIGHT_GRAY, padding: "100px 0" }} className="about-cert-section">
      <div style={{ width: "90%", maxWidth: 1200, margin: "0 auto" }}>
        <div data-reveal style={{ textAlign: "center", marginBottom: 56 }}>
          <div style={{
            color: ORANGE, fontWeight: 700, fontSize: 12, letterSpacing: 2,
            textTransform: "uppercase", marginBottom: 14, fontFamily: "Outfit, sans-serif",
          }}>
            CERTIFICATIONS & PARTENAIRES
          </div>
          <h2 style={{
            fontFamily: "Outfit, sans-serif", fontWeight: 800,
            fontSize: "clamp(28px, 4vw, 38px)", color: DARK,
            margin: "0 0 16px", letterSpacing: "-0.5px",
          }}>
            Des partenariats stratégiques
          </h2>
          <p style={{ fontFamily: "Open Sans, sans-serif", color: BODY_TEXT, fontSize: 16, maxWidth: 560, margin: "0 auto", lineHeight: 1.7 }}>
            Nous collaborons avec les leaders mondiaux de la technologie pour vous offrir les meilleures solutions du marché.
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
  const ref = useRef<HTMLElement>(null);
  useGsapReveal(ref);

  return (
    <section ref={ref} style={{ background: CARD_BG, padding: "100px 0" }} className="about-tech-section">
      <div style={{ width: "90%", maxWidth: 1200, margin: "0 auto" }}>
        <div data-reveal style={{ textAlign: "center", marginBottom: 56 }}>
          <div style={{
            color: ORANGE, fontWeight: 700, fontSize: 12, letterSpacing: 2,
            textTransform: "uppercase", marginBottom: 14, fontFamily: "Outfit, sans-serif",
          }}>
            NOS TECHNOLOGIES
          </div>
          <h2 style={{
            fontFamily: "Outfit, sans-serif", fontWeight: 800,
            fontSize: "clamp(28px, 4vw, 38px)", color: DARK,
            margin: 0, letterSpacing: "-0.5px",
          }}>
            Des outils à la pointe
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24, textAlign: "center" }} className="about-tech-grid">
          {technologies.map((t) => (
            <div
              key={t.label}
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
                <t.Icon size={28} color={ORANGE} />
              </div>
              <div style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: 16, color: DARK }}>{t.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── SECTION CTA ──────────────────────────────────────────────────────────────
function AboutCTA() {
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
          PRÊT À COMMENCER ?
        </div>
        <h2 data-reveal style={{
          fontFamily: "Outfit, sans-serif", fontWeight: 800,
          fontSize: "clamp(28px, 4vw, 40px)", color: "#fff",
          margin: "0 0 18px", letterSpacing: "-0.5px",
        }}>
          Travaillons ensemble
        </h2>
        <p data-reveal style={{
          fontFamily: "Open Sans, sans-serif", color: "rgba(255,255,255,0.65)",
          fontSize: 16, lineHeight: 1.8, maxWidth: 560, margin: "0 auto 40px",
        }}>
          Contactez notre équipe pour un audit gratuit de votre infrastructure IT et découvrez comment IntegralTech peut transformer votre entreprise.
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
          Demander un audit gratuit
          <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}

// ─── PAGE PRINCIPALE ──────────────────────────────────────────────────────────
export default function AboutPage() {
  usePageTransitionEffect();

  return (
    <div id="about">
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