import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "../../context/LanguageContext";
import { ORANGE, NAVY } from "../../constants";

export default function CTA() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const t = useTranslation();

  return (
    <section
      ref={ref}
      className="cta-section"
      style={{
        background: `linear-gradient(135deg, ${NAVY} 0%, #0f1b3d 50%, #1a2a5e 100%)`,
        padding: "96px 0",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative radial glow */}
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
        style={{
          width: "90%",
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
            fontFamily: "Outfit, sans-serif",
            fontWeight: 800,
            fontSize: "clamp(28px, 4vw, 42px)",
            color: "#fff",
            marginBottom: 18,
            lineHeight: 1.2,
            letterSpacing: "-0.5px",
            margin: "0 0 18px",
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
            fontFamily: "Open Sans, sans-serif",
            color: "rgba(255,255,255,0.7)",
            fontSize: 17,
            lineHeight: 1.7,
            marginBottom: 40,
            maxWidth: 560,
            margin: "0 auto 40px",
          }}
        >
          {t.cta.description}
        </motion.p>

        <motion.a
          href="#"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.25 }}
          whileHover={{
            scale: 1.05,
            boxShadow: "0 0 32px rgba(249, 115, 22, 0.45)",
          }}
          whileTap={{ scale: 0.97 }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            background: ORANGE,
            color: "#fff",
            fontFamily: "Outfit, sans-serif",
            fontWeight: 600,
            fontSize: 16,
            padding: "16px 36px",
            borderRadius: "12px",
            textDecoration: "none",
            boxShadow: "0 4px 16px rgba(249, 115, 22, 0.3)",
          }}
        >
          {t.cta.button}
          <ArrowRight size={18} />
        </motion.a>
      </div>
    </section>
  );
}