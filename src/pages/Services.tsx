import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "react-router-dom";
import SEO from "../components/seo/SEO";
import {
  ShieldCheck, Cloud, Layers, Wrench, BarChart3, Handshake,
  Network, Globe, Settings, Headphones, Lock, Database,
  ArrowRight,
} from "lucide-react";
import { DARK, LIGHT_GRAY, NAVY, ORANGE, BODY_TEXT, BORDER, CARD_BG } from "../constants";
import { usePageTransitionEffect } from "../hooks/usePageTransitionEffect";

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    id: "cybersecurite",
    Icon: ShieldCheck,
    title: "Cybersécurité",
    subtitle: "Protection & Conformité",
    desc: "Protégez votre organisation avec une approche holistique de la sécurité : audit, SOC managé, gestion des vulnérabilités et réponse aux incidents. Nous assurons la conformité RGPD et ISO 27001 de vos systèmes.",
    features: ["SOC managé 24/7", "Tests d'intrusion (pentest)", "Gestion des identités (IAM)", "Conformité RGPD / ISO 27001"],
  },
  {
    id: "cloud",
    Icon: Cloud,
    title: "Cloud & Infrastructure",
    subtitle: "Agilité & Scalabilité",
    desc: "De la migration cloud à l'infogérance multi-cloud, nos équipes certifiées AWS, Azure et Google Cloud conçoivent et opèrent votre infrastructure avec un niveau de service garanti (SLA 99,9%).",
    features: ["Migration vers le cloud", "Cloud hybride et multi-cloud", "Optimisation des coûts (FinOps)", "Monitoring et MCO proactif"],
  },
  {
    id: "erp",
    Icon: Layers,
    title: "Solutions ERP",
    subtitle: "Efficacité opérationnelle",
    desc: "Implémentation, personnalisation et support de solutions ERP (Microsoft Dynamics 365, SAP, Odoo). Nous digitalisons vos processus RH, Finance, Supply Chain et CRM pour une performance maximale.",
    features: ["Déploiement Microsoft Dynamics / SAP / Odoo", "Migration et intégration de données", "Formation des utilisateurs", "Support et évolution"],
  },
  {
    id: "support",
    Icon: Headphones,
    title: "Support & Maintenance",
    subtitle: "Réactivité & Disponibilité",
    desc: "Notre équipe de techniciens certifiés assure la disponibilité et les performances de votre parc informatique 24h/24, 7j/7. Contrats de support niveau 1, 2 et 3 adaptés à vos besoins.",
    features: ["Helpdesk N1/N2/N3", "Maintenance préventive et curative", "Gestion du parc informatique (ITSM)", "Astreinte et intervention sur site"],
  },
  {
    id: "bi",
    Icon: BarChart3,
    title: "Business Intelligence",
    subtitle: "Données & Analytics",
    desc: "Transformez vos données en avantages concurrentiels. Nos experts BI conçoivent des entrepôts de données, des tableaux de bord interactifs et des modèles analytiques avancés pour guider vos décisions.",
    features: ["Datawarehouse et lac de données", "Tableaux de bord Power BI / Qlik", "Analytics avancé et reporting", "KPIs et pilotage de la performance"],
  },
  {
    id: "conseil",
    Icon: Handshake,
    title: "Conseil & Audit",
    subtitle: "Stratégie & Gouvernance",
    desc: "Nos consultants seniors vous accompagnent dans la définition et l'exécution de votre stratégie IT : schéma directeur, gouvernance, gestion de projet et conduite du changement.",
    features: ["Audit complet du Système d'Information", "Schéma directeur informatique", "AMOA et gestion de projets", "Accompagnement au changement"],
  },
  {
    id: "reseau",
    Icon: Network,
    title: "Réseau & Télécommunications",
    subtitle: "Connectivité & Performance",
    desc: "Nous concevons et déployons des architectures réseau LAN, WAN, Wi-Fi et SD-WAN adaptées à vos sites et à vos exigences de performance, de redondance et de sécurité.",
    features: ["Architecture réseau LAN/WAN", "Wi-Fi entreprise haute densité", "SD-WAN et MPLS", "VOIP et téléphonie IP"],
  },
  {
    id: "securite-physique",
    Icon: Lock,
    title: "Sécurité Physique & IoT",
    subtitle: "Contrôle & Surveillance",
    desc: "Au-delà du numérique, nous sécurisons également vos locaux avec des solutions de vidéosurveillance IP, contrôle d'accès biométrique et systèmes d'alarme intégrés.",
    features: ["Vidéosurveillance IP (CCTV)", "Contrôle d'accès biométrique", "Intégration IoT industriel", "Systèmes d'alarme et intrusion"],
  },
  {
    id: "digital-workplace",
    Icon: Globe,
    title: "Digital Workplace",
    subtitle: "Mobilité & Collaboration",
    desc: "Créez un environnement de travail numérique fluide et sécurisé avec nos solutions Microsoft 365, outils collaboratifs et gestion de la mobilité d'entreprise (MDM).",
    features: ["Déploiement Microsoft 365 / Google Workspace", "Gestion des appareils mobiles (MDM)", "Solutions de visioconférence", "Intranet et portails collaboratifs"],
  },
  {
    id: "data",
    Icon: Database,
    title: "Gestion des Données",
    subtitle: "Sécurité & Conformité",
    desc: "Nous vous aidons à maîtriser votre patrimoine data : stratégie de sauvegarde, plan de reprise d'activité (PRA/PCA), protection contre les ransomwares et gouvernance des données.",
    features: ["Stratégie de sauvegarde et restauration", "Plan de reprise d'activité (PRA/PCA)", "Protection contre les ransomwares", "Gouvernance et qualité des données"],
  },
  {
    id: "integration",
    Icon: Settings,
    title: "Intégration & Interopérabilité",
    subtitle: "API & Middleware",
    desc: "Nous interconnectons vos applications métier (ERP, CRM, e-commerce) et créez des flux automatisés pour éliminer les silos d'information et améliorer votre productivité.",
    features: ["Intégration API et services web", "Middleware et ESB", "Automatisation des processus (RPA)", "Développement d'applications sur mesure"],
  },
  {
    id: "formation",
    Icon: Wrench,
    title: "Formation & Montée en compétences",
    subtitle: "Excellence & Capital humain",
    desc: "Renforcez les compétences IT de vos équipes avec nos programmes de formation personnalisés, dispensés par des formateurs certifiés dans nos centres ou dans vos locaux.",
    features: ["Formations certifiantes (Microsoft, Cisco, etc.)", "Ateliers pratiques sur site", "E-learning et blended learning", "Coaching technique individualisé"],
  },
];

