import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "react-router-dom";
import SEO from "../components/seo/SEO";
import { ShieldCheck, Cloud, Server, Layers, Zap, BarChart3, ArrowRight } from "lucide-react";
import { DARK, LIGHT_GRAY, NAVY, ORANGE, BODY_TEXT, BORDER, CARD_BG } from "../constants";
import { usePageTransitionEffect } from "../hooks/usePageTransitionEffect";

gsap.registerPlugin(ScrollTrigger);

const solutions = [
  {
    id: "cybersecurite",
    Icon: ShieldCheck,
    badge: "CYBERSÉCURITÉ",
    title: "Protégez votre entreprise contre les cybermenaces",
    desc: "Dans un monde où les cyberattaques sont en constante augmentation, IntegralTech vous offre une protection complète de votre système d'information. Notre approche multicouche couvre l'audit de sécurité, la détection d'intrusions, la formation de vos équipes et la réponse aux incidents.",
    points: ["Audit et diagnostic de sécurité", "SOC managé 24/7", "Formation et sensibilisation", "Gestion des identités et accès (IAM)", "Protection des données (DLP)"],
    gradient: `linear-gradient(135deg, ${NAVY} 0%, #0f1b3d 100%)`,
    accent: ORANGE,
  },
  {
    id: "cloud",
    Icon: Cloud,
    badge: "CLOUD",
    title: "Migrez vers le cloud en toute confiance",
    desc: "Notre expertise cloud vous accompagne de la stratégie à la mise en production. Que vous optiez pour un cloud public, privé ou hybride, nos équipes certifiées (AWS, Azure, Google Cloud) orchestrent votre migration avec un impact minimal sur votre activité.",
    points: ["Audit et stratégie cloud", "Migration applicative", "Optimisation des coûts cloud", "Cloud hybride et multi-cloud", "Infogérance et monitoring"],
    gradient: `linear-gradient(135deg, #0f2744 0%, #1e3a5f 100%)`,
    accent: "#4FC3F7",
  },
  {
    id: "infrastructure",
    Icon: Server,
    badge: "INFRASTRUCTURE IT",
    title: "Une infrastructure robuste et évolutive",
    desc: "Nous concevons, déployons et maintenons des infrastructures IT performantes adaptées à votre croissance. De la virtualisation à l'hyperconvergence, en passant par le réseau et le stockage, nos solutions garantissent disponibilité et performance.",
    points: ["Virtualisation et hyperconvergence", "Réseau LAN/WAN et Wi-Fi", "Stockage SAN/NAS", "Datacenter et colocation", "Monitoring et supervision proactifs"],
    gradient: `linear-gradient(135deg, #0f2744 0%, #223355 100%)`,
    accent: "#81C784",
  },
  {
    id: "erp",
    Icon: Layers,
    badge: "ERP",
    title: "Optimisez vos processus métiers avec un ERP sur mesure",
    desc: "L'implémentation d'un ERP est un projet stratégique. IntegralTech vous accompagne dans le choix, le paramétrage et le déploiement de votre solution ERP (Microsoft Dynamics, SAP, Odoo) pour digitaliser et optimiser l'ensemble de vos processus opérationnels.",
    points: ["Analyse des besoins et cadrage", "Déploiement ERP (Microsoft Dynamics, Odoo, SAP)", "Migration des données", "Formation des utilisateurs", "Support et maintenance évolutive"],
    gradient: `linear-gradient(135deg, #1a2a3a 0%, #2c3e50 100%)`,
    accent: "#CE93D8",
  },
  {
    id: "transformation",
    Icon: Zap,
    badge: "TRANSFORMATION DIGITALE",
    title: "Accélérez votre transformation numérique",
    desc: "La transformation digitale est plus qu'un projet technologique, c'est une évolution culturelle et organisationnelle. Nous vous guidons à travers cette mutation en alignant technologie, processus et humain pour créer un avantage compétitif durable.",
    points: ["Diagnostic de maturité digitale", "Définition de la feuille de route", "Automatisation des processus (RPA)", "Innovation et veille technologique", "Accompagnement au changement"],
    gradient: `linear-gradient(135deg, #0f2744 0%, #1f3456 100%)`,
    accent: "#FFB74D",
  },
  {
    id: "consulting",
    Icon: BarChart3,
    badge: "CONSEIL & AUDIT",
    title: "Un conseil stratégique pour vos décisions IT",
    desc: "Nos consultants seniors vous apportent un regard objectif et expert sur votre système d'information. Nous réalisons des audits techniques, définissons des stratégies IT et vous accompagnons dans la gouvernance et la conduite du changement.",
    points: ["Audit complet du SI", "Schéma directeur informatique", "Gouvernance IT (COBIT, ITIL)", "Gestion de projets IT complexes", "Optimisation des dépenses IT (FinOps)"],
    gradient: `linear-gradient(135deg, #14243b 0%, #1d3050 100%)`,
    accent: "#4DB6AC",
  },
];

function SolutionCard({ s, index }: { s: (typeof solutions)[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isEven = index % 2 === 0;

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      const visual = el.querySelector<HTMLElement>(".sol-visual");
      const content = el.querySelector<HTMLElement>(".sol-content");
      const points = el.querySelectorAll<HTMLElement>(".sol-point");

      gsap.set([visual, content], { opacity: 0, x: isEven ? -50 : 50 });
      gsap.set(points, { opacity: 0, x: -20 });

      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: "top 78%", once: true },
        defaults: { ease: "power3.out" },
      });

      tl.to(visual, { opacity: 1, x: 0, duration: 0.9 })
        .to(content, { opacity: 1, x: 0, duration: 0.9 }, "<0.15")
        .to(points, { opacity: 1, x: 0, duration: 0.5, stagger: 0.08 }, "<0.3");
    }, el);

    return () => ctx.revert();
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
          Demander une démo
          <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  );
}

export default function SolutionsPage() {
  usePageTransitionEffect();
  const heroRef = useRef<HTMLDivElement>(null);

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
        title="Nos Solutions IT & Digitalisation"
        description="Explorez nos expertises : cybersécurité avancée, architecture Cloud moderne, déploiement d'ERP sur mesure, infrastructure IT robuste et conseil stratégique."
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
            NOS SOLUTIONS
          </div>
          <h1 data-hero style={{
            fontFamily: "Outfit, sans-serif", fontWeight: 800,
            fontSize: "clamp(32px, 5vw, 48px)", lineHeight: 1.15,
            maxWidth: 720, margin: "0 auto 20px", letterSpacing: "-0.5px",
          }}>
            Des solutions IT sur mesure pour votre entreprise
          </h1>
          <p data-hero style={{
            fontFamily: "Open Sans, sans-serif", color: "rgba(255,255,255,0.7)",
            fontSize: 17, lineHeight: 1.8, maxWidth: 640, margin: "0 auto 40px",
          }}>
            Cybersécurité, Cloud, ERP, Infrastructure, Transformation digitale et Conseil — IntegralTech couvre l'intégralité de vos besoins technologiques.
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
            Besoin d'une solution spécifique ?
          </h2>
          <p style={{
            fontFamily: "Open Sans, sans-serif", color: "rgba(255,255,255,0.65)",
            fontSize: 16, lineHeight: 1.7, margin: "0 auto 40px", maxWidth: 560,
          }}>
            Nos experts analysent votre contexte et vous proposent une approche personnalisée.
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
            Contacter un expert
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
