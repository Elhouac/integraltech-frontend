import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "react-router-dom";
import { ShieldCheck, Cloud, Server, Layers, Zap, BarChart3 } from "lucide-react";
import { DARK, LIGHT_GRAY, NAVY, ORANGE } from "../constants";
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
    gradient: `linear-gradient(135deg, #0f2744 0%, #1a3a5c 100%)`,
    accent: ORANGE,
  },
  {
    id: "cloud",
    Icon: Cloud,
    badge: "CLOUD",
    title: "Migrez vers le cloud en toute confiance",
    desc: "Notre expertise cloud vous accompagne de la stratégie à la mise en production. Que vous optiez pour un cloud public, privé ou hybride, nos équipes certifiées (AWS, Azure, Google Cloud) orchestrent votre migration avec un impact minimal sur votre activité.",
    points: ["Audit et stratégie cloud", "Migration applicative", "Optimisation des coûts cloud", "Cloud hybride et multi-cloud", "Infogérance et monitoring"],
    gradient: `linear-gradient(135deg, #14243b 0%, #1e3a5f 100%)`,
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
        gap: 64,
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
          borderRadius: 20,
          background: s.gradient,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 24px 56px rgba(0,0,0,0.18)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", inset: 0, opacity: 0.08, backgroundImage: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4) 0%, transparent 60%)" }} />
        <s.Icon size={80} color={s.accent} strokeWidth={1.2} />
      </div>

      {/* Content */}
      <div className="sol-content" style={{ flex: 1 }}>
        <div style={{ color: ORANGE, fontWeight: 700, fontSize: 12, letterSpacing: 3, textTransform: "uppercase", marginBottom: 12, fontFamily: "Open Sans, sans-serif" }}>
          {s.badge}
        </div>
        <h2 style={{ fontFamily: "Outfit, sans-serif", fontWeight: 800, fontSize: 30, color: DARK, lineHeight: 1.25, marginBottom: 16 }}>
          {s.title}
        </h2>
        <p style={{ fontFamily: "Open Sans, sans-serif", color: "#6C7A89", fontSize: 15, lineHeight: 1.8, marginBottom: 24 }}>
          {s.desc}
        </p>
        <ul style={{ listStyle: "none", padding: 0, margin: "0 0 28px", display: "flex", flexDirection: "column", gap: 10 }}>
          {s.points.map((pt) => (
            <li key={pt} className="sol-point" style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: ORANGE, flexShrink: 0, display: "inline-block" }} />
              <span style={{ fontFamily: "Open Sans, sans-serif", color: DARK, fontSize: 14 }}>{pt}</span>
            </li>
          ))}
        </ul>
        <Link
          to="/contact"
          style={{ display: "inline-flex", alignItems: "center", gap: 8, background: ORANGE, color: "#fff", fontFamily: "Open Sans, sans-serif", fontWeight: 700, fontSize: 14, padding: "13px 28px", borderRadius: 10, textDecoration: "none" }}
        >
          Demander une démo →
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
      {/* ── Hero ── */}
      <div
        ref={heroRef}
        style={{ background: DARK, color: "#fff", padding: "100px 80px 80px", textAlign: "center" }}
        className="solutions-hero"
      >
        <div data-hero style={{ color: ORANGE, fontWeight: 700, fontSize: 13, letterSpacing: 3, textTransform: "uppercase", marginBottom: 14, fontFamily: "Open Sans, sans-serif" }}>
          NOS SOLUTIONS
        </div>
        <h1 data-hero style={{ fontFamily: "Outfit, sans-serif", fontWeight: 800, fontSize: 48, lineHeight: 1.15, maxWidth: 720, margin: "0 auto 20px" }}>
          Des solutions IT sur mesure pour votre entreprise
        </h1>
        <p data-hero style={{ fontFamily: "Open Sans, sans-serif", color: "rgba(255,255,255,0.75)", fontSize: 17, lineHeight: 1.8, maxWidth: 640, margin: "0 auto 40px" }}>
          Cybersécurité, Cloud, ERP, Infrastructure, Transformation digitale et Conseil — IntegralTech couvre l'intégralité de vos besoins technologiques.
        </p>

        {/* Anchor nav */}
        <div data-hero style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
          {solutions.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              style={{ padding: "8px 18px", borderRadius: 8, border: `1px solid rgba(255,255,255,0.25)`, color: "rgba(255,255,255,0.85)", fontFamily: "Open Sans, sans-serif", fontSize: 13, fontWeight: 600, textDecoration: "none", background: "rgba(255,255,255,0.06)", transition: "background 0.2s" }}
            >
              {s.badge}
            </a>
          ))}
        </div>
      </div>

      {/* ── Solution cards ── */}
      <div style={{ background: LIGHT_GRAY, padding: "80px 80px 8px" }} className="solutions-body">
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          {solutions.map((s, i) => (
            <SolutionCard key={s.id} s={s} index={i} />
          ))}
        </div>
      </div>

      {/* ── CTA ── */}
      <div style={{ background: NAVY, padding: "72px 80px", textAlign: "center" }}>
        <h2 style={{ fontFamily: "Outfit, sans-serif", fontWeight: 800, fontSize: 38, color: "#fff", marginBottom: 16 }}>
          Besoin d'une solution spécifique ?
        </h2>
        <p style={{ fontFamily: "Open Sans, sans-serif", color: "rgba(255,255,255,0.75)", fontSize: 16, marginBottom: 36 }}>
          Nos experts analysent votre contexte et vous proposent une approche personnalisée.
        </p>
        <Link
          to="/contact"
          style={{ display: "inline-flex", alignItems: "center", gap: 10, background: ORANGE, color: "#fff", fontFamily: "Open Sans, sans-serif", fontWeight: 700, fontSize: 15, padding: "16px 40px", borderRadius: 10, textDecoration: "none" }}
        >
          Contacter un expert →
        </Link>
      </div>
    </div>
  );
}