function ServiceCard({ s, index }: { s: (typeof services)[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      gsap.from(el, {
        opacity: 0,
        y: 50,
        duration: 0.7,
        ease: "power3.out",
        delay: (index % 3) * 0.12,
        scrollTrigger: { trigger: el, start: "top 85%", once: true },
      });

      // hover
      const onEnter = () =>
        gsap.to(el, { y: -6, boxShadow: `0 20px 48px rgba(249,115,22,0.15)`, duration: 0.35, ease: "power2.out" });
      const onLeave = () =>
        gsap.to(el, { y: 0, boxShadow: "0 2px 16px rgba(15,23,42,0.05)", duration: 0.35, ease: "power2.out" });

      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    }, el);

    return () => ctx.revert();
  }, [index]);

  return (
    <div
      ref={ref}
      id={s.id}
      style={{
        background: CARD_BG,
        borderRadius: 18,
        padding: "36px 28px",
        boxShadow: "0 2px 16px rgba(15,23,42,0.05)",
        borderTop: `3px solid ${ORANGE}`,
        display: "flex",
        flexDirection: "column",
        gap: 0,
        cursor: "default",
        border: `1px solid ${BORDER}`,
        borderTopColor: ORANGE,
      }}
    >
      <div style={{
        width: 52, height: 52, borderRadius: 14,
        background: `${ORANGE}12`, display: "flex", alignItems: "center",
        justifyContent: "center", marginBottom: 20,
      }}>
        <s.Icon size={24} color={ORANGE} />
      </div>
      <div style={{
        color: ORANGE, fontWeight: 700, fontSize: 11, letterSpacing: 2,
        textTransform: "uppercase", marginBottom: 6, fontFamily: "Outfit, sans-serif",
      }}>
        {s.subtitle}
      </div>
      <h3 style={{
        fontFamily: "Outfit, sans-serif", fontWeight: 800, fontSize: 20,
        color: DARK, marginBottom: 12, lineHeight: 1.3, margin: "0 0 12px",
      }}>
        {s.title}
      </h3>
      <p style={{
        fontFamily: "Open Sans, sans-serif", color: BODY_TEXT, fontSize: 14,
        lineHeight: 1.75, marginBottom: 16, flex: 1, margin: "0 0 16px",
      }}>
        {s.desc}
      </p>

      {expanded && (
        <ul style={{ listStyle: "none", padding: 0, margin: "0 0 16px", display: "flex", flexDirection: "column", gap: 8 }}>
          {s.features.map((f) => (
            <li key={f} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: ORANGE, flexShrink: 0, display: "inline-block" }} />
              <span style={{ fontFamily: "Open Sans, sans-serif", color: DARK, fontSize: 13 }}>{f}</span>
            </li>
          ))}
        </ul>
      )}

      <div style={{ display: "flex", gap: 12, marginTop: "auto", flexWrap: "wrap" }}>
        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            background: "none", border: `1px solid ${ORANGE}`, color: ORANGE,
            fontFamily: "Outfit, sans-serif", fontWeight: 600, fontSize: 13,
            padding: "8px 18px", borderRadius: 10, cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = `${ORANGE}0D`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "none";
          }}
        >
          {expanded ? "Réduire" : "En savoir plus"}
        </button>
        <Link
          to="/contact"
          style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: ORANGE, color: "#fff",
            fontFamily: "Outfit, sans-serif", fontWeight: 600, fontSize: 13,
            padding: "8px 18px", borderRadius: 10, textDecoration: "none",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(249,115,22,0.3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          Demander
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}

