import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useTranslation } from "../../context/LanguageContext";

const ORANGE = "#E67E22";
const NAVY = "#34568B";


export default function CTA() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const t = useTranslation();

  return (
    <section ref={ref} className="cta-section" style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #1a2a4a 100%)`, padding: "72px 80px", textAlign: "center" }}>
      <motion.h2
        className="cta-title"
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        style={{ fontFamily: "Outfit, sans-serif", fontWeight: 800, fontSize: 40, color: "#fff", marginBottom: 16 }}
      >
        {t.cta.title}
      </motion.h2>
      <motion.p
        className="cta-text"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: 0.15 }}
        style={{ fontFamily: "Open Sans, sans-serif", color: "rgba(255,255,255,0.8)", fontSize: 17, marginBottom: 36 }}
      >
        {t.cta.description}
      </motion.p>
      <motion.a
        href="#"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.25 }}
        whileHover={{ scale: 1.06, boxShadow: "0 10px 28px rgba(230,126,34,0.45)" }}
        whileTap={{ scale: 0.97 }}
        style={{ display: "inline-flex", alignItems: "center", gap: 10, background: ORANGE, color: "#fff", fontFamily: "Open Sans, sans-serif", fontWeight: 700, fontSize: 15, padding: "16px 40px", borderRadius: 10, textDecoration: "none" }}
      >
        {t.cta.button}
      </motion.a>
    </section>
  );
}