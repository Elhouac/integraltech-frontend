import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import { useTranslation } from "../../context/LanguageContext";
import { ShieldCheck, Database, Cpu, Wifi, Zap, ArrowRight } from "lucide-react";
import { ORANGE, NAVY, DARK, BODY_TEXT, BORDER, CARD_BG, LIGHT_GRAY } from "../../constants";

export default function Hero() {
  const t = useTranslation();

  // Floating animations helper with dynamic coordinates
  const floatAnim = (duration: number, delay: number) => ({
    animate: {
      y: [0, -12, 0],
    },
    transition: {
      duration,
      repeat: Infinity,
      ease: "easeInOut",
      delay,
    },
  });

  return (
    <section
      className="hero-section"
      style={{
        position: "relative",
        minHeight: "calc(100vh - 120px)",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        background: `radial-gradient(circle at 80% 20%, rgba(30, 58, 138, 0.08) 0%, transparent 60%), radial-gradient(circle at 10% 80%, rgba(249, 115, 22, 0.05) 0%, transparent 50%), var(--background)`,
        padding: "85px 0",
        boxSizing: "border-box",
      }}
    >
      {/* Encapsulated Animation Styles */}
      <style>{`
        @keyframes pulse-ring {
          0% { transform: scale(0.65); opacity: 0.8; }
          50% { opacity: 0.4; }
          100% { transform: scale(1.4); opacity: 0; }
        }
        @keyframes dash-flow {
          to { stroke-dashoffset: -40; }
        }
        @keyframes subtle-rotation {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      {/* Background Subtle Grid Pattern */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "radial-gradient(var(--border) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          opacity: 0.65,
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

      <div
        className="hero-container"
        style={{
          position: "relative",
          zIndex: 1,
          width: "90%",
          maxWidth: 1400,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "60px",
          alignItems: "center",
        }}
      >
        {/* LEFT COLUMN: Texts and CTA */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
          {/* Glowing Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "var(--hover)",
              border: `1px solid var(--border)`,
              color: "var(--primary)",
              padding: "6px 14px",
              borderRadius: "99px",
              fontSize: 12,
              fontWeight: 600,
              fontFamily: "Outfit, sans-serif",
              textTransform: "uppercase",
              letterSpacing: "1px",
              marginBottom: 24,
            }}
          >
            <span style={{ display: "inline-flex", width: 6, height: 6, borderRadius: "50%", background: ORANGE, position: "relative" }}>
              <span style={{
                position: "absolute",
                inset: -4,
                borderRadius: "50%",
                border: `2px solid ${ORANGE}`,
                animation: "pulse-ring 2s cubic-bezier(0.24, 0, 0.38, 1) infinite",
              }} />
            </span>
            {t.hero.badge}
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            style={{
              fontFamily: "Outfit, sans-serif",
              fontSize: "clamp(38px, 5vw, 62px)",
              fontWeight: 800,
              color: DARK,
              lineHeight: 1.12,
              letterSpacing: "-1.5px",
              marginBottom: 20,
              margin: 0,
            }}
          >
            {t.hero.title.split("\n").map((line, i) => (
              <span key={i} style={{ display: "block" }}>
                {i === 1 ? (
                  <span style={{
                    background: `linear-gradient(135deg, ${ORANGE} 0%, ${NAVY} 100%)`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}>
                    {line}
                  </span>
                ) : line}
              </span>
            ))}
          </motion.h1>

          {/* Supporting Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            style={{
              fontFamily: "Open Sans, sans-serif",
              fontSize: 17,
              lineHeight: 1.7,
              color: BODY_TEXT,
              maxWidth: 540,
              marginTop: 20,
              marginBottom: 36,
            }}
          >
            {t.hero.subtitle}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 48 }}
          >
            <NavLink
              to="/contact"
              style={{
                background: ORANGE,
                color: "#fff",
                padding: "14px 32px",
                borderRadius: "12px",
                fontSize: 15,
                fontWeight: 600,
                textDecoration: "none",
                fontFamily: "Outfit, sans-serif",
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
              {t.cta.button}
              <ArrowRight size={16} />
            </NavLink>

            <NavLink
              to="/solutions"
              style={{
                background: CARD_BG,
                border: `1px solid var(--border)`,
                color: DARK,
                padding: "14px 32px",
                borderRadius: "12px",
                fontSize: 15,
                fontWeight: 600,
                textDecoration: "none",
                fontFamily: "Outfit, sans-serif",
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
                e.currentTarget.style.background = CARD_BG;
              }}
            >
              {t.common.discover}
            </NavLink>
          </motion.div>

          {/* Trust Metrics */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            style={{
              display: "flex",
              gap: 36,
              borderTop: `1px solid var(--border)`,
              paddingTop: 24,
              width: "100%",
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: 26, fontWeight: 800, color: NAVY, fontFamily: "Outfit, sans-serif" }}>10+</span>
              <span style={{ fontSize: 13, color: BODY_TEXT, fontFamily: "Open Sans, sans-serif", marginTop: 4 }}>
                {t.stats.experience}
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: 26, fontWeight: 800, color: NAVY, fontFamily: "Outfit, sans-serif" }}>500+</span>
              <span style={{ fontSize: 13, color: BODY_TEXT, fontFamily: "Open Sans, sans-serif", marginTop: 4 }}>
                {t.stats.clients}
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: 26, fontWeight: 800, color: NAVY, fontFamily: "Outfit, sans-serif" }}>50+</span>
              <span style={{ fontSize: 13, color: BODY_TEXT, fontFamily: "Open Sans, sans-serif", marginTop: 4 }}>
                {t.stats.experts}
              </span>
            </div>
          </motion.div>
        </div>

        {/* RIGHT COLUMN: Interactive Tech Canvas Illustration */}
        <div
          style={{
            position: "relative",
            height: "500px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
          }}
        >
          {/* Animated Background Vector Diagram */}
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
              {/* Central Core Circle */}
              <circle cx="250" cy="225" r="70" stroke="var(--border)" strokeWidth="1" strokeDasharray="3 3" />
              <circle cx="250" cy="225" r="110" stroke="var(--border)" strokeWidth="1" strokeDasharray="4 6" />

              {/* Connecting Lines */}
              <path d="M120 120 L250 225 L380 120 M120 330 L250 225 L380 330" stroke="var(--border)" strokeWidth="1.2" />

              {/* Animated Traffic Flows */}
              <path d="M120 120 L250 225 L380 120" stroke="var(--accent)" strokeWidth="1.5" strokeDasharray="8 12" strokeDashoffset="0" style={{ animation: "dash-flow 6s linear infinite" }} />
              <path d="M380 330 L250 225 L120 330" stroke="var(--primary)" strokeWidth="1.5" strokeDasharray="8 12" strokeDashoffset="0" style={{ animation: "dash-flow 6s linear infinite" }} />

              {/* Center Core Beacon */}
              <circle cx="250" cy="225" r="8" fill="var(--accent)" />
              <circle cx="250" cy="225" r="18" stroke="var(--accent)" strokeWidth="1.5" opacity="0.35" style={{ transformOrigin: "250px 225px", animation: "pulse-ring 2.5s cubic-bezier(0.24, 0, 0.38, 1) infinite" }} />

              {/* Server Nodes */}
              <circle cx="120" cy="120" r="5" fill="var(--primary)" />
              <circle cx="380" cy="120" r="5" fill="var(--primary)" />
              <circle cx="120" cy="330" r="5" fill="var(--primary)" />
              <circle cx="380" cy="330" r="5" fill="var(--primary)" />
            </svg>
          </div>

          {/* Foreground Floating Cards */}
          <div style={{ position: "relative", width: "100%", height: "100%", zIndex: 1 }}>
            {/* Card 1: Cloud & Infrastructure (Top Left) */}
            <motion.div
              {...floatAnim(5.4, 0)}
              style={{
                position: "absolute",
                top: "10%",
                left: "4%",
                width: "220px",
                background: "var(--glass-bg)",
                backdropFilter: "blur(12px)",
                border: "1px solid var(--glass-border)",
                borderRadius: "16px",
                padding: "16px",
                boxShadow: "var(--shadow-md)",
                display: "flex",
                gap: 12,
                alignItems: "center",
                transition: "border-color 0.25s, box-shadow 0.25s",
              }}
              whileHover={{ borderColor: "var(--primary)", boxShadow: "var(--shadow-lg)" }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "10px",
                  background: "rgba(30, 58, 138, 0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: NAVY,
                }}
              >
                <Database size={20} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: DARK, fontFamily: "Outfit, sans-serif" }}>
                  Cloud & Infra
                </h3>
                <p style={{ margin: "2px 0 0", fontSize: 11, color: BODY_TEXT, fontFamily: "Open Sans, sans-serif" }}>
                  SLA 99.99% Garanti
                </p>
              </div>
            </motion.div>

            {/* Card 2: Cybersécurité (Top Right) */}
            <motion.div
              {...floatAnim(4.6, 0.8)}
              style={{
                position: "absolute",
                top: "22%",
                right: "4%",
                width: "230px",
                background: "var(--glass-bg)",
                backdropFilter: "blur(12px)",
                border: "1px solid var(--glass-border)",
                borderRadius: "16px",
                padding: "16px",
                boxShadow: "var(--shadow-md)",
                display: "flex",
                gap: 12,
                alignItems: "center",
                transition: "border-color 0.25s, box-shadow 0.25s",
              }}
              whileHover={{ borderColor: "var(--accent)", boxShadow: "var(--shadow-lg)" }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "10px",
                  background: "rgba(249, 115, 22, 0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: ORANGE,
                }}
              >
                <ShieldCheck size={20} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: DARK, fontFamily: "Outfit, sans-serif" }}>
                  Cybersécurité
                </h3>
                <p style={{ margin: "2px 0 0", fontSize: 11, color: BODY_TEXT, fontFamily: "Open Sans, sans-serif" }}>
                  Protection active 24/7
                </p>
              </div>
            </motion.div>

            {/* Card 3: AI & BI (Center Bottom Left) */}
            <motion.div
              {...floatAnim(5.2, 0.4)}
              style={{
                position: "absolute",
                bottom: "16%",
                left: "10%",
                width: "220px",
                background: "var(--glass-bg)",
                backdropFilter: "blur(12px)",
                border: "1px solid var(--glass-border)",
                borderRadius: "16px",
                padding: "16px",
                boxShadow: "var(--shadow-md)",
                display: "flex",
                gap: 12,
                alignItems: "center",
                transition: "border-color 0.25s, box-shadow 0.25s",
              }}
              whileHover={{ borderColor: "#22C55E", boxShadow: "var(--shadow-lg)" }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "10px",
                  background: "rgba(34, 197, 94, 0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#22C55E",
                }}
              >
                <Cpu size={20} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: DARK, fontFamily: "Outfit, sans-serif" }}>
                  Intelligence Artificielle
                </h3>
                <p style={{ margin: "2px 0 0", fontSize: 11, color: BODY_TEXT, fontFamily: "Open Sans, sans-serif" }}>
                  Business Intelligence
                </p>
              </div>
            </motion.div>

            {/* Card 4: Networking (Bottom Right) */}
            <motion.div
              {...floatAnim(4.4, 1.2)}
              style={{
                position: "absolute",
                bottom: "26%",
                right: "6%",
                width: "200px",
                background: "var(--glass-bg)",
                backdropFilter: "blur(12px)",
                border: "1px solid var(--glass-border)",
                borderRadius: "16px",
                padding: "16px",
                boxShadow: "var(--shadow-md)",
                display: "flex",
                gap: 12,
                alignItems: "center",
                transition: "border-color 0.25s, box-shadow 0.25s",
              }}
              whileHover={{ borderColor: "#A855F7", boxShadow: "var(--shadow-lg)" }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "10px",
                  background: "rgba(168, 85, 247, 0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#A855F7",
                }}
              >
                <Wifi size={20} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: DARK, fontFamily: "Outfit, sans-serif" }}>
                  Supervision IT
                </h3>
                <p style={{ margin: "2px 0 0", fontSize: 11, color: BODY_TEXT, fontFamily: "Open Sans, sans-serif" }}>
                  Alertes temps réel
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}