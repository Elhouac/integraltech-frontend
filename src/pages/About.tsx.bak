import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "react-router-dom";
import {
  Trophy, Lightbulb, ShieldCheck, TrendingUp,
  Users, Clock, Award, Globe,
  CheckCircle, Cpu, Database, Wifi
} from "lucide-react";
import { DARK, LIGHT_GRAY, NAVY, ORANGE } from "../constants";
import { usePageTransitionEffect } from "../hooks/usePageTransitionEffect";

gsap.registerPlugin(ScrollTrigger);

// ─── DATA ────────────────────────────────────────────────────────────────────
const values = [
  { Icon: Trophy,       title: "Excellence",  desc: "Certifications internationales et standards de qualité élevés." },
  { Icon: Lightbulb,   title: "Innovation",  desc: "Technologies de pointe et veille technologique permanente." },
  { Icon: ShieldCheck, title: "Sécurité",    desc: "Protection maximale de vos données et systèmes d'information." },
  { Icon: TrendingUp,  title: "Croissance",  desc: "Solutions évolutives qui grandissent avec votre entreprise." },
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
        background: DARK,
        color: "#fff",
        padding: "100px 80px 80px",
        textAlign: "center",
      }}
      className="about-hero-section"
    >
      <div data-hero style={{ color: ORANGE, fontWeight: 700, fontSize: 13, letterSpacing: 3, textTransform: "uppercase", marginBottom: 14, fontFamily: "Open Sans, sans-serif" }}>
        À PROPOS DE NOUS
      </div>
      <h1 data-hero style={{ fontFamily: "Outfit, sans-serif", fontWeight: 800, fontSize: 48, lineHeight: 1.15, marginBottom: 20, maxWidth: 720, margin: "0 auto 20px" }}>
        Votre Partenaire Digital De Confiance
      </h1>
      <p data-hero style={{ fontFamily: "Open Sans, sans-serif", color: "rgba(255,255,255,0.75)", fontSize: 17, lineHeight: 1.8, maxWidth: 640, margin: "0 auto 36px" }}>
        Depuis plus de 10 ans, IntegralTech accompagne les entreprises marocaines dans leur transformation numérique avec expertise, fiabilité et innovation.
      </p>
      <Link
        data-hero
        to="/contact"
        style={{ display: "inline-flex", alignItems: "center", gap: 10, background: ORANGE, color: "#fff", fontFamily: "Open Sans, sans-serif", fontWeight: 700, fontSize: 15, padding: "14px 32px", borderRadius: 10, textDecoration: "none" }}
      >
        Nous contacter →
      </Link>
    </section>
  );
}

