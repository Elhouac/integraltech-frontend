import { motion } from "framer-motion";
import { useTranslation } from "../../context/LanguageContext";

const ORANGE = "#E67E22";

export default function Hero() {
  const t = useTranslation();
  return (
    <section className="hero-section" style={{ position: "relative", minHeight: 620, display: "flex", alignItems: "center", overflow: "hidden", background: "#0f2744" }}>
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <img src="/hero-bg.webp" alt="Hero background" loading="eager" decoding="async" fetchPriority="high" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }} />
      </div>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(15,39,68,0.92) 0%, rgba(15,39,68,0.75) 45%, rgba(15,39,68,0.15) 100%)", zIndex: 1 }} />

      <div className="hero-content" style={{ position: "relative", zIndex: 2, maxWidth: 680, padding: "80px 40px 80px 80px" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          style={{ color: ORANGE, fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: 14, letterSpacing: 3, textTransform: "uppercase", marginBottom: 16 }}
        >
          {t.hero.badge}
        </motion.div>

        <motion.h1
          className="hero-title"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55 }}
          style={{ fontFamily: "Outfit, sans-serif", fontWeight: 800, fontSize: 56, color: "#fff", lineHeight: 1.1, marginBottom: 24 }}
        >
          {t.hero.title.split('\n').map((line, i) => (
            <span key={i}>{line}<br /></span>
          ))}
        </motion.h1>

        <motion.p
          className="hero-desc"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          style={{ fontFamily: "Open Sans, sans-serif", color: "rgba(255,255,255,0.85)", fontSize: 17, lineHeight: 1.7, marginBottom: 36, maxWidth: 520 }}
        >
          {t.hero.subtitle}
        </motion.p>

        <motion.a
          className="hero-cta"
          href="#"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.85 }}
          whileHover={{ scale: 1.05, boxShadow: "0 8px 24px rgba(230,126,34,0.4)" }}
          whileTap={{ scale: 0.97 }}
          style={{ display: "inline-flex", alignItems: "center", gap: 10, background: ORANGE, color: "#fff", fontFamily: "Open Sans, sans-serif", fontWeight: 700, fontSize: 15, padding: "14px 32px", borderRadius: 10, textDecoration: "none", letterSpacing: 0.5 }}
        >
          {t.cta.button.toUpperCase()} →
        </motion.a>
      </div>
    </section>
  );
}