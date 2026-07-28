import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "react-router-dom";
import SEO from "../components/seo/SEO";
import {
  ShieldCheck, Cloud, Layers, Wrench, BarChart3, Handshake,
  Network, Globe, Settings, Headphones, Lock, Database,
  ArrowRight, Loader2, AlertCircle
} from "lucide-react";
import { DARK, LIGHT_GRAY, NAVY, ORANGE, BODY_TEXT, BORDER, CARD_BG } from "../constants";
import { usePageTransitionEffect } from "../hooks/usePageTransitionEffect";
import { useLanguage, useTranslation } from "../context/LanguageContext";
import { publicApi, ServiceDto } from "../api/publicApi";

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

interface ServiceItem {
  id: string;
  Icon: any;
  title: string;
  subtitle: string;
  desc: string;
  features: readonly string[];
}

const ICON_MAP: Record<string, any> = {
  ShieldCheck, Cloud, Layers, Wrench, BarChart3, Handshake,
  Network, Globe, Settings, Headphones, Lock, Database,
};

function getIconByName(name?: string): any {
  if (name && ICON_MAP[name]) return ICON_MAP[name];
  return Layers;
}

function ServiceCard({ s, index }: { s: ServiceItem; index: number }) {
  const t = useTranslation();
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
      {s.subtitle && (
        <div style={{
          color: ORANGE, fontWeight: 700, fontSize: 11, letterSpacing: 2,
          textTransform: "uppercase", marginBottom: 6, fontFamily: "Outfit, sans-serif",
        }}>
          {s.subtitle}
        </div>
      )}
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

      {expanded && s.features && s.features.length > 0 && (
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
        {s.features && s.features.length > 0 && (
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
            {expanded ? t.servicesPage.reduce : t.servicesPage.learnMore}
          </button>
        )}
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
          {t.servicesPage.request}
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}

export default function ServicesPage() {
  const t = useTranslation();
  const { language } = useLanguage();
  usePageTransitionEffect();
  const heroRef = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiServices, setApiServices] = useState<ServiceDto[]>([]);

  const defaultServices: ServiceItem[] = [
    {
      id: "cybersecurite",
      Icon: ShieldCheck,
      title: t.servicesPage.cybersecurityTitle,
      subtitle: t.servicesPage.cybersecuritySub,
      desc: t.servicesPage.cybersecurityDesc,
      features: t.servicesPage.cybersecurityFeatures,
    },
    {
      id: "cloud",
      Icon: Cloud,
      title: t.servicesPage.cloudTitle,
      subtitle: t.servicesPage.cloudSub,
      desc: t.servicesPage.cloudDesc,
      features: t.servicesPage.cloudFeatures,
    },
    {
      id: "erp",
      Icon: Layers,
      title: t.servicesPage.erpTitle,
      subtitle: t.servicesPage.erpSub,
      desc: t.servicesPage.erpDesc,
      features: t.servicesPage.erpFeatures,
    },
    {
      id: "support",
      Icon: Headphones,
      title: t.servicesPage.supportTitle,
      subtitle: t.servicesPage.supportSub,
      desc: t.servicesPage.supportDesc,
      features: t.servicesPage.supportFeatures,
    },
    {
      id: "bi",
      Icon: BarChart3,
      title: t.servicesPage.biTitle,
      subtitle: t.servicesPage.biSub,
      desc: t.servicesPage.biDesc,
      features: t.servicesPage.biFeatures,
    },
    {
      id: "conseil",
      Icon: Handshake,
      title: t.servicesPage.conseilTitle,
      subtitle: t.servicesPage.conseilSub,
      desc: t.servicesPage.conseilDesc,
      features: t.servicesPage.conseilFeatures,
    },
  ];

  useEffect(() => {
    let active = true;
    publicApi.fetchServices()
      .then((res) => {
        if (active && res.data) {
          setApiServices(res.data);
        }
      })
      .catch(() => {
        // Fallback gracefully on network/backend error
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  const displayServices: ServiceItem[] = apiServices.length > 0
    ? apiServices.map((item) => {
        const title = item.title?.[language] || item.title?.fr || item.slug;
        const desc = item.shortDescription?.[language] || item.shortDescription?.fr || "";
        const featuresRaw = item.features?.[language] || item.features?.fr || [];
        const features = Array.isArray(featuresRaw) ? featuresRaw : [];
        return {
          id: item.slug,
          Icon: getIconByName(item.icon),
          title,
          subtitle: item.accentColor || "SOLUTION",
          desc,
          features,
        };
      })
    : defaultServices;

  useLayoutEffect(() => {
    const el = heroRef.current;
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
    <div id="services">
      <SEO
        title={t.servicesPage.seoTitle}
        description={t.servicesPage.seoDesc}
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
            {t.servicesPage.badge}
          </div>
          <h1 data-hero style={{
            fontFamily: "Outfit, sans-serif", fontWeight: 800,
            fontSize: "clamp(32px, 5vw, 48px)", lineHeight: 1.15,
            maxWidth: 720, margin: "0 auto 20px", letterSpacing: "-0.5px",
          }}>
            {t.servicesPage.title}
          </h1>
          <p data-hero style={{
            fontFamily: "Open Sans, sans-serif", color: "rgba(255,255,255,0.7)",
            fontSize: 17, lineHeight: 1.8, maxWidth: 640, margin: "0 auto 40px",
          }}>
            {t.servicesPage.description}
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
            {t.servicesPage.auditBtn}
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
              {t.servicesPage.gridTitle}
            </h2>
            <p style={{ fontFamily: "Open Sans, sans-serif", color: BODY_TEXT, fontSize: 16, maxWidth: 580, margin: "0 auto", lineHeight: 1.7 }}>
              {t.servicesPage.gridDesc}
            </p>
          </div>

          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "60px 0", gap: 12 }}>
              <Loader2 size={24} className="animate-spin" color={ORANGE} />
              <span style={{ fontFamily: "Open Sans, sans-serif", color: BODY_TEXT }}>Chargement des services...</span>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 28 }} className="services-page-grid">
              {displayServices.map((s, i) => (
                <ServiceCard key={s.id} s={s} index={i} />
              ))}
            </div>
          )}
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
            {t.servicesPage.ctaTitle}
          </h2>
          <p style={{
            fontFamily: "Open Sans, sans-serif", color: "rgba(255,255,255,0.65)",
            fontSize: 16, lineHeight: 1.7, margin: "0 auto 40px", maxWidth: 560,
          }}>
            {t.servicesPage.ctaDesc}
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
            {t.servicesPage.ctaBtn}
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