// ─── SECTION HISTOIRE ─────────────────────────────────────────────────────────
function AboutHistory() {
  const ref = useRef<HTMLElement>(null);
  useGsapReveal(ref);

  return (
    <section ref={ref} style={{ background: "#fff", padding: "80px 80px" }} className="about-history-section">
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", gap: 72, alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 340px" }}>
          <div data-reveal style={{ color: ORANGE, fontWeight: 700, fontSize: 13, letterSpacing: 3, textTransform: "uppercase", marginBottom: 12, fontFamily: "Open Sans, sans-serif" }}>
            NOTRE HISTOIRE
          </div>
          <h2 data-reveal style={{ fontFamily: "Outfit, sans-serif", fontWeight: 800, fontSize: 38, color: DARK, marginBottom: 20 }}>
            Plus de 10 ans d'innovation au service des entreprises
          </h2>
          <p data-reveal style={{ fontFamily: "Open Sans, sans-serif", color: "#6C7A89", fontSize: 16, lineHeight: 1.8, marginBottom: 16 }}>
            Fondée en 2014 à Casablanca, <strong>Integral Progress Technology</strong> est née d'une vision claire : démocratiser l'accès aux technologies IT de pointe pour les entreprises marocaines, quelle que soit leur taille.
          </p>
          <p data-reveal style={{ fontFamily: "Open Sans, sans-serif", color: "#6C7A89", fontSize: 16, lineHeight: 1.8, marginBottom: 16 }}>
            Au fil des années, nous avons bâti une équipe d'experts certifiés et développé des partenariats stratégiques avec les leaders mondiaux de la technologie, nous positionnant comme un acteur incontournable de la transformation digitale au Maroc.
          </p>
          <p data-reveal style={{ fontFamily: "Open Sans, sans-serif", color: "#6C7A89", fontSize: 16, lineHeight: 1.8 }}>
            Aujourd'hui, plus de 500 entreprises nous font confiance pour sécuriser, optimiser et moderniser leur système d'information.
          </p>
        </div>
        <div style={{ flex: "1 1 300px" }}>
          {[
            { year: "2014", title: "Fondation", desc: "Création d'IntegralTech à Casablanca avec une équipe de 5 experts." },
            { year: "2017", title: "Expansion", desc: "Ouverture de nouvelles agences et obtention des premières certifications internationales." },
            { year: "2020", title: "Leadership", desc: "Devenu l'un des principaux partenaires IT du Maroc avec +200 clients." },
            { year: "2024", title: "Innovation", desc: "Lancement de notre pôle IA et cloud avec +500 clients satisfaits." },
          ].map((item, i) => (
            <div
              key={i}
              data-reveal
              style={{ display: "flex", gap: 20, marginBottom: i < 3 ? 28 : 0, alignItems: "flex-start" }}
            >
              <div style={{
                minWidth: 64, height: 64, borderRadius: "50%", background: ORANGE,
                color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "Outfit, sans-serif", fontWeight: 800, fontSize: 14, flexShrink: 0,
              }}>
                {item.year}
              </div>
              <div>
                <div style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: 17, color: DARK, marginBottom: 4 }}>{item.title}</div>
                <div style={{ fontFamily: "Open Sans, sans-serif", color: "#6C7A89", fontSize: 14, lineHeight: 1.7 }}>{item.desc}</div>
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
    <section ref={ref} style={{ background: NAVY, padding: "64px 80px" }} className="about-stats-section">
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 32, textAlign: "center" }} className="about-stats-grid">
        {stats.map((s) => (
          <div key={s.label} data-stat>
            <s.Icon size={32} color={ORANGE} style={{ marginBottom: 12 }} />
            <div style={{ fontFamily: "Outfit, sans-serif", fontWeight: 800, fontSize: 36, color: "#fff", marginBottom: 6 }}>{s.value}</div>
            <div style={{ fontFamily: "Open Sans, sans-serif", color: "rgba(255,255,255,0.75)", fontSize: 14 }}>{s.label}</div>
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
    <section ref={ref} style={{ background: LIGHT_GRAY, padding: "80px 80px" }} className="about-mv-section">
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div data-reveal style={{ textAlign: "center", marginBottom: 56 }}>
          <div style={{ color: ORANGE, fontWeight: 700, fontSize: 13, letterSpacing: 3, textTransform: "uppercase", marginBottom: 12, fontFamily: "Open Sans, sans-serif" }}>
            NOS FONDEMENTS
          </div>
          <h2 style={{ fontFamily: "Outfit, sans-serif", fontWeight: 800, fontSize: 38, color: DARK, marginBottom: 12 }}>
            Mission & Vision
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }} className="about-mv-grid">
          {[
            {
              label: "Notre Mission",
              color: ORANGE,
              title: "Accélérer votre transformation digitale",
              desc: "Notre mission est d'accompagner chaque entreprise marocaine dans sa transformation numérique en lui fournissant des solutions IT sur mesure, fiables et sécurisées. Nous agissons comme un véritable partenaire technologique, engagé dans la réussite de nos clients sur le long terme.",
            },
            {
              label: "Notre Vision",
              color: NAVY,
              title: "Être le leader IT de référence en Afrique",
              desc: "Nous aspirons à devenir la référence incontournable de l'intégration de solutions IT en Afrique du Nord. En alliant expertise humaine et technologies d'avant-garde, nous construisons une économie numérique plus compétitive, résiliente et innovante pour les entreprises africaines.",
            },
          ].map((item) => (
            <div
              key={item.label}
              data-reveal
              style={{ background: "#fff", borderRadius: 16, padding: "40px 36px", borderTop: `4px solid ${item.color}`, boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}
            >
              <div style={{ color: item.color, fontWeight: 700, fontSize: 12, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12, fontFamily: "Open Sans, sans-serif" }}>
                {item.label}
              </div>
              <h3 style={{ fontFamily: "Outfit, sans-serif", fontWeight: 800, fontSize: 22, color: DARK, marginBottom: 16 }}>
                {item.title}
              </h3>
              <p style={{ fontFamily: "Open Sans, sans-serif", color: "#6C7A89", fontSize: 15, lineHeight: 1.8 }}>
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
    <section ref={ref} style={{ background: "#fff", padding: "80px 80px" }} className="about-values-section">
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div data-reveal style={{ textAlign: "center", marginBottom: 56 }}>
          <div style={{ color: ORANGE, fontWeight: 700, fontSize: 13, letterSpacing: 3, textTransform: "uppercase", marginBottom: 12, fontFamily: "Open Sans, sans-serif" }}>
            NOS VALEURS
          </div>
          <h2 style={{ fontFamily: "Outfit, sans-serif", fontWeight: 800, fontSize: 38, color: DARK }}>
            Ce qui nous guide au quotidien
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }} className="about-values-grid">
          {values.map((v) => (
            <div
              key={v.title}
              data-reveal
              style={{ background: LIGHT_GRAY, borderRadius: 14, padding: "36px 24px", textAlign: "center", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}
            >
              <div style={{ width: 64, height: 64, borderRadius: "50%", background: `rgba(230,126,34,0.1)`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                <v.Icon size={28} color={ORANGE} />
              </div>
              <div style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: 18, color: DARK, marginBottom: 10 }}>{v.title}</div>
              <p style={{ fontFamily: "Open Sans, sans-serif", color: "#6C7A89", fontSize: 14, lineHeight: 1.7, margin: 0 }}>{v.desc}</p>
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
    <section ref={ref} style={{ background: LIGHT_GRAY, padding: "72px 80px" }} className="about-cert-section">
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div data-reveal style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ color: ORANGE, fontWeight: 700, fontSize: 13, letterSpacing: 3, textTransform: "uppercase", marginBottom: 12, fontFamily: "Open Sans, sans-serif" }}>
            CERTIFICATIONS & PARTENAIRES
          </div>
          <h2 style={{ fontFamily: "Outfit, sans-serif", fontWeight: 800, fontSize: 38, color: DARK, marginBottom: 16 }}>
            Des partenariats stratégiques
          </h2>
          <p style={{ fontFamily: "Open Sans, sans-serif", color: "#6C7A89", fontSize: 16, maxWidth: 560, margin: "0 auto" }}>
            Nous collaborons avec les leaders mondiaux de la technologie pour vous offrir les meilleures solutions du marché.
          </p>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "center" }}>
          {certifications.map((cert) => (
            <div
              key={cert}
              data-reveal
              style={{ background: "#fff", borderRadius: 10, padding: "14px 24px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", display: "flex", alignItems: "center", gap: 10 }}
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
    <section ref={ref} style={{ background: "#fff", padding: "72px 80px" }} className="about-tech-section">
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div data-reveal style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ color: ORANGE, fontWeight: 700, fontSize: 13, letterSpacing: 3, textTransform: "uppercase", marginBottom: 12, fontFamily: "Open Sans, sans-serif" }}>
            NOS TECHNOLOGIES
          </div>
          <h2 style={{ fontFamily: "Outfit, sans-serif", fontWeight: 800, fontSize: 38, color: DARK }}>
            Des outils à la pointe
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24, textAlign: "center" }} className="about-tech-grid">
          {technologies.map((t) => (
            <div
              key={t.label}
              data-reveal
              style={{ padding: "32px 20px", borderRadius: 14, border: `1px solid rgba(0,0,0,0.07)`, background: LIGHT_GRAY }}
            >
              <t.Icon size={36} color={ORANGE} style={{ marginBottom: 14 }} />
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
    <section ref={ref} style={{ background: DARK, padding: "80px 80px", textAlign: "center" }} className="about-cta-section">
      <div data-reveal style={{ color: ORANGE, fontWeight: 700, fontSize: 13, letterSpacing: 3, textTransform: "uppercase", marginBottom: 12, fontFamily: "Open Sans, sans-serif" }}>
        PRÊT À COMMENCER ?
      </div>
      <h2 data-reveal style={{ fontFamily: "Outfit, sans-serif", fontWeight: 800, fontSize: 40, color: "#fff", marginBottom: 16 }}>
        Travaillons ensemble
      </h2>
      <p data-reveal style={{ fontFamily: "Open Sans, sans-serif", color: "rgba(255,255,255,0.75)", fontSize: 16, lineHeight: 1.8, maxWidth: 560, margin: "0 auto 36px" }}>
        Contactez notre équipe pour un audit gratuit de votre infrastructure IT et découvrez comment IntegralTech peut transformer votre entreprise.
      </p>
      <Link
        data-reveal
        to="/contact"
        style={{ display: "inline-flex", alignItems: "center", gap: 10, background: ORANGE, color: "#fff", fontFamily: "Open Sans, sans-serif", fontWeight: 700, fontSize: 15, padding: "16px 40px", borderRadius: 10, textDecoration: "none" }}
      >
        Demander un audit gratuit →
      </Link>
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