export default function ServicesPage() {
  usePageTransitionEffect();
  const heroRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      gsap.from(el.querySelectorAll<HTMLElement>("[data-hero]"), {
        opacity: 0, y: 30, duration: 0.7, ease: "power3.out", stagger: 0.15,
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <div id="services">
      <SEO
        title="Nos Services & Expertises IT"
        description="IntegralTech vous propose des services IT à valeur ajoutée : infogérance, audits de sécurité, migration Cloud, intégration ERP et support technique 24/7."
        path="/services"
      />
      {/* Hero */}
      <div
        ref={heroRef}
        style={{
          background: `linear-gradient(135deg, ${NAVY} 0%, #0f1b3d 50%, #1a2a5e 100%)`,
          color: "#fff", padding: "120px 0 96px", textAlign: "center",
          position: "relative", overflow: "hidden",
        }}
        className="services-hero"
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
            NOS SERVICES
          </div>
          <h1 data-hero style={{
            fontFamily: "Outfit, sans-serif", fontWeight: 800,
            fontSize: "clamp(32px, 5vw, 48px)", lineHeight: 1.15,
            maxWidth: 720, margin: "0 auto 20px", letterSpacing: "-0.5px",
          }}>
            Support, Conseil Et Maintenance
          </h1>
          <p data-hero style={{
            fontFamily: "Open Sans, sans-serif", color: "rgba(255,255,255,0.7)",
            fontSize: 17, lineHeight: 1.8, maxWidth: 640, margin: "0 auto 40px",
          }}>
            Nous accompagnons vos équipes avec une gamme complète de services IT — de l'assistance quotidienne aux projets de transformation stratégique.
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
            Demander un audit
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* Grid */}
      <div style={{ background: LIGHT_GRAY, padding: "100px 0" }} className="services-page-body">
        <div style={{ width: "90%", maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <h2 style={{
              fontFamily: "Outfit, sans-serif", fontWeight: 800,
              fontSize: "clamp(28px, 4vw, 36px)", color: DARK,
              margin: "0 0 14px", letterSpacing: "-0.5px",
            }}>
              Une offre complète pour votre activité
            </h2>
            <p style={{ fontFamily: "Open Sans, sans-serif", color: BODY_TEXT, fontSize: 16, maxWidth: 580, margin: "0 auto", lineHeight: 1.7 }}>
              Cliquez sur "En savoir plus" pour découvrir le détail de chaque service.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 28 }} className="services-page-grid">
            {services.map((s, i) => (
              <ServiceCard key={s.id} s={s} index={i} />
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
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
            Un service sur mesure pour votre entreprise
          </h2>
          <p style={{
            fontFamily: "Open Sans, sans-serif", color: "rgba(255,255,255,0.65)",
            fontSize: 16, lineHeight: 1.7, margin: "0 auto 40px", maxWidth: 560,
          }}>
            Nos experts sont disponibles pour analyser vos besoins et vous proposer un contrat de service adapté.
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
            Nous contacter
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
