import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { NavLink } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useLanguage, useTranslation } from "../../context/LanguageContext";

export default function CTA() {
  const { language } = useLanguage();
  const t = useTranslation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      ref={ref}
      className="cta-section"
      style={{
        background: "linear-gradient(135deg, var(--primary) 0%, #0f1b3d 50%, #1a2a5e 100%)",
        padding: "64px 32px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
        borderRadius: "var(--radius-xl)",
        boxShadow: "var(--shadow-xl)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Radial glow */}
      <div
        style={{
          position: "absolute",
          top: "30%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          height: 400,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(249,115,22,0.12) 0%, transparent 70%)",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />

      <div
        className="cta-content"
        style={{
          width: "100%",
          maxWidth: 720,
          margin: "0 auto",
          position: "relative",
          zIndex: 1,
        }}
      >
        <motion.h2
          className="cta-title"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: "clamp(28px, 4vw, 42px)",
            color: "#fff",
            margin: "0 0 18px",
            lineHeight: 1.2,
            letterSpacing: "-0.5px",
          }}
        >
          {t.cta.title}
        </motion.h2>

        <motion.p
          className="cta-text"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
          style={{
            fontFamily: "var(--font-sans)",
            color: "rgba(255,255,255,0.7)",
            fontSize: 17,
            lineHeight: 1.7,
            margin: "0 auto 40px",
            maxWidth: 560,
          }}
        >
          {t.cta.description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.25 }}
        >
          <NavLink
            className="cta-button"
            to="/contact"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              background: "var(--accent)",
              color: "#fff",
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              fontSize: 16,
              padding: "16px 36px",
              borderRadius: 12,
              textDecoration: "none",
              boxShadow: "0 4px 16px rgba(249, 115, 22, 0.3)",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 6px 24px rgba(249, 115, 22, 0.45)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = "0 4px 16px rgba(249, 115, 22, 0.3)";
            }}
          >
            {t.cta.button}
            <ArrowRight size={18} style={{ transform: language === "ar" ? "scaleX(-1)" : undefined }} />
          </NavLink>
        </motion.div>
      </div>
    </section>
  );
}
