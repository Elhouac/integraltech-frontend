import { motion, type HTMLMotionProps } from "framer-motion";
import { NavLink } from "react-router-dom";
import { useTranslation } from "../../context/LanguageContext";
import {
  ShieldCheck, Headphones, Award, Settings,
  Database, Cpu, Wifi, ArrowRight,
} from "lucide-react";

// ── Trust indicator items ─────────────────────────────────

const trustIndicators = [
  { icon: Headphones, labelKey: "reactiveSupport" },
  { icon: ShieldCheck, labelKey: "secureSolutions" },
  { icon: Award, labelKey: "itExpertise" },
  { icon: Settings, labelKey: "tailoredSupport" },
];

// ── Floating card animation helper ────────────────────────

const floatAnim = (duration: number, delay: number): HTMLMotionProps<"div"> => ({
  animate: { y: [0, -12, 0] },
  transition: { duration, repeat: Infinity, ease: "easeInOut", delay },
});

// ── Component ─────────────────────────────────────────────

export default function Hero() {
  const t = useTranslation();

  // Fallback trust label map (will be replaced by i18n in Batch 6)
  const trustLabels: Record<string, string> = {
    reactiveSupport: t.hero.reactiveSupport,
    secureSolutions: t.hero.secureSolutions,
    itExpertise: t.hero.itExpertise,
    tailoredSupport: t.hero.tailoredSupport,
  };

  return (
    <section
      className="hero-section"
      style={{
        position: "relative",
        minHeight: "calc(100vh - 120px)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        overflow: "hidden",
        background: `
          radial-gradient(circle at 80% 20%, rgba(30, 58, 138, 0.08) 0%, transparent 60%),
          radial-gradient(circle at 10% 80%, rgba(249, 115, 22, 0.05) 0%, transparent 50%),
          var(--background)
        `,
        boxSizing: "border-box",
      }}
    >
      {/* Encapsulated keyframes */}
      <style>{`
        @keyframes pulse-ring {
          0% { transform: scale(0.65); opacity: 0.8; }
          50% { opacity: 0.4; }
          100% { transform: scale(1.4); opacity: 0; }
        }
        @keyframes dash-flow {
          to { stroke-dashoffset: -40; }
        }
      `}</style>

      {/* Background dot grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "radial-gradient(var(--border) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          opacity: 0.5,
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

      {/* ── Main content grid ── */}
      <div
        className="hero-container"
        style={{
          position: "relative",
          zIndex: 1,
          width: "90%",
          maxWidth: 1320,
          margin: "0 auto",
          display: "grid",
          alignItems: "center",
        }}
      >
        {/* LEFT: Headlines + CTAs */}
        <div className="hero-copy" style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
          {/* Badge */}
          <motion.div
            className="hero-badge"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "var(--hover)",
              border: "1px solid var(--border)",
              color: "var(--primary)",
              padding: "6px 14px",
              borderRadius: 99,
              fontSize: 12,
              fontWeight: 600,
              fontFamily: "var(--font-display)",
              textTransform: "uppercase",
              letterSpacing: "1px",
              marginBottom: 24,
            }}
          >
            <span
              style={{
                display: "inline-flex",
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "var(--accent)",
                position: "relative",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  inset: -4,
                  borderRadius: "50%",
                  border: "2px solid var(--accent)",
                  animation: "pulse-ring 2s cubic-bezier(0.24, 0, 0.38, 1) infinite",
                }}
              />
            </span>
            {t.hero.badge}
          </motion.div>

          {/* Headline */}
          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              color: "var(--text)",
              lineHeight: 1.12,
              letterSpacing: "-1.5px",
              margin: "0 0 20px",
            }}
          >
            <span style={{ display: "block" }}>{t.hero.titlePart1}</span>
            <span style={{ display: "block" }}>{t.hero.titlePart2}</span>
            <span
              style={{
                display: "block",
                background: "linear-gradient(135deg, var(--accent) 0%, var(--primary) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {t.hero.titlePart3}
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 17,
              lineHeight: 1.7,
              color: "var(--text-secondary)",
              maxWidth: 520,
              marginBottom: 36,
            }}
          >
            {t.hero.subtitle}
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="hero-cta"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            style={{ display: "flex", gap: 16, flexWrap: "wrap" }}
          >
            <NavLink
              to="/contact"
              style={{
                background: "var(--accent)",
                color: "#fff",
                padding: "14px 32px",
                borderRadius: 12,
                fontSize: 15,
                fontWeight: 600,
                textDecoration: "none",
                fontFamily: "var(--font-display)",
                boxShadow: "0 4px 14px rgba(249,115,22,0.25)",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 6px 18px rgba(249,115,22,0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow = "0 4px 14px rgba(249,115,22,0.25)";
              }}
            >
              {t.hero.ctaQuote}
              <ArrowRight size={16} />
            </NavLink>

            <NavLink
              to="/services"
              style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                color: "var(--text)",
                padding: "14px 32px",
                borderRadius: 12,
                fontSize: 15,
                fontWeight: 600,
                textDecoration: "none",
                fontFamily: "var(--font-display)",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                boxShadow: "var(--shadow-sm)",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "var(--shadow-md)";
                e.currentTarget.style.background = "var(--hover)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow = "var(--shadow-sm)";
                e.currentTarget.style.background = "var(--card)";
              }}
            >
              {t.hero.ctaServices}
            </NavLink>
          </motion.div>
        </div>

        {/* RIGHT: Tech canvas illustration */}
        <div
          className="hero-visual"
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
          }}
        >
          {/* SVG diagram background */}
          <div
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              top: 0,
              left: 0,
              zIndex: 0,
              opacity: 0.85,
            }}
          >
            <svg width="100%" height="100%" viewBox="0 0 500 450" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="250" cy="225" r="70" stroke="var(--border)" strokeWidth="1" strokeDasharray="3 3" />
              <circle cx="250" cy="225" r="110" stroke="var(--border)" strokeWidth="1" strokeDasharray="4 6" />
              <path d="M120 120 L250 225 L380 120 M120 330 L250 225 L380 330" stroke="var(--border)" strokeWidth="1.2" />
              <path d="M120 120 L250 225 L380 120" stroke="var(--accent)" strokeWidth="1.5" strokeDasharray="8 12" strokeDashoffset="0" style={{ animation: "dash-flow 6s linear infinite" }} />
              <path d="M380 330 L250 225 L120 330" stroke="var(--primary)" strokeWidth="1.5" strokeDasharray="8 12" strokeDashoffset="0" style={{ animation: "dash-flow 6s linear infinite" }} />
              <circle cx="250" cy="225" r="8" fill="var(--accent)" />
              <circle cx="250" cy="225" r="18" stroke="var(--accent)" strokeWidth="1.5" opacity="0.35" style={{ transformOrigin: "250px 225px", animation: "pulse-ring 2.5s cubic-bezier(0.24, 0, 0.38, 1) infinite" }} />
              <circle cx="120" cy="120" r="5" fill="var(--primary)" />
              <circle cx="380" cy="120" r="5" fill="var(--primary)" />
              <circle cx="120" cy="330" r="5" fill="var(--primary)" />
              <circle cx="380" cy="330" r="5" fill="var(--primary)" />
            </svg>
          </div>

          {/* Floating cards */}
          <div className="hero-visual-canvas" style={{ position: "relative", width: "100%", height: "100%", zIndex: 1 }}>
            {/* Cloud & Infra */}
            <motion.div
              className="hero-floating-card hero-floating-card--cloud"
              {...floatAnim(5.4, 0)}
              style={{
                position: "absolute",
                background: "var(--glass-bg)",
                backdropFilter: "blur(12px)",
                border: "1px solid var(--glass-border)",
                borderRadius: 16,
                padding: 16,
                boxShadow: "var(--shadow-md)",
                display: "flex",
                gap: 12,
                alignItems: "center",
                transition: "border-color 0.25s, box-shadow 0.25s",
              }}
            >
              <div
                style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: "rgba(30, 58, 138, 0.08)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "var(--primary)",
                }}
              >
                <Database size={20} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "var(--text)", fontFamily: "var(--font-display)" }}>
                  {t.hero.floatingCloud}
                </h3>
                <p style={{ margin: "2px 0 0", fontSize: 11, color: "var(--text-secondary)", fontFamily: "var(--font-sans)" }}>
                  {t.hero.floatingCloudDesc}
                </p>
              </div>
            </motion.div>

            {/* Cybersécurité */}
            <motion.div
              className="hero-floating-card hero-floating-card--cyber"
              {...floatAnim(4.6, 0.8)}
              style={{
                position: "absolute",
                background: "var(--glass-bg)",
                backdropFilter: "blur(12px)",
                border: "1px solid var(--glass-border)",
                borderRadius: 16,
                padding: 16,
                boxShadow: "var(--shadow-md)",
                display: "flex",
                gap: 12,
                alignItems: "center",
                transition: "border-color 0.25s, box-shadow 0.25s",
              }}
            >
              <div
                style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: "rgba(249, 115, 22, 0.08)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "var(--accent)",
                }}
              >
                <ShieldCheck size={20} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "var(--text)", fontFamily: "var(--font-display)" }}>
                  {t.hero.floatingCyber}
                </h3>
                <p style={{ margin: "2px 0 0", fontSize: 11, color: "var(--text-secondary)", fontFamily: "var(--font-sans)" }}>
                  {t.hero.floatingCyberDesc}
                </p>
              </div>
            </motion.div>

            {/* AI & BI */}
            <motion.div
              className="hero-floating-card hero-floating-card--ai"
              {...floatAnim(5.2, 0.4)}
              style={{
                position: "absolute",
                background: "var(--glass-bg)",
                backdropFilter: "blur(12px)",
                border: "1px solid var(--glass-border)",
                borderRadius: 16,
                padding: 16,
                boxShadow: "var(--shadow-md)",
                display: "flex",
                gap: 12,
                alignItems: "center",
                transition: "border-color 0.25s, box-shadow 0.25s",
              }}
            >
              <div
                style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: "rgba(34, 197, 94, 0.08)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#22C55E",
                }}
              >
                <Cpu size={20} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "var(--text)", fontFamily: "var(--font-display)" }}>
                  {t.hero.floatingAI}
                </h3>
                <p style={{ margin: "2px 0 0", fontSize: 11, color: "var(--text-secondary)", fontFamily: "var(--font-sans)" }}>
                  {t.hero.floatingAIDesc}
                </p>
              </div>
            </motion.div>

            {/* Supervision IT */}
            <motion.div
              className="hero-floating-card hero-floating-card--supervision"
              {...floatAnim(4.4, 1.2)}
              style={{
                position: "absolute",
                background: "var(--glass-bg)",
                backdropFilter: "blur(12px)",
                border: "1px solid var(--glass-border)",
                borderRadius: 16,
                padding: 16,
                boxShadow: "var(--shadow-md)",
                display: "flex",
                gap: 12,
                alignItems: "center",
                transition: "border-color 0.25s, box-shadow 0.25s",
              }}
            >
              <div
                style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: "rgba(168, 85, 247, 0.08)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#A855F7",
                }}
              >
                <Wifi size={20} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "var(--text)", fontFamily: "var(--font-display)" }}>
                  {t.hero.floatingSupervision}
                </h3>
                <p style={{ margin: "2px 0 0", fontSize: 11, color: "var(--text-secondary)", fontFamily: "var(--font-sans)" }}>
                  {t.hero.floatingSupervisionDesc}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── Trust Indicators Strip ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.6 }}
        className="hero-trust-strip"
        style={{
          width: "90%",
          maxWidth: 1320,
          marginLeft: "auto",
          marginRight: "auto",
          display: "grid",
          borderTop: "1px solid var(--border)",
          position: "relative",
          zIndex: 1,
        }}
      >
        {trustIndicators.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.labelKey}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: "rgba(249, 115, 22, 0.06)",
                  border: "1px solid rgba(249, 115, 22, 0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--accent)",
                  flexShrink: 0,
                }}
              >
                <Icon size={20} />
              </div>
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 600,
                  fontSize: 14,
                  color: "var(--text)",
                  lineHeight: 1.3,
                }}
              >
                {trustLabels[item.labelKey] ?? item.labelKey}
              </span>
            </div>
          );
        })}
      </motion.div>
    </section>
  );
}
