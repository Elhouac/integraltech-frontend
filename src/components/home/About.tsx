import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { CheckCircle, Zap, ShieldCheck, BarChart3 } from "lucide-react";
import { useTranslation } from "../../context/LanguageContext";

const ORANGE = "#E67E22";
const DARK = "#2C3E50";
const LIGHT_GRAY = "#F4F6F8";

export default function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const t = useTranslation();

  const features = [
    { icon: <CheckCircle size={24} />, title: t.homeAbout.excellence, desc: t.homeAbout.excellenceDesc },
    { icon: <Zap size={24} />, title: t.homeAbout.innovation, desc: t.homeAbout.innovationDesc },
    { icon: <ShieldCheck size={24} />, title: t.homeAbout.security, desc: t.homeAbout.securityDesc },
    { icon: <BarChart3 size={24} />, title: t.homeAbout.growth, desc: t.homeAbout.growthDesc },
  ];
  return (
    <section ref={ref} className="about-section" style={{ background: LIGHT_GRAY, padding: "80px 80px", display: "flex", gap: 80, alignItems: "center" }}>
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.7 }}
        style={{ flex: 1 }}
      >
        <div style={{ color: ORANGE, fontWeight: 700, fontSize: 13, letterSpacing: 3, textTransform: "uppercase", marginBottom: 12, fontFamily: "Open Sans, sans-serif" }}>À PROPOS DE NOUS</div>
        <h2 style={{ fontFamily: "Outfit, sans-serif", fontWeight: 800, fontSize: 40, color: DARK, marginBottom: 20 }}>Votre Partenaire Digital De Confiance</h2>
        <p style={{ fontFamily: "Open Sans, sans-serif", color: "#6C7A89", fontSize: 16, lineHeight: 1.8, marginBottom: 24 }}>
          Depuis plus de 10 ans, IntegralTech accompagne les entreprises marocaines dans leur transformation numérique.
        </p>
        <p style={{ fontFamily: "Open Sans, sans-serif", color: "#6C7A89", fontSize: 16, lineHeight: 1.8, marginBottom: 36 }}>
          Nous croyons en un partenariat durable, fondé sur la confiance, l'expertise et l'innovation continue.
        </p>
        <motion.a
          href="#"
          whileHover={{ scale: 1.04, boxShadow: "0 8px 24px rgba(230,126,34,0.35)" }}
          whileTap={{ scale: 0.97 }}
          style={{ display: "inline-flex", alignItems: "center", gap: 10, background: ORANGE, color: "#fff", fontFamily: "Open Sans, sans-serif", fontWeight: 700, fontSize: 14, padding: "14px 28px", borderRadius: 10, textDecoration: "none" }}
        >
          {t.common.learnMore} →
        </motion.a>
      </motion.div>
      <div className="about-grid" style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {features.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
            whileHover={{ y: -4, boxShadow: "0 8px 24px rgba(0,0,0,0.1)" }}
            style={{ background: "#fff", borderRadius: 12, padding: "24px 20px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", cursor: "default" }}
          >
            <div style={{ fontSize: 28, marginBottom: 10 }}>{item.icon}</div>
            <div style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: 16, color: DARK, marginBottom: 6 }}>{item.title}</div>
            <div style={{ fontFamily: "Open Sans, sans-serif", color: "#6C7A89", fontSize: 13, lineHeight: 1.6 }}>{item.desc}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
